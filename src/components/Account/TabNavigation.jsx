import React, { useRef, useEffect } from "react";

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  const scrollRef = useRef(null);

  // Ensure scrolling works on mount
  useEffect(() => {
    if (scrollRef.current) {
      // Force the browser to recognize this as a scrollable area
      scrollRef.current.style.overflowX = "scroll";
    }
  }, []);

  return (
    <div className="bg-white border-b border-gray-200">
      <div
        ref={scrollRef}
        className="flex overflow-x-scroll scrollbar-hide"
        style={{
          WebkitOverflowScrolling: "touch",
          paddingBottom: "2px",
          marginBottom: "-2px",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 mr-2 ${
              activeTab === tab.id
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
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
