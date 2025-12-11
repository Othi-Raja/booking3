import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import BookingPage from './pages/BookingPage';

const Navigation = () => {
  const { user, login, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">TicketBooking</Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/admin" className="hover:text-gray-300">Admin</Link>
          
          {user ? (
            <div className="flex items-center gap-4 ml-4 border-l pl-4 border-gray-600">
              <span className="text-sm text-gray-400">Hi, {user.name}</span>
              <button onClick={logout} className="text-sm hover:text-red-400">Logout</button>
            </div>
          ) : (
            <div className="flex gap-2 ml-4 border-l pl-4 border-gray-600">
              <button onClick={() => login('user')} className="text-sm bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">Login User</button>
              <button onClick={() => login('admin')} className="text-sm bg-purple-600 px-3 py-1 rounded hover:bg-purple-700">Login Admin</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <Routes>
            <Route path="/" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/booking/:id" element={<BookingPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
