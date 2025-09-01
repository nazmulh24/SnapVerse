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

      let avatarUrl;
      if (profilePicture) {
        if (profilePicture.startsWith("http")) {
          // Already a full URL, use as-is
          avatarUrl = profilePicture;
        } else if (profilePicture.startsWith("image/upload/")) {
          // Partial Cloudinary path, add base URL
          avatarUrl = `https://res.cloudinary.com/dlkq5sjum/${profilePicture}`;
        } else {
          // Just filename, add full Cloudinary path
          avatarUrl = `https://res.cloudinary.com/dlkq5sjum/image/upload/${profilePicture}`;
        }
      } else {
        // Fallback to generated avatar
        avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          post.author.full_name || post.author.username || "User"
        )}&background=random&color=fff`;
      }

      return {
        username: post.author.username || "unknown",
        full_name:
          post.author.full_name || post.author.username || "Unknown User",
        avatar: avatarUrl,
      };
    }

    // Fallback to direct post properties
    const profilePicture =
      post.user_profile_picture ||
      post.profile_picture ||
      post.author_profile_picture ||
      post.user_avatar ||
      post.user_image;

    let avatarUrl;
    if (profilePicture) {
      if (profilePicture.startsWith("http")) {
        // Already a full URL, use as-is
        avatarUrl = profilePicture;
      } else if (profilePicture.startsWith("image/upload/")) {
        // Partial Cloudinary path, add base URL
        avatarUrl = `https://res.cloudinary.com/dlkq5sjum/${profilePicture}`;
      } else {
        // Just filename, add full Cloudinary path
        avatarUrl = `https://res.cloudinary.com/dlkq5sjum/image/upload/${profilePicture}`;
      }
    } else {
      // Fallback to generated avatar
      avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        post.user_full_name || post.user || "User"
      )}&background=random&color=fff`;
    }

    return {
      username: post.user || "unknown",
      full_name: post.user_full_name || post.user || "Unknown User",
      avatar: avatarUrl,
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
    console.log(`[Post ${post.id}] Profile picture debug:`, {
      post_structure: {
        has_author: !!post.author,
        author_fields: post.author ? Object.keys(post.author) : [],
        author_profile_picture: post.author?.profile_picture,
        author_avatar: post.author?.avatar,
        user_profile_picture: post.user_profile_picture,
        profile_picture: post.profile_picture,
      },
      formatted_user: formattedUser,
      final_avatar_url: formattedUser.avatar,
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
