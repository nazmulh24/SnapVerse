import React from "react";

export default function UserList({
  users,
  following,
  requestSent,
  activeTab,
  handleAction,
  processingId,
  isPrivate,
}) {
  return (
    <ul className="divide-y divide-gray-100">
      {users.map((user) => {
        const isFollowing = following.some((f) => f.id === user.id);
        return (
          <li
            key={user.id}
            className="flex items-center gap-5 py-5 group rounded-xl transition-colors"
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
              (isPrivate && requestSent.includes(user.id) ? (
                <span className="px-5 py-2 rounded-full bg-yellow-100 text-yellow-800 font-semibold shadow-sm border border-yellow-200">
                  Request Sent
                </span>
              ) : (
                <button
                  className={`px-5 py-2 rounded-full font-semibold transition-colors shadow-sm ${
                    processingId === user.id
                      ? "bg-gray-200 text-gray-500"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  }`}
                  onClick={() => handleAction(user.id, "Follow Back")}
                  disabled={processingId === user.id}
                >
                  {processingId === user.id ? "Processing..." : "Follow Back"}
                </button>
              ))}
            {activeTab === "following" && (
              <button
                className={`px-5 py-2 rounded-full font-semibold transition-colors shadow-sm ${
                  processingId === user.id
                    ? "bg-gray-200 text-gray-500"
                    : "bg-red-100 text-red-600 hover:bg-red-200"
                }`}
                onClick={() => handleAction(user.id, "Unfollow")}
                disabled={processingId === user.id}
              >
                {processingId === user.id ? "Processing..." : "Unfollow"}
              </button>
            )}
            {activeTab === "pending" && isPrivate && (
              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 rounded-full font-semibold transition-colors shadow-sm ${
                    processingId === user.id
                      ? "bg-gray-200 text-gray-500"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                  onClick={() =>
                    handleAction(user.id, "Accept", user.requestId)
                  }
                  disabled={processingId === user.id}
                >
                  {processingId === user.id ? "Processing..." : "Accept"}
                </button>
                <button
                  className={`px-4 py-2 rounded-full font-semibold transition-colors shadow-sm ${
                    processingId === user.id
                      ? "bg-gray-200 text-gray-500"
                      : "bg-red-100 text-red-600 hover:bg-red-200"
                  }`}
                  onClick={() =>
                    handleAction(user.id, "Reject", user.requestId)
                  }
                  disabled={processingId === user.id}
                >
                  {processingId === user.id ? "Processing..." : "Reject"}
                </button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
