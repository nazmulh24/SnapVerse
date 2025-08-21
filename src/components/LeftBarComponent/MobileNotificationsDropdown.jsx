import React from "react";
import RecentActivity from "../RightBarComponent/RecentActivity";
import SuggestedUsers from "../RightBarComponent/SuggestedUsers";
import { MdClose, MdArrowBack } from "react-icons/md";

const MobileNotificationsDropdown = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-700 hover:text-purple-600 transition-colors duration-200"
        >
          <MdArrowBack className="text-xl" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        <div className="w-10 h-10"></div> {/* Spacer for center alignment */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {/* Recent Activity Section */}
        <div className="bg-white">
          <RecentActivity />
        </div>

        {/* Suggested Users Section */}
        <div className="bg-gray-50">
          <SuggestedUsers />
        </div>
      </div>
    </div>
  );
};

export default MobileNotificationsDropdown;
