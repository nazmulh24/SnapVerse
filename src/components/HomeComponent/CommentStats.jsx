import React from "react";
import { Heart, MessageCircle } from "lucide-react";

const CommentStats = ({
  likes,
  replies,
  onLike,
  onReply,
  isLiked,
  className = "",
}) => {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Like button */}
      <button
        onClick={onLike}
        className={`flex items-center space-x-1 transition-colors ${
          isLiked
            ? "text-red-500 hover:text-red-600"
            : "text-gray-500 hover:text-red-500"
        }`}
      >
        <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
        {likes > 0 && <span className="text-sm">{likes}</span>}
      </button>

      {/* Reply button */}
      {onReply && (
        <button
          onClick={onReply}
          className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          {replies > 0 && <span className="text-sm">{replies}</span>}
        </button>
      )}
    </div>
  );
};

export default CommentStats;
