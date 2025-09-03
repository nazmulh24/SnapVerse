import React, { useState } from "react";
import CommentSection from "./CommentSection";
import useComments from "../../hooks/useComments";

const CommentDemo = () => {
  const [showComments, setShowComments] = useState(true);
  const [comments, setComments] = useState([]);
  const { addComment, deleteComment, addReply } = useComments();

  // Mock post data
  const mockPost = {
    id: 1,
    content: "Just built an amazing comment system! 🚀",
    user: {
      full_name: "John Doe",
      username: "johndoe",
      profile_picture: null,
    },
    created_at: new Date().toISOString(),
    comments_count: 5,
  };

  const handleAddComment = async (postId, content) => {
    try {
      const newComment = await addComment(postId, content);
      setComments((prev) => [newComment, ...prev]);
      return newComment;
    } catch (error) {
      console.error("Failed to add comment:", error);
      throw error;
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await deleteComment(postId, commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
      throw error;
    }
  };

  const handleAddReply = async (parentCommentId, content) => {
    try {
      const newReply = await addReply(mockPost.id, parentCommentId, content);
      setComments((prev) => [...prev, newReply]);
      return newReply;
    } catch (error) {
      console.error("Failed to add reply:", error);
      throw error;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Mock Post Header */}
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              mockPost.user.full_name
            )}&background=random&color=fff&size=40`}
            alt={mockPost.user.full_name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">
              {mockPost.user.full_name}
            </h3>
            <p className="text-sm text-gray-500">@{mockPost.user.username}</p>
          </div>
        </div>
        <p className="mt-3 text-gray-800">{mockPost.content}</p>
      </div>

      {/* Mock Post Actions */}
      <div className="px-4 pb-4">
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-blue-500 hover:text-blue-600 font-medium text-sm"
        >
          {showComments ? "Hide Comments" : "Show Comments"}
        </button>
      </div>

      {/* Comment Section */}
      <CommentSection
        postId={mockPost.id}
        isVisible={showComments}
        onClose={() => setShowComments(false)}
        initialComments={comments}
        commentsCount={mockPost.comments_count}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        onAddReply={handleAddReply}
      />
    </div>
  );
};

export default CommentDemo;
