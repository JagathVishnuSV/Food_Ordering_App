# Quick Start Guide - Food Ordering System

## 🚀 Start the Complete System

### 1. Start Backend Services (Docker Compose)
```bash
# From project root
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

**Services will start:**
- RabbitMQ (port 5672, management UI: 15672)
- User Service (port 3000)
- Restaurant Service (port 3001)
- Order Service (port 8080)
- Delivery Service (port 8000)
- Notification Service (port 8100)
- API Gateway (port 80)

### 2. Start Frontend
```bash
cd frontend
npm install  # Only needed first time
npm run dev
```

Frontend opens at **http://localhost:5173**

---

## 🧪 Test the Complete Flow

### Step 1: Create an Account
1. Open http://localhost:5173
2. Click **"Get Started"** or **"Register"**
3. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
4. Click **"Register"**
5. You'll be auto-logged in and redirected to restaurants

### Step 2: Seed a Restaurant (One-time Setup)

**Option A: MongoDB Compass / Atlas UI**
1. Connect to your MongoDB Atlas cluster
2. Database: `restaurant_db`
3. Collection: `restaurants`
4. Insert this document:
```json
{
  "name": "Demo Pizza",
  "category": "Pizza",
  "location": {
    "type": "Point",
    "coordinates": [0, 0]
  },
  "menu": [
    {
      "name": "Margherita",
      "description": "Classic tomato and mozzarella",
      "price": 10.00,
      "currency": "USD"
    },
    {
      "name": "Pepperoni",
      "description": "Spicy pepperoni with cheese",
      "price": 12.00,
      "currency": "USD"
    }
  ],
  "pricingRules": [
    {
      "type": "tax",
      "strategy": "percentage",
      "value": 10
    },
    {
      "type": "discount",
      "strategy": "fixed",
      "value": 1
    }
  ]
}
```

**Option B: Using mongosh (CLI)**
```bash
mongosh "mongodb+srv://YOUR_ATLAS_URI/restaurant_db"

db.restaurants.insertOne({
  name: "Demo Pizza",
  category: "Pizza",
  location: { type: "Point", coordinates: [0, 0] },
  menu: [
    { name: "Margherita", description: "Classic", price: 10.0, currency: "USD" },
    { name: "Pepperoni", description: "Spicy", price: 12.0, currency: "USD" }
  ],
  pricingRules: [
    { type: "tax", strategy: "percentage", value: 10 },
    { type: "discount", strategy: "fixed", value: 1 }
  ]
})
```

### Step 3: Place an Order
1. On the restaurants page, click **"Demo Pizza"**
2. You'll see menu items with calculated prices:
   - Margherita: ~~$10.00~~ **$10.00** (after 10% tax - $1 discount)
   - Pepperoni: ~~$12.00~~ **$12.20**
3. Click **+** to increase quantity
4. Click **"Add to Cart"**
5. Click the cart icon (top right)
6. Review your order
7. Click **"Place Order"**

### Step 4: Track Delivery
1. After placing order, you're redirected to `/order/:orderId`
2. Watch the delivery progress:
   - Status changes: CREATED → ASSIGNED → IN_TRANSIT → DELIVERED
   - Progress bar fills up (0% → 100%)
   - Rider gets assigned
   - Location updates in real-time
3. Delivery completes in ~10 seconds (simulated)

---

## 🔍 Verify Services

### Check Health Endpoints
```bash
curl http://localhost/health                    # Gateway
curl http://localhost:3000/health              # User Service
curl http://localhost:3001/health              # Restaurant Service
curl http://localhost:8080/health              # Order Service
curl http://localhost:8000/health              # Delivery Service
curl http://localhost:8100/health              # Notification Service
```

### Check RabbitMQ
1. Open http://localhost:15672
2. Login: `guest` / `guest`
3. Go to **Exchanges** → `food_orders`
4. Check **Queues** for consumers

### Check Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f order-service
docker-compose logs -f delivery-service
```

---

## 🐛 Troubleshooting

### Frontend can't reach backend
- Ensure gateway is running: `docker-compose ps`
- Check Vite proxy in `frontend/vite.config.ts`
- Verify `.env`: `VITE_API_BASE_URL=http://localhost`

### Order placement fails with "price_mismatch"
- Menu item prices in your order must match restaurant menu
- Check restaurant document in MongoDB
- Verify finalPrice calculation

### Delivery tracking shows "not available"
- Order must be placed first
- Delivery service needs time to process event
- Check RabbitMQ: delivery service should consume `order.placed`

### Services won't start
- Check Docker Desktop is running
- Verify ports aren't in use: 80, 3000, 3001, 8080, 8000, 8100, 5672
- Check MongoDB Atlas IP whitelist
- Verify `.env` files have correct Atlas URIs

### Login fails
- Check MongoDB Atlas connection
- Verify user was created in `users_db.users`
- Check JWT_SECRET is set

---

## 📊 System Monitoring

### RabbitMQ Management UI
- URL: http://localhost:15672
- User/Pass: `guest` / `guest`
- Monitor: queues, exchanges, message rates

### MongoDB Atlas
- Check your cluster dashboard
- View collections: `users_db`, `restaurant_db`, `orders_db`

### Docker Stats
```bash
docker stats
```

---

## 🛑 Stop the System

### Stop frontend
Press `Ctrl+C` in the terminal running `npm run dev`

### Stop backend
```bash
# Stop containers
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## 📝 Quick API Examples

### Register
```bash
curl -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"pass123"}'
```

### Login
```bash
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"pass123"}'
```

### List Restaurants
```bash
curl http://localhost/api/restaurants
```

### Get Restaurant Menu
```bash
curl http://localhost/api/restaurants/<RESTAURANT_ID>
```

### Place Order (requires token)
```bash
curl -X POST http://localhost/order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "userId":"<USER_ID>",
    "restaurantId":"<RESTAURANT_ID>",
    "items":[{"name":"Margherita","price":10,"qty":2}]
  }'
```

### Track Delivery
```bash
curl http://localhost/delivery/assignments/<ORDER_ID>
```

---

## 🎯 Next Steps

1. ✅ System is running
2. ✅ Test account created
3. ✅ Restaurant seeded
4. ✅ Order placed & tracked

**Now you can:**
- Add more restaurants
- Test different pricing rules
- Monitor RabbitMQ messages
- Scale services: `docker-compose up --scale order-service=3`
- Build production: `cd frontend && npm run build`

---

## 📚 Documentation

- **Complete Overview:** `COMPLETE_SYSTEM_OVERVIEW.md`
- **Frontend Details:** `frontend/FRONTEND_README.md`
- **Service READMEs:** In each service folder

---

## 💡 Tips

- Use MongoDB Compass for easier data management
- Check RabbitMQ UI to debug event flow
- Use browser DevTools Network tab to inspect API calls
- Frontend React Query DevTools (add `@tanstack/react-query-devtools` for debugging)

---

**Happy ordering! 🍕**
