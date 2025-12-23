import os
import json
import threading
import time
from typing import Dict, Any, List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import pika

# optional Mongo
try:
    from pymongo import MongoClient
except Exception:
    MongoClient = None

load_dotenv()

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672")
EXCHANGE = os.getenv("EXCHANGE", "food_orders")
MONGO_URI = os.getenv("MONGO_URI", "")
PORT = int(os.getenv("PORT", "8100"))

app = FastAPI(title="Notification Service")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# in-memory store: userId -> list of notifications
notifications: Dict[str, List[Dict[str, Any]]] = {}
store_lock = threading.Lock()

mongo_client = None
notif_coll = None
if MONGO_URI and MongoClient:
    try:
        mongo_client = MongoClient(MONGO_URI)
        notif_coll = mongo_client.get_database().get_collection("notifications")
    except Exception as e:
        print("Mongo init error:", e)
        mongo_client = None
        notif_coll = None

def pika_connection():
    params = pika.URLParameters(RABBITMQ_URL)
    return pika.BlockingConnection(params)

def send_notification(user_id: str, payload: dict):
    note = {
        "userId": user_id,
        "payload": payload,
        "sent_at": int(time.time() * 1000),
        "delivered": True,
        "transport": "mock"
    }
    with store_lock:
        notifications.setdefault(user_id, []).append(note)
    if notif_coll:
        try:
            notif_coll.insert_one(note)
        except Exception as e:
            print("Mongo insert error:", e)

def handle_message(ch, method, properties, body):
    try:
        data = json.loads(body)
    except Exception:
        ch.basic_ack(method.delivery_tag)
        return

    # Heuristics: pick userId if present in payload, else broadcast to "unknown"
    user_id = data.get("userId") or data.get("user_id") or data.get("user") or "unknown_user"

    # Build a friendly notification depending on routing key
    rk = method.routing_key if method and hasattr(method, 'routing_key') else ''
    title = f"Event {rk or 'event'}"
    message = data

    send_notification(user_id, {"title": title, "message": message, "routingKey": rk})

    ch.basic_ack(method.delivery_tag)

def start_consumer():
    while True:
        try:
            conn = pika_connection()
            ch = conn.channel()
            ch.exchange_declare(exchange=EXCHANGE, exchange_type='topic', durable=True)
            q = ch.queue_declare(queue='', exclusive=True)
            queue_name = q.method.queue
            # Bind to relevant keys
            keys = ['order.placed', 'order.assigned', 'delivery.update', 'order.delivered']
            for k in keys:
                ch.queue_bind(queue=queue_name, exchange=EXCHANGE, routing_key=k)
            ch.basic_consume(queue=queue_name, on_message_callback=handle_message, auto_ack=False)
            print("Notification consumer started, waiting for events...")
            ch.start_consuming()
        except Exception as e:
            print("Notification consumer error:", e)
            time.sleep(5)

@app.on_event("startup")
def startup_event():
    t = threading.Thread(target=start_consumer, daemon=True)
    t.start()

@app.get("/health")
def health():
    return {"ok": True, "service": "notification-service"}

@app.get("/notifications")
def all_notifications():
    with store_lock:
        # flatten into list
        all_notes = []
        for lst in notifications.values():
            all_notes.extend(lst)
        return all_notes

@app.get("/notifications/{user_id}")
def user_notifications(user_id: str):
    with store_lock:
        lst = notifications.get(user_id)
        if not lst:
            raise HTTPException(status_code=404, detail="no_notifications")
        return lst