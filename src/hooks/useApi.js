import { useState, useCallback } from "react";
import apiClient from "../services/api-client";
import useAuthContext from "./useAuthContext";

const useApi = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get authentication headers
  const getAuthHeaders = useCallback(() => {
    const authTokens = localStorage.getItem("authTokens");
    if (authTokens) {
      try {
        const tokens = JSON.parse(authTokens);
        return {
          Authorization: `JWT ${tokens.access}`,
          "Content-Type": "application/json",
        };
      } catch (error) {
        console.error("[useApi] Error parsing auth tokens:", error);
        return {};
      }
    }
    return {};
  }, []);

  // Generic API call function
  const apiCall = useCallback(
    async (method, endpoint, data = null, config = {}) => {
      try {
        setLoading(true);
        setError(null);

        const headers = {
          ...getAuthHeaders(),
          ...config.headers,
        };

        const requestConfig = {
          ...config,
          headers,
        };

        let response;
        switch (method.toLowerCase()) {
          case "get":
            response = await apiClient.get(endpoint, requestConfig);
            break;
          case "post":
            response = await apiClient.post(endpoint, data, requestConfig);
            break;
          case "put":
            response = await apiClient.put(endpoint, data, requestConfig);
            break;
          case "patch":
            response = await apiClient.patch(endpoint, data, requestConfig);
            break;
          case "delete":
            response = await apiClient.delete(endpoint, requestConfig);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }

        return {
          success: true,
          data: response.data,
          status: response.status,
        };
      } catch (error) {
        console.error(
          `[useApi] ${method.toUpperCase()} ${endpoint} error:`,
          error
        );

        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Something went wrong";

        const errorResult = {
          success: false,
          error: errorMessage,
          status: error.response?.status,
          data: error.response?.data,
        };

        setError(errorResult);
        return errorResult;
      } finally {
        setLoading(false);
      }
    },
    [getAuthHeaders]
  );

  // Specific methods for common operations
  const get = useCallback(
    (endpoint, config = {}) => apiCall("get", endpoint, null, config),
    [apiCall]
  );

  const post = useCallback(
    (endpoint, data, config = {}) => apiCall("post", endpoint, data, config),
    [apiCall]
  );

  const put = useCallback(
    (endpoint, data, config = {}) => apiCall("put", endpoint, data, config),
    [apiCall]
  );

  const patch = useCallback(
    (endpoint, data, config = {}) => apiCall("patch", endpoint, data, config),
    [apiCall]
  );

  const del = useCallback(
    (endpoint, config = {}) => apiCall("delete", endpoint, null, config),
    [apiCall]
  );

  // Posts specific methods
  const fetchPosts = useCallback(
    async (params = {}) => {
      console.log(
        "[useApi] Fetching posts for user:",
        user?.username || "anonymous"
      );

      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/posts/${queryString ? `?${queryString}` : ""}`;

      const result = await get(endpoint);

      if (result.success) {
        const posts = result.data.results || result.data || [];
        console.log(`[useApi] Loaded ${posts.length} posts`);

        if (posts.length > 0) {
          console.log("[useApi] First post structure:", posts[0]);
        }
      }

      return result;
    },
    [get, user?.username]
  );

  const fetchMyPosts = useCallback(
    async (params = {}) => {
      console.log(
        "[useApi] Fetching my posts for user:",
        user?.username || "anonymous"
      );

      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/posts/my_posts/${
        queryString ? `?${queryString}` : ""
      }`;

      const result = await get(endpoint);

      if (result.success) {
        const posts = result.data.results || result.data || [];
        console.log(`[useApi] Loaded ${posts.length} my posts`);

        if (posts.length > 0) {
          console.log("[useApi] First my post structure:", posts[0]);
        }
      }

      return result;
    },
    [get, user?.username]
  );

  const createPost = useCallback(
    async (postData) => {
      console.log("[useApi] Creating post:", postData);
      return await post("/posts/", postData);
    },
    [post]
  );

  const updatePost = useCallback(
    async (postId, postData) => {
      console.log("[useApi] Updating post:", postId, postData);
      return await put(`/posts/${postId}/`, postData);
    },
    [put]
  );

  const deletePost = useCallback(
    async (postId) => {
      console.log("[useApi] Deleting post:", postId);
      return await del(`/posts/${postId}/`);
    },
    [del]
  );

  const likePost = useCallback(
    async (postId) => {
      console.log("[useApi] Liking post:", postId);
      return await post(`/posts/${postId}/like/`);
    },
    [post]
  );

  const unlikePost = useCallback(
    async (postId) => {
      console.log("[useApi] Unliking post:", postId);
      return await del(`/posts/${postId}/like/`);
    },
    [del]
  );

  // Comments methods
  const fetchComments = useCallback(
    async (postId) => {
      return await get(`/posts/${postId}/comments/`);
    },
    [get]
  );

  const createComment = useCallback(
    async (postId, commentData) => {
      return await post(`/posts/${postId}/comments/`, commentData);
    },
    [post]
  );

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Generic methods
    get,
    post,
    put,
    patch,
    del: del,
    apiCall,
    getAuthHeaders,

    // Posts methods
    fetchPosts,
    fetchMyPosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost,

    // Comments methods
    fetchComments,
    createComment,

    // State
    loading,
    error,
    clearError,

    // Utils
    isAuthenticated: !!user,
    currentUser: user,
  };
};

export default useApi;
