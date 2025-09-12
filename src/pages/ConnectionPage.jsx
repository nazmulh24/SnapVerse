import React from "react";
import useAuthContext from "../hooks/useAuthContext";
import useConnectionsApi from "../hooks/useConnectionsApi";
import UserList from "../components/Connection/UserList";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import ErrorAlert from "../components/Alert/ErrorAlert";

const ConnectionsPage = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = React.useState("followers");
  const {
    counts,
    followers,
    following,
    pending,
    requestSent,
    handleAction,
    processingId,
    loading,
    error,
  } = useConnectionsApi(user);

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="max-w-2xl mx-3 sm:mx-auto mt-4 sm:mt-10 bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8">
        <h2 className="text-xl sm:text-3xl font-extrabold mb-3 sm:mb-4 text-purple-800 tracking-tight">
          Connections
        </h2>
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Please log in to view your connections.
          </p>
          <a href="/login" className="btn btn-primary">
            Log In
          </a>
        </div>
      </div>
    );
  }

  // Only show Pending Requests tab if user is private
  const tabList = [
    { key: "followers", label: "Followers" },
    { key: "following", label: "Following" },
    ...(user?.is_private
      ? [{ key: "pending", label: "Pending Requests" }]
      : []),
  ];
  const tabCounts = {
    followers: counts.followers_count,
    following: counts.following_count,
    ...(user?.is_private ? { pending: counts.pending_requests_count } : {}),
  };
  // If the logged-in user is not private, never show pending — map to followers instead
  const displayedTab =
    !user?.is_private && activeTab === "pending" ? "followers" : activeTab;

  const handleRetry = () => {
    window.location.reload();
  };

  const getList = () => {
    switch (displayedTab) {
      case "followers":
        return followers;
      case "following":
        return following;
      case "pending":
        return pending;
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-3 sm:mx-auto mt-4 sm:mt-10 bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8">
        <h2 className="text-xl sm:text-3xl font-extrabold mb-3 sm:mb-4 text-purple-800 tracking-tight">
          Connections
        </h2>
        <LoadingSpinner size="lg" text="Loading connections..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-3 sm:mx-auto mt-4 sm:mt-10 bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8">
        <h2 className="text-xl sm:text-3xl font-extrabold mb-3 sm:mb-4 text-purple-800 tracking-tight">
          Connections
        </h2>
        <ErrorAlert error={error} showRetry={true} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-3 sm:mx-auto mt-4 sm:mt-10 bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8">
      <h2 className="text-xl sm:text-3xl font-extrabold mb-3 sm:mb-4 text-purple-800 tracking-tight">
        Connections
      </h2>
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 justify-center">
        {tabList.map((tab) => (
          <button
            key={tab.key}
            className={`px-3 sm:px-5 py-2 rounded-full font-semibold shadow-sm transition-colors duration-150 border text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 ${
              activeTab === tab.key
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-purple-700 border-gray-200 hover:bg-purple-50"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="truncate">{tab.label}</span>
            <span
              className={`inline-block min-w-[1.2em] sm:min-w-[1.5em] px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === tab.key
                  ? "bg-white text-purple-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {tabCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>
      <div>
        {getList().length === 0 ? (
          <div className="text-gray-400 text-center py-8 sm:py-12 text-base sm:text-lg font-medium">
            No users found.
          </div>
        ) : (
          <UserList
            users={getList()}
            following={following}
            requestSent={requestSent}
            activeTab={displayedTab}
            handleAction={handleAction}
            processingId={processingId}
            isPrivate={!!user?.is_private}
          />
        )}
      </div>
    </div>
  );
};

export default ConnectionsPage;
