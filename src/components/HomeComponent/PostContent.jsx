import React from "react";

const PostContent = ({
  caption,
  username,
  commentsCount = 0,
  onViewComments,
}) => {
  const handleViewComments = () => {
    if (onViewComments) {
      onViewComments();
    }
  };

  return (
    <div className="px-4 pb-4">
      {caption && (
        <p className="text-sm mb-2">
          <span className="font-semibold text-gray-900">{username}</span>{" "}
          <span className="text-gray-800">{caption}</span>
        </p>
      )}

      {commentsCount > 0 && (
        <button
          onClick={handleViewComments}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          View all {commentsCount}{" "}
          {commentsCount === 1 ? "comment" : "comments"}
        </button>
      )}
    </div>
  );
};

export default PostContent;
