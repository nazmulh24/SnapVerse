import React, { useState, useContext } from "react";
import { Send } from "lucide-react";
import AuthContext from "../../context/AuthContext";
import { getAvatarUrl, handleAvatarError } from "../../utils/avatarUtils";

const CommentForm = ({
  onSubmit,
  placeholder = "Write a comment...",
  autoFocus = false,
}) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || isSubmitting) return;

    console.log("📝 CommentForm - Submitting comment:", comment.trim());
    setIsSubmitting(true);
    try {
      await onSubmit(comment.trim());
      console.log("✅ CommentForm - Comment submitted successfully");
      setComment("");
    } catch (error) {
      console.error("❌ CommentForm - Failed to submit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3">
      <div className="flex space-x-3">
        {/* Current user avatar */}
        <img
          src={getAvatarUrl(user, 32)}
          alt="Your avatar"
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          onError={(e) =>
            handleAvatarError(e, user?.full_name || user?.username || "U", 32)
          }
        />

        {/* Comment input */}
        <div className="flex-1 relative">
          <div className="flex items-center bg-gray-100 rounded-full border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              autoFocus={autoFocus}
              disabled={isSubmitting}
              className="flex-1 bg-transparent px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none"
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={!comment.trim() || isSubmitting}
              className={`p-2 mr-2 rounded-full transition-colors ${
                comment.trim() && !isSubmitting
                  ? "text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              title="Send comment"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
