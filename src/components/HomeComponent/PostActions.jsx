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
  const [showReactionDetails, setShowReactionDetails] = useState(false);

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

  // Calculate total reactions dynamically
  const totalReactions = Object.values(reactions).reduce(
    (sum, count) => sum + count,
    0
  );

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
  const toggleReactionDetails = () =>
    setShowReactionDetails(!showReactionDetails);

  return (
    <div className="px-4 py-3 border-t border-gray-100">
      {/* Simple Reactions Summary */}
      {totalReactions > 0 && (
        <div className="mb-3">
          <button
            onClick={toggleReactionDetails}
            className="flex items-center space-x-2 hover:bg-gray-50 rounded p-2 transition-colors"
          >
            {/* Simple emoji display */}
            <div className="flex space-x-1">
              {Object.entries(reactions)
                .filter(([, count]) => count > 0)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([reactionType]) => (
                  <span key={reactionType} className="text-sm">
                    {reactionConfig[reactionType]?.emoji}
                  </span>
                ))}
            </div>
            <span className="text-sm text-gray-600">{totalReactions}</span>
          </button>

          {/* Simple Reaction Details */}
          {showReactionDetails && (
            <div className="mt-2 bg-white border rounded-lg shadow-lg p-3 absolute z-20 min-w-48">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Reactions
              </h4>
              {Object.entries(reactions)
                .filter(([, count]) => count > 0)
                .sort(([, a], [, b]) => b - a)
                .map(([type, count]) => (
                  <div
                    key={type}
                    className="flex items-center justify-between py-1"
                  >
                    <div className="flex items-center space-x-2">
                      <span>{reactionConfig[type]?.emoji}</span>
                      <span className="text-sm text-gray-700">
                        {reactionConfig[type]?.label}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Simple Action Buttons */}
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
      {(showReactionDetails || showReactionPicker) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowReactionDetails(false);
            setShowReactionPicker(false);
          }}
        />
      )}
    </div>
  );
};

export default PostActions;
