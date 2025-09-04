import { useState, useEffect } from "react";
import useAuthContext from "./useAuthContext";
import usePosts from "./usePosts";

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

  // Check if viewing own profile
  const isOwnProfile = currentUser?.username === username;

  // Load user profile and posts
  useEffect(() => {
    const loadUserData = async () => {
      if (!username) {
        return;
      }

      setIsLoadingProfile(true);
      setApiError(null);

      try {
        // Create different possible username formats to try
        const possibleUsernames = [
          username, // Original as-is
          username.toLowerCase(), // lowercase
          username
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "_")
            .replace(/_+/g, "_")
            .replace(/^_|_$/g, ""), // converted from full name
          username.toLowerCase().replace(/\s+/g, "_"), // spaces to underscores
          username.toLowerCase().replace(/\s+/g, ""), // remove spaces
        ];

        // Remove duplicates
        const uniqueUsernames = [...new Set(possibleUsernames)];

        let realUserData = null;

        // Try each username format
        for (const tryUsername of uniqueUsernames) {
          const encodedUsername = encodeURIComponent(tryUsername);
          const apiEndpoint = `http://127.0.0.1:8000/api/v1/users/${encodedUsername}/`;

          try {
            const response = await fetch(apiEndpoint, {
              headers: {
                Authorization: `JWT ${
                  JSON.parse(localStorage.getItem("authTokens"))?.access
                }`,
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              realUserData = await response.json();
              break; // Stop trying once we find a successful one
            }
          } catch {
            // Continue to next username variant
          }
        }

        if (realUserData) {
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
        } else {
          // All attempts failed
          setApiError(`All API attempts failed for username: ${username}`);
          console.log(
            "❌ All API endpoints failed, falling back to simulated data"
          );
          createSimulatedData();

          // Load posts for simulated user
          if (isOwnProfile) {
            const result = await loadMyPosts({}, { pageSize: 10 });
            if (!result.success) {
              console.error(
                "[UserProfile] Failed to load posts:",
                result.error
              );
            }
          } else {
            console.log(
              "[UserProfile] Using simulated user - loading posts for filtering"
            );
            await loadPosts({}, { pageSize: 50 });
          }
        }

        function createSimulatedData() {
          console.log("🔄 Using simulated data as fallback");
          const userData = {
            id: `user_${username}`,
            username: username,
            full_name:
              username.charAt(0).toUpperCase() + username.slice(1) + " User",
            bio: "This is a sample bio for the user profile. Welcome to SnapVerse!",
            email: `${username}@example.com`,
            followers_count: Math.floor(Math.random() * 1000) + 100,
            following_count: Math.floor(Math.random() * 500) + 50,
            posts_count: Math.floor(Math.random() * 200) + 20,
            date_joined: new Date(
              Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
            ).toISOString(),
            location: "New York, NY",
            website: "https://example.com",
            is_verified: Math.random() > 0.8,
            is_private: Math.random() > 0.7,
            profile_picture: null,
            cover_photo: null,
          };
          setProfileUser(userData);
          setFollowersCount(userData.followers_count);
          return userData;
        }

        setIsFollowing(Math.random() > 0.5); // Random follow status for demo
      } catch (error) {
        console.error("[UserProfile] Error loading user profile:", error);
        setApiError(`Error: ${error.message}`);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    const loadPostsForUser = async (realUserData) => {
      // If user profile has posts array with IDs, fetch them individually
      if (
        realUserData.posts &&
        Array.isArray(realUserData.posts) &&
        realUserData.posts.length > 0
      ) {
        setLoadingUserPosts(true);

        try {
          const postIds = realUserData.posts;
          const fetchedPosts = [];

          // Fetch each post individually
          for (const postId of postIds) {
            try {
              const authTokens = JSON.parse(localStorage.getItem("authTokens"));
              const accessToken = authTokens?.access;

              if (!accessToken) {
                continue;
              }

              const response = await fetch(
                `http://127.0.0.1:8000/api/v1/posts/${postId}/`,
                {
                  headers: {
                    Authorization: `JWT ${accessToken}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (response.ok) {
                const post = await response.json();
                fetchedPosts.push(post);
              }
            } catch {
              // Continue with next post if one fails
              continue;
            }
          }

          if (fetchedPosts.length > 0) {
            setUserSpecificPosts(fetchedPosts);
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
