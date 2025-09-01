import React from "react";
import PostHeader from "./PostHeader";
import PostImage from "./PostImage";
import PostActions from "./PostActions";
import PostContent from "./PostContent";

const Post = ({ post, onLike, onComment, onShare, onViewComments }) => {
  // Format time ago from created_at
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return `${Math.floor(diffInSeconds / 604800)}w`;
  };

  // Handle user data structure from API
  const formatUserData = (post) => {
    // Check if post has author data (from API response)
    if (post.author) {
      // Get profile picture from various possible fields
      const profilePicture =
        post.author.profile_picture ||
        post.author.avatar ||
        post.author.image ||
        post.author.photo;

      return {
        username: post.author.username || "unknown",
        full_name:
          post.author.full_name || post.author.username || "Unknown User",
        avatar: profilePicture
          ? `https://res.cloudinary.com/dlkq5sjum/${profilePicture}`
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
              post.author.full_name || post.author.username || "User"
            )}&background=random&color=fff`,
      };
    }

    // Fallback to direct post properties
    const profilePicture =
      post.user_profile_picture ||
      post.profile_picture ||
      post.author_profile_picture ||
      post.user_avatar ||
      post.user_image;

    return {
      username: post.user || "unknown",
      full_name: post.user_full_name || post.user || "Unknown User",
      avatar: profilePicture
        ? `https://res.cloudinary.com/dlkq5sjum/${profilePicture}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            post.user_full_name || post.user || "User"
          )}&background=random&color=fff`,
    };
  };

  const handleDoubleClickLike = () => {
    if (onLike && !post.is_liked) {
      onLike(post.id, true);
    }
  };

  const formattedUser = formatUserData(post);
  const timeAgo = post.created_at
    ? formatTimeAgo(post.created_at)
    : "Unknown time";

  // Debug: Log profile picture info in development
  if (import.meta.env.DEV) {
    console.log(`[Post ${post.id}] Profile picture info:`, {
      author: post.author,
      user_profile_picture: post.user_profile_picture,
      profile_picture: post.profile_picture,
      final_avatar: formattedUser.avatar,
      user_data: formattedUser,
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      {/* Post Header - Profile picture, full_name, time, location and edited status on right */}
      <PostHeader
        user={formattedUser}
        timeAgo={timeAgo}
        location={post.location}
        isEdited={post.is_edited}
      />

      {/* Post Caption/Content - Show before image */}
      {(post.content || post.caption) && (
        <div className="px-4 pb-3">
          <p className="text-gray-800 text-sm">
            {post.content || post.caption}
          </p>
        </div>
      )}

      {/* Post Image - Show after caption */}
      <PostImage
        src={
          post.image
            ? `https://res.cloudinary.com/dlkq5sjum/${post.image}`
            : null
        }
        alt={`Post by ${formattedUser.full_name}`}
        onDoubleClick={handleDoubleClickLike}
      />

      {/* Post Actions - Like, Comment, Share buttons */}
      <PostActions
        initialLikes={parseInt(post.reactions_count) || 0}
        isLiked={post.is_liked || false}
        onLike={(liked) => onLike && onLike(post.id, liked)}
        onComment={() => onComment && onComment(post.id)}
        onShare={() => onShare && onShare(post.id)}
      />

      {/* Comments Section - Show 2 comments */}
      <PostContent
        caption="" // Don't show caption again here
        username={formattedUser.username}
        full_name={formattedUser.full_name}
        commentsCount={parseInt(post.comments_count) || 0}
        onViewComments={() => onViewComments && onViewComments(post.id)}
        showComments={true}
      />
    </div>
  );
};

export default Post;
