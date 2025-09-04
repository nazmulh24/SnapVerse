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
        console.log("[UserProfile] No username/ID provided");
        return;
      }

      console.log("[UserProfile] Loading profile for identifier:", username);
      setIsLoadingProfile(true);
      setApiError(null);

      try {
        console.log("🔗 Attempting to find user with identifier:", username);

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
        console.log("🎯 Will try these username formats:", uniqueUsernames);

        let realUserData = null;

        // Try each username format
        for (const tryUsername of uniqueUsernames) {
          const encodedUsername = encodeURIComponent(tryUsername);
          const apiEndpoint = `http://127.0.0.1:8000/api/v1/users/${encodedUsername}/`;

          console.log(`🔄 Trying endpoint: ${apiEndpoint}`);

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
              console.log("✅ API SUCCESS with endpoint:", apiEndpoint);
              console.log("✅ API SUCCESS - Complete user data:", realUserData);
              break; // Stop trying once we find a successful one
            } else {
              console.log(`❌ Failed with ${apiEndpoint}: ${response.status}`);
            }
          } catch (fetchError) {
            console.log(
              `🚫 Network error with ${apiEndpoint}:`,
              fetchError.message
            );
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
      console.log(
        "[UserProfile] Loading posts for user:",
        realUserData.username,
        "ID:",
        realUserData.id
      );

      const possibleParams = [
        { author: realUserData.id },
        { author_id: realUserData.id },
        { user: realUserData.id },
        { user_id: realUserData.id },
        { author__username: realUserData.username },
        { username: realUserData.username },
      ];

      let postsLoaded = false;
      for (const params of possibleParams) {
        console.log("[UserProfile] Trying posts with params:", params);
        const result = await loadPosts(params, { pageSize: 10 });
        if (result.success && result.data?.results?.length > 0) {
          console.log(
            "[UserProfile] ✅ Successfully loaded posts with params:",
            params
          );
          postsLoaded = true;
          break;
        }
      }

      if (!postsLoaded) {
        console.log("[UserProfile] ❌ No posts found with server filtering");

        // If user profile has posts array with IDs, fetch them individually
        if (
          realUserData.posts &&
          Array.isArray(realUserData.posts) &&
          realUserData.posts.length > 0
        ) {
          console.log(
            "[UserProfile] 🔍 User has post IDs in profile:",
            realUserData.posts
          );
          console.log(
            "[UserProfile] 🎯 Fetching ONLY user's specific posts by ID"
          );

          setLoadingUserPosts(true);

          try {
            const postIds = realUserData.posts;
            const fetchedPosts = [];

            // Fetch each post individually
            for (const postId of postIds) {
              console.log(`[UserProfile] 🔄 Fetching post ID: ${postId}`);
              try {
                const response = await fetch(
                  `http://127.0.0.1:8000/api/v1/posts/${postId}/`,
                  {
                    headers: {
                      Authorization: `JWT ${
                        JSON.parse(localStorage.getItem("authTokens"))?.access
                      }`,
                      "Content-Type": "application/json",
                    },
                  }
                );

                if (response.ok) {
                  const post = await response.json();
                  fetchedPosts.push(post);
                  console.log(
                    `[UserProfile] ✅ Successfully fetched post ${postId}`
                  );
                } else {
                  console.log(
                    `[UserProfile] ❌ Failed to fetch post ${postId}: ${response.status}`
                  );
                }
              } catch (error) {
                console.log(
                  `[UserProfile] ❌ Error fetching post ${postId}:`,
                  error
                );
              }
            }

            if (fetchedPosts.length > 0) {
              console.log(
                `[UserProfile] ✅ Successfully fetched ${fetchedPosts.length} user-specific posts`
              );
              setUserSpecificPosts(fetchedPosts);
            } else {
              console.log(
                "[UserProfile] ❌ No user-specific posts could be fetched"
              );
            }
          } catch (error) {
            console.log(
              "[UserProfile] ❌ Error in individual post fetching:",
              error
            );
          } finally {
            setLoadingUserPosts(false);
          }
        } else {
          console.log("[UserProfile] ❌ No post IDs found in user profile");
        }
      }
    };

    loadUserData();
  }, [username, currentUser, isOwnProfile, loadMyPosts, loadPosts]);

  // Filter posts to show only those from the profile user
  const userPosts =
    userSpecificPosts.length > 0
      ? userSpecificPosts
      : posts?.filter((post) => {
          if (isOwnProfile) {
            return true;
          } else {
            const isUserPost =
              post.author?.id === profileUser?.id ||
              post.author?.username === profileUser?.username ||
              post.user?.id === profileUser?.id ||
              post.user?.username === profileUser?.username ||
              (profileUser?.posts &&
                Array.isArray(profileUser.posts) &&
                profileUser.posts.includes(post.id));

            return isUserPost;
          }
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
