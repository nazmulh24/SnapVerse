import React, { useState, useEffect } from "react";
import { MdChatBubbleOutline, MdShare, MdThumbUp } from "react-icons/md";
import ReactionPicker from "./ReactionPicker";
import useReactions from "../../hooks/useReactions";

const PostActions = ({
  postId,
  initialReactions = {},
  currentUserReaction = null,
  onComment,
  onShare,
  onReactionClick,
  loadingReactions = false,
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [userReaction, setUserReaction] = useState(currentUserReaction);
  const [reactions, setReactions] = useState(initialReactions);

  // Use the new handlers if provided, otherwise fall back to useReactions hook
  const { addReaction, removeReaction, loading } = useReactions();
  const isLoading = loadingReactions || loading;

  // Simplified reaction mappings
  const reactionConfig = {
    like: { emoji: "👍", label: "Like", color: "text-blue-600" },
    dislike: { emoji: "👎", label: "Dislike", color: "text-red-600" },
    love: { emoji: "❤️", label: "Love", color: "text-red-500" },
    haha: { emoji: "😂", label: "Haha", color: "text-yellow-600" },
    wow: { emoji: "😮", label: "Wow", color: "text-purple-600" },
    sad: { emoji: "😢", label: "Sad", color: "text-gray-600" },
    angry: { emoji: "😠", label: "Angry", color: "text-orange-600" },
  };

  useEffect(() => {
    console.log(
      `[PostActions] Props updated - userReaction: ${currentUserReaction}, reactions:`,
      initialReactions
    );
    setUserReaction(currentUserReaction);
    setReactions(initialReactions);
  }, [currentUserReaction, initialReactions]);

  const handleReactionSelect = async (reactionType) => {
    if (isLoading) {
      console.log(
        "[PostActions] Reaction request already in progress, ignoring"
      );
      return;
    }

    console.log(
      `[PostActions] Handling reaction: ${reactionType} for post ${postId}`
    );
    console.log(`[PostActions] Current user reaction: ${userReaction}`);
    console.log(`[PostActions] Current reactions:`, reactions);

    const oldReaction = userReaction;

    setShowReactionPicker(false);

    try {
      let result;

      // Use new unified handler if provided, otherwise fall back to useReactions hook
      if (onReactionClick) {
        console.log(`[PostActions] Using unified reaction handler`);
        result = await onReactionClick(reactionType);
      } else {
        // Fallback to direct useReactions hook calls
        if (oldReaction === reactionType) {
          // Remove reaction (toggle off)
          console.log(`[PostActions] API call: Removing reaction`);
          result = await removeReaction(postId);
        } else {
          // Add/change reaction
          console.log(
            `[PostActions] API call: Adding reaction ${reactionType}`
          );
          result = await addReaction(postId, reactionType);
        }
      }

      console.log(`[PostActions] API result:`, result);

      if (result && result.success !== false) {
        console.log(
          `[PostActions] API succeeded - parent component will update props`
        );
        // Parent component handles all state updates
        // Our useEffect will sync when props change
      } else {
        console.error("[PostActions] Reaction API error:", result?.error);
      }
    } catch (error) {
      console.error("[PostActions] Failed to update reaction:", error);
    }
  };

  const handleComment = () => onComment?.();
  const handleShare = () => onShare?.();

  const toggleReactionPicker = () => {
    console.log(
      `[PostActions] Toggling reaction picker: ${!showReactionPicker}`
    );
    setShowReactionPicker(!showReactionPicker);
  };

  const showReactionPickerOnHover = () => {
    if (!showReactionPicker && !isLoading) {
      console.log(`[PostActions] Showing reaction picker on hover`);
      setShowReactionPicker(true);
    }
  };

  const hideReactionPicker = () => {
    console.log(`[PostActions] Hiding reaction picker`);
    setShowReactionPicker(false);
  };

  return (
    <div className="px-4 py-3 border-t border-gray-100">
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        {/* Reaction Button */}
        <div className="relative flex-1">
          <button
            onClick={toggleReactionPicker}
            onMouseEnter={showReactionPickerOnHover}
            disabled={isLoading}
            className={`flex items-center justify-center space-x-2 w-full py-2 px-3 rounded-lg transition-colors hover:bg-gray-50 ${
              userReaction
                ? reactionConfig[userReaction]?.color
                : "text-gray-600"
            } ${showReactionPicker ? "bg-gray-50" : ""} ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {userReaction ? (
              <>
                <span className="text-lg">
                  {reactionConfig[userReaction]?.emoji}
                </span>
                <span className="text-sm font-semibold">
                  {reactionConfig[userReaction]?.label}
                </span>
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin ml-1"></div>
                )}
              </>
            ) : (
              <>
                <MdThumbUp className="text-xl" />
                <span className="text-sm font-semibold">Like</span>
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin ml-1"></div>
                )}
              </>
            )}
          </button>

          {showReactionPicker && !isLoading && (
            <ReactionPicker
              onReactionSelect={handleReactionSelect}
              onClose={hideReactionPicker}
              currentReaction={userReaction}
            />
          )}
        </div>

        {/* Comment Button */}
        <button
          onClick={handleComment}
          className="flex items-center justify-center space-x-2 flex-1 py-2 px-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <MdChatBubbleOutline className="text-xl" />
          <span className="text-sm font-semibold">Comment</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center justify-center space-x-2 flex-1 py-2 px-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <MdShare className="text-xl" />
          <span className="text-sm font-semibold">Share</span>
        </button>
      </div>

      {/* Click outside to close reaction picker */}
      {showReactionPicker && (
        <div
          className="fixed inset-0 z-10 bg-transparent"
          onClick={hideReactionPicker}
        />
      )}
    </div>
  );
};

export default PostActions;
