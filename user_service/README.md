User Service (Node.js + Express + MongoDB)

Quick start:
1. Copy `.env.example` to `.env` and edit values.
2. Install deps:
   npm install
3. Run in dev:
   npm run dev
4. Health:
   GET /health
5. Auth endpoints:
   POST /api/auth/register
   POST /api/auth/login
   GET /api/auth/me (requires Authorization: Bearer <token>)
   POST /api/auth/address (requires token)