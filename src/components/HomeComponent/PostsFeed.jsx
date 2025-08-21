import React from "react";
import Post from "./Post";

const PostsFeed = ({
  posts = [],
  onLike,
  onComment,
  onShare,
  onMenuClick,
  onViewComments,
}) => {
  const defaultPosts = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    user: {
      username: `User ${index + 1}`,
      avatar: "/user-profile-illustration.png",
    },
    timeAgo: "2 hours ago",
    image: null, // Will show placeholder
    caption: "This is a sample post caption...",
    likesCount: Math.floor(Math.random() * 500) + 10,
    commentsCount: Math.floor(Math.random() * 20) + 1,
    isLiked: Math.random() > 0.7,
  }));

  const displayPosts = posts.length > 0 ? posts : defaultPosts;

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
    </div>
  );
};

export default PostsFeed;
