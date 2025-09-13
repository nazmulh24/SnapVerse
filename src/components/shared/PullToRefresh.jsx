import React, { useState, useEffect, useRef } from "react";
import { BiRefresh } from "react-icons/bi";

const PullToRefresh = ({ onRefresh, isRefreshing = false, children }) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isTriggered, setIsTriggered] = useState(false);
  const containerRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  const PULL_THRESHOLD = 80; // Distance needed to trigger refresh
  const MAX_PULL_DISTANCE = 120; // Maximum pull distance

  // Check if we're on mobile
  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle touch start
  const handleTouchStart = (e) => {
    // On mobile, be much more strict about when to activate
    if (isMobile && window.scrollY > 0) return;
    if (!isMobile && window.scrollY > 10) return;

    startY.current = e.touches[0].clientY;
    setIsPulling(false);
    setIsTriggered(false);
  };

  // Handle touch move
  const handleTouchMove = (e) => {
    // On mobile, only work if we're exactly at the top
    if (isMobile && window.scrollY > 0) return;
    if (!isMobile && window.scrollY > 10) return;

    if (startY.current === 0) return;
    if (isRefreshing) return;

    currentY.current = e.touches[0].clientY;
    const deltaY = currentY.current - startY.current;

    // Only handle significant downward pulls
    if (deltaY > (isMobile ? 60 : 30)) {
      // On mobile, only prevent default after very significant pull
      if (isMobile && deltaY > 80) {
        e.preventDefault();
      } else if (!isMobile && deltaY > 40) {
        e.preventDefault();
      }

      const distance = Math.min(deltaY * 0.3, MAX_PULL_DISTANCE);
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
