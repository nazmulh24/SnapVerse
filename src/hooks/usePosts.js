import { useState, useCallback, useRef } from "react";
import useApi from "./useApi";

const usePosts = () => {
  const {
    fetchPosts,
    fetchMyPosts,
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

  // Infinite scrolling states
  const [hasNextPage, setHasNextPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refs for pagination tracking
  const abortControllerRef = useRef(null);
  const lastFetchedPageRef = useRef(0);

  // Shuffle array utility function
  const shuffleArray = useCallback((array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Load posts with pagination support
  const loadPosts = useCallback(
    async (params = {}, options = {}) => {
      const {
        page = 1,
        append = false,
        shuffle = false,
        pageSize = 20,
      } = options;

      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      try {
        if (!append) {
          setIsRefreshing(true);
        } else {
          setIsLoadingMore(true);
        }

        const queryParams = {
          page,
          page_size: pageSize,
          ...params,
        };

        const result = await fetchPosts(queryParams);

        if (result.success && result.data) {
          const newPosts = result.data.results || result.data || [];
          const count = result.data.count || newPosts.length;
          const nextPage = result.data.next;

          console.log(
            `[usePosts] Loaded ${newPosts.length} posts for page ${page}`
          );
          console.log(
            `[usePosts] Total count: ${count}, Has next: ${!!nextPage}`
          );

          // Debug: Log first post's reaction data
          if (newPosts.length > 0) {
            console.log("[usePosts] Sample post reaction data:", {
              post_id: newPosts[0].id,
              reactions_count: newPosts[0].reactions_count,
              reactions: newPosts[0].reactions,
              user_reaction: newPosts[0].user_reaction,
            });
          }

          let processedPosts = newPosts;

          // Shuffle posts if requested (usually on refresh)
          if (shuffle && processedPosts.length > 0) {
            processedPosts = shuffleArray(processedPosts);
            console.log("[usePosts] Posts shuffled");
          }

          setPosts((prevPosts) => {
            if (append && page > 1) {
              // Append new posts for infinite scroll
              const existingIds = new Set(prevPosts.map((post) => post.id));
              const uniqueNewPosts = processedPosts.filter(
                (post) => !existingIds.has(post.id)
              );
              return [...prevPosts, ...uniqueNewPosts];
            } else {
              // Replace posts for initial load or refresh
              return processedPosts;
            }
          });

          setCurrentPage(page);
          setTotalCount(count);
          setHasNextPage(!!nextPage && newPosts.length === pageSize);
          lastFetchedPageRef.current = page;

          clearError();
        }

        return result;
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("[usePosts] Error loading posts:", error);
        }
        return { success: false, error: error.message };
      } finally {
        setIsLoadingMore(false);
        setIsRefreshing(false);
        abortControllerRef.current = null;
      }
    },
    [fetchPosts, clearError, shuffleArray]
  );

  // Load more posts for infinite scrolling
  const loadMorePosts = useCallback(
    async (params = {}) => {
      if (isLoadingMore || !hasNextPage || loading) {
        return;
      }

      const nextPage = currentPage + 1;
      console.log(
        `[usePosts] Loading more posts - page ${nextPage} with params:`,
        params
      );

      return await loadPosts(params, {
        page: nextPage,
        append: true,
      });
    },
    [currentPage, hasNextPage, isLoadingMore, loading, loadPosts]
  );

  // Refresh posts with shuffle
  const refreshPosts = useCallback(
    async (params = {}, shouldShuffle = true) => {
      // If params is a boolean (for backward compatibility), treat it as shouldShuffle
      if (typeof params === "boolean") {
        shouldShuffle = params;
        params = {};
      }

      console.log(
        "[usePosts] Refreshing posts with params:",
        params,
        "shuffle:",
        shouldShuffle
      );
      setCurrentPage(1);
      setHasNextPage(true);
      lastFetchedPageRef.current = 0;

      return await loadPosts(params, {
        page: 1,
        append: false,
        shuffle: shouldShuffle,
      });
    },
    [loadPosts]
  );

  // Initial load on mount
  const initializePosts = useCallback(async () => {
    return await loadPosts(
      {},
      {
        page: 1,
        append: false,
        shuffle: true,
      }
    );
  }, [loadPosts]);

  // Handle like/unlike with optimistic updates and reaction data
  const handleLike = useCallback(
    async (postId, isLiked, reactionData = null) => {
      // Set loading state for this specific post
      setLoadingStates((prev) => ({ ...prev, [postId]: true }));

      // If we have detailed reaction data from the new system, use it
      if (reactionData) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                reactions: reactionData.reactions || post.reactions || {},
                user_reaction: reactionData.userReaction || null,
                reactions_count:
                  reactionData.totalReactions?.toString() ||
                  post.reactions_count,
                is_liked: reactionData.userReaction === "like",
              };
            }
            return post;
          })
        );

        // Clear loading state and return success
        setLoadingStates((prev) => ({ ...prev, [postId]: false }));
        return { success: true };
      }

      // Legacy like system - optimistic update
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

  // Get loading state for a specific post
  const isPostLoading = useCallback(
    (postId) => {
      return loadingStates[postId] || false;
    },
    [loadingStates]
  );

  // Load user's own posts specifically
  const loadMyPosts = useCallback(
    async (params = {}, options = {}) => {
      const { page = 1, append = false, pageSize = 20 } = options;

      console.log(`[usePosts] Loading my posts - page ${page}`);

      try {
        setIsLoadingMore(page > 1);
        if (page === 1 && !append) {
          setIsRefreshing(true);
        }

        const requestParams = {
          page,
          page_size: pageSize,
          ...params,
        };

        const result = await fetchMyPosts(requestParams);

        if (result.success) {
          const { results = [], count = 0, next: nextPage } = result.data || {};

          const newPosts = Array.isArray(results) ? results : [];
          console.log(`[usePosts] Loaded ${newPosts.length} my posts`);

          setPosts((prevPosts) => {
            if (append && page > 1) {
              // Filter out duplicates before appending
              const existingIds = new Set(prevPosts.map((post) => post.id));
              const uniqueNewPosts = newPosts.filter(
                (post) => !existingIds.has(post.id)
              );
              return [...prevPosts, ...uniqueNewPosts];
            } else {
              // Replace posts for initial load or refresh
              return newPosts;
            }
          });

          setCurrentPage(page);
          setTotalCount(count);
          setHasNextPage(!!nextPage && newPosts.length === pageSize);
          lastFetchedPageRef.current = page;

          clearError();
        }

        return result;
      } catch (error) {
        console.error("[usePosts] Error loading my posts:", error);
        return { success: false, error: error.message };
      } finally {
        setIsLoadingMore(false);
        setIsRefreshing(false);
      }
    },
    [fetchMyPosts, clearError]
  );

  return {
    // Data
    posts,

    // Actions
    loadPosts,
    loadMyPosts,
    loadMorePosts,
    refreshPosts,
    initializePosts,
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

    // Infinite scroll states
    hasNextPage,
    currentPage,
    isLoadingMore,
    totalCount,
    isRefreshing,

    // Utils
    postsCount: posts.length,
  };
};

export default usePosts;
