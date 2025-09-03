import React, { useState } from "react";
import { Heart, MessageCircle, MoreHorizontal, Trash2 } from "lucide-react";

const CommentItem = ({
  comment,
  onLike,
  onReply,
  onDelete,
  currentUserId = 999,
  isReply = false,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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

  const getAvatar = (user) => {
    if (user.profile_picture) {
      return user.profile_picture.startsWith("http")
        ? user.profile_picture
        : `https://res.cloudinary.com/dlkq5sjum/image/upload/${user.profile_picture}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.full_name || user.username || "User"
    )}&background=random&color=fff&size=32`;
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      await onReply(comment.id, replyText.trim());
      setReplyText("");
      setShowReplyForm(false);
      setShowReplies(true);
    } catch (error) {
      console.error("Failed to add reply:", error);
    }
  };

  const handleLike = () => {
    onLike(comment.id);
  };

  const handleDelete = () => {
    onDelete(comment.id);
    setShowMenu(false);
  };

  const isOwner = comment.user.id === currentUserId;

  return (
    <div className={`flex space-x-2 ${isReply ? "ml-8 mt-2" : "mt-3"}`}>
      {/* Avatar */}
      <img
        src={getAvatar(comment.user)}
        alt={comment.user.full_name}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        {/* Comment Content */}
        <div className="bg-gray-100 rounded-2xl px-3 py-2 relative group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-gray-900">
                {comment.user.full_name}
              </h4>
              <p className="text-gray-800 text-sm mt-0.5 break-words">
                {comment.content}
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
          <button
            onClick={handleLike}
            className={`text-xs font-semibold transition-colors ${
              comment.is_liked
                ? "text-red-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Like
          </button>

          {!isReply && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
            >
              Reply
            </button>
          )}

          <span className="text-xs text-gray-500">
            {formatTimeAgo(comment.created_at)}
          </span>

          {comment.likes_count > 0 && (
            <div className="flex items-center space-x-1">
              <Heart
                className={`w-3 h-3 ${
                  comment.is_liked
                    ? "text-red-500 fill-current"
                    : "text-gray-400"
                }`}
              />
              <span className="text-xs text-gray-500">
                {comment.likes_count}
              </span>
            </div>
          )}
        </div>

        {/* Reply form */}
        {showReplyForm && (
          <form onSubmit={handleReplySubmit} className="mt-2 ml-3">
            <div className="flex space-x-2">
              <img
                src={`https://ui-avatars.com/api/?name=Current%20User&background=random&color=fff&size=24`}
                alt="Your avatar"
                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${comment.user.full_name}...`}
                  className="w-full bg-gray-100 rounded-full px-3 py-1.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  autoFocus
                />
              </div>
            </div>
          </form>
        )}

        {/* Show replies button */}
        {comment.replies_count > 0 && !showReplies && !isReply && (
          <button
            onClick={() => setShowReplies(true)}
            className="flex items-center space-x-1 mt-2 ml-3 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>
              View {comment.replies_count}{" "}
              {comment.replies_count === 1 ? "reply" : "replies"}
            </span>
          </button>
        )}

        {/* Hide replies button */}
        {showReplies && comment.replies_count > 0 && !isReply && (
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
          comment.replies &&
          comment.replies.length > 0 &&
          !isReply && (
            <div className="mt-2">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onLike={onLike}
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
