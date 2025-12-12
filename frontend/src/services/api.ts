import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://booking3-ho4cntc5t-othirajas-projects.vercel.app/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Show {
  id: number;
  name: string;
  start_time: string;
  total_seats: number;
}

export interface Seat {
  id: number;
  show_id: number;
  seat_number: number;
  status: 'AVAILABLE' | 'BOOKED' | 'LOCKED';
}

export interface BookingResponse {
  message: string;
  bookingId?: number;
  error?: string;
}

export const getShows = async () => {
  const response = await api.get<Show[]>('/shows');
  return response.data;
};

export const getShowDetails = async (id: string) => {
  const response = await api.get<{ show: Show; seats: Seat[] }>(`/shows/${id}`);
  return response.data;
};

export const createShow = async (data: Omit<Show, 'id'>) => {
  const response = await api.post('/admin/shows', data);
  return response.data;
};

export const bookSeats = async (showId: number, seatIds: number[], userId: number = 1) => {
  const response = await api.post<BookingResponse>('/bookings', { showId, seatIds, userId });
  return response.data;
};
