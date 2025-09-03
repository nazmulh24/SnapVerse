import React, { useState, useEffect, useContext } from "react";
import {
  X,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import AuthContext from "../../context/AuthContext";

const CommentSection = ({
  postId,
  isVisible,
  onClose,
  initialComments = [],
  commentsCount = 0,
  onAddComment,
  onDeleteComment,
  onAddReply,
  loading = false,
  error = null,
}) => {
  const [comments, setComments] = useState(initialComments);
  const [showAllComments, setShowAllComments] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log(
      "💬 CommentSection - initialComments changed:",
      initialComments
    );
    console.log(
      "💬 CommentSection - initialComments type:",
      typeof initialComments
    );
    console.log(
      "💬 CommentSection - initialComments length:",
      initialComments?.length
    );
    setComments(initialComments);
  }, [initialComments]);

  // Show only first 3 comments by default
  const displayedComments = showAllComments ? comments : comments.slice(0, 3);
  const hasMoreComments = comments.length > 3;

  console.log("📊 CommentSection render state:");
  console.log("  - comments:", comments);
  console.log("  - comments.length:", comments.length);
  console.log("  - displayedComments:", displayedComments);
  console.log("  - showAllComments:", showAllComments);
  console.log("  - hasMoreComments:", hasMoreComments);
  console.log("  - loading:", loading);
  console.log("  - isVisible:", isVisible);

  // Enhanced debug for comment structure
  if (comments && comments.length > 0) {
    console.log("🔍 CommentSection - First comment full object:", comments[0]);
    console.log(
      "🔍 CommentSection - First comment keys:",
      Object.keys(comments[0])
    );
    const firstComment = comments[0];
    console.log(
      "🔍 CommentSection - First comment user field:",
      firstComment.user
    );
    console.log(
      "🔍 CommentSection - First comment author field:",
      firstComment.author
    );
    console.log(
      "🔍 CommentSection - First comment content field:",
      firstComment.content
    );
    console.log(
      "🔍 CommentSection - First comment text field:",
      firstComment.text
    );
  }

  const handleAddComment = async (content) => {
    try {
      console.log("📝 CommentSection - Adding comment:", content);
      const newComment = await onAddComment(content);
      console.log("📝 CommentSection - New comment received:", newComment);
      setComments((prev) => [newComment, ...prev]);
    } catch (error) {
      console.error("❌ CommentSection - Failed to add comment:", error);
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
        {loading ? (
          <div className="p-6 text-center">
            <Loader2 className="w-6 h-6 text-gray-400 mx-auto mb-3 animate-spin" />
            <p className="text-gray-500 text-sm">Loading comments...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-3" />
            <p className="text-red-500 text-sm font-medium">
              Failed to load comments
            </p>
            <p className="text-gray-400 text-xs mt-1">{error}</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="p-6 text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No comments yet</p>
            <p className="text-gray-400 text-xs mt-1">
              Be the first to comment!
            </p>
          </div>
        ) : (
          <div className="p-3">
            {displayedComments.map((comment, index) => {
              console.log(`🗨️ Rendering comment ${index}:`, comment);
              return (
                <CommentItem
                  key={comment.id || index}
                  comment={comment}
                  onReply={handleAddReply}
                  onDelete={handleDeleteComment}
                  currentUserId={user?.id || null}
                />
              );
            })}

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
