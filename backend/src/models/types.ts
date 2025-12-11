export interface Show {
  id: number;
  name: string;
  start_time: Date;
  total_seats: number;
}

export interface Seat {
  id: number;
  show_id: number;
  seat_number: number;
  status: 'AVAILABLE' | 'BOOKED' | 'LOCKED';
  version: number;
}

export interface Booking {
  id: number;
  user_id: number | null;
  show_id: number;
  seat_ids: number[];
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  created_at: Date;
}
