import React from "react";
import CommentSection from "./CommentSection";

const CommentTest = () => {
  const mockComments = [
    {
      id: 1,
      content: "This is a great post! Thanks for sharing. 😊",
      created_at: new Date(Date.now() - 3600000).toISOString(),
      user: {
        id: 1,
        username: "johndoe",
        full_name: "John Doe",
        profile_picture: null,
      },
      replies_count: 2,
      replies: [
        {
          id: 101,
          content: "I totally agree with you!",
          created_at: new Date(Date.now() - 1800000).toISOString(),
          user: {
            id: 2,
            username: "janesmith",
            full_name: "Jane Smith",
            profile_picture: null,
          },
        },
        {
          id: 102,
          content: "Same here, very helpful content.",
          created_at: new Date(Date.now() - 900000).toISOString(),
          user: {
            id: 3,
            username: "mikebrown",
            full_name: "Mike Brown",
            profile_picture: null,
          },
        },
      ],
    },
    {
      id: 2,
      content: "Love this! Can't wait to see more content like this.",
      created_at: new Date(Date.now() - 7200000).toISOString(),
      user: {
        id: 4,
        username: "sarahwilson",
        full_name: "Sarah Wilson",
        profile_picture: null,
      },
      replies_count: 0,
      replies: [],
    },
    {
      id: 3,
      content: "Very informative post. Thank you!",
      created_at: new Date(Date.now() - 10800000).toISOString(),
      user: {
        id: 5,
        username: "alexjohnson",
        full_name: "Alex Johnson",
        profile_picture: null,
      },
      replies_count: 1,
      replies: [
        {
          id: 103,
          content: "You're welcome! Glad it helped.",
          created_at: new Date(Date.now() - 5400000).toISOString(),
          user: {
            id: 999,
            username: "currentuser",
            full_name: "Current User",
            profile_picture: null,
          },
        },
      ],
    },
  ];

  const handleAddComment = async (postId, content) => {
    console.log("Adding comment:", { postId, content });
    return {
      id: Date.now(),
      content,
      created_at: new Date().toISOString(),
      user: {
        id: 999,
        username: "currentuser",
        full_name: "Current User",
        profile_picture: null,
      },
      replies_count: 0,
      replies: [],
    };
  };

  const handleDeleteComment = async (postId, commentId) => {
    console.log("Deleting comment:", { postId, commentId });
  };

  const handleAddReply = async (parentCommentId, content) => {
    console.log("Adding reply:", { parentCommentId, content });
    return {
      id: Date.now(),
      content,
      created_at: new Date().toISOString(),
      user: {
        id: 999,
        username: "currentuser",
        full_name: "Current User",
        profile_picture: null,
      },
    };
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Mock Post Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <img
              src="https://ui-avatars.com/api/?name=Demo%20User&background=3b82f6&color=fff&size=40"
              alt="Demo User"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-900">Demo User</h3>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>
        </div>

        {/* Mock Post Content */}
        <div className="p-4">
          <p className="text-gray-800">
            Check out this amazing new comment system! It's clean, modular, and
            works just like Facebook comments. You can reply to comments and see
            the time stamps. 📝✨
          </p>
        </div>

        {/* Comment Section */}
        <CommentSection
          postId="demo-post"
          isVisible={true}
          onClose={() => console.log("Closing comments")}
          initialComments={mockComments}
          commentsCount={mockComments.length}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          onAddReply={handleAddReply}
        />
      </div>

      {/* Usage Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">
          Features Implemented:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✅ Reply to comments</li>
          <li>✅ Time stamps (e.g., "2h", "1m", "now")</li>
          <li>✅ Nested replies</li>
          <li>✅ Delete own comments (hover to see menu)</li>
          <li>✅ Add new comments</li>
          <li>✅ Show/hide replies</li>
          <li>✅ View all comments</li>
          <li>❌ Like functionality removed as requested</li>
        </ul>
      </div>
    </div>
  );
};

export default CommentTest;
