import React, { useRef, useEffect, useState } from "react";

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Force scroll properties
    container.style.overflowX = "scroll";
    container.style.overflowY = "hidden";
    container.style.WebkitOverflowScrolling = "touch";

    // Touch event handlers for mobile
    const handleTouchStart = (e) => {
      setIsDragging(true);
      setStartX(e.touches[0].pageX - container.offsetLeft);
      setScrollLeft(container.scrollLeft);
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      container.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    // Add touch event listeners
    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, startX, scrollLeft]);

  return (
    <div className="bg-white border-b border-gray-200">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide select-none"
        style={{
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-x",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${
              activeTab === tab.id
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
            style={{ minWidth: "fit-content" }}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
