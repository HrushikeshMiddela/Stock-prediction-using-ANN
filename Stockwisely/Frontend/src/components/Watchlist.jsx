import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from "../components/Navbar";
import gsap from 'gsap';
import Lenis from '@studio-freight/lenis';

const StockWatchlist = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stockData, setStockData] = useState([]);
  const [stockPreview, setStockPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      lerp: 0.1, // Adjust smoothness
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);


  // Load watchlist data from localStorage
  useEffect(() => {
    const savedWatchlist = JSON.parse(localStorage.getItem('watchlist'));
    if (savedWatchlist) {
      setStockData(savedWatchlist);
    }
  }, []);

  // Save watchlist data to localStorage whenever it changes
  useEffect(() => {
    if (stockData.length > 0) {
      localStorage.setItem('watchlist', JSON.stringify(stockData));
    }
  }, [stockData]);

  // API call to fetch stock data (adjust according to your API)
  const fetchStockData = async (symbol) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`/api/stocks/${symbol}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      const data = await response.json();

      setStockPreview({
        companyName: symbol,
        symbol,
        dates: data.dates.slice(-30), // Get the last 30 days of data
        prices: data.prices.slice(-30), // Get the last 30 prices
        currentPrice: data.prices[data.prices.length - 1], // Get the most recent price
        isHoliday: data.isHoliday, // New flag indicating if today is a holiday (if applicable)
      });

      // Animating the stock preview using GSAP
      gsap.fromTo('.stock-preview', { opacity: 0 }, { opacity: 1, duration: 1 });
    } catch (err) {
      setError('Error fetching stock data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === '') return;
    await fetchStockData(searchQuery.toUpperCase());
  };

  const addToWatchlist = (stock) => {
    if (!stockData.find(s => s.symbol === stock.symbol)) {
      const updatedWatchlist = [...stockData, stock];
      setStockData(updatedWatchlist);

      // GSAP animation for adding to watchlist
      gsap.fromTo('.watchlist', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 });
    }
  };

  const removeFromWatchlist = (symbol) => {
    const updatedWatchlist = stockData.filter(stock => stock.symbol !== symbol);
    setStockData(updatedWatchlist);
  };

  const formatChartData = (dates, prices) => {
    return dates.map((date, index) => ({
      date,
      price: prices[index]
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6 bg-white">
      {/* Navigation Bar */}
      <Navbar className="fixed top-0 left-0 w-full bg-white shadow-lg p-4 rounded-b-2xl z-50" />

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-xl p-6 mt-30"> {/* Added mt-24 for margin-top to provide gap between navbar */}
        <h1 className="text-2xl font-bold text-black mb-4">Stock Watchlist</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by company ticker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}  // Added this to trigger the search when Enter is pressed
            className="w-full h-14 px-4 pr-12 text-lg border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 placeholder-gray-400 outline-none"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300"
            style={{ border: 'none' }} // Remove black border
          >
            <Search className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Search Results */}
      {stockPreview && (
        <div className="stock-preview bg-white rounded-lg shadow-xl p-6 mb-8 mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">{stockPreview.companyName}</h2>
            <button
              onClick={() => addToWatchlist(stockPreview)}
              className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 hover:-translate-y-1"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {loading ? (
            <div className="space-y-4">
              {/* Skeleton Loader */}
              <div className="h-6 bg-gray-200 animate-pulse rounded-md w-3/4"></div>
              <div className="h-6 bg-gray-200 animate-pulse rounded-md w-1/2"></div>
              <div className="h-48 bg-gray-200 animate-pulse rounded-md w-full"></div>
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <div className="text-lg font-semibold text-orange-500 mb-4">
                Current Price: {stockPreview.isHoliday ? 'Market Closed' : `$${stockPreview.currentPrice}`}
              </div>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formatChartData(stockPreview.dates, stockPreview.prices)}>
                    <XAxis dataKey="date" stroke="#fb923c" />
                    <YAxis stroke="#fb923c" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', borderColor: '#fed7aa' }}
                      labelStyle={{ color: '#ea580c' }}
                      formatter={(value) => `$${value}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#ea580c" 
                      strokeWidth={2} 
                      dot={{ fill: '#ea580c' }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      )}

      {/* Watchlist */}
      <div id="watchlist" className="watchlist bg-white rounded-lg shadow-xl p-8 mb-8">
        <h2 className="text-xl font-bold text-black mb-6">Your Watchlist</h2>
        {stockData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stockData.map((stock, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border-2 border-orange-200 relative">
                <button
                  onClick={() => removeFromWatchlist(stock.symbol)}
                  className="absolute top-2 right-2 p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all duration-300 hover:-translate-y-1"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold text-black mb-4">{stock.companyName}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-sm text-orange-500 mb-2">
                    <strong>Current Price:</strong> {stock.isHoliday ? 'Market Closed' : `$${stock.currentPrice}`}
                  </div>
                  <div className="text-sm text-orange-500 mb-2">
                    <strong>Last Price:</strong> {stock.prices[stock.prices.length - 1]} USD
                  </div>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formatChartData(stock.dates, stock.prices)}>
                      <XAxis dataKey="date" stroke="#fb923c" />
                      <YAxis stroke="#fb923c" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'white', borderColor: '#fed7aa' }}
                        labelStyle={{ color: '#ea580c' }}
                        formatter={(value) => `$${value}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#ea580c" 
                        strokeWidth={2} 
                        dot={{ fill: '#ea580c' }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Your watchlist is empty.</p>
        )}
      </div>
    </div>
  );
};

export default StockWatchlist;
