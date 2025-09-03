import { useState, useCallback } from "react";
import apiClient from "../services/api-client";

const useComments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get auth token from localStorage
  const getAuthHeaders = () => {
    const authTokens = localStorage.getItem("authTokens");
    if (authTokens) {
      const tokens = JSON.parse(authTokens);
      return {
        Authorization: `Bearer ${tokens.access}`,
      };
    }
    return {};
  };

  const fetchComments = useCallback(async (postId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`posts/${postId}/comments/`, {
        headers: getAuthHeaders(),
      });

      return response.data;
    } catch (err) {
      setError(err.message || "Failed to fetch comments");
      console.error("Failed to fetch comments:", err);

      // Return empty array on error to prevent crashes
      return {
        results: [],
        count: 0,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const addComment = useCallback(async (postId, content) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post(
        `posts/${postId}/comments/`,
        { content },
        {
          headers: getAuthHeaders(),
        }
      );

      return response.data;
    } catch (err) {
      setError(err.message || "Failed to add comment");
      console.error("Failed to add comment:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteComment = useCallback(async (postId, commentId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.delete(
        `posts/${postId}/comments/${commentId}/`,
        {
          headers: getAuthHeaders(),
        }
      );

      return response.data;
    } catch (err) {
      setError(err.message || "Failed to delete comment");
      console.error("Failed to delete comment:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addReply = useCallback(async (postId, parentCommentId, content) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post(
        `posts/${postId}/comments/${parentCommentId}/replies/`,
        { content },
        {
          headers: getAuthHeaders(),
        }
      );

      return response.data;
    } catch (err) {
      setError(err.message || "Failed to add reply");
      console.error("Failed to add reply:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchComments,
    addComment,
    deleteComment,
    addReply,
    loading,
    error,
  };
};

export default useComments;
