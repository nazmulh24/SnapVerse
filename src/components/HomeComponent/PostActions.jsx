import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  MdChatBubbleOutline,
  MdShare,
  MdThumbUp,
  MdClose,
} from "react-icons/md";
import ReactionPicker from "./ReactionPicker";
import useReactions from "../../hooks/useReactions";
import AuthApiClient from "../../services/auth-api-client";

const PostActions = ({
  postId,
  initialReactions = {},
  currentUserReaction = null,
  onComment,
  onShare,
  onReactionClick,
  loadingReactions = false,
  onShowReactionDetails, // New prop to pass the function up to Post
  onReactionCountChange, // New prop to notify when reaction count changes
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [userReaction, setUserReaction] = useState(() =>
    currentUserReaction === "" ? null : currentUserReaction
  );
  const [reactions, setReactions] = useState(initialReactions);
  const [showReactionModal, setShowReactionModal] = useState(false);
  const [reactionDetails, setReactionDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Prevent infinite loops with refs
  const previousReactionsRef = useRef();

  const { addReaction, removeReaction, loading } = useReactions();
  const isLoading = loadingReactions || loading;

  // Enhanced reaction mappings with background colors
  const reactionConfig = useMemo(
    () => ({
      like: {
        emoji: "👍",
        label: "Like",
        name: "like",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        hoverBg: "hover:bg-blue-100",
        iconColor: "text-blue-600",
      },
      dislike: {
        emoji: "👎",
        label: "Dislike",
        name: "dislike",
        color: "text-red-600",
        bgColor: "bg-red-50",
        hoverBg: "hover:bg-red-100",
        iconColor: "text-blue-600",
      },
      love: {
        emoji: "❤️",
        label: "Love",
        name: "love",
        color: "text-red-500",
        bgColor: "bg-red-50",
        hoverBg: "hover:bg-red-100",
        iconColor: "text-red-500",
      },
      haha: {
        emoji: "😂",
        label: "Haha",
        name: "haha",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        hoverBg: "hover:bg-yellow-100",
        iconColor: "text-yellow-600",
      },
      wow: {
        emoji: "😮",
        label: "Wow",
        name: "wow",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        hoverBg: "hover:bg-purple-100",
        iconColor: "text-purple-600",
      },
      sad: {
        emoji: "😢",
        label: "Sad",
        name: "sad",
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        hoverBg: "hover:bg-gray-100",
        iconColor: "text-gray-600",
      },
      angry: {
        emoji: "😠",
        label: "Angry",
        name: "angry",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        hoverBg: "hover:bg-orange-100",
        iconColor: "text-orange-600",
      },
    }),
    []
  );

  // Update user reaction when prop changes
  useEffect(() => {
    const normalizedReaction =
      currentUserReaction === "" ? null : currentUserReaction;
    setUserReaction(normalizedReaction);
  }, [currentUserReaction]);

  // Update reactions when initialReactions change
  useEffect(() => {
    const reactionsString = JSON.stringify(initialReactions);
    const previousString = JSON.stringify(previousReactionsRef.current);

    console.log(`[PostActions] Reactions update check for post ${postId}:`, {
      initialReactions,
      hasChanged: reactionsString !== previousString,
    });

    if (reactionsString !== previousString) {
      previousReactionsRef.current = initialReactions;
      setReactions(initialReactions);

      // Save to localStorage
      const localStorageKey = `post_reactions_${postId}`;
      localStorage.setItem(localStorageKey, JSON.stringify(initialReactions));
    }
  }, [initialReactions, postId]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27 && showReactionModal) {
        setShowReactionModal(false);
      }
    };

    if (showReactionModal) {
      document.addEventListener("keydown", handleEsc, false);
      return () => {
        document.removeEventListener("keydown", handleEsc, false);
      };
    }
  }, [showReactionModal]);

  // Calculate total reaction count with memoization
  const getTotalReactionCount = useCallback(() => {
    const total = Object.values(reactions).reduce((sum, count) => {
      const numericCount = parseInt(count) || 0;
      return sum + numericCount;
    }, 0);
    return total;
  }, [reactions]);

  // Get top 3 reaction types for display with memoization
  const getTopReactions = useCallback(() => {
    const sortedReactions = Object.entries(reactions)
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
    return sortedReactions;
  }, [reactions]);

  // Notify parent when reactions change (send initial count immediately)
  useEffect(() => {
    if (onReactionCountChange) {
      const totalCount = getTotalReactionCount();
      console.log(
        `[PostActions] Sending count to parent for post ${postId}:`,
        totalCount,
        "from reactions:",
        reactions
      );
      onReactionCountChange(totalCount);
    }
  }, [reactions, onReactionCountChange, getTotalReactionCount, postId]);

  // Function to save reactions to localStorage
  const saveReactionsToLocalStorage = useCallback(
    (newReactions) => {
      const localStorageKey = `post_reactions_${postId}`;
      localStorage.setItem(localStorageKey, JSON.stringify(newReactions));
    },
    [postId]
  );

  // Function to fetch reaction details from API
  const fetchReactionDetails = useCallback(async () => {
    if (loadingDetails) return;

    setLoadingDetails(true);
    try {
      console.log(`Fetching reactions for post ${postId}...`);
      const response = await AuthApiClient.get(`/posts/${postId}/reactions/`);
      console.log("Reaction details response:", response.data);

      if (response.data && Array.isArray(response.data)) {
        setReactionDetails(response.data);
        setShowReactionModal(true);
      } else {
        console.error("Invalid reaction details format:", response.data);
        setReactionDetails([]);
      }
    } catch (error) {
      console.error("Error fetching reaction details:", error);
      setReactionDetails([]);
    } finally {
      setLoadingDetails(false);
    }
  }, [loadingDetails, postId]);

  // Pass functions to parent component
  useEffect(() => {
    if (onShowReactionDetails) {
      onShowReactionDetails({
        fetchReactionDetails,
        getTotalReactionCount,
        getTopReactions,
        reactions,
        setShowReactionModal,
      });
    }
  }, [
    onShowReactionDetails,
    reactions,
    fetchReactionDetails,
    getTotalReactionCount,
    getTopReactions,
  ]);

  const handleReactionSelect = useCallback(
    async (reactionType) => {
      if (isLoading) return;

      setShowReactionPicker(false);

      try {
        const oldReaction = userReaction;
        const isRemovingReaction = oldReaction === reactionType;

        // Optimistically update local state
        let newReactions = { ...reactions };
        let newUserReaction = null;

        // Remove old reaction if exists
        if (oldReaction && newReactions[oldReaction]) {
          newReactions[oldReaction] = Math.max(
            0,
            newReactions[oldReaction] - 1
          );
        }

        // Add new reaction if not removing the same one
        if (!isRemovingReaction) {
          newReactions[reactionType] = (newReactions[reactionType] || 0) + 1;
          newUserReaction = reactionType;
        }

        // Update state optimistically
        setReactions(newReactions);
        setUserReaction(newUserReaction);
        saveReactionsToLocalStorage(newReactions);

        // Call parent reaction handler
        if (onReactionClick) {
          await onReactionClick(reactionType);
        } else {
          // Fallback to direct useReactions hook calls
          if (isRemovingReaction) {
            await removeReaction(postId);
          } else {
            await addReaction(postId, reactionType);
          }
        }
      } catch (error) {
        console.error("Failed to update reaction:", error);
        // Revert optimistic update on error
        setUserReaction(userReaction);
        setReactions(reactions);
      }
    },
    [
      isLoading,
      userReaction,
      reactions,
      saveReactionsToLocalStorage,
      onReactionClick,
      removeReaction,
      addReaction,
      postId,
    ]
  );

  const handleDirectLike = useCallback(async () => {
    if (isLoading) return;
    await handleReactionSelect("like");
  }, [isLoading, handleReactionSelect]);

  const handleComment = useCallback(() => {
    onComment?.();
  }, [onComment]);

  const handleShare = useCallback(() => {
    onShare?.();
  }, [onShare]);

  const toggleReactionPicker = useCallback(() => {
    setShowReactionPicker((prev) => !prev);
  }, []);

  const showReactionPickerOnHover = useCallback(() => {
    if (!showReactionPicker && !isLoading) {
      setShowReactionPicker(true);
    }
  }, [showReactionPicker, isLoading]);

  const hideReactionPicker = useCallback(() => {
    setShowReactionPicker(false);
  }, []);

  return (
    <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-100">
      {/* Reaction Details Modal */}
      {showReactionModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowReactionModal(false);
            }
          }}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Total reactions ({reactionDetails.length})
              </h3>
              <button
                onClick={() => setShowReactionModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <MdClose className="text-xl" />
              </button>
            </div>

            {/* Reactions List */}
            <div className="overflow-y-auto max-h-96">
              {loadingDetails ? (
                <div className="p-4">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 animate-pulse"
                    >
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                      </div>
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    </div>
                  ))}
                </div>
              ) : reactionDetails.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {reactionDetails.map((reaction, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      {/* Left: Profile Picture and User Name */}
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            reaction.user_profile_picture ||
                            `https://ui-avatars.com/api/?name=${reaction.user}&background=random&color=fff`
                          }
                          alt={reaction.user}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {reaction.user}
                        </span>
                      </div>

                      {/* Right: Reaction Emoji */}
                      <div className="text-lg">
                        {reactionConfig[reaction.reaction]?.emoji || "👍"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <div className="text-3xl">�</div>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    No reactions yet
                  </h4>
                  <p className="text-sm text-gray-500 mb-4 max-w-xs mx-auto">
                    Be the first person to react to this post and show your
                    support!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {/* Reaction Button */}
        <div className="relative flex-1">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDirectLike();
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleReactionPicker();
            }}
            onMouseEnter={showReactionPickerOnHover}
            disabled={isLoading}
            className={`flex items-center justify-center space-x-1.5 sm:space-x-2 w-full py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg transition-all duration-200 ${
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
                <span className="text-xs sm:text-sm font-semibold">
                  {reactionConfig[userReaction]?.label}
                </span>
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin ml-1"></div>
                )}
              </>
            ) : (
              <>
                <MdThumbUp className="text-xl" />
                <span className="text-xs sm:text-sm font-semibold">Like</span>
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
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleComment();
          }}
          className="flex items-center justify-center space-x-2 flex-1 py-2 px-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <MdChatBubbleOutline className="text-xl" />
                          <span className="text-xs sm:text-sm font-semibold">Comment</span>
        </button>

        {/* Share Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleShare();
          }}
          className="flex items-center justify-center space-x-2 flex-1 py-2 px-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <MdShare className="text-xl" />
                          <span className="text-xs sm:text-sm font-semibold">Share</span>
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
