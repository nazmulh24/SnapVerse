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
  onReactionUpdate,
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [userReaction, setUserReaction] = useState(currentUserReaction);
  const [reactions, setReactions] = useState(initialReactions);

  const { addReaction, removeReaction, loading } = useReactions();

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
    setUserReaction(currentUserReaction);
    setReactions(initialReactions);
  }, [currentUserReaction, initialReactions]);

  const handleReactionSelect = async (reactionType) => {
    if (loading) {
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
    const oldReactions = { ...reactions };

    // Optimistic update
    let newReactions = { ...reactions };

    // Remove old reaction count
    if (oldReaction) {
      newReactions[oldReaction] = Math.max(
        0,
        (newReactions[oldReaction] || 0) - 1
      );
      console.log(`[PostActions] Removed old reaction: ${oldReaction}`);
    }

    // Handle new reaction
    if (oldReaction !== reactionType) {
      // Adding a new/different reaction
      newReactions[reactionType] = (newReactions[reactionType] || 0) + 1;
      setUserReaction(reactionType);
      console.log(`[PostActions] Added new reaction: ${reactionType}`);
    } else {
      // Removing the same reaction (toggle off)
      setUserReaction(null);
      console.log(`[PostActions] Toggled off reaction: ${reactionType}`);
    }

    setReactions(newReactions);
    setShowReactionPicker(false);

    try {
      let result;

      if (oldReaction === reactionType) {
        // Remove reaction (toggle off)
        console.log(`[PostActions] API call: Removing reaction`);
        result = await removeReaction(postId);
      } else {
        // Add/change reaction
        console.log(`[PostActions] API call: Adding reaction ${reactionType}`);
        result = await addReaction(postId, reactionType);
      }

      console.log(`[PostActions] API result:`, result);

      if (result.success) {
        if (result.data && result.data.reactions) {
          console.log(
            `[PostActions] Updating reactions from API:`,
            result.data.reactions
          );
          setReactions(result.data.reactions);
        }

        if (result.data && result.data.user_reaction !== undefined) {
          console.log(
            `[PostActions] Updating user reaction from API:`,
            result.data.user_reaction
          );
          setUserReaction(result.data.user_reaction);
        }

        // Notify parent component
        if (onReactionUpdate && result.data) {
          onReactionUpdate(result.data);
        }
      } else {
        // Revert optimistic update on API failure
        console.log(`[PostActions] API failed, reverting optimistic update`);
        setUserReaction(oldReaction);
        setReactions(oldReactions);
        console.error("[PostActions] Reaction API error:", result.error);
      }
    } catch (error) {
      // Revert optimistic update on error
      console.log(
        `[PostActions] Exception occurred, reverting optimistic update`
      );
      setUserReaction(oldReaction);
      setReactions(oldReactions);
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
    if (!showReactionPicker) {
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
            className={`flex items-center justify-center space-x-2 w-full py-2 px-3 rounded-lg transition-colors hover:bg-gray-50 ${
              userReaction
                ? reactionConfig[userReaction]?.color
                : "text-gray-600"
            } ${showReactionPicker ? "bg-gray-50" : ""}`}
          >
            {userReaction ? (
              <>
                <span className="text-lg">
                  {reactionConfig[userReaction]?.emoji}
                </span>
                <span className="text-sm font-semibold">
                  {reactionConfig[userReaction]?.label}
                </span>
              </>
            ) : (
              <>
                <MdThumbUp className="text-xl" />
                <span className="text-sm font-semibold">Like</span>
              </>
            )}
          </button>

          {showReactionPicker && (
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
