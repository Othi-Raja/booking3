import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getShows, type Show } from '../services/api';

const UserDashboard = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const data = await getShows();
        setShows(data);
      } catch (error) {
        console.error('Failed to fetch shows', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, []);

  if (loading) return <div className="text-center p-10">Loading shows...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Available Shows</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shows.map((show) => (
          <div key={show.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">{show.name}</h3>
            <p className="text-gray-600 mb-4">
              {new Date(show.start_time).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mb-4">{show.total_seats} Seats</p>
            <Link
              to={`/booking/${show.id}`}
              className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Book Seats
            </Link>
          </div>
        ))}
      </div>
      {shows.length === 0 && (
        <p className="text-center text-gray-500">No shows available at the moment.</p>
      )}
    </div>
  );
};

export default UserDashboard;
