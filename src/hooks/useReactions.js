import { useState, useCallback } from "react";
import apiClient from "../services/api-client";

const useReactions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const tokensRaw = localStorage.getItem("authTokens");
    const access = tokensRaw ? JSON.parse(tokensRaw)?.access : null;
    return access ? { Authorization: `JWT ${access}` } : {};
  };

  // Get reactions for a specific post
  const fetchReactions = useCallback(async (postId) => {
    setLoading(true);
    setError(null);

    try {
      const headers = getAuthHeaders();
      const response = await apiClient.get(`/posts/${postId}/reactions/`, {
        headers,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (err) {
      console.error("[useReactions] Error fetching reactions:", err);
      setError(err.response?.data?.message || "Failed to fetch reactions");
      return {
        success: false,
        error: err.response?.data?.message || "Failed to fetch reactions",
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Add or update a reaction
  const addReaction = useCallback(async (postId, reactionType) => {
    setLoading(true);
    setError(null);

    try {
      const headers = getAuthHeaders();
      const response = await apiClient.post(
        `/posts/${postId}/react/`,
        { reaction_type: reactionType },
        { headers }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (err) {
      console.error("[useReactions] Error adding reaction:", err);
      setError(err.response?.data?.message || "Failed to add reaction");
      return {
        success: false,
        error: err.response?.data?.message || "Failed to add reaction",
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove a reaction
  const removeReaction = useCallback(async (postId) => {
    setLoading(true);
    setError(null);

    try {
      const headers = getAuthHeaders();
      const response = await apiClient.delete(`/posts/${postId}/react/`, {
        headers,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (err) {
      console.error("[useReactions] Error removing reaction:", err);
      setError(err.response?.data?.message || "Failed to remove reaction");
      return {
        success: false,
        error: err.response?.data?.message || "Failed to remove reaction",
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchReactions,
    addReaction,
    removeReaction,
  };
};

export default useReactions;
