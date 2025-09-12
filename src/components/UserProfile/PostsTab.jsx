import React from "react";
import Post from "../HomeComponent/Post";
import InfiniteScrollTrigger from "../shared/InfiniteScrollTrigger";
import LoadingSpinner from "../shared/LoadingSpinner";

/**
 * PostsTab Component - Displays ONLY the profile user's posts
 * Filters out any posts that don't belong to the current profile user
 */
const PostsTab = ({
  userPosts,
  loading,
  loadingUserPosts,
  hasNextPage,
  isOwnProfile,
  profileUser,
  onLike,
  onComment,
  onShare,
  onLoadMore,
}) => {
  // Get the user's display name
  const getDisplayName = () => {
    if (!profileUser) return "User";
    const fullName = `${profileUser.first_name || ""} ${
      profileUser.last_name || ""
    }`.trim();
    return fullName || profileUser.username || "User";
  };

  const displayName = getDisplayName();

  // Use userPosts directly since useUserProfile should already provide filtered posts
  const postsToShow = userPosts || [];

  return (
    <div className="px-4 sm:px-6 md:px-4 lg:px-8 py-4 sm:py-6">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">
        {isOwnProfile ? "My Posts" : `${displayName}'s Posts`}
      </h3>

      {/* Loading state */}
      {(loading || loadingUserPosts) &&
      (!postsToShow || postsToShow.length === 0) ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : postsToShow && postsToShow.length > 0 ? (
        /* Show user posts */
        <div className="space-y-4 sm:space-y-6">
          {postsToShow.map((post) => (
            <Post
              key={post.id}
              post={post}
              onLike={onLike}
              onComment={onComment}
              onShare={onShare}
            />
          ))}
          {hasNextPage && (
            <InfiniteScrollTrigger loading={loading} onLoadMore={onLoadMore} />
          )}
        </div>
      ) : (
        /* Empty state */
        <div className="text-center py-8 sm:py-12">
          <div className="text-gray-400 text-base sm:text-lg mb-2">No posts yet</div>
          <p className="text-gray-500 text-sm sm:text-base px-4">
            {isOwnProfile
              ? "Share your first post to get started!"
              : `${displayName} hasn't shared any posts yet.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default PostsTab;
