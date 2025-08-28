import React from "react";

export default function UserList({
  users,
  following,
  requestSent,
  activeTab,
  handleAction,
}) {
  return (
    <ul className="divide-y divide-gray-100">
      {users.map((user) => {
        const isFollowing = following.some((f) => f.id === user.id);
        return (
          <li
            key={user.id}
            className="flex items-center gap-5 py-5 group hover:bg-gray-50 rounded-xl transition-colors"
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-purple-100 shadow-sm group-hover:border-purple-400 transition-all"
              />
              <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 text-lg truncate">
                {user.name}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {user.username}
              </div>
            </div>
            {activeTab === "followers" &&
              !isFollowing &&
              (requestSent.includes(user.id) ? (
                <span className="px-5 py-2 rounded-full bg-gray-100 text-gray-500 font-semibold shadow-sm border border-gray-200">
                  Request Sent
                </span>
              ) : (
                <button
                  className="px-5 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition-colors shadow-sm"
                  onClick={() => handleAction(user.id, "Follow Back")}
                >
                  Follow Back
                </button>
              ))}
            {activeTab === "following" && (
              <button
                className="px-5 py-2 rounded-full bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition-colors shadow-sm"
                onClick={() => handleAction(user.id, "Unfollow")}
              >
                Unfollow
              </button>
            )}
            {activeTab === "pending" && (
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition-colors shadow-sm"
                  onClick={() => handleAction(user.id, "Accept")}
                >
                  Accept
                </button>
                <button
                  className="px-4 py-2 rounded-full bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition-colors shadow-sm"
                  onClick={() => handleAction(user.id, "Reject")}
                >
                  Reject
                </button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
