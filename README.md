
Mini Q&A App (MERN)
-------------------
Structure:
  backend/   - Express + Mongo (APIs)
    database/ db.js
    models/   Mongoose models
    controllers/
    routes/
    utils/
  frontend/  - React + Vite (pages + styles + components)

Quick start:
  # backend
  cd backend
  npm install
  cp .env.example .env
  # set MONGO_URI and JWT_SECRET
  npm run dev

  # frontend
  cd frontend
  npm install
  npm run dev

Notes:
  - The backend uses JWT auth and role-based checks for insights.
  - This is a reference starter. You can extend validation, pagination, upload features, and UI polish.
