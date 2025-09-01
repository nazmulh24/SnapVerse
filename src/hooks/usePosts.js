import { useState, useCallback } from "react";
import useApi from "./useApi";

const usePosts = () => {
  const {
    fetchPosts,
    likePost,
    unlikePost,
    createComment,
    fetchComments,
    loading,
    error,
    clearError,
  } = useApi();

  const [posts, setPosts] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});

  // Load posts with caching
  const loadPosts = useCallback(
    async (params = {}) => {
      const result = await fetchPosts(params);
      if (result.success) {
        setPosts(result.data.results || result.data || []);
      }
      return result;
    },
    [fetchPosts]
  );

  // Handle like/unlike with optimistic updates
  const handleLike = useCallback(
    async (postId, isLiked) => {
      // Set loading state for this specific post
      setLoadingStates((prev) => ({ ...prev, [postId]: true }));

      // Optimistic update
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            const currentCount = parseInt(post.reactions_count) || 0;
            return {
              ...post,
              is_liked: isLiked,
              reactions_count: (isLiked
                ? currentCount + 1
                : Math.max(0, currentCount - 1)
              ).toString(),
            };
          }
          return post;
        })
      );

      try {
        const result = isLiked
          ? await likePost(postId)
          : await unlikePost(postId);

        if (!result.success) {
          // Revert optimistic update on failure
          setPosts((prevPosts) =>
            prevPosts.map((post) => {
              if (post.id === postId) {
                const currentCount = parseInt(post.reactions_count) || 0;
                return {
                  ...post,
                  is_liked: !isLiked,
                  reactions_count: (!isLiked
                    ? currentCount + 1
                    : Math.max(0, currentCount - 1)
                  ).toString(),
                };
              }
              return post;
            })
          );
          console.error("[usePosts] Like action failed:", result.error);
        }

        return result;
      } finally {
        setLoadingStates((prev) => ({ ...prev, [postId]: false }));
      }
    },
    [likePost, unlikePost]
  );

  // Handle comments
  const handleComment = useCallback(
    async (postId) => {
      console.log("[usePosts] Opening comments for post:", postId);
      // This could open a modal or navigate to a comments page
      // For now, just fetch and log comments
      const result = await fetchComments(postId);
      if (result.success) {
        console.log("[usePosts] Comments for post", postId, ":", result.data);
      }
      return result;
    },
    [fetchComments]
  );

  // Add a comment to a post
  const addComment = useCallback(
    async (postId, commentText) => {
      const result = await createComment(postId, { content: commentText });

      if (result.success) {
        // Update the comments count optimistically
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.id === postId) {
              const currentCount = parseInt(post.comments_count) || 0;
              return {
                ...post,
                comments_count: (currentCount + 1).toString(),
              };
            }
            return post;
          })
        );
      }

      return result;
    },
    [createComment]
  );

  // Handle share
  const handleShare = useCallback(async (postId) => {
    console.log("[usePosts] Sharing post:", postId);
    // Implement share functionality here
    // Could copy link, open share modal, etc.

    // For now, just copy to clipboard if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this post on SnapVerse",
          url: `${window.location.origin}/posts/${postId}`,
        });
      } catch (error) {
        console.error("[usePosts] Share failed:", error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(
          `${window.location.origin}/posts/${postId}`
        );
        console.log("[usePosts] Post link copied to clipboard");
      } catch (error) {
        console.error("[usePosts] Failed to copy to clipboard:", error);
      }
    }
  }, []);

  // Handle menu click (more options)
  const handleMenuClick = useCallback((postId) => {
    console.log("[usePosts] Menu clicked for post:", postId);
    // This could open a dropdown menu with options like:
    // - Edit post (if user owns it)
    // - Delete post (if user owns it)
    // - Report post
    // - Save post
    // - Copy link
    // - Hide post
  }, []);

  // View comments (navigate to comments view)
  const handleViewComments = useCallback((postId) => {
    console.log("[usePosts] Viewing comments for post:", postId);
    // This could navigate to a dedicated comments page
    // or open a comments modal
  }, []);

  // Refresh posts
  const refreshPosts = useCallback(() => {
    clearError();
    return loadPosts();
  }, [loadPosts, clearError]);

  // Get loading state for a specific post
  const isPostLoading = useCallback(
    (postId) => {
      return loadingStates[postId] || false;
    },
    [loadingStates]
  );

  return {
    // Data
    posts,

    // Actions
    loadPosts,
    refreshPosts,
    handleLike,
    handleComment,
    handleShare,
    handleMenuClick,
    handleViewComments,
    addComment,

    // State
    loading,
    error,
    clearError,
    isPostLoading,

    // Utils
    postsCount: posts.length,
  };
};

export default usePosts;
