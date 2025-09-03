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
    if (loading) return;

    const oldReaction = userReaction;
    const oldReactions = { ...reactions };

    // Simple optimistic update
    let newReactions = { ...reactions };

    if (oldReaction) {
      newReactions[oldReaction] = Math.max(
        0,
        (newReactions[oldReaction] || 0) - 1
      );
    }

    if (oldReaction !== reactionType) {
      newReactions[reactionType] = (newReactions[reactionType] || 0) + 1;
      setUserReaction(reactionType);
    } else {
      setUserReaction(null);
    }

    setReactions(newReactions);
    setShowReactionPicker(false);

    try {
      const result =
        oldReaction === reactionType
          ? await removeReaction(postId)
          : await addReaction(postId, reactionType);

      if (result.success && result.data.reactions) {
        setReactions(result.data.reactions);
        if (result.data.user_reaction !== undefined) {
          setUserReaction(result.data.user_reaction);
        }
        onReactionUpdate?.(result.data);
      } else {
        // Revert on error
        setUserReaction(oldReaction);
        setReactions(oldReactions);
      }
    } catch (error) {
      // Revert on error
      setUserReaction(oldReaction);
      setReactions(oldReactions);
      console.error("Failed to update reaction:", error);
    }
  };

  const handleComment = () => onComment?.();
  const handleShare = () => onShare?.();
  const toggleReactionPicker = () => setShowReactionPicker(!showReactionPicker);

  return (
    <div className="px-4 py-3 border-t border-gray-100">
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        {/* Reaction Button */}
        <div className="relative flex-1">
          <button
            onClick={toggleReactionPicker}
            onMouseEnter={() =>
              !showReactionPicker && setShowReactionPicker(true)
            }
            className={`flex items-center justify-center space-x-2 w-full py-2 px-3 rounded-lg transition-colors hover:bg-gray-50 ${
              userReaction
                ? reactionConfig[userReaction]?.color
                : "text-gray-600"
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
              onClose={() => setShowReactionPicker(false)}
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

      {/* Click outside to close modals */}
      {showReactionPicker && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowReactionPicker(false);
          }}
        />
      )}
    </div>
  );
};

export default PostActions;
