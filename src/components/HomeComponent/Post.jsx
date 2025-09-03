import React, { useState } from "react";
import PostHeader from "./PostHeader";
import PostImage from "./PostImage";
import PostActions from "./PostActions";
import PostContent from "./PostContent";
import CommentSection from "./CommentSection";
import ErrorBoundary from "../shared/ErrorBoundary";
import useComments from "../../hooks/useComments";

const Post = ({ post, onLike, onShare }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const { addComment, deleteComment, fetchComments, addReply } = useComments();
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

  // Handle comment button click
  const handleCommentClick = async () => {
    if (!showComments) {
      // Load comments when opening comment section
      try {
        const commentsData = await fetchComments(post.id);
        console.log("Fetched comments data:", commentsData);
        setComments(commentsData.results || commentsData || []);
      } catch (error) {
        console.error("Failed to load comments:", error);
        setComments([]);
      }
    }
    setShowComments(!showComments);
  };

  // Handle adding new comment
  const handleAddComment = async (postId, content) => {
    try {
      const newComment = await addComment(postId, content);
      setComments((prev) => [...prev, newComment]);
      return newComment;
    } catch (error) {
      console.error("Failed to add comment:", error);
      throw error;
    }
  };

  // Handle deleting comment
  const handleDeleteComment = async (postId, commentId) => {
    try {
      await deleteComment(postId, commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
      throw error;
    }
  };

  // Handle adding a reply to comment
  const handleAddReply = async (parentCommentId, content) => {
    try {
      const newReply = await addReply(post.id, parentCommentId, content);
      setComments((prev) => [...prev, newReply]);
      return newReply;
    } catch (error) {
      console.error("Failed to add reply:", error);
      throw error;
    }
  };

  const formattedUser = formatUserData(post);
  const timeAgo = post.created_at
    ? formatTimeAgo(post.created_at)
    : "Unknown time";

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

      {/* Post Image - Only show if image exists */}
      {post.image && (
        <PostImage
          src={`https://res.cloudinary.com/dlkq5sjum/${post.image}`}
          alt={`Post by ${formattedUser.full_name}`}
          onDoubleClick={handleDoubleClickLike}
        />
      )}

      {/* Post Actions - Like, Comment, Share buttons with reactions */}
      <PostActions
        postId={post.id}
        initialReactions={post.reactions || {}}
        currentUserReaction={post.user_reaction || null}
        onComment={handleCommentClick}
        onShare={() => onShare && onShare(post.id)}
        onReactionUpdate={(reactionData) => {
          // Update post data with new reaction information
          if (onLike) {
            onLike(post.id, reactionData.userReaction === "like", reactionData);
          }
        }}
      />

      {/* Comments Section - Show 2 comments */}
      <PostContent
        caption="" // Don't show caption again here
        username={formattedUser.username}
        full_name={formattedUser.full_name}
        commentsCount={parseInt(post.comments_count) || 0}
        onViewComments={handleCommentClick}
        showComments={true}
      />

      {/* Comment Section */}
      <ErrorBoundary>
        <CommentSection
          postId={post.id}
          isVisible={showComments}
          onClose={() => setShowComments(false)}
          initialComments={comments}
          commentsCount={parseInt(post.comments_count) || 0}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          onAddReply={handleAddReply}
        />
      </ErrorBoundary>
    </div>
  );
};

export default Post;
