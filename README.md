# Kuhuu Fashion

> Premium Indian fashion e-commerce platform — Instagram-first, mobile-first.

## Project Structure

```
kuhuu-fashion/
├── frontend/          # React + Vite + TypeScript + Tailwind CSS
├── backend/           # Node.js + Express + TypeScript + Prisma
├── docs/              # API, Database, Deployment documentation
├── docker-compose.yml # Local development environment
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or pnpm

### 1. Clone & install

```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Set up environment

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your database URL, JWT secrets, Razorpay keys, etc.

# Frontend
cp frontend/.env.example frontend/.env
```

### 3. Set up database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Start development servers

```bash
# Backend (port 5000)
cd backend && npm run dev

# Frontend (port 5173)
cd frontend && npm run dev
```

### 5. Using Docker (optional)

```bash
docker-compose up -d
```

## Technology Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| State | Zustand |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Backend | Node.js, Express, TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT (access + refresh tokens) |
| Payment | Razorpay |
| Storage | Cloudinary |
| Email | Nodemailer |
| WhatsApp | WhatsApp Business API |

## Features

- 🛍️ Product catalogue with variants (size, color)
- 🔍 Full-text search & advanced filters
- 🛒 Cart (drawer + full page)
- ❤️ Wishlist
- 💳 Checkout (Razorpay + COD)
- 📦 Order management & tracking
- 👤 Customer accounts
- 🏷️ Coupon system
- 📊 Admin dashboard with analytics
- 📱 WhatsApp & Email notifications
- 📸 Instagram feed integration
- 🔒 Role-based access control
- 🚀 SEO optimized

## License

Private — Kuhuu Fashion © 2024
