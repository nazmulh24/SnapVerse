import React from "react";

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="overflow-x-auto overflow-y-hidden scrollbar-hide">
        <nav
          className="flex min-w-max"
          style={{
            WebkitOverflowScrolling: "touch",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3 sm:px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 flex-shrink-0 ${
                activeTab === tab.id
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;
