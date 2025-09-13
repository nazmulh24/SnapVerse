import React from "react";
import { Link } from "react-router";

const UserProfile = ({ user }) => {
  const getProfileImage = (profile_picture) => {
    if (!profile_picture || profile_picture.trim() === "") {
      return "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
    }
    if (profile_picture.startsWith("http") || profile_picture.startsWith("/")) {
      return profile_picture;
    }
    return `https://res.cloudinary.com/dlkq5sjum/${profile_picture}`;
  };

  if (!user) {
    return (
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3 animate-pulse">
          <div className="w-14 h-14 rounded-full bg-gray-200" />
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-24 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-16" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <Link to={`/profile/${user.username}`} className="flex-1 flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors">
          <img
            src={getProfileImage(user.profile_picture)}
            alt="Your Profile"
            className="w-14 h-14 rounded-full object-cover"
          />
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">{user.full_name}</h2>
            <p className="text-sm text-gray-500">{user.username}</p>
          </div>
        </Link>
        <div className="flex flex-col gap-1">
          <Link
            to="/account"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium px-2 py-1 hover:bg-blue-50 rounded transition-colors"
          >
            Account
          </Link>
          <button className="text-sm text-gray-600 hover:text-gray-800 font-medium px-2 py-1 hover:bg-gray-50 rounded transition-colors">
            Switch
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
