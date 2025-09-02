import React, { useState, useEffect, useCallback } from "react";
import usePosts from "../hooks/usePosts";
import SimpleFeedLayout from "../components/HomeComponent/SimpleFeedLayout";
import PullToRefresh from "../components/shared/PullToRefresh";

/**
 * Home Component - Main home page with feed and sponsors
 * Manages post data, sponsor visibility, and user interactions
 */
const Home = () => {
  const {
    posts,
    refreshPosts,
    loadMorePosts,
    handleLike,
    handleComment,
    handleShare,
    handleMenuClick,
    handleViewComments,
    loading,
    error,
    isRefreshing,
    hasNextPage,
    isLoadingMore,
  } = usePosts();

  const [hiddenSponsors, setHiddenSponsors] = useState([]);

  // Initialize data on component mount
  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  // Handle hiding sponsors with useCallback for performance
  const handleHideSponsor = useCallback((sponsorId) => {
    setHiddenSponsors((prev) => [...prev, sponsorId]);
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <PullToRefresh onRefresh={refreshPosts} isRefreshing={isRefreshing}>
        {/* Error State */}
        {error && (
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 text-sm font-medium">!</span>
              </div>
              <div className="flex-1">
                <p className="text-red-800 font-medium">Failed to load posts</p>
                <p className="text-red-600 text-sm mt-1">
                  {typeof error === "string"
                    ? error
                    : error?.message || "An unexpected error occurred"}
                </p>
              </div>
              <button
                onClick={refreshPosts}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0"
                aria-label="Retry loading posts"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Main Feed Layout */}
        <SimpleFeedLayout
          posts={posts}
          hiddenSponsors={hiddenSponsors}
          onHideSponsor={handleHideSponsor}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onMenuClick={handleMenuClick}
          onViewComments={handleViewComments}
          loading={loading}
          isRefreshing={isRefreshing}
          onRefresh={refreshPosts}
          onLoadMore={loadMorePosts}
          hasNextPage={hasNextPage}
          isLoadingMore={isLoadingMore}
        />
      </PullToRefresh>
    </div>
  );
};

export default Home;
