import { Request, Response } from 'express';
import pool from '../config/db';

export const getShows = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM shows ORDER BY start_time ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching shows:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getShowDetails = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const showResult = await pool.query('SELECT * FROM shows WHERE id = $1', [id]);
    if (showResult.rows.length === 0) {
      return res.status(404).json({ error: 'Show not found' });
    }

    const seatsResult = await pool.query(
      'SELECT id, seat_number, status FROM seats WHERE show_id = $1 ORDER BY seat_number ASC',
      [id]
    );

    res.json({
      show: showResult.rows[0],
      seats: seatsResult.rows,
    });
  } catch (error) {
    console.error('Error fetching show details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
