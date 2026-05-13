# MEILE — SmartStyle Fashion Platform

> High-End Fashion Retail with Serverless Scalability

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-black?style=for-the-badge)](https://meile-fashion.vercel.app/dees)
[![Next.js](https://img.shields.io/badge/Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

---

## Overview

**MEILE** is a full-stack, serverless M-Commerce platform engineered for high-traffic fashion retail. Built on **Next.js 15** with a **PostgreSQL (Neon)** backend and **Prisma Transactions**, it ensures data integrity during flash sales and global traffic spikes delivering a seamless, premium shopping experience at scale.

---

## Features

- 🛍️ **Full M-Commerce Flow** — Product browsing, cart management, and checkout
- 💳 **Stripe Payment Integration** — Secure, real world payment processing
- 🔐 **JWT Authentication** — Stateless, secure user sessions
- ⚡ **Serverless Architecture** — Scales automatically with demand via Vercel
- 🗃️ **Prisma Transactions** — ACID-compliant transactions for order and inventory integrity
- 🌐 **Neon DB (PostgreSQL)** — Serverless Postgres with instant branching
- 🧠 **Zustand State Management** — Lightweight, scalable client side state

---

## Tech Stack

| Layer        | Technology                              |
|-------------|------------------------------------------|
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS    |
| **State**    | Zustand                                 |
| **Backend**  | Next.js API Routes (Serverless)         |
| **Auth**     | JWT                                     |
| **Database** | PostgreSQL (Neon DB)                    |
| **ORM**      | Prisma                                  |
| **Payments** | Stripe                                  |
| **Deploy**   | Vercel                                  |

---

## Architecture

```
Client (Next.js 15 / TypeScript)
        │
        ▼
  Next.js API Routes  ──── JWT Auth
        │
        ▼
   Prisma ORM
        │
        ▼
  PostgreSQL (Neon DB)
        │
   ACID Transactions
   (Cart / Orders / Payments)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or [Neon DB](https://neon.tech/) account)
- Stripe account for payment processing

### Installation

```bash
# Clone the repository
git clone https://github.com/HirushaDulshaan/MEILE.git
cd MEILE

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=your_neon_postgresql_connection_string

# Auth
JWT_SECRET=your_jwt_secret_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# App
NEXTAUTH_URL=http://localhost:3000
```

### Database Setup

```bash
# Run Prisma migrations
npx prisma migrate dev

# Seed the database (if applicable)
npx prisma db seed
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Live Demo

🔗 [meile-fashion.vercel.app/dees](https://meile-fashion.vercel.app/dees)

---

## Author

**Hirusha Dulshan** — Fullstack Engineer

- 🌐 Portfolio: [hirushadulshan.me](https://hirushadulshan.me)
- 💼 LinkedIn: [linkedin.com/in/hirusha-dulshan](https://www.linkedin.com/in/hirusha-dulshan/)
- 🐙 GitHub: [github.com/HirushaDulshaan](https://github.com/HirushaDulshaan)
- 📧 Email: hirushadulshaan@gmail.com

---

## License

This project is open source and available under the [MIT License](LICENSE).
