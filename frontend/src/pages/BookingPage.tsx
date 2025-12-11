import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShowDetails, bookSeats, type Show, type Seat } from '../services/api';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [show, setShow] = useState<Show | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      const data = await getShowDetails(id!);
      setShow(data.show);
      setSeats(data.seats);
    } catch (error) {
      console.error('Failed to fetch details', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seatId: number) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      alert('Please login to book seats');
      return;
    }
    setBookingStatus('pending');
    setErrorMessage('');

    try {
      await bookSeats(Number(id), selectedSeats, user.id);
      setBookingStatus('success');
      setSelectedSeats([]);
      fetchDetails(); // Refresh to show updated seat status
    } catch (error) {
      setBookingStatus('error');
      const err = error as any;
      setErrorMessage(err.response?.data?.error || 'Booking failed due to concurrency or network error.');
      fetchDetails(); // Refresh to show which seats were taken
    }
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (!show) return <div className="text-center p-10">Show not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{show.name}</h1>
          <p className="text-gray-600">{new Date(show.start_time).toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Selected: {selectedSeats.length}</p>
        </div>
      </div>

      {bookingStatus === 'success' && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-6">
          Booking Confirmed!
        </div>
      )}
      {bookingStatus === 'error' && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-5 gap-4 mb-8 max-w-md mx-auto">
        {seats.map((seat) => {
          const isSelected = selectedSeats.includes(seat.id);
          const isBooked = seat.status === 'BOOKED';
          
          return (
            <button
              key={seat.id}
              disabled={isBooked}
              onClick={() => toggleSeat(seat.id)}
              className={`
                h-12 w-12 rounded-lg font-bold transition-all duration-200
                ${isBooked 
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                  : isSelected 
                    ? 'bg-green-500 text-white transform scale-105 shadow-md' 
                    : 'bg-white border-2 border-blue-200 hover:border-blue-400 text-blue-600'}
              `}
            >
              {seat.seat_number}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center gap-4">
        <Button 
          onClick={handleBooking} 
          disabled={selectedSeats.length === 0 || bookingStatus === 'pending'}
          className="w-48"
        >
          {bookingStatus === 'pending' ? 'Processing...' : 'Confirm Booking'}
        </Button>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Back to List
        </Button>
      </div>
      
      <div className="mt-8 flex justify-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border-2 border-blue-200 rounded"></div> Available
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div> Selected
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div> Booked
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
