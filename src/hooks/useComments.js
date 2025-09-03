import { useState, useCallback } from "react";
import apiClient from "../services/api-client";

const useComments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get auth token from localStorage
  const getAuthHeaders = () => {
    const authTokens = localStorage.getItem("authTokens");
    console.log("🔑 Raw authTokens from localStorage:", authTokens);

    if (authTokens) {
      try {
        const tokens = JSON.parse(authTokens);
        console.log("🎫 Parsed tokens:", tokens);
        console.log("🔓 Access token:", tokens.access ? "Present" : "Missing");

        return {
          Authorization: `Bearer ${tokens.access}`,
        };
      } catch (error) {
        console.error("❌ Error parsing auth tokens:", error);
        return {};
      }
    }

    console.log("⚠️ No auth tokens found in localStorage");
    return {};
  };

  const fetchComments = useCallback(async (postId) => {
    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Fetching comments for post ID:", postId);
      const headers = getAuthHeaders();
      console.log("📨 Request headers:", headers);

      const response = await apiClient.get(`posts/${postId}/comments/`, {
        headers,
      });

      console.log("✅ Raw API response:", response);
      console.log("📊 Response data:", response.data);
      console.log("📝 Response data type:", typeof response.data);
      console.log("🔢 Array check:", Array.isArray(response.data));
      console.log("📋 Response.data.results:", response.data?.results);
      console.log("📈 Response.data.count:", response.data?.count);

      // Try to handle different response structures
      let commentsData = response.data;

      // If response.data is an object with results array
      if (
        commentsData &&
        typeof commentsData === "object" &&
        commentsData.results
      ) {
        console.log("📦 Using response.data.results");
        return commentsData;
      }

      // If response.data is directly an array
      if (Array.isArray(commentsData)) {
        console.log("📦 Response data is array, wrapping it");
        return {
          results: commentsData,
          count: commentsData.length,
        };
      }

      // Fallback
      console.log("📦 Using fallback structure");
      return commentsData || { results: [], count: 0 };
    } catch (err) {
      console.error("❌ Failed to fetch comments - Error details:", err);
      console.error("❌ Error response:", err.response?.data);
      console.error("❌ Error status:", err.response?.status);
      console.error("❌ Error message:", err.message);

      setError(
        err.response?.data?.detail || err.message || "Failed to fetch comments"
      );

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
