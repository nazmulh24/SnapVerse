import { useState, useCallback } from "react";
import apiClient from "../services/api-client";

const useReactions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    // Try both token storage methods
    const tokensRaw = localStorage.getItem("authTokens");
    const directToken = localStorage.getItem("access_token");

    let access = null;

    if (tokensRaw) {
      try {
        access = JSON.parse(tokensRaw)?.access;
      } catch {
        console.warn("[useReactions] Failed to parse authTokens");
      }
    }

    // Fallback to direct token
    if (!access && directToken) {
      access = directToken;
    }

    console.log("[useReactions] Token found:", !!access);
    return access ? { Authorization: `JWT ${access}` } : {};
  };

  // Get reactions for a specific post
  const fetchReactions = useCallback(async (postId) => {
    setLoading(true);
    setError(null);

    console.log(`[useReactions] Fetching reactions for post ${postId}`);

    try {
      const headers = getAuthHeaders();
      console.log(`[useReactions] Request headers:`, headers);

      const response = await apiClient.get(`/posts/${postId}/reactions/`, {
        headers,
      });

      console.log(`[useReactions] ✅ Fetch reactions success:`, response.data);

      return {
        success: true,
        data: response.data,
      };
    } catch (err) {
      console.error("[useReactions] ❌ Error fetching reactions:", err);
      console.error("[useReactions] Error response:", err.response?.data);
      console.error("[useReactions] Error status:", err.response?.status);

      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch reactions";

      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Add or update a reaction
  const addReaction = useCallback(async (postId, reactionType) => {
    setLoading(true);
    setError(null);

    console.log(
      `[useReactions] Adding reaction: ${reactionType} to post ${postId}`
    );

    try {
      const headers = getAuthHeaders();
      console.log(`[useReactions] Request headers:`, headers);

      // Try primary payload format first
      let payload = { reaction_type: reactionType };
      console.log(`[useReactions] Request payload:`, payload);

      let response;
      try {
        response = await apiClient.post(`/posts/${postId}/react/`, payload, {
          headers,
        });
      } catch (firstError) {
        // If reaction_type fails (expected 400 error), try with just 'reaction'
        if (firstError.response?.status === 400) {
          console.log(`[useReactions] Using fallback payload format`);
          payload = { reaction: reactionType };

          response = await apiClient.post(`/posts/${postId}/react/`, payload, {
            headers,
          });
        } else {
          // Re-throw unexpected errors
          throw firstError;
        }
      }

      console.log(`[useReactions] ✅ Add reaction success:`, response.data);

      return {
        success: true,
        data: response.data,
      };
    } catch (err) {
      console.error("[useReactions] ❌ Error adding reaction:", err);
      console.error("[useReactions] Error response:", err.response?.data);
      console.error("[useReactions] Error status:", err.response?.status);
      console.error("[useReactions] Full error response:", err.response);
      console.error("[useReactions] Request config:", err.config);

      // Log the exact validation errors if available
      if (err.response?.data) {
        console.error(
          "[useReactions] Detailed errors:",
          JSON.stringify(err.response.data, null, 2)
        );
      }

      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Failed to add reaction";

      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove a reaction
  const removeReaction = useCallback(async (postId) => {
    setLoading(true);
    setError(null);

    console.log(`[useReactions] Removing reaction from post ${postId}`);

    try {
      const headers = getAuthHeaders();
      console.log(`[useReactions] Request headers:`, headers);

      const response = await apiClient.delete(`/posts/${postId}/react/`, {
        headers,
      });

      console.log(`[useReactions] ✅ Remove reaction success:`, response.data);

      return {
        success: true,
        data: response.data,
      };
    } catch (err) {
      console.error("[useReactions] ❌ Error removing reaction:", err);
      console.error("[useReactions] Error response:", err.response?.data);
      console.error("[useReactions] Error status:", err.response?.status);

      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Failed to remove reaction";

      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
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
