import { PoolClient } from 'pg';

export const bookSeatsTransaction = async (
  client: PoolClient,
  userId: number | null,
  showId: number,
  seatIds: number[]
): Promise<{ success: boolean; message?: string; bookingId?: number }> => {
  try {
    // 1. Lock the seats for update
    // We select the seats and lock them. We also check if they are AVAILABLE.
    // FOR UPDATE ensures that no other transaction can modify these rows until this one commits/rollbacks.
    // We sort seatIds to prevent deadlocks if multiple transactions try to lock same seats in different order.
    const sortedSeatIds = [...seatIds].sort((a, b) => a - b);
    
    const seatsResult = await client.query(
      `SELECT id, status, version FROM seats 
       WHERE id = ANY($1::int[]) AND show_id = $2 
       FOR UPDATE`,
      [sortedSeatIds, showId]
    );

    if (seatsResult.rows.length !== seatIds.length) {
        return { success: false, message: 'One or more seats not found or invalid.' };
    }

    // 2. Check availability
    for (const seat of seatsResult.rows) {
      if (seat.status !== 'AVAILABLE') {
        return { success: false, message: `Seat ${seat.id} is already booked or locked.` };
      }
    }

    // 3. Create Booking Record (PENDING)
    const bookingResult = await client.query(
      'INSERT INTO bookings (user_id, show_id, seat_ids, status) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, showId, seatIds, 'CONFIRMED'] // Directly confirming for simplicity in this step, or could be PENDING then CONFIRMED
    );
    const bookingId = bookingResult.rows[0].id;

    // 4. Update Seats status to BOOKED
    await client.query(
      `UPDATE seats SET status = 'BOOKED' WHERE id = ANY($1::int[])`,
      [seatIds]
    );

    return { success: true, bookingId };

  } catch (error) {
    throw error;
  }
};
