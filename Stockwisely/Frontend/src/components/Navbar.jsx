import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Star, User, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear authentication token
    navigate('/landing'); // Redirect to landing page
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">StockWisely</span>
          </Link>
        </div>

        <div className="flex items-center space-x-8">
          <NavLink to="/home" icon={<Home />} active={location.pathname === '/home'} label="Home" />
          <NavLink to="/watchlist" icon={<Star />} active={location.pathname === '/watchlist'} label="Watchlist" />
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                location.pathname === '/profile' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <User className={`h-5 w-5 ${location.pathname === '/profile' ? 'text-orange-600' : 'text-gray-600'}`} />
              <span className="text-sm font-medium">Profile</span>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
                <button
                  onClick={() => { navigate('/profile'); setShowDropdown(false); }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Your Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const NavLink = ({ to, icon, active, label }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
      active ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-700'
    }`}
  >
    {React.cloneElement(icon, {
      className: `h-5 w-5 ${active ? 'text-orange-600' : 'text-gray-600'}`,
    })}
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

export default Navbar;