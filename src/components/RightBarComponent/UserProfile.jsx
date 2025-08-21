import React from "react";

const UserProfile = ({ user }) => {
  return (
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <img
          src={user.avatar}
          alt="Your Profile"
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900">{user.fullName}</h2>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Switch
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
