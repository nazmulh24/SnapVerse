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

  const { addReaction, removeReaction, loading } = useReactions();
  const isLoading = loadingReactions || loading;

  // Enhanced reaction mappings with background colors
  const reactionConfig = {
    like: {
      emoji: "👍",
      label: "Like",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hoverBg: "hover:bg-blue-100",
      iconColor: "text-blue-600",
    },
    dislike: {
      emoji: "👎",
      label: "Dislike",
      color: "text-red-600",
      bgColor: "bg-red-50",
      hoverBg: "hover:bg-red-100",
      iconColor: "text-red-600",
    },
    love: {
      emoji: "❤️",
      label: "Love",
      color: "text-red-500",
      bgColor: "bg-red-50",
      hoverBg: "hover:bg-red-100",
      iconColor: "text-red-500",
    },
    haha: {
      emoji: "😂",
      label: "Haha",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      hoverBg: "hover:bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    wow: {
      emoji: "😮",
      label: "Wow",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      hoverBg: "hover:bg-purple-100",
      iconColor: "text-purple-600",
    },
    sad: {
      emoji: "😢",
      label: "Sad",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      hoverBg: "hover:bg-gray-100",
      iconColor: "text-gray-600",
    },
    angry: {
      emoji: "😠",
      label: "Angry",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      hoverBg: "hover:bg-orange-100",
      iconColor: "text-orange-600",
    },
  };

  useEffect(() => {
    // Convert empty string to null for proper state management
    const normalizedReaction =
      currentUserReaction === "" ? null : currentUserReaction;
    setUserReaction(normalizedReaction);
  }, [currentUserReaction, initialReactions]);

  const handleReactionSelect = async (reactionType) => {
    if (isLoading) return;

    setShowReactionPicker(false);

    try {
      if (onReactionClick) {
        await onReactionClick(reactionType);
      } else {
        // Fallback to direct useReactions hook calls
        const oldReaction = userReaction;
        if (oldReaction === reactionType) {
          await removeReaction(postId);
        } else {
          await addReaction(postId, reactionType);
        }
      }
    } catch (error) {
      console.error("Failed to update reaction:", error);
    }
  };

  const handleDirectLike = async () => {
    if (isLoading) return;
    await handleReactionSelect("like");
  };

  const handleComment = () => onComment?.();
  const handleShare = () => onShare?.();

  const toggleReactionPicker = () => {
    setShowReactionPicker(!showReactionPicker);
  };

  const showReactionPickerOnHover = () => {
    if (!showReactionPicker && !isLoading) {
      setShowReactionPicker(true);
    }
  };

  const hideReactionPicker = () => {
    setShowReactionPicker(false);
  };

  return (
    <div className="px-4 py-3 border-t border-gray-100">
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        {/* Reaction Button */}
        <div className="relative flex-1">
          <button
            onClick={handleDirectLike}
            onContextMenu={(e) => {
              e.preventDefault();
              toggleReactionPicker();
            }}
            onMouseEnter={showReactionPickerOnHover}
            disabled={isLoading}
            className={`flex items-center justify-center space-x-2 w-full py-2 px-3 rounded-lg transition-all duration-200 ${
              userReaction
                ? `${reactionConfig[userReaction]?.color} ${reactionConfig[userReaction]?.bgColor} ${reactionConfig[userReaction]?.hoverBg} border border-current border-opacity-20`
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-700"
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
