import { useState, useEffect, useCallback } from "react";
import useAuthContext from "./useAuthContext";
import usePosts from "./usePosts";
import AuthApiClient from "../services/auth-api-client";

// Simple in-memory cache for user profiles
const profileCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const useUserProfile = (username) => {
  const { user: currentUser } = useAuthContext();
  const {
    posts,
    loadPosts,
    loadMyPosts,
    handleLike,
    handleComment,
    handleShare,
    loading,
    hasNextPage,
    loadMorePosts,
  } = usePosts();

  // State
  const [apiResponse, setApiResponse] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileUser, setProfileUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [userSpecificPosts, setUserSpecificPosts] = useState([]);
  const [loadingUserPosts, setLoadingUserPosts] = useState(false);

  // Check if viewing own profile - use username directly
  const isOwnProfile = currentUser?.username === username;

  // Check cache first
  const getCachedProfile = (username) => {
    const cached = profileCache.get(username);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  };

  // Check if current user is following the profile user
  const checkFollowStatus = async (profileUserId) => {
    try {
      console.log("🔍 Checking follow status for user ID:", profileUserId);
      const response = await AuthApiClient.get("/follows/following/");
      const followingList = response.data.results || [];
      console.log(
        "📋 Following list:",
        followingList.map((item) => ({
          id: item.following.id,
          username: item.following.username,
        }))
      );

      const isUserFollowing = followingList.some(
        (item) => item.following.id === profileUserId
      );
      console.log(
        `${isUserFollowing ? "✅" : "❌"} Follow status:`,
        isUserFollowing
      );
      setIsFollowing(isUserFollowing);
      return isUserFollowing; // Return the result for immediate use
    } catch (error) {
      console.error("❌ Failed to check follow status:", error);
      setIsFollowing(false);
      return false;
    }
  };

  // Function to load posts for a user with explicit follow status
  const loadPostsForUserWithStatus = useCallback(
    async (realUserData, followStatus) => {
      console.log("🔍 Loading posts with follow status:", followStatus);
      // Check if user can view private content first
      const canView = isOwnProfile || !realUserData.is_private || followStatus;

      if (!canView) {
        console.log(
          "Cannot view posts for private account - follow status:",
          followStatus
        );
        setUserSpecificPosts([]);
        setLoadingUserPosts(false);
        return;
      }

      // If user profile has posts array with IDs, fetch them in parallel
      if (
        realUserData.posts &&
        Array.isArray(realUserData.posts) &&
        realUserData.posts.length > 0
      ) {
        setLoadingUserPosts(true);
        console.log("📝 Found posts to load:", realUserData.posts.length);

        try {
          const postIds = realUserData.posts.slice(0, 10); // Limit to first 10 posts for performance

          // Fetch all posts in parallel instead of sequentially
          const postPromises = postIds.map(async (postId) => {
            try {
              const response = await AuthApiClient.get(`/posts/${postId}/`);
              return response.data;
            } catch (error) {
              console.warn(`Failed to fetch post ${postId}:`, error);
              return null;
            }
          });

          const fetchedPosts = await Promise.all(postPromises);
          const validPosts = fetchedPosts.filter((post) => post !== null);
          console.log("✅ Successfully loaded posts:", validPosts.length);

          // Filter posts based on privacy levels
          const filteredPosts = validPosts.filter((post) => {
            // If it's the user's own profile, show all posts
            if (isOwnProfile) {
              return true;
            }

            // Check privacy field (new logic)
            if (post.privacy) {
              switch (post.privacy) {
                case "public":
                  return true; // Anyone can see
                case "followers":
                  return followStatus; // Only followers can see
                case "private":
                  return false; // Only owner can see (already handled above)
                default:
                  return true; // Default to public if unknown privacy value
              }
            }

            // Fallback to old is_private field for backwards compatibility
            return !post.is_private;
          });

          console.log("🔒 After privacy filter:", {
            totalPosts: validPosts.length,
            filteredPosts: filteredPosts.length,
            followStatus: followStatus,
            isOwnProfile: isOwnProfile,
            postPrivacyLevels: validPosts.map((p) => ({
              id: p.id,
              privacy: p.privacy || "is_private:" + p.is_private,
            })),
          });

          setUserSpecificPosts(filteredPosts);
        } catch (error) {
          console.error("Error loading posts for user:", error);
          setUserSpecificPosts([]);
        } finally {
          setLoadingUserPosts(false);
        }
      } else {
        console.log("❌ No posts found in user profile");
        setUserSpecificPosts([]);
        setLoadingUserPosts(false);
      }
    },
    [isOwnProfile]
  );

  // Function to load posts for a user
  const loadPostsForUser = useCallback(
    async (realUserData) => {
      // Check if user can view private content first
      const canView = isOwnProfile || !realUserData.is_private || isFollowing;

      if (!canView) {
        console.log("Cannot view posts for private account");
        setUserSpecificPosts([]);
        setLoadingUserPosts(false);
        return;
      }

      // If user profile has posts array with IDs, fetch them in parallel
      if (
        realUserData.posts &&
        Array.isArray(realUserData.posts) &&
        realUserData.posts.length > 0
      ) {
        setLoadingUserPosts(true);

        try {
          const postIds = realUserData.posts.slice(0, 10); // Limit to first 10 posts for performance

          // Fetch all posts in parallel instead of sequentially
          const postPromises = postIds.map(async (postId) => {
            try {
              const response = await AuthApiClient.get(`/posts/${postId}/`);
              return response.data;
            } catch (error) {
              console.warn(`Failed to fetch post ${postId}:`, error);
              return null;
            }
          });

          const fetchedPosts = await Promise.all(postPromises);
          const validPosts = fetchedPosts.filter((post) => post !== null);

          // Filter posts based on privacy levels
          const filteredPosts = validPosts.filter((post) => {
            // If it's the user's own profile, show all posts
            if (isOwnProfile) {
              return true;
            }

            // Check privacy field (new logic)
            if (post.privacy) {
              switch (post.privacy) {
                case "public":
                  return true; // Anyone can see
                case "followers":
                  return isFollowing; // Only followers can see
                case "private":
                  return false; // Only owner can see (already handled above)
                default:
                  return true; // Default to public if unknown privacy value
              }
            }

            // Fallback to old is_private field for backwards compatibility
            return !post.is_private;
          });

          setUserSpecificPosts(filteredPosts);
        } catch (error) {
          console.error("Error loading posts for user:", error);
          setUserSpecificPosts([]);
        } finally {
          setLoadingUserPosts(false);
        }
      } else {
        setUserSpecificPosts([]);
        setLoadingUserPosts(false);
      }
    },
    [isOwnProfile, isFollowing]
  );

  // Load user profile and posts
  useEffect(() => {
    const loadUserData = async () => {
      if (!username) {
        return;
      }

      console.log("Username:", username);
      console.log("Username type:", typeof username);
      console.log("Username encoded:", encodeURIComponent(username));

      // Check cache first for faster loading
      const cachedProfile = getCachedProfile(username);
      if (cachedProfile) {
        console.log(`📋 Using cached profile for: ${username}`);
        setApiResponse(cachedProfile.data);
        setApiError(null);
        setIsLoadingProfile(false);
        return;
      }

      try {
        setIsLoadingProfile(true);
        setApiError(null);

        console.log(`🔍 Fetching user profile for: ${username}`);

        // Make API call to get user profile - username should be used as-is
        const apiEndpoint = `/users/${username}/`;
        console.log(`🌐 API endpoint: ${apiEndpoint}`);
        const response = await AuthApiClient.get(apiEndpoint);

        if (response.data) {
          const realUserData = response.data;
          console.log(`✅ Successfully found user data for: ${username}`);

          // Cache the profile data
          profileCache.set(username, {
            data: realUserData,
            timestamp: Date.now(),
          });

          // Check follow status BEFORE setting profile data for other users
          let followStatus = false;
          if (!isOwnProfile && currentUser) {
            followStatus = await checkFollowStatus(realUserData.id);
          }

          setApiResponse(realUserData);
          setProfileUser(realUserData);
          setFollowersCount(realUserData.followers_count || 0);
          setApiError(null);

          // Debug the user data structure
          console.log("👤 Profile User Data:", {
            username: realUserData.username,
            isPrivate: realUserData.is_private,
            postsArray: realUserData.posts,
            postsLength: realUserData.posts?.length,
            allFields: Object.keys(realUserData),
          });

          // Load posts for this user after profile is set
          if (isOwnProfile) {
            const result = await loadMyPosts({}, { pageSize: 10 });
            if (!result.success) {
              console.error(
                "[UserProfile] Failed to load posts:",
                result.error
              );
            }
          } else {
            // For other users, load posts now that follow status is determined
            // Pass the follow status directly instead of relying on state
            await loadPostsForUserWithStatus(realUserData, followStatus);
          }
        }
      } catch (error) {
        console.error("[UserProfile] Error loading user profile:", error);
        console.error("[UserProfile] Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url,
        });

        // Handle specific error cases with user-friendly messages
        let errorMessage = "Error loading profile";
        if (error.response?.status === 404) {
          errorMessage = `Username "${username}" is not valid or does not exist`;
        } else if (error.response?.status === 403) {
          errorMessage = "You don't have permission to view this profile";
        } else if (error.response?.status >= 500) {
          errorMessage = "Server error. Please try again later";
        } else if (error.message?.includes("Network Error")) {
          errorMessage = "Network error. Please check your connection";
        } else {
          errorMessage = `Error: ${error.message}`;
        }

        setApiError(errorMessage);
        setProfileUser(null);
        setApiResponse(null);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadUserData();
  }, [
    username,
    currentUser,
    isOwnProfile,
    loadMyPosts,
    loadPosts,
    loadPostsForUser,
    loadPostsForUserWithStatus,
  ]);

  // Return filtered posts - use userSpecificPosts if available, otherwise filter general posts
  const userPosts =
    userSpecificPosts.length > 0
      ? userSpecificPosts
      : posts?.filter((post) => {
          // Always filter to only show posts from the profile user
          const isUserPost =
            post.author?.id === profileUser?.id ||
            post.author?.username === profileUser?.username ||
            post.user?.id === profileUser?.id ||
            post.user?.username === profileUser?.username ||
            (profileUser?.posts &&
              Array.isArray(profileUser.posts) &&
              profileUser.posts.includes(post.id));

          // Also filter posts based on privacy levels
          let canViewPost = false;
          if (isOwnProfile) {
            canViewPost = true; // Owner can see all posts
          } else if (post.privacy) {
            // Use new privacy field
            switch (post.privacy) {
              case "public":
                canViewPost = true;
                break;
              case "followers":
                canViewPost = isFollowing;
                break;
              case "private":
                canViewPost = false;
                break;
              default:
                canViewPost = true; // Default to public
            }
          } else {
            // Fallback to old is_private field
            canViewPost = !post.is_private;
          }

          return isUserPost && canViewPost;
        }) || [];

  const handleFollow = async () => {
    try {
      setIsFollowing(!isFollowing);
      setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  return {
    // Data
    profileUser,
    userPosts,
    apiResponse,
    apiError,
    userSpecificPosts,
    followersCount,
    isFollowing,
    isOwnProfile,

    // Loading states
    isLoadingProfile,
    loading,
    loadingUserPosts,
    hasNextPage,

    // Actions
    handleLike,
    handleComment,
    handleShare,
    handleFollow,
    loadMorePosts,
  };
};

export default useUserProfile;
