import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowLeft } from 'lucide-react';
import Navbar from "../components/Navbar";
import Lenis from '@studio-freight/lenis';

const Predicted = () => {
  const { state } = useLocation();
  const ticker = state?.ticker || 'Unknown';
  const futureDate = state?.futureDate || 'Unknown';

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.pow(t - 1, 3) + 1,
      smoothWheel: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticker, predictionDate: futureDate }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      })
      .then((response) => {
        setData(response);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [ticker, futureDate]);

  useEffect(() => {
    if (!isLoading) {
      gsap.fromTo(
        '.prediction-container',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
    }
  }, [isLoading]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar className="fixed top-0 left-0 w-full bg-white shadow-lg p-4 rounded-b-2xl z-50" />
      <div className="flex flex-col items-center justify-center prediction-container pt-24 pb-10 px-4 overflow-auto">
        <div className="max-w-4xl mx-auto w-full">
          <button
            onClick={() => window.history.back()}
            className="mb-6 flex items-center text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg shadow-md transition-all"
          >
            <ArrowLeft className="mr-2" size={20} />
            Go Back
          </button>

          {/* Prediction Box */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-10 bg-gray-300 rounded w-1/2 mb-6" />
                <div className="h-6 bg-gray-300 rounded w-2/3 mb-6" />
                <div className="h-16 bg-gray-300 rounded w-full mb-8" />
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Stock Prediction for {ticker}
                </h1>
                <p className="text-gray-600 mb-6">
                  Predicted value for {new Date(futureDate).toLocaleDateString()}
                </p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-8 mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Predicted Value
                  </h2>
                  <p className="text-4xl font-bold text-orange-500">
                    ₹{data?.predicted_price?.toFixed(2)}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Accuracy Block with Skeleton Loader */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-8 mb-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Prediction Accuracy</h2>
            {isLoading ? (
              <div className="animate-pulse h-10 bg-gray-300 rounded w-1/3 mb-4" />
            ) : (
              <p className="text-4xl font-bold text-orange-500">
                {data?.accuracy ? `${(100 - data.accuracy).toFixed(2)}%` : 'N/A'}
              </p>
            )}
          </div>

          {/* Graph Box with Loader */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-10 bg-gray-300 rounded w-1/2 mb-4" />
                <div className="h-64 bg-gray-300 rounded w-full mb-8" />
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Prediction Graph</h2>
                <div className="graph-container shadow-lg w-full max-w-5xl mx-auto mb-8">
                  <img
                    src={`http://localhost:5000/${data?.graph_path}`}
                    alt="Prediction Graph"
                    className="w-full rounded-lg"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predicted;