# Ticket Booking System Documentation

## 1. Project Overview

A full-stack ticket booking application built to handle concurrency and providing a seamless user experience.

### Technology Stack

- **Backend**: Node.js, Express, PostgreSQL
- **Frontend**: React, TypeScript, TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

---

## 2. System Architecture

The system follows a standard 3-tier architecture:

- **Client**: React.js Single Page Application (SPA).
- **Server**: Node.js/Express REST API.
- **Database**: PostgreSQL Relational Database.

### Key Components

- **API Gateway / Load Balancer**: Distributes traffic across backend instances.
- **Backend Services**: Stateless Node.js instances handling business logic.
- **Database Cluster**: Primary-Replica setup for high availability.

### Concurrency Control

To prevent overbooking, the system implements **Pessimistic Locking** using `FOR UPDATE`.

**Strategy**:

1.  Start Transaction (`BEGIN`).
2.  Lock specific seats (`SELECT ... FOR UPDATE`).
3.  Check availability.
4.  If available, book and commit.
5.  If not, rollback/fail.

### Scaling Strategy

- **Read Replicas**: For high-read endpoints like (`GET /shows`).
- **Sharding**: Future-proof strategy for `seats` and `bookings` tables based on `show_id`.
- **Connection Pooling**: Managed via `pg-pool`.

---

## 3. Local Setup Instructions

### Prerequisites

- Node.js (v18+)
- PostgreSQL

### Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    - Create a `.env` file based on `.env.example`.
    - Update `DATABASE_URL` with your Postgres credentials.
4.  Initialize Database:
    ```bash
    npx ts-node src/initDb.ts
    ```
5.  Start the development server:
    ```bash
    npm run dev
    ```

### Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

---

## 4. Deployment Guide (Vercel & Supabase)

### Database (Supabase)

1.  Create a new project on [Supabase](https://supabase.com/).
2.  Retrieve the **Connection String** (Transaction mode / port 6543 recommended).
3.  Run the schema script found in `backend/src/models/schema.sql` via the Supabase SQL Editor.

### Backend (Vercel)

1.  Navigate to `backend` and run `vercel` to deploy.
2.  Set **Environment Variables** in Vercel:
    - `DATABASE_URL`: Your Supabase connection string.
3.  Note the deployed URL (e.g., `https://your-backend.vercel.app`).

### Frontend (Vercel)

1.  Navigate to `frontend` and run `vercel`.
2.  **Build Settings**:
    - Framework: Vite
    - Build Command: `npm run build`
    - Output Directory: `dist`
3.  Set **Environment Variables**:
    - `VITE_API_URL`: The Backend URL (e.g., `https://your-backend.vercel.app/api`).
4.  Deploy.

---

## 5. API Reference

### Shows

- `GET /api/shows`: List all shows.
- `GET /api/shows/:id`: Get detailed show info and seat availability.
- `POST /api/admin/shows`: Create a new show (Admin).

### Bookings

- `POST /api/bookings`: Book seats. Requires seat IDs and user details.
