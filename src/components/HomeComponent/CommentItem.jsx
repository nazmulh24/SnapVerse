import React, { useState, useContext } from "react";
import { MessageCircle, MoreHorizontal, Trash2 } from "lucide-react";
import AuthContext from "../../context/AuthContext";
import { getAvatarUrl } from "../../utils/avatarUtils";

const CommentItem = ({
  comment,
  onReply,
  onDelete,
  currentUserId = null,
  isReply = false,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { user } = useContext(AuthContext);

  // Early return if comment is null or undefined
  if (!comment) {
    console.error("❌ CommentItem: comment prop is null or undefined");
    return null;
  }

  // Ensure comment has at minimum required structure
  const safeComment = {
    id: comment.id || Date.now(),
    content: comment.content || comment.text || comment.body || "",
    created_at:
      comment.created_at ||
      comment.date ||
      comment.timestamp ||
      new Date().toISOString(),
    user: (() => {
      // Try different possible user field names and structures
      const userSource = comment.user || comment.author || comment.owner || {};

      // Log the actual user data we received
      console.log("🔍 Raw user data from API:", userSource);
      console.log("🔍 Full comment object:", comment);
      console.log("🔍 Comment keys:", Object.keys(comment));

      // Check if there's profile picture data elsewhere in the comment
      if (
        comment.profile_picture ||
        comment.user_profile_picture ||
        comment.avatar
      ) {
        console.log("🔍 Found profile picture in comment:", {
          profile_picture: comment.profile_picture,
          user_profile_picture: comment.user_profile_picture,
          avatar: comment.avatar,
        });
      }

      // Handle case where user data is just a string (user's name)
      if (typeof userSource === "string") {
        console.log(
          "🔍 User data is string, creating user object from name:",
          userSource
        );

        // Check if profile picture is stored elsewhere in the comment
        const profilePicture =
          comment.profile_picture ||
          comment.user_profile_picture ||
          comment.avatar ||
          comment.user_avatar ||
          null;

        console.log("🔍 Found profile picture from comment:", profilePicture);

        return {
          id: 0,
          full_name: userSource,
          username: userSource.toLowerCase().replace(/\s+/g, "_"),
          profile_picture: profilePicture,
        };
      }

      // Handle case where user data is an object
      if (typeof userSource === "object" && userSource !== null) {
        return {
          id: userSource.id || userSource.user_id || 0,
          full_name:
            userSource.full_name ||
            userSource.fullName ||
            userSource.name ||
            userSource.display_name ||
            userSource.username ||
            "Unknown User",
          username:
            userSource.username ||
            userSource.user_name ||
            userSource.handle ||
            "unknown",
          profile_picture:
            userSource.profile_picture ||
            userSource.profilePicture ||
            userSource.avatar ||
            userSource.image ||
            userSource.photo ||
            null,
        };
      }

      // Fallback for other cases
      return {
        id: 0,
        full_name: "Unknown User",
        username: "unknown",
        profile_picture: null,
      };
    })(),
    replies_count: comment.replies_count || 0,
    replies: comment.replies || [],
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);

    if (diffInSeconds < 60) return "now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return `${Math.floor(diffInSeconds / 604800)}w`;
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      await onReply(safeComment.id, replyText.trim());
      setReplyText("");
      setShowReplyForm(false);
      setShowReplies(true);
    } catch (error) {
      console.error("Failed to add reply:", error);
    }
  };

  const handleDelete = () => {
    onDelete(safeComment.id);
    setShowMenu(false);
  };

  const isOwner = safeComment.user?.id === (currentUserId || user?.id);

  // Debug the comment data structure
  console.log("🗨️ CommentItem received comment:", comment);
  console.log("🗨️ SafeComment:", safeComment);
  console.log("🗨️ SafeComment.user:", safeComment.user);
  console.log("🗨️ SafeComment.user.full_name:", safeComment.user?.full_name);
  console.log(
    "🗨️ SafeComment.user.profile_picture:",
    safeComment.user?.profile_picture
  );
  console.log("🗨️ SafeComment.content:", safeComment.content);

  return (
    <div className={`flex space-x-2 ${isReply ? "ml-8 mt-2" : "mt-3"}`}>
      {/* Avatar */}
      <img
        src={getAvatarUrl(safeComment.user, 32)}
        alt={safeComment.user?.full_name || "User"}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        onError={(e) => {
          console.error("🖼️ Avatar failed to load:", e.target.src);
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            safeComment.user?.full_name || "User"
          )}&background=random&color=fff&size=32`;
        }}
      />

      <div className="flex-1 min-w-0">
        {/* Comment Content */}
        <div className="bg-gray-100 rounded-2xl px-3 py-2 relative group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-gray-900">
                {safeComment.user?.full_name ||
                  safeComment.user?.username ||
                  safeComment.user?.name ||
                  "Unknown User"}
              </h4>
              <p className="text-gray-800 text-sm mt-0.5 break-words">
                {safeComment.content || "No content"}
              </p>
            </div>

            {/* Menu button */}
            {isOwner && (
              <div className="relative ml-2 flex-shrink-0">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded-full"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[100px]">
                    <button
                      onClick={handleDelete}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-4 mt-1 ml-3">
          {!isReply && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
            >
              Reply
            </button>
          )}

          <span className="text-xs text-gray-500">
            {formatTimeAgo(safeComment.created_at)}
          </span>
        </div>

        {/* Reply form */}
        {showReplyForm && (
          <form onSubmit={handleReplySubmit} className="mt-2 ml-3">
            <div className="flex space-x-2">
              <img
                src={getAvatarUrl(user, 24)}
                alt="Your avatar"
                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${
                    safeComment.user?.full_name ||
                    safeComment.user?.username ||
                    "User"
                  }...`}
                  className="w-full bg-gray-100 rounded-full px-3 py-1.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  autoFocus
                />
              </div>
            </div>
          </form>
        )}

        {/* Show replies button */}
        {safeComment.replies_count > 0 && !showReplies && !isReply && (
          <button
            onClick={() => setShowReplies(true)}
            className="flex items-center space-x-1 mt-2 ml-3 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>
              View {safeComment.replies_count}{" "}
              {safeComment.replies_count === 1 ? "reply" : "replies"}
            </span>
          </button>
        )}

        {/* Hide replies button */}
        {showReplies && safeComment.replies_count > 0 && !isReply && (
          <button
            onClick={() => setShowReplies(false)}
            className="flex items-center space-x-1 mt-2 ml-3 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Hide replies</span>
          </button>
        )}

        {/* Replies */}
        {showReplies &&
          safeComment.replies &&
          safeComment.replies.length > 0 &&
          !isReply && (
            <div className="mt-2">
              {safeComment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onDelete={onDelete}
                  currentUserId={currentUserId}
                  isReply={true}
                />
              ))}
            </div>
          )}
      </div>
    </div>
  );
};

export default CommentItem;
