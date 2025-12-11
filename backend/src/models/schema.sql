CREATE TABLE IF NOT EXISTS shows (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  total_seats INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS seats (
  id SERIAL PRIMARY KEY,
  show_id INTEGER REFERENCES shows(id),
  seat_number INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'AVAILABLE', -- AVAILABLE, BOOKED, LOCKED
  version INTEGER DEFAULT 0, -- Optimistic locking
  UNIQUE(show_id, seat_number)
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER, -- Can be nullable if no user auth
  show_id INTEGER REFERENCES shows(id),
  seat_ids INTEGER[], -- Array of seat IDs
  status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, CONFIRMED, FAILED
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
