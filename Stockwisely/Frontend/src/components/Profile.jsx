import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 
import Navbar from "../components/Navbar"; 

const Profile = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch watchlist from localStorage
    const fetchWatchlist = () => {
      const savedWatchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
      setWatchlist(savedWatchlist);
    };
    fetchWatchlist();
  }, []);

  const handlePasswordUpdate = async () => {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    if (!email || !token) {
      setMessage("Please log in first.");
      return;
    }

    try {
      const res = await axios.post(
        "/api/user/update-password", 
        { email, password: newPassword }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
    } catch (error) {
      console.error("Error updating password", error);
      setMessage("Error updating password");
    }
  };

  const handleWatchlistRedirect = () => {
    navigate("/watchlist");
  };

  return (
    <div className="mt-20 p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md space-y-6">
      <Navbar /> 

      {/* Update Password Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold">Update Password</h3>
        <input
          type="password"
          placeholder="New password"
          className="border p-2 rounded w-full mt-2 focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 placeholder-gray-400 outline-none"
          
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          onClick={handlePasswordUpdate}
          className="mt-2 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Update Password
        </button>
        {message && <p className="text-green-600 mt-2">{message}</p>}
      </div>

      {/* Watchlist Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3
          className="text-xl font-semibold cursor-pointer"
          onClick={handleWatchlistRedirect}
        >
          Check your watchlist →
        </h3>

        {watchlist.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {watchlist.map((stock, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 border-2 border-orange-200 relative"
              >
                <h3 className="text-lg font-semibold text-black mb-4">{stock.companyName}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-sm text-orange-500 mb-2">
                    <strong>Current Price:</strong>
                    <div className="mt-1 text-lg font-medium">
                      {stock.isHoliday ? "Market Closed" : `$${stock.currentPrice.toFixed(2)}`}
                    </div>
                  </div>
                  <div className="text-sm text-orange-500 mb-2">
                    <strong>Last Price:</strong>
                    <div className="mt-1 text-lg font-medium">
                      {stock.prices[stock.prices.length - 1].toFixed(2)} USD
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-2">Your watchlist is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
