import React from "react";
import Post from "./Post";

/**
 * FeedSection Component - Renders a group of posts
 * @param {Array} posts - Array of post objects to render
 * @param {Function} onLike - Handler for post like action
 * @param {Function} onComment - Handler for post comment action
 * @param {Function} onShare - Handler for post share action
 * @param {Function} onMenuClick - Handler for post menu action
 * @param {Function} onViewComments - Handler for viewing comments
 */
const FeedSection = ({
  posts = [],
  onLike,
  onComment,
  onShare,
  onMenuClick,
  onViewComments,
}) => {
  // Don't render anything if no posts
  if (!posts?.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <Post
          key={post?.id || `post-${index}`}
          post={post}
          onLike={onLike}
          onComment={onComment}
          onShare={onShare}
          onMenuClick={onMenuClick}
          onViewComments={onViewComments}
        />
      ))}
    </div>
  );
};

export default FeedSection;
