import React from "react";

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="overflow-x-scroll overflow-y-hidden tab-scroll">
        <div
          className="flex"
          style={{
            width: `${tabs.length * 140}px`,
            minWidth: "100%",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
              style={{
                padding: "1rem 1rem",
                minWidth: "140px",
                flexShrink: 0,
              }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
