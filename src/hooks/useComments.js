import { useState, useCallback } from "react";

const useComments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async (postId) => {
    setLoading(true);
    setError(null);

    try {
      // Mock API call - replace with your actual API endpoint
      const response = await fetch(`/api/posts/${postId}/comments`);

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      // Return mock data for development
      return {
        results: [
          {
            id: 1,
            content: "Great post! Thanks for sharing.",
            created_at: new Date(Date.now() - 3600000).toISOString(),
            user: {
              id: 1,
              username: "johndoe",
              full_name: "John Doe",
              profile_picture: null,
            },
            likes_count: 5,
            is_liked: false,
            replies_count: 2,
            replies: [
              {
                id: 101,
                content: "I agree! Really insightful.",
                created_at: new Date(Date.now() - 1800000).toISOString(),
                user: {
                  id: 2,
                  username: "janesmith",
                  full_name: "Jane Smith",
                  profile_picture: null,
                },
                likes_count: 2,
                is_liked: true,
              },
            ],
          },
          {
            id: 2,
            content: "Love this! 😍",
            created_at: new Date(Date.now() - 7200000).toISOString(),
            user: {
              id: 3,
              username: "mikebrown",
              full_name: "Mike Brown",
              profile_picture: null,
            },
            likes_count: 8,
            is_liked: true,
            replies_count: 0,
            replies: [],
          },
        ],
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const addComment = useCallback(async (postId, content) => {
    setLoading(true);
    setError(null);

    try {
      // Mock API call - replace with your actual API endpoint
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      // Return mock data for development
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
        likes_count: 0,
        is_liked: false,
        replies_count: 0,
        replies: [],
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteComment = useCallback(async (postId, commentId) => {
    setLoading(true);
    setError(null);

    try {
      // Mock API call - replace with your actual API endpoint
      const response = await fetch(
        `/api/posts/${postId}/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      return true;
    } catch (err) {
      setError(err.message);
      return true; // Return true for mock
    } finally {
      setLoading(false);
    }
  }, []);

  const addReply = useCallback(async (postId, parentCommentId, content) => {
    setLoading(true);
    setError(null);

    try {
      // Mock API call - replace with your actual API endpoint
      const response = await fetch(
        `/api/posts/${postId}/comments/${parentCommentId}/replies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add reply");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      // Return mock data for development
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
        likes_count: 0,
        is_liked: false,
        parent_id: parentCommentId,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const likeComment = useCallback(async (postId, commentId) => {
    setLoading(true);
    setError(null);

    try {
      // Mock API call - replace with your actual API endpoint
      const response = await fetch(
        `/api/posts/${postId}/comments/${commentId}/like`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to like comment");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      return { is_liked: true, likes_count: 1 }; // Mock response
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchComments,
    addComment,
    deleteComment,
    addReply,
    likeComment,
    loading,
    error,
  };
};

export default useComments;
