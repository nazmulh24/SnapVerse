import React, { useState, useEffect } from "react";
import { X, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

const CommentSection = ({
  postId,
  isVisible,
  onClose,
  initialComments = [],
  commentsCount = 0,
  onAddComment,
  onDeleteComment,
  onAddReply,
}) => {
  const [comments, setComments] = useState(initialComments);
  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  // Show only first 3 comments by default
  const displayedComments = showAllComments ? comments : comments.slice(0, 3);
  const hasMoreComments = comments.length > 3;

  const handleAddComment = async (content) => {
    try {
      const newComment = await onAddComment(postId, content);
      setComments((prev) => [newComment, ...prev]);
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await onDeleteComment(postId, commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleAddReply = async (parentCommentId, content) => {
    try {
      const newReply = await onAddReply(parentCommentId, content);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === parentCommentId
            ? {
                ...comment,
                replies: [...(comment.replies || []), newReply],
                replies_count: (comment.replies_count || 0) + 1,
              }
            : comment
        )
      );
    } catch (error) {
      console.error("Failed to add reply:", error);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-white border-t border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">
            Comments ({commentsCount})
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Comments list */}
      <div className="max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="p-6 text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No comments yet</p>
            <p className="text-gray-400 text-xs mt-1">
              Be the first to comment!
            </p>
          </div>
        ) : (
          <div className="p-3">
            {displayedComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleAddReply}
                onDelete={handleDeleteComment}
                currentUserId={999} // Replace with actual current user ID
              />
            ))}

            {/* Show more/less comments button */}
            {hasMoreComments && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => setShowAllComments(!showAllComments)}
                  className="flex items-center space-x-2 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {showAllComments ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      <span>Show fewer comments</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      <span>View all {comments.length} comments</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comment form */}
      <CommentForm
        onSubmit={handleAddComment}
        placeholder="Write a comment..."
      />
    </div>
  );
};

export default CommentSection;
