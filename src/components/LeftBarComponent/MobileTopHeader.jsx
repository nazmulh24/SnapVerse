import React from "react";
import { Link } from "react-router";
import { MdAutoAwesome, MdAdd, MdFavoriteBorder } from "react-icons/md";

const MobileTopHeader = () => {
  const handleNewPostClick = () => {
    console.log("New post clicked");
    // Handle new post creation
  };

  return (
    <>
      <div className="sm:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between p-3">
          {/* Left - New Post Icon */}
          <button
            onClick={handleNewPostClick}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-700 hover:text-purple-600 transition-all duration-200 group"
          >
            <MdAdd className="text-2xl group-hover:scale-110 transition-transform duration-200" />
          </button>

          {/* Center - Logo Section */}
          <Link to="/" className="flex items-center space-x-2 group">
            {/* Logo Icon */}
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300">
                <MdAutoAwesome className="text-white text-sm group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>

            {/* Logo Text */}
            <span className="text-lg font-black bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 bg-clip-text text-transparent transition-all duration-300">
              SnapVerse
            </span>
          </Link>

          {/* Right - Activity Icon */}
          <Link
            to="/activity?modal=true"
            className="p-2 rounded-full hover:bg-gray-100 text-gray-700 hover:text-purple-600 transition-all duration-200 group relative"
          >
            <MdFavoriteBorder className="text-2xl group-hover:scale-110 transition-transform duration-200" />
            {/* Activity badge */}
            <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">15</span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileTopHeader;
