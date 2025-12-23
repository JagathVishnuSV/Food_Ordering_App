import os
import json
import threading
import time
from uuid import uuid4
from typing import Dict, Any

from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
import pika

load_dotenv()

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672")
EXCHANGE = os.getenv("EXCHANGE", "food_orders")
PORT = int(os.getenv("PORT", "8000"))

app = FastAPI(title="Delivery Service")

assignments: Dict[str, Dict[str, Any]] = {}
assign_lock = threading.Lock()

def pika_connection():
    params = pika.URLParameters(RABBITMQ_URL)
    return pika.BlockingConnection(params)

def publish(event_key: str, payload: dict):
    try:
        conn = pika_connection()
        ch = conn.channel()
        ch.exchange_declare(exchange=EXCHANGE, exchange_type='topic', durable=True)
        ch.basic_publish(exchange=EXCHANGE, routing_key=event_key, body=json.dumps(payload).encode())
        conn.close()
    except Exception as e:
        print("Publish error:", e)

def simulate_delivery(order_id: str):
    with assign_lock:
        assignment = assignments.get(order_id)
        if not assignment:
            return
        assignment["status"] = "ASSIGNED"
        assignment["rider_id"] = f"rider-{uuid4().hex[:6]}"
    publish("order.assigned", {"orderId": order_id, "riderId": assignment["rider_id"]})

    steps = 10
    for step in range(1, steps + 1):
        time.sleep(1)
        frac = step / steps
        lat = assignment["start"][0] + (assignment["dest"][0] - assignment["start"][0]) * frac
        lng = assignment["start"][1] + (assignment["dest"][1] - assignment["start"][1]) * frac
        with assign_lock:
            assignment["location"] = [round(lat, 6), round(lng, 6)]
            assignment["progress"] = int(frac * 100)
            assignment["status"] = "IN_TRANSIT" if step < steps else "DELIVERED"
        publish("delivery.update", {"orderId": order_id, "riderId": assignment["rider_id"], "location": assignment["location"], "progress": assignment["progress"], "status": assignment["status"]})

def handle_message(ch, method, properties, body):
    try:
        data = json.loads(body)
    except Exception:
        ch.basic_ack(method.delivery_tag)
        return

    order_id = data.get("orderId") or data.get("id") or data.get("order_id")
    if not order_id:
        ch.basic_ack(method.delivery_tag)
        return

    assignment = {
        "orderId": order_id,
        "status": "CREATED",
        "rider_id": None,
        "location": [0.0, 0.0],
        "start": [0.0, 0.0],
        "dest": [10.0, 10.0],
        "progress": 0,
        "created_at": int(time.time() * 1000)
    }
    with assign_lock:
        assignments[order_id] = assignment

    t = threading.Thread(target=simulate_delivery, args=(order_id,), daemon=True)
    t.start()

    ch.basic_ack(method.delivery_tag)

def start_consumer():
    while True:
        try:
            conn = pika_connection()
            ch = conn.channel()
            ch.exchange_declare(exchange=EXCHANGE, exchange_type='topic', durable=True)
            q = ch.queue_declare(queue='', exclusive=True)
            queue_name = q.method.queue
            ch.queue_bind(queue=queue_name, exchange=EXCHANGE, routing_key='order.placed')
            ch.basic_consume(queue=queue_name, on_message_callback=handle_message, auto_ack=False)
            print("Delivery consumer started, waiting for order.placed events...")
            ch.start_consuming()
        except Exception as e:
            print("Consumer error:", e)
            time.sleep(5)

@app.on_event("startup")
def startup_event():
    t = threading.Thread(target=start_consumer, daemon=True)
    t.start()

@app.get("/health")
def health():
    return {"ok": True, "service": "delivery-service"}

@app.get("/assignments")
def list_assignments():
    with assign_lock:
        return list(assignments.values())

@app.get("/assignments/{order_id}")
def get_assignment(order_id: str):
    with assign_lock:
        a = assignments.get(order_id)
        if not a:
            raise HTTPException(status_code=404, detail="assignment_not_found")
        return a