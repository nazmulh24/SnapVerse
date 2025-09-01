import React from "react";
import { MdVerified } from "react-icons/md";
import useSuggestedUsers from "../../hooks/useSuggestedUsers";

const SuggestedUsers = () => {
  const {
    suggestedUsers,
    allUsers,
    showingMore,
    loading,
    error,
    requestSent,
    processingId,
    refreshSuggestions,
    showMoreSuggestions,
    followUser,
  } = useSuggestedUsers();

  const handleFollow = async (user, event) => {
    event.stopPropagation();
    const result = await followUser(user.id);
    if (result) {
      console.log(`User ${user.username} follow status:`, result);
    }
  };

  const handleSeeAll = () => {
    if (showingMore) {
      // Show less - collapse back to 4 users
      showMoreSuggestions();
    } else if (allUsers.length > 4) {
      // Show more - expand to all users
      showMoreSuggestions();
    } else {
      // Navigate to explore page or connections page if no more users
      window.location.href = "/connections";
    }
  };
  if (loading) {
    return (
      <div className="mx-4 my-6">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl px-4 py-8 border border-gray-100">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="ml-2 text-sm text-gray-600">
              Loading suggestions...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-4 my-6">
        <div className="bg-red-50 rounded-xl px-4 py-4 border border-red-100">
          <p className="text-sm text-red-600">Failed to load suggestions</p>
          <button
            onClick={refreshSuggestions}
            className="mt-2 text-xs text-red-700 hover:text-red-800 font-semibold"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!suggestedUsers || suggestedUsers.length === 0) {
    return (
      <div className="mx-4 my-6">
        <div className="bg-gray-50 rounded-xl px-4 py-8 border border-gray-100">
          <div className="text-center">
            <p className="text-sm text-gray-600">No suggestions available</p>
            <button
              onClick={refreshSuggestions}
              className="mt-2 text-xs text-purple-600 hover:text-purple-700 font-semibold"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 my-6">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-xl px-4 py-3 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <h3 className="text-sm font-bold text-gray-800">
              {showingMore ? "More suggestions" : "Suggested for you"}
            </h3>
          </div>
          <button
            onClick={handleSeeAll}
            className="text-xs text-purple-600 hover:text-purple-700 font-semibold transition-colors hover:underline"
          >
            {showingMore
              ? "Show Less"
              : allUsers.length > 4
              ? "See All"
              : "Explore"}
          </button>
        </div>
      </div>{" "}
      {/* Users list with enhanced styling */}
      <div className="bg-white rounded-b-xl border-l border-r border-b border-gray-100 shadow-sm">
        {suggestedUsers.map((user, index) => {
          return (
            <div
              key={user.id}
              className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                index !== suggestedUsers.length - 1
                  ? "border-b border-gray-50"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                {/* Enhanced avatar with ring */}
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                  />
                  {user.isVerified && (
                    <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5">
                      <MdVerified className="text-white text-xs" />
                    </div>
                  )}
                  {user.followersCount >= 1000 && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
                      <MdVerified className="text-white text-xs" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="font-semibold text-gray-900 text-sm">
                      {user.fullName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 mt-0.5">
                    {user.mutualFriends > 15 && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        Top match
                      </span>
                    )}
                    {user.mutualFriends > 10 && user.mutualFriends <= 15 && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                    {user.mutualFriends > 5 && user.mutualFriends <= 10 && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        Good match
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <p className="text-xs text-gray-400">
                      {user.mutualFriends} mutual friend
                      {user.mutualFriends !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced follow button with status handling */}
              <button
                onClick={(event) => handleFollow(user, event)}
                disabled={
                  user.isFollowed ||
                  user.isRequestSent ||
                  requestSent.includes(user.id) ||
                  processingId === user.id
                }
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-200 hover:shadow-md ${
                  user.isFollowed
                    ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                    : user.isRequestSent || requestSent.includes(user.id)
                    ? "bg-yellow-200 text-yellow-700 cursor-not-allowed"
                    : processingId === user.id
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {processingId === user.id
                  ? "..."
                  : user.isFollowed
                  ? "Following"
                  : user.isRequestSent || requestSent.includes(user.id)
                  ? "Requested"
                  : "Follow"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedUsers;
