import { Request, Response } from 'express';
import pool from '../config/db';
import { bookSeatsTransaction } from '../services/bookingService';

export const createBooking = async (req: Request, res: Response) => {
  const { userId, showId, seatIds } = req.body;

  if (!showId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
    return res.status(400).json({ error: 'Invalid booking request' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await bookSeatsTransaction(client, userId || null, showId, seatIds);

    if (result.success) {
      await client.query('COMMIT');
      res.status(201).json({ message: 'Booking confirmed', bookingId: result.bookingId });
    } else {
      await client.query('ROLLBACK');
      res.status(409).json({ error: result.message }); // 409 Conflict
    }

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error processing booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};
