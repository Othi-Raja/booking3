import { Request, Response } from 'express';
import pool from '../config/db';

export const createShow = async (req: Request, res: Response) => {
  const { name, start_time, total_seats } = req.body;

  if (!name || !start_time || !total_seats) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insert Show
    const showResult = await client.query(
      'INSERT INTO shows (name, start_time, total_seats) VALUES ($1, $2, $3) RETURNING id',
      [name, start_time, total_seats]
    );
    const showId = showResult.rows[0].id;

    // Generate Seats
    const seatValues = [];
    for (let i = 1; i <= total_seats; i++) {
      seatValues.push(`(${showId}, ${i}, 'AVAILABLE', 0)`);
    }

    // Bulk Insert Seats
    // Note: For very large numbers of seats, we might need to batch this, 
    // but for < 1000 seats, a single query is usually fine.
    if (seatValues.length > 0) {
        await client.query(
        `INSERT INTO seats (show_id, seat_number, status, version) VALUES ${seatValues.join(',')}`
        );
    }

    await client.query('COMMIT');

    res.status(201).json({ message: 'Show created successfully', showId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating show:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};
