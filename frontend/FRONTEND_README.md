# Food Ordering System - Frontend

Modern React + TypeScript + Vite frontend for the polyglot microservices food ordering system.

## Architecture

This frontend communicates **ONLY** through the API Gateway (Nginx on port 80). It never calls backend services directly.

### Gateway Routes Used
- `/api/auth/*` → User Service (login, register, profile, addresses)
- `/api/restaurants/*` → Restaurant Service (list, menu with pricing)
- `/order` → Order Service (place orders)
- `/delivery/*` → Delivery Service (track assignments)
- `/notifications/*` → Notification Service (user notifications)

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Zustand** - Client state (cart)
- **Material-UI** - Component library
- **Axios** - HTTP client

## Features

### ✅ Authentication
- Register & Login with JWT
- Protected routes
- Token stored in localStorage
- Auto-redirect on 401

### ✅ Restaurant Browsing
- List all restaurants
- View menu with calculated pricing (after tax/discounts)
- Category filtering

### ✅ Cart & Checkout
- Add items to cart (persistent via Zustand)
- Update quantities
- Review order before placement
- Order validation against restaurant service

### ✅ Order Tracking
- Real-time delivery status
- Progress bar (0-100%)
- Auto-refresh every 3 seconds
- Rider assignment info

### ✅ Responsive Design
- Mobile-first
- Material-UI responsive grid
- Touch-friendly UI

## Getting Started

### Prerequisites
- Node.js 18+
- Backend services running (gateway on port 80)

### Installation
\`\`\`bash
npm install
\`\`\`

### Development
\`\`\`bash
npm run dev
# Opens at http://localhost:5173
\`\`\`

Vite dev proxy forwards:
- `/api/*` → `http://localhost` (gateway)
- `/order` → `http://localhost` (gateway)
- `/delivery/*` → `http://localhost` (gateway)
- `/notifications/*` → `http://localhost` (gateway)

### Build
\`\`\`bash
npm run build
# Output: dist/
\`\`\`

### Preview Production Build
\`\`\`bash
npm run preview
\`\`\`

## Project Structure

\`\`\`
src/
├── api/           # API client & service modules (gateway only)
│   ├── client.ts       # Axios instance with auth interceptor
│   ├── auth.ts         # Auth endpoints
│   ├── restaurants.ts  # Restaurant endpoints
│   ├── orders.ts       # Order endpoints
│   ├── delivery.ts     # Delivery tracking
│   └── notifications.ts
├── components/    # Reusable UI components
│   ├── Navbar.tsx
│   └── ProtectedRoute.tsx
├── context/       # React Context providers
│   └── AuthContext.tsx  # JWT & user state
├── pages/         # Route pages
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Restaurants.tsx
│   ├── RestaurantMenu.tsx
│   ├── Checkout.tsx
│   └── OrderTracking.tsx
├── store/         # Zustand stores
│   └── cart.ts         # Shopping cart state
├── types/         # TypeScript interfaces
│   └── index.ts        # All backend contracts
├── App.tsx        # Root component with routing
└── main.tsx       # Entry point
\`\`\`

## Environment Variables

\`.env\`:
\`\`\`
VITE_API_BASE_URL=http://localhost
\`\`\`

For production, set to your gateway URL (e.g., `https://api.yourdomain.com`).

## Key Design Decisions

### Gateway-Only Communication
- Frontend **never** calls services directly (user:3000, restaurant:3001, etc.)
- All requests go through Nginx gateway on port 80
- Gateway handles routing, CORS, and can add auth validation

### JWT Authentication
- Token stored in localStorage
- Axios interceptor adds `Authorization: Bearer <token>`
- 401 responses trigger auto-logout and redirect to login

### State Management
- Server state: React Query (caching, refetching, mutations)
- Client state: Zustand (cart)
- Auth state: React Context + localStorage

### Real-time Tracking
- Uses React Query `refetchInterval` (3s polling)
- Delivery service updates location/progress/status
- Alternative: WebSocket (can be added later)

## User Flows

### 1. Registration → Login → Browse
1. User registers (`POST /api/auth/register`)
2. Auto-login after registration
3. Redirected to `/restaurants`

### 2. Order Placement
1. Browse restaurants (`GET /api/restaurants`)
2. Select restaurant → view menu (`GET /api/restaurants/:id`)
3. Add items to cart (Zustand)
4. Checkout → review cart
5. Place order (`POST /order`)
6. Order service validates prices with restaurant service
7. Order service publishes to RabbitMQ
8. Redirected to `/order/:orderId`

### 3. Delivery Tracking
1. Delivery service consumes `order.placed` event
2. Creates assignment, assigns rider
3. Frontend polls `/delivery/assignments/:orderId` every 3s
4. Shows progress, rider info, location
5. Status: CREATED → ASSIGNED → IN_TRANSIT → DELIVERED

## API Contracts (from backend)

All types defined in `src/types/index.ts` match backend responses:
logout
- **User**: `_id`, `name`, `email`, `addresses[]`
- **Restaurant**: `_id`, `name`, `category`, `menu[]`, `pricingRules[]`
- **MenuItem**: `name`, `description`, `price`, `finalPrice` (calculated)
- **Order**: `id`, `userId`, `restaurantId`, `items[]`, `total`, `status`
- **DeliveryAssignment**: `orderId`, `status`, `rider_id`, `location`, `progress`

## Error Handling

- API errors shown via MUI `<Alert>`
- Loading states via MUI `<CircularProgress>`
- 401 → auto-
- Network errors caught by React Query

## Security Notes

- JWT in localStorage (consider httpOnly cookies for production)
- No sensitive data in client state
- All auth via gateway
- CORS handled by gateway

## Future Enhancements

- [ ] WebSocket for real-time notifications
- [ ] Optimistic UI updates
- [ ] Offline support (service worker)
- [ ] Push notifications
- [ ] Order history page
- [ ] User profile & address management
- [ ] Favorite restaurants
- [ ] Payment integration

## Testing

\`\`\`bash
# (Tests not yet implemented)
npm run test
\`\`\`

## License

MIT
