import React, { useState, useEffect } from "react";
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
  const [postData, setPostData] = useState(post);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsError, setCommentsError] = useState(null);
  const { fetchComments, addComment, deleteComment, addReply, error } =
    useComments();

  // Update postData when post prop changes
  useEffect(() => {
    setPostData(post);
  }, [post]);
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
    if (onLike && !postData.is_liked) {
      onLike(postData.id, true);
    }
  };

  // Handle comment button click
  const handleCommentClick = async () => {
    if (!showComments) {
      // Load comments when opening comment section
      setLoadingComments(true);
      setCommentsError(null);
      try {
        console.log("🚀 Starting to fetch comments for post:", postData.id);
        const commentsData = await fetchComments(postData.id);
        console.log("📦 Received comments data:", commentsData);
        console.log("📊 Comments data type:", typeof commentsData);
        console.log(
          "🔍 Comments data structure:",
          Object.keys(commentsData || {})
        );

        const commentsArray = commentsData.results || commentsData || [];
        console.log("📝 Final comments array:", commentsArray);
        console.log("🔢 Comments array length:", commentsArray.length);

        setComments(commentsArray);
      } catch (err) {
        console.error("❌ Failed to load comments:", err);
        setCommentsError(err.message || "Failed to load comments");
        setComments([]);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  // Handle adding new comment
  const handleAddComment = async (postId, content) => {
    try {
      const newComment = await addComment(postId, content);
      setComments((prev) => [newComment, ...prev]);

      // Update post data to reflect new comment count
      setPostData((prev) => ({
        ...prev,
        comments_count: (parseInt(prev.comments_count) || 0) + 1,
      }));

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

      // Update post data to reflect new comment count
      setPostData((prev) => ({
        ...prev,
        comments_count: Math.max((parseInt(prev.comments_count) || 0) - 1, 0),
      }));
    } catch (error) {
      console.error("Failed to delete comment:", error);
      throw error;
    }
  };

  // Handle adding a reply to comment
  const handleAddReply = async (parentCommentId, content) => {
    try {
      const newReply = await addReply(postData.id, parentCommentId, content);

      // Update the parent comment with the new reply
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === parentCommentId
            ? {
                ...comment,
                replies: [...(comment.replies || []), newReply],
                replies_count: (comment.replies_count || 0) + 1,
              }
            : comment
        )
      );

      return newReply;
    } catch (error) {
      console.error("Failed to add reply:", error);
      throw error;
    }
  };

  // Handle reaction updates
  const handleReactionUpdate = (reactionData) => {
    setPostData((prev) => ({
      ...prev,
      reactions: reactionData.reactions || prev.reactions,
      user_reaction: reactionData.user_reaction,
    }));

    if (onLike) {
      onLike(postData.id, reactionData.userReaction === "like", reactionData);
    }
  };

  const formattedUser = formatUserData(postData);
  const timeAgo = postData.created_at
    ? formatTimeAgo(postData.created_at)
    : "Unknown time";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      {/* Post Header - Profile picture, full_name, time, location and edited status on right */}
      <PostHeader
        user={formattedUser}
        timeAgo={timeAgo}
        location={postData.location}
        isEdited={postData.is_edited}
      />

      {/* Post Caption/Content - Show before image */}
      {(postData.content || postData.caption) && (
        <div className="px-4 pb-3">
          <p className="text-gray-800 text-sm">
            {postData.content || postData.caption}
          </p>
        </div>
      )}

      {/* Post Image - Only show if image exists */}
      {postData.image && (
        <PostImage
          src={`https://res.cloudinary.com/dlkq5sjum/${postData.image}`}
          alt={`Post by ${formattedUser.full_name}`}
          onDoubleClick={handleDoubleClickLike}
        />
      )}

      {/* Like and Comment Counts */}
      {((postData.reactions &&
        Object.values(postData.reactions).some((count) => count > 0)) ||
        postData.comments_count > 0) && (
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {/* Reaction count on the left */}
            {postData.reactions &&
              Object.values(postData.reactions).some((count) => count > 0) && (
                <button className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg px-2 py-1 -mx-2 transition-colors group">
                  <div className="flex items-center -space-x-1">
                    {postData.reactions.like > 0 && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs border-2 border-white z-30">
                        👍
                      </div>
                    )}
                    {postData.reactions.love > 0 && (
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs border-2 border-white z-20">
                        ❤️
                      </div>
                    )}
                    {postData.reactions.haha > 0 && (
                      <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs border-2 border-white z-10">
                        😂
                      </div>
                    )}
                    {postData.reactions.wow > 0 && (
                      <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-xs border-2 border-white">
                        😮
                      </div>
                    )}
                    {postData.reactions.sad > 0 && (
                      <div className="w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center text-xs border-2 border-white">
                        😢
                      </div>
                    )}
                    {postData.reactions.angry > 0 && (
                      <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-xs border-2 border-white">
                        😠
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-600 group-hover:underline font-medium">
                    {Object.values(postData.reactions).reduce(
                      (sum, count) => sum + count,
                      0
                    )}
                  </span>
                </button>
              )}

            {/* Comment count on the right */}
            {postData.comments_count > 0 && (
              <button
                onClick={handleCommentClick}
                className="text-sm text-gray-600 hover:underline transition-colors font-medium"
              >
                {postData.comments_count}{" "}
                {postData.comments_count === 1 ? "comment" : "comments"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Post Actions - Like, Comment, Share buttons with reactions */}
      <PostActions
        postId={postData.id}
        initialReactions={postData.reactions || {}}
        currentUserReaction={postData.user_reaction || null}
        onComment={handleCommentClick}
        onShare={() => onShare && onShare(postData.id)}
        onReactionUpdate={handleReactionUpdate}
      />

      {/* Comment Section */}
      <ErrorBoundary>
        <CommentSection
          postId={postData.id}
          isVisible={showComments}
          onClose={() => setShowComments(false)}
          initialComments={comments}
          commentsCount={parseInt(postData.comments_count) || 0}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          onAddReply={handleAddReply}
          loading={loadingComments}
          error={commentsError || error}
        />
      </ErrorBoundary>
    </div>
  );
};

export default Post;
