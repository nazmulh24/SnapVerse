import React from "react";
import { Link } from "react-router";
import { MdHome, MdFavorite } from "react-icons/md";
import RecentActivity from "../components/RightBarComponent/RecentActivity";
import SuggestedUsers from "../components/RightBarComponent/SuggestedUsers";

const ActivityPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Medium devices - Show full activity page */}
      <div className="hidden md:block lg:hidden">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <RecentActivity />
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <SuggestedUsers />
          </div>
        </div>
      </div>

      {/* Large devices - Show message that this is for medium screens */}
      <div className="hidden lg:flex items-center justify-center min-h-screen">
        <div className="text-center bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdFavorite className="text-purple-600 text-2xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Activity Center
          </h2>
          <p className="text-gray-600 mb-6">
            This feature is optimized for medium-sized screens. On larger
            displays, activity and suggestions are available in the right
            sidebar.
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            <MdHome className="text-lg" />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>

      {/* Small devices - Show message to use mobile navigation */}
      <div className="md:hidden flex items-center justify-center min-h-screen p-4">
        <div className="text-center bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-sm mx-auto">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdFavorite className="text-purple-600 text-xl" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Activity Center
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Use the heart icon in the top header to access your activity and
            notifications on mobile.
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm"
          >
            <MdHome className="text-base" />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
