// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage'; // New Landing Page component
import Home from './pages/Home';
import Prediction from './pages/prediction';
import Login from './components/Login';
import Signup from './components/Signup';
import Lenis from '@studio-freight/lenis';
import ImmersiveParallax from "./pages/ImmersiveParallax";
import Navbar  from './components/Navbar';
import Watchlist from './components/Watchlist';
import Profile from './components/Profile';

const App = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ImmersiveParallax />} />
        <Route path="/landing" element={<LandingPage />}  />
        <Route path="/home" element={<Home />} /> {/* Home Page */}
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Watchlist" element={<Watchlist />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
