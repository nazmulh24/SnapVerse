import React from "react";
import { MdVerified } from "react-icons/md";

const SuggestedUsers = ({ suggestions = [] }) => {
  const defaultSuggestions = [
    {
      id: 1,
      username: "azunyan_s",
      fullName: "Azunyan Senpal",
      avatar: "/user-profile-illustration.png",
      mutualFriends: 12,
      isVerified: false,
    },
    {
      id: 2,
      username: "oarackbabama",
      fullName: "Oarack Babama",
      avatar: "/user-profile-illustration.png",
      mutualFriends: 8,
      isVerified: true,
    },
    {
      id: 3,
      username: "davidgilmore",
      fullName: "David Gilmore",
      avatar: "/user-profile-illustration.png",
      mutualFriends: 23,
      isVerified: false,
    },
    {
      id: 4,
      username: "gerardway",
      fullName: "Gerard Way",
      avatar: "/user-profile-illustration.png",
      mutualFriends: 5,
      isVerified: true,
    },
  ];

  const displaySuggestions =
    suggestions.length > 0 ? suggestions : defaultSuggestions;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">
          Suggested for you
        </h3>
        <button className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors">
          See All
        </button>
      </div>

      <div className="space-y-3">
        {displaySuggestions.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center space-x-1">
                  <p className="font-semibold text-gray-900 text-sm">
                    {user.username}
                  </p>
                  {user.isVerified && (
                    <MdVerified className="text-blue-500 text-xs" />
                  )}
                </div>
                <p className="text-xs text-gray-500">{user.fullName}</p>
                <p className="text-xs text-gray-400">
                  {user.mutualFriends} mutual friends
                </p>
              </div>
            </div>
            <button className="text-xs text-blue-600 hover:text-blue-800 font-semibold">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
