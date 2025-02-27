import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TrendingUp, ChevronRight, LineChart, BarChart4, PieChart } from 'lucide-react';

const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/login", { email, password });
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        navigate("/home");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/signup", { username, email, password });
      if (response.status === 201) {
        alert("Signup successful! Redirecting to the home page...");
        navigate("/home");
      } else {
        setError("Signup failed!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-orange-50 via-white to-orange-50 overflow-hidden">
      {/* Background Patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, orange 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <LineChart className="text-orange-300 h-12 w-12" />
      </div>
      <div className="absolute bottom-20 right-10 animate-float-delayed">
        <BarChart4 className="text-orange-300 h-12 w-12" />
      </div>
      <div className="absolute top-1/2 right-20 animate-float">
        <PieChart className="text-orange-200 h-8 w-8" />
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-8 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left content */}
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center space-x-2 bg-orange-100 rounded-full px-4 py-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-semibold text-orange-500">AI-Powered Platform</span>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Stock Prediction
              <br />
              Made Simple
            </h1>
            
            <p className="text-gray-600 text-lg max-w-xl">
            StockWisely uses the power of Artificial Neural Networks (ANN) bulid with the MERN stack to predict stock prices accurately. Stay ahead in the market with data-driven insights and real-time stock tracking
            </p>

            <div className="flex space-x-4 pt-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <ChevronRight className="h-5 w-5 text-orange-500" />
                <span>Watchlist</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <ChevronRight className="h-5 w-5 text-orange-500" />
                <span>Smart Predictions</span>
              </div>
            </div>
          </div>

          {/* Right side: Login/Signup */}
          <div className="flex-1 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-orange-100">
            {isLogin ? (
              <form onSubmit={handleLogin}>
                <h2 className="text-2xl font-bold text-center mb-4">Welcome Back</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-orange-500 text-white py-3 px-6 rounded-lg transition-colors duration-200 ${
                    loading ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-600"
                  }`}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-700">Don't have an account?</p>
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className="text-sm text-orange-500 hover:underline"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignup}>
                <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-orange-500 text-white py-3 px-6 rounded-lg transition-colors duration-200 ${
                    loading ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-600"
                  }`}
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </button>
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-700">Already have an account?</p>
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className="text-sm text-orange-500 hover:underline"
                  >
                    Login
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Add the floating animation styles */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 6s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;