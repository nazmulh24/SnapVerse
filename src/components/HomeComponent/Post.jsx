import React, { useState, useEffect } from "react";
import PostHeader from "./PostHeader";
import PostImage from "./PostImage";
import PostActions from "./PostActions";
import PostContent from "./PostContent";
import CommentSection from "./CommentSection";
import ErrorBoundary from "../shared/ErrorBoundary";
import useComments from "../../hooks/useComments";
import useReactions from "../../hooks/useReactions";

const Post = ({ post, onLike, onShare }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [postData, setPostData] = useState(post);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsError, setCommentsError] = useState(null);
  const [loadingReactions, setLoadingReactions] = useState(false);
  const [reactionsError, setReactionsError] = useState(null);

  const { fetchComments, addComment, deleteComment, addReply, error } =
    useComments();
  const { addReaction, fetchReactions } = useReactions();

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
  const handleAddComment = async (content) => {
    try {
      console.log("💬 Attempting to add comment to post:", postData.id);
      console.log("💬 Comment content:", content);

      const newComment = await addComment(postData.id, content);
      console.log("💬 New comment created:", newComment);

      // Update the comments list with the new comment
      setComments((prev) => [newComment, ...prev]);

      // Update post data to reflect new comment count
      setPostData((prev) => ({
        ...prev,
        comments_count: (parseInt(prev.comments_count) || 0) + 1,
      }));

      return newComment;
    } catch (error) {
      console.error("❌ Failed to add comment:", error);
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

  // Handle reaction click (unified like comment pattern)
  const handleReactionClick = async (reactionType) => {
    try {
      console.log("😊 Attempting to handle reaction for post:", postData.id);
      console.log("😊 Reaction type:", reactionType);

      // Immediate optimistic update for better UX
      const oldUserReaction = postData.user_reaction;
      const isTogglingSame = oldUserReaction === reactionType;

      setPostData((prev) => {
        const newReactions = { ...prev.reactions };

        // Remove old reaction if exists
        if (prev.user_reaction) {
          newReactions[prev.user_reaction] = Math.max(
            0,
            (newReactions[prev.user_reaction] || 0) - 1
          );
        }

        // If toggling the same reaction, don't add it back
        if (!isTogglingSame) {
          newReactions[reactionType] = (newReactions[reactionType] || 0) + 1;
        }

        return {
          ...prev,
          reactions: newReactions,
          user_reaction: isTogglingSame ? null : reactionType,
        };
      });

      setLoadingReactions(true);
      setReactionsError(null);

      const result = await addReaction(postData.id, reactionType);

      if (result.success) {
        console.log("😊 Reaction handled successfully:", result.data);
        console.log("😊 Current postData.reactions:", postData.reactions);
        console.log("😊 Old user reaction:", oldUserReaction);

        // Handle API response based on action type
        if (result.data) {
          const { action, reaction_type } = result.data;
          console.log(
            "😊 API action:",
            action,
            "reaction_type:",
            reaction_type
          );

          setPostData((prev) => {
            // Reset to original state first
            const originalReactions = { ...postData.reactions };
            console.log(
              "😊 Original reactions before update:",
              originalReactions
            );

            // Remove old user reaction from original state
            if (oldUserReaction) {
              originalReactions[oldUserReaction] = Math.max(
                0,
                (originalReactions[oldUserReaction] || 0) - 1
              );
              console.log("😊 After removing old reaction:", originalReactions);
            }

            if (action === "added") {
              // Reaction was added
              originalReactions[reaction_type] =
                (originalReactions[reaction_type] || 0) + 1;
              console.log("😊 After adding new reaction:", originalReactions);
              return {
                ...prev,
                reactions: originalReactions,
                user_reaction: reaction_type,
              };
            } else if (action === "removed") {
              // Reaction was removed (toggle off)
              console.log(
                "😊 Reaction removed, final reactions:",
                originalReactions
              );
              return {
                ...prev,
                reactions: originalReactions,
                user_reaction: null,
              };
            }

            // If no action specified, keep current state
            return prev;
          });
        }

        // Call the callback if provided
        if (onLike && reactionType === "like") {
          onLike(postData.id, result.data.action === "added", result.data);
        }

        return result.data;
      } else {
        // Revert optimistic update on failure
        setPostData((prev) => {
          const newReactions = { ...prev.reactions };

          // Revert the reaction changes
          if (isTogglingSame) {
            // We were removing, so add it back
            newReactions[reactionType] = (newReactions[reactionType] || 0) + 1;
          } else {
            // We were adding, so remove it
            newReactions[reactionType] = Math.max(
              0,
              (newReactions[reactionType] || 0) - 1
            );

            // Restore old reaction if exists
            if (oldUserReaction) {
              newReactions[oldUserReaction] =
                (newReactions[oldUserReaction] || 0) + 1;
            }
          }

          return {
            ...prev,
            reactions: newReactions,
            user_reaction: oldUserReaction,
          };
        });

        throw new Error(result.error || "Failed to handle reaction");
      }
    } catch (error) {
      console.error("❌ Failed to handle reaction:", error);
      setReactionsError(error.message || "Failed to handle reaction");
      throw error;
    } finally {
      setLoadingReactions(false);
    }
  };

  // Handle fetching reactions (similar to comment pattern)
  const handleFetchReactions = async () => {
    try {
      console.log("🔄 Fetching reactions for post:", postData.id);

      setLoadingReactions(true);
      setReactionsError(null);

      const reactionsData = await fetchReactions(postData.id);
      console.log("📦 Received reactions data:", reactionsData);

      if (reactionsData) {
        setPostData((prev) => ({
          ...prev,
          reactions: reactionsData.reactions || prev.reactions,
          user_reaction: reactionsData.user_reaction || prev.user_reaction,
        }));
      }

      return reactionsData;
    } catch (error) {
      console.error("❌ Failed to fetch reactions:", error);
      setReactionsError(error.message || "Failed to fetch reactions");
      throw error;
    } finally {
      setLoadingReactions(false);
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

      {/* Like and Comment Counts - Always show */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {/* Total Reaction count on the left */}
          <div className="text-sm text-gray-600 hover:underline transition-colors font-medium">
            Total Reaction: {parseInt(postData.reactions_count) || 0}
          </div>

          {/* Total Comment count on the right */}
          <button
            onClick={handleCommentClick}
            className="text-sm text-gray-600 hover:underline transition-colors font-medium"
          >
            Total Comments: {parseInt(postData.comments_count) || 0}
          </button>
        </div>
      </div>

      {/* Post Actions - Like, Comment, Share buttons with reactions */}
      <PostActions
        postId={postData.id}
        initialReactions={postData.reactions || {}}
        currentUserReaction={postData.user_reaction || null}
        onComment={handleCommentClick}
        onShare={() => onShare && onShare(postData.id)}
        onReactionClick={handleReactionClick}
        onFetchReactions={handleFetchReactions}
        loadingReactions={loadingReactions}
        reactionsError={reactionsError}
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
