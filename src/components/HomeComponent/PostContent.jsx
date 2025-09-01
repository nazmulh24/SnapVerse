import React from "react";

const PostContent = ({
  caption,
  username,
  full_name,
  commentsCount = 0,
  onViewComments,
  showComments = false,
}) => {
  const handleViewComments = () => {
    if (onViewComments) {
      onViewComments();
    }
  };

  // Sample comments for demo - in real app this would come from API
  const sampleComments = [
    {
      id: 1,
      user: { username: "john_doe", full_name: "John Doe" },
      content: "Great post! Love it 🔥",
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      user: { username: "jane_smith", full_name: "Jane Smith" },
      content: "Amazing content, keep it up! 👏",
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return (
    <div className="px-4 pb-4">
      {/* Show caption if provided */}
      {caption && (
        <p className="text-sm mb-2">
          <span className="font-semibold text-gray-900">
            {full_name || username}
          </span>{" "}
          <span className="text-gray-800">{caption}</span>
        </p>
      )}

      {/* Show likes count if any */}

      {/* Show 2 comments if showComments is true */}
      {showComments && sampleComments.length > 0 && (
        <div className="space-y-1 mb-2">
          {sampleComments.slice(0, 2).map((comment) => (
            <p key={comment.id} className="text-sm">
              <span className="font-semibold text-gray-900">
                {comment.user.full_name || comment.user.username}
              </span>{" "}
              <span className="text-gray-800">{comment.content}</span>
            </p>
          ))}
        </div>
      )}

      {/* View all comments link */}
      {commentsCount > 2 && (
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
