import React, { useState } from "react";
import {
  MdFavoriteBorder,
  MdFavorite,
  MdChatBubbleOutline,
  MdShare,
} from "react-icons/md";

const PostActions = ({
  initialLikes = 0,
  isLiked = false,
  onLike,
  onComment,
  onShare,
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);

  const handleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikesCount((prev) => (newLikedState ? prev + 1 : prev - 1));

    if (onLike) {
      onLike(newLikedState);
    }
  };

  const handleComment = () => {
    if (onComment) {
      onComment();
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center space-x-4 mb-2">
        <button
          onClick={handleLike}
          className={`transition-colors duration-200 ${
            liked ? "text-red-500" : "text-gray-700 hover:text-gray-900"
          }`}
          title={liked ? "Unlike" : "Like"}
        >
          {liked ? (
            <MdFavorite className="text-2xl" />
          ) : (
            <MdFavoriteBorder className="text-2xl" />
          )}
        </button>

        <button
          onClick={handleComment}
          className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
          title="Comment"
        >
          <MdChatBubbleOutline className="text-2xl" />
        </button>

        <button
          onClick={handleShare}
          className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
          title="Share"
        >
          <MdShare className="text-2xl" />
        </button>
      </div>

      {likesCount > 0 && (
        <p className="font-semibold mb-1 text-gray-900">
          {likesCount.toLocaleString()} {likesCount === 1 ? "like" : "likes"}
        </p>
      )}
    </div>
  );
};

export default PostActions;
