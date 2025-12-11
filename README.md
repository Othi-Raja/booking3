# Ticket Booking System

A full-stack ticket booking application with concurrency handling.

## Tech Stack

- **Backend**: Node.js, Express, PostgreSQL
- **Frontend**: React, TypeScript, TailwindCSS

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- PostgreSQL

### Backend Setup

1. Navigate to `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` with your Postgres credentials.
4. Initialize Database:
   ```bash
   npx ts-node src/initDb.ts
   ```
5. Start Server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Development Server:
   ```bash
   npm run dev
   ```

## API Documentation

See `design_document.md` for architecture details.

### Endpoints

- `POST /api/admin/shows`: Create a new show.
- `GET /api/shows`: List all shows.
- `GET /api/shows/:id`: Get show details and seat status.
- `POST /api/bookings`: Book seats.
