import { useState, useEffect } from "react";
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

  // Load user profile and posts
  useEffect(() => {
    const loadUserData = async () => {
      if (!username) {
        return;
      }

      console.log('Username:', username);

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
        
        // Make API call to get user profile
        const apiEndpoint = `/users/${username}/`;
        const response = await AuthApiClient.get(apiEndpoint);
        
        if (response.data) {
          const realUserData = response.data;
          console.log(`✅ Successfully found user data for: ${username}`);
          
          // Cache the profile data
          profileCache.set(username, {
            data: realUserData,
            timestamp: Date.now()
          });
          
          setApiResponse(realUserData);
          setProfileUser(realUserData);
          setFollowersCount(realUserData.followers_count || 0);
          setApiError(null);

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
            await loadPostsForUser(realUserData);
          }
        }
      } catch (error) {
        console.error("[UserProfile] Error loading user profile:", error);
        setApiError(`Error: ${error.message}`);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    const loadPostsForUser = async (realUserData) => {
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
          const validPosts = fetchedPosts.filter(post => post !== null);

          if (validPosts.length > 0) {
            setUserSpecificPosts(validPosts);
          }
        } catch (error) {
          console.error("Error fetching user posts:", error);
        } finally {
          setLoadingUserPosts(false);
        }
      }
    };

    loadUserData();
  }, [username, currentUser, isOwnProfile, loadMyPosts, loadPosts]);

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

          return isUserPost;
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
