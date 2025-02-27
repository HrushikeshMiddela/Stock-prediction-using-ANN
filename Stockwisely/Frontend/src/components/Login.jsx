import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      });

      if (response.data.token) {
        // Store the token in localStorage
        localStorage.setItem('authToken', response.data.token);
        navigate('/Home'); // Redirect to Home after login
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred, please try again.');
    }
  };

  // Handle navigation to the sign-up page
  const handleSignupRedirect = () => {
    navigate('/signup'); // Navigate to the signup page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors duration-200"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">
            Forgot password?
          </a>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-700">Don't have an account?</p>
          <button
            onClick={handleSignupRedirect}
            className="text-sm text-blue-500 hover:underline"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
