import React from "react";
import Post from "./Post";
import { BiImageAdd } from "react-icons/bi";

const PostsFeed = ({
  posts = [],
  onLike,
  onComment,
  onShare,
  onMenuClick,
  onViewComments,
}) => {
  // Show default posts only if no real posts are provided
  const defaultPosts = Array.from({ length: 3 }, (_, index) => ({
    id: `default-${index + 1}`,
    user: `Demo User ${index + 1}`,
    user_profile_picture: null,
    caption: `This is a sample post ${
      index + 1
    }. When you connect to your API, real posts will appear here with your priority logic (your posts → following → public).`,
    image: index === 1 ? "sample-image.jpg" : null,
    location: null,
    privacy: "public",
    is_edited: false,
    created_at: new Date(
      Date.now() - Math.random() * 86400000 * 3
    ).toISOString(),
    updated_at: new Date().toISOString(),
    reactions_count: (Math.floor(Math.random() * 500) + 10).toString(),
    comments_count: (Math.floor(Math.random() * 20) + 1).toString(),
    is_liked: Math.random() > 0.7,
  }));

  const displayPosts = posts.length > 0 ? posts : defaultPosts;

  // Empty state for when no posts are available
  if (displayPosts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BiImageAdd className="text-gray-400 text-2xl" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No posts yet
        </h3>
        <p className="text-gray-500 mb-4">
          Be the first to share something with your followers!
        </p>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
          Create Your First Post
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {displayPosts.map((post) => (
        <Post
          key={post.id}
          post={post}
          onLike={onLike}
          onComment={onComment}
          onShare={onShare}
          onMenuClick={onMenuClick}
          onViewComments={onViewComments}
        />
      ))}

      {/* Posts count indicator */}
      {posts.length > 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          Showing {posts.length} post{posts.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

export default PostsFeed;
