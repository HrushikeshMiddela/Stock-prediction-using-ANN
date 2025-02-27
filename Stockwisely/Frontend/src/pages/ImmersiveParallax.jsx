import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp } from "lucide-react";

const ImmersiveParallax = () => {
  const [scroll, setScroll] = useState(0);
  const [activeBarIndex, setActiveBarIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Reset scroll to top on page load

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScroll(scrollY);

      // Navigate to the landing page when final bar reaches its height
      const finalBarThreshold = 200; // You can adjust this threshold based on your preference
      if (scrollY > finalBarThreshold && !completed) {
        setCompleted(true);
        navigate("/landing", {
          state: { fromParallax: true },
          replace: false,
        });
      }

      // Faster activation of bars (reduced divisor from 40 to 20)
      const newIndex = Math.min(Math.floor(scrollY / 20), 4);
      setActiveBarIndex(newIndex);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navigate, completed]);

  // Generate bars data with initial value of 0
  const bars = Array.from({ length: 5 }, (_, index) => ({
    height: 200 + index * 50,
    value: 0, // Start at 0
    targetValue: Math.floor(Math.random() * 100) + 50, // Target value to animate to
  }));

  return (
    <div className="min-h-[200vh] bg-white">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative h-full w-full flex flex-col items-center justify-center">
          {/* Scroll Down Text */}
          <div
            className="absolute top-8 text-center text-2xl font-semibold text-gray-700 bg-white/80 px-4 py-2 rounded-lg shadow-md"
            style={{
              opacity: Math.max(1 - scroll / 50, 0), // Faster fade (reduced from 100)
              transform: `translateY(${scroll * 0.4}px)`, // Faster movement (increased from 0.2)
            }}
          >
            Scroll down to start <span className="text-orange-500">PREDICTION</span>
          </div>

          {/* Central title */}
          <div
            className="text-center mb-8"
            style={{
              transform: `translateY(${scroll * 0.6}px)`, // Faster movement (increased from 0.3)
              opacity: Math.max(1 - scroll / 300, 0), // Faster fade (reduced from 500)
            }}
          >
            <h1 className="text-8xl font-bold text-orange-500 whitespace-nowrap">
              StockWisely
            </h1>
          </div>

          {/* Trending Arrow */}
          <div
            className="mb-16"
            style={{
              transform: `translateY(${scroll * 0.8}px)`, // Faster movement (increased from 0.4)
              opacity: Math.max(1 - scroll / 300, 0), // Faster fade (reduced from 500)
            }}
          >
            <TrendingUp
              className="text-orange-500 h-32 w-32"
              style={{
                filter: "drop-shadow(0 0 10px rgba(249, 115, 22, 0.4))",
              }}
            />
          </div>

          {/* Bars container */}
          <div className="flex items-end justify-center gap-8">
            {bars.map((bar, index) => (
              <div key={index} className="relative group">
                <div
                  className="w-20 rounded-t-xl transition-all duration-150" // Faster transition (reduced from 300)
                  style={{
                    height: index <= activeBarIndex
                      ? `${Math.min(scroll * 3, bar.height)}px` // Faster scaling (increased from 2)
                      : "40px",
                    backgroundColor: index <= activeBarIndex ? "#f97316" : "#f4f4f5",
                    transform: `scaleY(${index <= activeBarIndex ? 1 : 0.3})`,
                    transformOrigin: "bottom",
                    opacity: index <= activeBarIndex ? 1 : 0.5,
                    boxShadow: index <= activeBarIndex
                      ? "0 0 20px rgba(249, 115, 22, 0.4)"
                      : "none",
                  }}
                />
                {/* No numbers below bars */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveParallax;
