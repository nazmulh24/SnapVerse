import React, { useMemo } from "react";
import StoriesSection from "./StoriesSection";
import FeedSection from "./FeedSection";
import SponsorCard from "./SponsorCard";
import InfiniteScrollTrigger from "../shared/InfiniteScrollTrigger";
import LoadingSpinner from "../shared/LoadingSpinner";

/**
 * SimpleFeedLayout Component - Main feed layout with posts and sponsors
 * Handles feed display, infinite scroll, and sponsor insertion every 10 posts
 */
const SimpleFeedLayout = ({
  posts = [],
  hiddenSponsors = [],
  onHideSponsor,
  onLike,
  onComment,
  onShare,
  onMenuClick,
  onViewComments,
  loading = false,
  isRefreshing = false,
  onRefresh,
  onLoadMore,
  hasNextPage = false,
  isLoadingMore = false,
}) => {
  // Memoize post groups to avoid recalculation on every render
  const postGroups = useMemo(() => {
    const groups = [];
    const groupSize = 10;

    for (let i = 0; i < posts.length; i += groupSize) {
      groups.push(posts.slice(i, i + groupSize));
    }
    return groups;
  }, [posts]);

  if (loading && posts.length === 0) {
    return (
      <div className="py-6 sm:py-8">
        <LoadingSpinner size="large" text="Loading your feed..." />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-safe">
      {/* Stories Section - Always at top */}
      <StoriesSection />

      {/* Refresh indicator */}
      {isRefreshing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-center">
          <LoadingSpinner
            size="small"
            color="blue"
            text="Refreshing your feed..."
          />
        </div>
      )}

      {/* Render post groups with sponsors and suggestions */}
      {postGroups.map((group, groupIndex) => (
        <div key={`group-${groupIndex}`} className="space-y-4 sm:space-y-6">
          {/* Posts Group */}
          <FeedSection
            posts={group}
            onLike={onLike}
            onComment={onComment}
            onShare={onShare}
            onMenuClick={onMenuClick}
            onViewComments={onViewComments}
          />

          {/* Insert sponsor after every group (every 10 posts) */}
          <SponsorCard
            position={groupIndex}
            hiddenSponsors={hiddenSponsors}
            onHide={onHideSponsor}
          />
        </div>
      ))}

      {/* Infinite Scroll Trigger */}
      {hasNextPage && !isLoadingMore && posts.length > 0 && (
        <InfiniteScrollTrigger
          onLoadMore={onLoadMore}
          hasNextPage={hasNextPage}
          isLoading={isLoadingMore}
          threshold={200}
        />
      )}

      {/* Loading More Indicator */}
      {isLoadingMore && (
        <div className="py-6 sm:py-8">
          <LoadingSpinner size="medium" text="Loading more posts..." />
        </div>
      )}

      {/* End of Feed */}
      {!hasNextPage && posts.length > 0 && (
        <div className="text-center py-6 sm:py-8">
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 text-gray-600">
            <div className="text-lg mb-2">🎉</div>
            <p className="font-medium text-sm sm:text-base">
              You've reached the end!
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              No more posts to load
            </p>
            <button
              onClick={onRefresh}
              className="mt-3 sm:mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm"
            >
              Refresh feed
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && posts.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-gray-200">
            <div className="text-gray-400 text-3xl sm:text-4xl mb-3 sm:mb-4">
              📱
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">
              Be the first to share something!
            </p>
            <button
              onClick={onRefresh}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg transition-colors text-sm sm:text-base"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleFeedLayout;
