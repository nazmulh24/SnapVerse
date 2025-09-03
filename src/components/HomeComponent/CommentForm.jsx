import React, { useState } from "react";
import { Send, Smile } from "lucide-react";
import EmojiPicker from "./EmojiPicker";

const CommentForm = ({
  onSubmit,
  placeholder = "Write a comment...",
  autoFocus = false,
}) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(comment.trim());
      setComment("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
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

  const handleEmojiSelect = (emoji) => {
    setComment((prev) => prev + emoji);
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3">
      <div className="flex space-x-3">
        {/* Current user avatar */}
        <img
          src={`https://ui-avatars.com/api/?name=Current%20User&background=random&color=fff&size=32`}
          alt="Your avatar"
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
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
              className="flex-1 bg-transparent px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none"
            />

            {/* Emoji button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Add emoji"
              >
                <Smile className="w-4 h-4" />
              </button>

              <EmojiPicker
                isOpen={showEmojiPicker}
                onEmojiSelect={handleEmojiSelect}
                onClose={() => setShowEmojiPicker(false)}
              />
            </div>

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
