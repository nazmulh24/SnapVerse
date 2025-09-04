import React from "react";
import { MdPerson, MdInfo } from "react-icons/md";

const ProfileTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "posts", label: "Posts", icon: MdPerson },
    { id: "about", label: "About", icon: MdInfo },
    { id: "photos", label: "Photos", icon: MdPerson },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors flex items-center justify-center space-x-2 ${
              activeTab === tab.id
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs;
