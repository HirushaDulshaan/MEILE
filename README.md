# 🛍️ MEILI — SmartStyle Fashion & AI-Powered E-Commerce Platform

> High-End Fashion Retail with Microservices Architecture & Gemini AI Support Engine.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-black?style=for-the-badge)](https://meile-fashion.vercel.app/dees)
[![Next.js](https://img.shields.io/badge/Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini%20AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![Render](https://img.shields.io/badge/AI%20Engine%20on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://render.com/)

---

## 🌟 Overview

**MEILI (SmartStyle)** is a modern, high-performance M-Commerce platform engineered for high-traffic fashion retail. Built with a **Decoupled Microservices Architecture**, it combines a ultra-responsive **Next.js 15** frontend with an autonomous **Python FastAPI AI Agent Engine** powered by **Google Gemini AI**. 

It uses **Neon PostgreSQL** with **ACID Prisma Transactions** to guarantee zero data inconsistency during flash sales, while serving real-time AI customer assistance, complaint ticketing, and interactive order tracking.

---

## 🔥 Key Features

- 🤖 **Autonomous AI Customer Agent (Gemini AI)** — Intelligent order verification, automated complaint ticketing, and product inquiry assistance.
- 🛍️ **Full M-Commerce Shopping Flow** — Dynamic product catalog, interactive size filters, and animated drag-and-drop cart management.
- 📊 **Real-time Admin Analytics Dashboard** — Interactive revenue growth charts powered by **Recharts** and live store highlights.
- 💳 **Stripe Payment Integration** — Secure, PCI-compliant checkout workflow.
- 🔐 **JWT & Role-Based Security** — Stateless user sessions with administrative security controls.
- 🗃️ **Serverless PostgreSQL (Neon DB)** — Instant database branching with Prisma ORM for resilient data transactions.
- 🎨 **Modern Interactive UI/UX** — Framer Motion smooth page transitions, draggable floating chat widget, and responsive layout.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Platform** | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| **UI & Animations** | Framer Motion, Lucide Icons, Recharts |
| **State Management** | Zustand |
| **Main E-Commerce Backend** | Next.js Serverless API Routes |
| **AI Support Microservice** | Python 3.12, FastAPI, Uvicorn, Pydantic |
| **LLM & AI Engine** | Google Gemini Generative AI API |
| **Database & ORM** | PostgreSQL (Neon DB), Prisma ORM & SQLAlchemy |
| **Payments** | Stripe API |
| **Deployments** | **Frontend:** Vercel \| **AI Engine:** Render.com |

---

## 🏗️ System Architecture

```text
               ┌──────────────────────────────────────────────┐
               │         Client Interface (Browser)           │
               │        Next.js 15 / TypeScript / React       │
               └──────────────────────┬───────────────────────┘
                                      │
            ┌─────────────────────────┴─────────────────────────┐
            │                                                   │
            ▼                                                   ▼
┌──────────────────────┐                             ┌──────────────────────┐
│ Next.js API Routes   │                             │ Python FastAPI Service│
│ (E-Commerce Backend) │                             │ (AI Support Engine)  │
└───────────┬──────────┘                             └──────────┬───────────┘
            │                                                   │
            │ (Prisma ORM)                                      │ (Gemini API / SQLAlchemy)
            ▼                                                   ▼
┌──────────────────────┐                             ┌──────────────────────┐
│ Neon PostgreSQL DB   │ ◄───────────────────────────┤ Google Gemini AI     │
│ (Orders/Users/Items) │     (Order Verification)    │ (Intent Processing)  │
└──────────────────────┘                             └──────────────────────┘
```
## ⚡ Microservices Breakdown

### 1. Main E-Commerce Web Service (`/`)
* **Framework:** Next.js 15 (React 19 / TypeScript)
* **Hosting:** Vercel
* **Function:** Storefront UI, Zustand Cart, Checkout, User Authentication, Admin Dashboard, Recharts Visuals.

### 2. AI Support Agent Service (`meili-ai-support-service`)
* **Framework:** Python 3.12 + FastAPI
* **Hosting:** Render ([https://meili-ai-support-service.onrender.com](https://meili-ai-support-service.onrender.com))
* **Function:** Natural Language Intent Analysis, Automated Order Status Verification, AI Complaint Ticket Creation.

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* Python 3.12+
* Neon PostgreSQL Database Account
* Google Gemini API Key
* Stripe Account

---

### 1. Main Next.js App Setup

```bash
# Clone the repository
git clone [https://github.com/HirushaDulshaan/MEILE.git](https://github.com/HirushaDulshaan/MEILE.git)
cd MEILE

# Install Node dependencies
npm install

# Setup Environment Variables (.env)
DATABASE_URL="postgresql://..."
JWT_SECRET="your_jwt_secret"
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Run Database Migrations
npx prisma migrate dev

# Run Next.js Development Server
npm run dev
```
### 2. Python AI Engine Microservice Setup

```bash
cd meili-ai-support-service

# Install Python Dependencies
pip install -r requirements.txt

# Setup Environment Variables (.env)
GEMINI_API_KEY="your_gemini_api_key"
DATABASE_URL="your_neon_db_url"
FRONTEND_URL="http://localhost:3000"

# Run FastAPI Server locally
uvicorn main:app --reload --port 8000
```
## 🌐 Live Microservice Links

* 🛍️ **Live Application:** [meile-fashion.vercel.app/dees](https://meile-fashion.vercel.app/dees)
* ⚡ **Live AI Service Health Check:** [meili-ai-support-service.onrender.com](https://meili-ai-support-service.onrender.com)

---

## 👤 Author

**Hirusha Dulshan** — Fullstack Software Engineer

* 🌐 **Portfolio:** [hirushadulshan.me](https://hirushadulshan.me)
* 💼 **LinkedIn:** [linkedin.com/in/hirusha-dulshan](https://www.linkedin.com/in/hirusha-dulshan/)
* 🐙 **GitHub:** [github.com/HirushaDulshaan](https://github.com/HirushaDulshaan)
* 📧 **Email:** hirushadulshaan@gmail.com

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
