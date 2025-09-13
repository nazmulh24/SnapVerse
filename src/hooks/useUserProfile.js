import { useState, useEffect, useCallback } from "react";
import useAuthContext from "./useAuthContext";
import usePosts from "./usePosts";
import AuthApiClient from "../services/auth-api-client";

const useUserProfile = (username) => {
  const { user: currentUser } = useAuthContext();
  const {
    posts,
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
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [hasRequestPending, setHasRequestPending] = useState(false);

  // Check if viewing own profile - use username directly
  const isOwnProfile = currentUser?.username === username;

  // Check if current user is following the profile user
  const checkFollowStatus = useCallback(async (profileUserId) => {
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
  }, []);

  // Check if there's a pending follow request for private accounts
  const checkPendingRequestStatus = useCallback(async (profileUserId) => {
    try {
      console.log(
        "🔍 Checking pending request status for user ID:",
        profileUserId
      );

      // Check localStorage for pending requests (similar to useConnectionsApi)
      const LS_KEY = "snapverse_follow_requests";
      const rawMap = localStorage.getItem(LS_KEY);
      const requestMap = rawMap ? JSON.parse(rawMap) : {};

      const hasPendingRequest = Object.keys(requestMap).includes(
        String(profileUserId)
      );

      if (hasPendingRequest) {
        console.log("✅ Found pending request in localStorage");
        setHasRequestPending(true);
        return true;
      }

      // Also check server-side pending requests
      const response = await AuthApiClient.get("/follows/pending_requests/");
      const pendingList = response.data.results || [];
      console.log("📋 Pending requests list:", pendingList);

      const hasPendingServerRequest = pendingList.some(
        (item) =>
          item.following?.id === profileUserId ||
          item.follower?.id === profileUserId
      );

      console.log(
        `${hasPendingServerRequest ? "✅" : "❌"} Pending request status:`,
        hasPendingServerRequest
      );
      setHasRequestPending(hasPendingServerRequest);
      return hasPendingServerRequest;
    } catch (error) {
      console.error("❌ Failed to check pending request status:", error);
      setHasRequestPending(false);
      return false;
    }
  }, []);

  // Function to load posts for a user with explicit follow status
  const loadPostsForUserWithStatus = useCallback(
    async (realUserData, followStatus) => {
      console.log("🔍 Loading posts with follow status:", followStatus);

      // Check if current user is admin
      const isAdmin = currentUser && currentUser.is_staff === true;

      // Check if user can view private content first
      const canView =
        isOwnProfile || !realUserData.is_private || followStatus || isAdmin;

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
            const isAdmin = currentUser && currentUser.is_staff === true;

            // If it's the user's own profile or admin, show all posts
            if (isOwnProfile || isAdmin) {
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
            isAdmin: currentUser && currentUser.is_staff === true,
            currentUserIsStaff: currentUser?.is_staff,
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
    [isOwnProfile, currentUser]
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

      try {
        setIsLoadingProfile(true);
        setApiError(null);
        // Reset follow status to prevent stale data
        setIsFollowing(false);
        setUserSpecificPosts([]);

        console.log(`🔍 Fetching user profile for: ${username}`);

        // Make API call to get user profile - username should be used as-is
        const apiEndpoint = `/users/${username}/`;
        console.log(`🌐 API endpoint: ${apiEndpoint}`);
        const response = await AuthApiClient.get(apiEndpoint);

        if (response.data) {
          const realUserData = response.data;
          console.log(`✅ Successfully found user data for: ${username}`);

          // Check follow status BEFORE setting profile data for other users
          let followStatus = false;
          if (!isOwnProfile && currentUser) {
            followStatus = await checkFollowStatus(realUserData.id);
            await checkPendingRequestStatus(realUserData.id);
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
    loadPostsForUserWithStatus,
    checkFollowStatus,
    checkPendingRequestStatus,
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
          const isAdmin = currentUser && currentUser.is_staff === true;

          if (isOwnProfile || isAdmin) {
            canViewPost = true; // Owner and admin can see all posts
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
    if (!profileUser || isOwnProfile || isFollowLoading) return;

    const wasFollowing = isFollowing; // Store original state
    const hadRequestPending = hasRequestPending; // Store original request state
    const isPrivateAccount = profileUser.is_private;

    setIsFollowLoading(true); // Start loading

    try {
      console.log(`🔄 ${isFollowing ? "Unfollowing" : "Following"} user:`, {
        userId: profileUser.id,
        username: profileUser.username,
        currentStatus: isFollowing,
        isPrivate: isPrivateAccount,
        hadRequestPending,
      });

      if (isFollowing) {
        // UNFOLLOW: Always works the same way for public/private
        setIsFollowing(false);
        setFollowersCount((prev) => prev - 1);

        await AuthApiClient.post("/follows/unfollow_user/", {
          user_id: profileUser.id,
        });
        console.log("✅ Successfully unfollowed user");

        // Clear any pending request state
        setHasRequestPending(false);
      } else if (hasRequestPending) {
        // CANCEL REQUEST: User wants to cancel pending follow request
        setHasRequestPending(false);

        // Remove from localStorage
        const LS_KEY = "snapverse_follow_requests";
        const rawMap = localStorage.getItem(LS_KEY);
        const requestMap = rawMap ? JSON.parse(rawMap) : {};
        delete requestMap[String(profileUser.id)];
        localStorage.setItem(LS_KEY, JSON.stringify(requestMap));

        // TODO: Add API call to cancel pending request if backend supports it
        console.log("✅ Cancelled follow request");
      } else {
        // FOLLOW: Different behavior for public vs private
        if (isPrivateAccount) {
          // Private account: Send follow request
          setHasRequestPending(true);

          await AuthApiClient.post("/follows/follow_user/", {
            user_id: profileUser.id,
          });

          // Store in localStorage for immediate UI feedback
          const LS_KEY = "snapverse_follow_requests";
          const rawMap = localStorage.getItem(LS_KEY);
          const requestMap = rawMap ? JSON.parse(rawMap) : {};
          requestMap[String(profileUser.id)] = Date.now();
          localStorage.setItem(LS_KEY, JSON.stringify(requestMap));

          console.log("✅ Successfully sent follow request to private account");
        } else {
          // Public account: Follow immediately
          setIsFollowing(true);
          setFollowersCount((prev) => prev + 1);

          await AuthApiClient.post("/follows/follow_user/", {
            user_id: profileUser.id,
          });
          console.log("✅ Successfully followed public account");
        }
      }

      // Refresh status after operation
      if (profileUser.id) {
        await checkFollowStatus(profileUser.id);
        await checkPendingRequestStatus(profileUser.id);

        // Fetch updated user profile data to get accurate followers count
        try {
          const updatedProfileResponse = await AuthApiClient.get(
            `/profiles/${username}/`
          );
          if (updatedProfileResponse.data) {
            setFollowersCount(updatedProfileResponse.data.followers_count || 0);
          }
        } catch (profileError) {
          console.warn("Failed to fetch updated profile data:", profileError);
        }
      }
    } catch (error) {
      console.error("❌ Error following/unfollowing user:", error);

      // Revert optimistic updates on error
      setIsFollowing(wasFollowing);
      setHasRequestPending(hadRequestPending);
      setFollowersCount((prev) => (wasFollowing ? prev + 1 : prev - 1));

      // Show error message to user
      const action = isFollowing
        ? "unfollow"
        : hasRequestPending
        ? "cancel request for"
        : "follow";
      alert(`Failed to ${action} user. Please try again.`);
    } finally {
      setIsFollowLoading(false); // End loading
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
    hasRequestPending,

    // Loading states
    isLoadingProfile,
    loading,
    loadingUserPosts,
    hasNextPage,
    isFollowLoading,

    // Actions
    handleLike,
    handleComment,
    handleShare,
    handleFollow,
    loadMorePosts,
  };
};

export default useUserProfile;
