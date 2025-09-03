import { useState, useCallback, useContext } from "react";
import apiClient from "../services/api-client";
import AuthContext from "../context/AuthContext";

const useComments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user: currentUser } = useContext(AuthContext);

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
          Authorization: `JWT ${tokens.access}`,
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

  const addComment = useCallback(
    async (postId, content) => {
      setLoading(true);
      setError(null);

      try {
        console.log("📝 Adding comment to post ID:", postId);
        console.log("📝 Comment content:", content);

        const headers = getAuthHeaders();
        console.log("📨 Request headers:", headers);

        // Prepare the data payload - Django API expects 'text' field
        const payload = { text: content };
        console.log("📦 Request payload:", payload);

        const response = await apiClient.post(
          `posts/${postId}/comments/`,
          payload,
          { headers }
        );

        console.log("✅ Add comment API response:", response);
        console.log("📊 Add comment response data:", response.data);
        console.log("📝 Add comment response type:", typeof response.data);

        // Create a standardized comment object that works with our UI
        let newComment = response.data;

        // If the API returns a string for the user field, convert it to our expected object format
        if (
          typeof newComment.user === "string" ||
          typeof newComment.author === "string"
        ) {
          const userName =
            newComment.user || newComment.author || "Unknown User";
          newComment = {
            ...newComment,
            user: {
              id: currentUser?.id || 0,
              full_name: currentUser?.full_name || userName,
              username:
                currentUser?.username ||
                userName.toLowerCase().replace(/\s+/g, "_"),
              profile_picture: currentUser?.profile_picture || null,
            },
          };
        } else if (
          newComment.user &&
          !newComment.user.profile_picture &&
          currentUser?.profile_picture
        ) {
          // If user object exists but missing profile picture, add it from current user
          newComment.user.profile_picture = currentUser.profile_picture;
        }

        console.log("🆕 Processed new comment:", newComment);
        return newComment;
      } catch (err) {
        console.error("❌ Failed to add comment:", err);
        console.error("❌ Error response:", err.response?.data);
        console.error("❌ Error status:", err.response?.status);
        console.error("❌ Error message:", err.message);

        setError(
          err.response?.data?.detail || err.message || "Failed to add comment"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

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

  const addReply = useCallback(
    async (postId, parentCommentId, content) => {
      setLoading(true);
      setError(null);

      try {
        console.log("💬 Adding reply to comment ID:", parentCommentId);
        console.log("💬 Post ID:", postId);
        console.log("💬 Reply content:", content);

        const headers = getAuthHeaders();
        console.log("📨 Request headers:", headers);

        // For replies, use the same endpoint but include parent_comment field
        const payload = {
          text: content,
          parent_comment: parentCommentId,
        };
        console.log("📦 Reply payload:", payload);

        const response = await apiClient.post(
          `posts/${postId}/comments/`,
          payload,
          { headers }
        );

        console.log("✅ Add reply API response:", response);
        console.log("📊 Add reply response data:", response.data);

        // Create a standardized reply object
        let newReply = response.data;

        // If the API returns a string for the user field, convert it to our expected object format
        if (
          typeof newReply.user === "string" ||
          typeof newReply.author === "string"
        ) {
          const userName = newReply.user || newReply.author || "Unknown User";
          newReply = {
            ...newReply,
            user: {
              id: currentUser?.id || 0,
              full_name: currentUser?.full_name || userName,
              username:
                currentUser?.username ||
                userName.toLowerCase().replace(/\s+/g, "_"),
              profile_picture: currentUser?.profile_picture || null,
            },
          };
        } else if (
          newReply.user &&
          !newReply.user.profile_picture &&
          currentUser?.profile_picture
        ) {
          // If user object exists but missing profile picture, add it from current user
          newReply.user.profile_picture = currentUser.profile_picture;
        }

        console.log("🆕 Processed new reply:", newReply);
        return newReply;
      } catch (err) {
        console.error("❌ Failed to add reply:", err);
        console.error("❌ Error response:", err.response?.data);
        console.error("❌ Error status:", err.response?.status);
        console.error("❌ Error message:", err.message);

        setError(
          err.response?.data?.detail || err.message || "Failed to add reply"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

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
