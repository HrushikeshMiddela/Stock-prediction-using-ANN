import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import Navbar from "../components/Navbar";

const Home = () => {
  const navigate = useNavigate();
  const [ticker, setTicker] = useState('');
  const [futureDate, setFutureDate] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const stockList = [
    'AAPL', 'GOOG', 'AMZN', 'TSLA', 'MSFT', 'NFLX', 'META', 'BABA', 'NVDA', 'SPY',
    'T', 'TSM', 'TWTR', 'TXN', 'TCEHY', 'TLRY', 'V', 'UBER', 'WMT', 'BA', 'GE', 'INTC', 'IRCTC.NS',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    navigate('/prediction', { state: { ticker, futureDate } });
  };

  const handleSuggestionClick = (suggestion) => {
    setTicker(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' && showSuggestions) {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === 'ArrowUp' && showSuggestions) {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        const selectedSuggestion = suggestions[highlightedIndex];
        setTicker(selectedSuggestion);
      }
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  React.useEffect(() => {
    if (ticker.length > 0) {
      const filteredSuggestions = stockList.filter((stock) =>
        stock.toUpperCase().startsWith(ticker.toUpperCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
      setHighlightedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [ticker]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-5xl font-bold text-orange-500 mb-4">Stock Wisely</h1>
          <p className="text-xl text-gray-600 mb-8">
            AI-powered stock price predictions for Better investment decisions
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto"
          >
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Ticker
                </label>
                <input
                  type="text"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Enter stock ticker (e.g., AAPL)"
                  required
                />
                {showSuggestions && ticker && (
                  <div className="absolute top-full left-0 mt-2 w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
                    {suggestions.length > 0 ? (
                      suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${
                            highlightedIndex === index ? 'bg-gray-300' : ''
                          }`}
                        >
                          {suggestion}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">No suggestions</div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Future Date
                </label>
                <input
                  type="date"
                  value={futureDate}
                  onChange={(e) => setFutureDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <TrendingUp className="h-5 w-5" />
                <span>Predict Stock Price</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;