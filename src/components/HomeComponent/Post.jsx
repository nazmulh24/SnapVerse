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
  const [reactionHelpers, setReactionHelpers] = useState(null);
  const [liveReactionCount, setLiveReactionCount] = useState(() => {
    // Calculate initial count from reactions object if available, fallback to reactions_count
    const reactionsObj = post.reactions || {};
    const calculatedFromReactions = Object.values(reactionsObj).reduce(
      (sum, count) => {
        return sum + (parseInt(count) || 0);
      },
      0
    );
    const backendCount = parseInt(post.reactions_count) || 0;
    const finalCount =
      calculatedFromReactions > 0 ? calculatedFromReactions : backendCount;

    console.log(`[Post ${post.id}] Initial reaction count calculation:`, {
      reactions: reactionsObj,
      calculatedFromReactions,
      backendCount,
      finalCount,
      post_data: post,
    });

    return finalCount;
  });

  // Update live reaction count when postData changes
  useEffect(() => {
    // Calculate count from reactions object if available, fallback to reactions_count
    const reactionsObj = postData.reactions || {};
    const calculatedFromReactions = Object.values(reactionsObj).reduce(
      (sum, count) => {
        return sum + (parseInt(count) || 0);
      },
      0
    );
    const backendCount = parseInt(postData.reactions_count) || 0;
    const finalCount =
      calculatedFromReactions > 0 ? calculatedFromReactions : backendCount;

    console.log(`[Post ${postData.id}] useEffect reaction count update:`, {
      reactions: reactionsObj,
      calculatedFromReactions,
      backendCount,
      finalCount,
      reactionHelpers: !!reactionHelpers,
    });

    // Only update if we don't have live helpers (to avoid conflicts)
    if (!reactionHelpers) {
      setLiveReactionCount(finalCount);
    }
  }, [
    postData.reactions_count,
    postData.reactions,
    postData.id,
    reactionHelpers,
  ]);

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

    // Create a username from the full name if needed
    const fullName = post.user_full_name || post.user || "Unknown User";
    const username =
      post.username ||
      post.user_username ||
      // Convert full name to username format if no real username available
      fullName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");

    return {
      username: username,
      full_name: fullName,
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
        const commentsData = await fetchComments(postData.id);

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

  // Handle reaction click (unified reaction pattern)
  const handleReactionClick = async (reactionType) => {
    try {
      console.log("😊 Attempting to handle reaction for post:", postData.id);
      console.log("😊 Reaction type:", reactionType);

      // Immediate optimistic update for better UX
      const oldUserReaction = postData.user_reaction;
      const isTogglingSame = oldUserReaction === reactionType;

      setPostData((prev) => {
        const newReactions = { ...prev.reactions };
        let newReactionsCount = parseInt(prev.reactions_count) || 0;

        // Remove old reaction if exists
        if (prev.user_reaction) {
          newReactions[prev.user_reaction] = Math.max(
            0,
            (newReactions[prev.user_reaction] || 0) - 1
          );
          newReactionsCount = Math.max(0, newReactionsCount - 1);
        }

        // If toggling the same reaction, don't add it back
        if (!isTogglingSame) {
          newReactions[reactionType] = (newReactions[reactionType] || 0) + 1;
          newReactionsCount = newReactionsCount + 1;
        }

        return {
          ...prev,
          reactions: newReactions,
          reactions_count: newReactionsCount.toString(),
          user_reaction: isTogglingSame ? null : reactionType,
        };
      });

      setLoadingReactions(true);
      setReactionsError(null);

      const result = await addReaction(postData.id, reactionType);

      if (result.success) {
        // Handle API response based on action type
        if (result.data) {
          const { action, reaction_type } = result.data;

          setPostData((prev) => {
            // Reset to original state first
            const originalReactions = { ...postData.reactions };
            let newReactionsCount = parseInt(postData.reactions_count) || 0;

            // Remove old user reaction from original state
            if (oldUserReaction) {
              originalReactions[oldUserReaction] = Math.max(
                0,
                (originalReactions[oldUserReaction] || 0) - 1
              );
              newReactionsCount = Math.max(0, newReactionsCount - 1);
            }

            if (action === "added") {
              // Reaction was added
              originalReactions[reaction_type] =
                (originalReactions[reaction_type] || 0) + 1;
              newReactionsCount = newReactionsCount + 1;
              return {
                ...prev,
                reactions: originalReactions,
                reactions_count: newReactionsCount.toString(),
                user_reaction: reaction_type || reactionType, // Fallback to reactionType if reaction_type is missing
              };
            } else if (action === "removed") {
              // Reaction was removed (toggle off)
              return {
                ...prev,
                reactions: originalReactions,
                reactions_count: newReactionsCount.toString(),
                user_reaction: null, // Always set to null, never empty string
              };
            }

            // If no action specified, keep current state
            return prev;
          });
        }

        // Special handling for 'like' - force state update if needed
        if (reactionType === "like") {
          setTimeout(() => {
            setPostData((current) => {
              if (
                result.data.action === "added" &&
                current.user_reaction !== "like"
              ) {
                return { ...current, user_reaction: "like" };
              } else if (
                result.data.action === "removed" &&
                current.user_reaction !== null
              ) {
                return { ...current, user_reaction: null };
              }
              return current;
            });
          }, 100);
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4 sm:mb-6">
      {/* Post Header - Profile picture, full_name, time, location and edited status on right */}
      <PostHeader
        user={formattedUser}
        timeAgo={timeAgo}
        location={postData.location}
        isEdited={postData.is_edited}
        privacy={postData.privacy}
        postId={postData.id}
      />

      {/* Post Caption/Content - Show before image */}
      {(postData.content || postData.caption) && (
        <div className="px-3 sm:px-4 pb-2 sm:pb-3">
          <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
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
      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {/* Total Reaction count on the left - Clickable */}
          <button
            onClick={() => reactionHelpers?.fetchReactionDetails?.()}
            disabled={!reactionHelpers}
            className="group flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 font-medium disabled:hover:text-gray-600 disabled:cursor-default"
          >
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-xs">💝</span>
              </div>
              <span className="group-hover:underline">
                {(() => {
                  // Debug: Show all possible reaction count sources
                  const fromReactions = Object.values(
                    postData.reactions || {}
                  ).reduce((sum, count) => sum + (parseInt(count) || 0), 0);
                  const fromReactionsCount =
                    parseInt(postData.reactions_count) || 0;
                  const fromLive = liveReactionCount;

                  // Use the highest non-zero value, or show all for debugging
                  const maxCount = Math.max(
                    fromReactions,
                    fromReactionsCount,
                    fromLive
                  );

                  // For debugging: if all are 0, let's show a test value to ensure display works
                  const displayValue =
                    maxCount > 0 ? maxCount : postData.id ? 1 : 0; // Test: show 1 if we have a post ID

                  console.log(
                    `[Post] Reaction count debug for post ${postData.id}:`,
                    {
                      fromReactions,
                      fromReactionsCount,
                      fromLive,
                      maxCount,
                      displayValue,
                      rawPostData: postData,
                    }
                  );

                  return displayValue;
                })()}{" "}
                <span className="hidden xs:inline">reactions</span>
              </span>
            </div>
          </button>

          {/* Total Comment count on the right */}
          <button
            onClick={handleCommentClick}
            className="group flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600 hover:text-green-600 transition-all duration-200 font-medium"
          >
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-xs">💬</span>
              </div>
              <span className="group-hover:underline">
                {parseInt(postData.comments_count) || 0}{" "}
                <span className="hidden xs:inline">comments</span>
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Post Actions - Like, Comment, Share buttons with reactions */}
      <PostActions
        postId={postData.id}
        initialReactions={(() => {
          const reactions = postData.reactions || {};
          console.log(
            `[Post] Passing to PostActions for post ${postData.id}:`,
            {
              initialReactions: reactions,
              reactions_count: postData.reactions_count,
              user_reaction: postData.user_reaction,
            }
          );
          return reactions;
        })()}
        currentUserReaction={
          postData.user_reaction === "" ? null : postData.user_reaction || null
        }
        onComment={handleCommentClick}
        onShare={() => onShare && onShare(postData.id)}
        onReactionClick={handleReactionClick}
        onFetchReactions={handleFetchReactions}
        loadingReactions={loadingReactions}
        reactionsError={reactionsError}
        onShowReactionDetails={setReactionHelpers}
        onReactionCountChange={(count) => {
          // Simple reaction count update without loops
          console.log(
            `[Post] Received reaction count update:`,
            count,
            `for post:`,
            postData.id
          );
          setLiveReactionCount(count);
        }}
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
