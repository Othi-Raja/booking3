# Deployment Guide: Vercel & Supabase

This guide explains how to deploy the Ticket Booking System using Supabase (Database) and Vercel (Frontend & Backend).

## 1. Supabase Setup (Database)

1.  **Create Project**: Go to [Supabase](https://supabase.com/) and create a new project.
2.  **Get Credentials**:
    - Go to **Project Settings** -> **Database**.
    - Copy the **Connection String** (URI mode). It looks like: `postgres://postgres.[ref]:[password]@aws-0-region.pooler.supabase.com:6543/postgres`.
    - _Note: Use the "Transaction" mode (port 6543) if available for serverless environments._
3.  **Run Schema**:
    - Go to **SQL Editor** in Supabase dashboard.
    - Copy the content of `backend/src/models/schema.sql`.
    - Run the query to create tables (`shows`, `seats`, `bookings`).

## 2. Backend Deployment (Vercel)

1.  **Install Vercel CLI** (Optional, or use Web UI):
    ```bash
    npm i -g vercel
    ```
2.  **Deploy**:
    - Navigate to `backend` folder.
    - Run `vercel` or connect your GitHub repo to Vercel.
3.  **Environment Variables**:
    - In Vercel Project Settings -> **Environment Variables**:
    - Add `DATABASE_URL`: Paste your Supabase connection string.
4.  **Get URL**:
    - Vercel will provide a URL (e.g., `https://your-backend.vercel.app`).
    - Test it: `https://your-backend.vercel.app/api/shows`.

## 3. Frontend Deployment (Vercel)

1.  **Configure Build**:
    - Navigate to `frontend` folder.
    - Run `vercel` or connect repo.
    - **Framework Preset**: Vite.
    - **Build Command**: `npm run build`.
    - **Output Directory**: `dist`.
2.  **Environment Variables**:
    - Add `VITE_API_URL`: Set this to your **Backend URL** (e.g., `https://your-backend.vercel.app/api`).
    - _Important: No trailing slash at the end if your code appends `/shows`._
3.  **Deploy**:
    - Click Deploy.
    - Your app is now live!

## 4. Troubleshooting

- **CORS Issues**: If frontend cannot talk to backend, ensure `cors` is enabled in `backend/src/app.ts` (it is by default).
- **Database Connection**: If you see "Too many connections", ensure you are using the Supabase **Transaction Pooler** (port 6543) instead of the Session Pooler (port 5432).
