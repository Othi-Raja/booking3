# Ticket Booking System - Technical Design Document

## 1. High-Level System Architecture

The system follows a standard 3-tier architecture:

- **Client**: React.js Single Page Application (SPA).
- **Server**: Node.js/Express REST API.
- **Database**: PostgreSQL Relational Database.

### Key Components

- **API Gateway / Load Balancer** (Production): Nginx or AWS ALB to distribute traffic across multiple Node.js instances.
- **Backend Services**: Stateless Node.js instances handling business logic.
- **Database Cluster**: Primary-Replica setup for high availability and read scaling.

## 2. Database Design & Scaling

### Schema

- **Shows**: Stores event details.
- **Seats**: Stores individual seat status per show. Optimistic locking (`version` column) is used for concurrency.
- **Bookings**: Stores transaction records.

### Scaling Strategy

- **Read Replicas**: Use read replicas for `GET /shows` and `GET /shows/:id` queries, as read traffic is typically much higher than write traffic.
- **Sharding**: If the number of shows grows significantly, we can shard the `seats` and `bookings` tables based on `show_id`. This ensures all data for a specific show resides on the same shard, maintaining transactional integrity for bookings.
- **Connection Pooling**: Use `pg-pool` to manage database connections efficiently.

## 3. Concurrency Control

To prevent overbooking, we implement **Pessimistic Locking** (or Optimistic Locking depending on contention).

### Strategy Used: `FOR UPDATE` (Pessimistic Lock)

In the `bookSeatsTransaction` service:

1.  Start Transaction (`BEGIN`).
2.  `SELECT ... FROM seats WHERE id = ... FOR UPDATE`. This locks the specific seat rows.
3.  Check if `status` is `AVAILABLE`.
4.  If available, insert into `bookings` and update `seats` to `BOOKED`.
5.  Commit Transaction (`COMMIT`).

This ensures that if two users try to book the same seat simultaneously, the second transaction will wait until the first one releases the lock. If the first one succeeds, the second one will see the status as `BOOKED` and fail.

## 4. Caching Strategy

- **Redis**: Use Redis to cache the response of `GET /shows` and `GET /shows/:id`.
- **Cache Invalidation**: When a booking is confirmed, invalidate the cache for that specific show's seat layout.

## 5. Message Queue (Optional)

For a production-grade system, we can decouple the booking process:

1.  API accepts booking request -> Pushes to **RabbitMQ/Kafka**.
2.  Worker service consumes message -> Processes transaction.
3.  User polls for status or receives WebSocket update.
    This handles traffic spikes better than synchronous processing.
