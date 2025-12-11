import { useState } from 'react';
import { createShow } from '../services/api';
import Button from '../components/Button';

const AdminDashboard = () => {
  const [formData, setFormData] = useState({
    name: '',
    start_time: '',
    total_seats: 40,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await createShow(formData);
      setMessage('Show created successfully!');
      setFormData({ name: '', start_time: '', total_seats: 40 });
    } catch (err) {
      setError('Failed to create show. Please check inputs.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Create New Show</h2>
        {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Show Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="datetime-local"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Seats</label>
            <input
              type="number"
              required
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              value={formData.total_seats}
              onChange={(e) => setFormData({ ...formData, total_seats: parseInt(e.target.value) })}
            />
          </div>
          <Button type="submit">Create Show</Button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
