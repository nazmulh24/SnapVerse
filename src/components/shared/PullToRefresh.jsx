import React, { useState, useEffect, useRef } from "react";
import { BiRefresh } from "react-icons/bi";

const PullToRefresh = ({ onRefresh, isRefreshing = false, children }) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isTriggered, setIsTriggered] = useState(false);
  const containerRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const PULL_THRESHOLD = 80; // Distance needed to trigger refresh
  const MAX_PULL_DISTANCE = 120; // Maximum pull distance

  // Handle touch start
  const handleTouchStart = (e) => {
    // Only allow pull-to-refresh if we're at the top of the page
    if (window.scrollY > 5) return; // Small tolerance for scroll position

    startY.current = e.touches[0].clientY;
    setIsPulling(false);
    setIsTriggered(false);
  };

  // Handle touch move
  const handleTouchMove = (e) => {
    if (window.scrollY > 5) return; // Small tolerance for scroll position
    if (startY.current === 0) return;
    if (isRefreshing) return; // Prevent pulling while already refreshing

    currentY.current = e.touches[0].clientY;
    const deltaY = currentY.current - startY.current;

    // Only track downward movement
    if (deltaY > 10) {
      // Small threshold to prevent accidental triggers
      e.preventDefault(); // Prevent default scroll behavior

      const distance = Math.min(deltaY * 0.4, MAX_PULL_DISTANCE); // Apply more resistance
      setPullDistance(distance);
      setIsPulling(true);

      // Check if we've reached the threshold
      if (distance >= PULL_THRESHOLD && !isTriggered) {
        setIsTriggered(true);
        // Add haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(30);
        }
      } else if (distance < PULL_THRESHOLD && isTriggered) {
        setIsTriggered(false);
      }
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    if (isPulling && pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      onRefresh();
    }

    // Reset states
    setIsPulling(false);
    setPullDistance(0);
    setIsTriggered(false);
    startY.current = 0;
    currentY.current = 0;
  };

  // Reset when refresh completes
  useEffect(() => {
    if (!isRefreshing) {
      setIsPulling(false);
      setPullDistance(0);
      setIsTriggered(false);
    }
  }, [isRefreshing]);

  return (
    <div
      ref={containerRef}
      className="relative pull-to-refresh-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform:
          isPulling || isRefreshing ? `translateY(${pullDistance}px)` : "none",
        transition: isPulling ? "none" : "transform 0.3s ease-out",
      }}
    >
      {/* Pull to refresh indicator */}
      <div
        className={`absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 z-10 ${
          isPulling || isRefreshing ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: `translateY(${-80 + pullDistance * 0.8}px)`,
          height: "80px",
        }}
      >
        <div
          className={`flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border transition-all duration-200 ${
            isTriggered
              ? "border-purple-300 bg-purple-50/95"
              : "border-gray-200"
          }`}
        >
          <div
            className={`relative ${
              isTriggered ? "scale-110" : "scale-100"
            } transition-transform duration-200`}
          >
            <BiRefresh
              className={`text-xl transition-all duration-200 ${
                isRefreshing
                  ? "animate-spin text-purple-600"
                  : isTriggered
                  ? "text-purple-600 rotate-180"
                  : "text-gray-400"
              }`}
            />
            {isTriggered && !isRefreshing && (
              <div className="absolute inset-0 rounded-full bg-purple-600/20 animate-ping"></div>
            )}
          </div>
          <span
            className={`text-sm font-medium transition-colors duration-200 ${
              isRefreshing
                ? "text-purple-600"
                : isTriggered
                ? "text-purple-600"
                : "text-gray-500"
            }`}
          >
            {isRefreshing
              ? "Refreshing feed..."
              : isTriggered
              ? "Release to refresh"
              : "Pull down to refresh"}
          </span>
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  );
};

export default PullToRefresh;
