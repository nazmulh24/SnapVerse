import { useState, useEffect, useCallback } from "react";
import apiClient from "../services/api-client";
import useAuthContext from "./useAuthContext";

export default function useSuggestedUsers() {
  const [allUsers, setAllUsers] = useState([]); // Store all fetched users
  const [suggestedUsers, setSuggestedUsers] = useState([]); // Display users
  const [showingMore, setShowingMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestSent, setRequestSent] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  const { user: currentUser } = useAuthContext(); // Get current user from auth context

  // localStorage for tracking pending follow requests (same as ConnectionPage)
  const LS_KEY = "snapverse_follow_requests";
  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

  const loadRequestMap = useCallback(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return {};
      return JSON.parse(raw || "{}");
    } catch {
      return {};
    }
  }, []);

  const saveRequestMap = useCallback((map) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(map));
    } catch {
      // ignore
    }
  }, []);

  const getAuthHeaders = () => {
    const tokensRaw = localStorage.getItem("authTokens");
    const access = tokensRaw ? JSON.parse(tokensRaw)?.access : null;
    return access ? { Authorization: `JWT ${access}` } : {};
  };

  // Format user data to match the component's expected structure
  const formatUserData = (user) => {
    let avatarUrl;
    if (user.profile_picture) {
      if (user.profile_picture.startsWith("http")) {
        avatarUrl = user.profile_picture;
      } else if (user.profile_picture.startsWith("image/upload/")) {
        avatarUrl = `https://res.cloudinary.com/dlkq5sjum/${user.profile_picture}`;
      } else {
        avatarUrl = `https://res.cloudinary.com/dlkq5sjum/image/upload/${user.profile_picture}`;
      }
    } else {
      avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.full_name || user.username
      )}&background=random&color=fff`;
    }

    return {
      id: user.id,
      username: user.username,
      fullName:
        user.full_name ||
        `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
        user.username,
      avatar: avatarUrl,
      mutualFriends:
        user.mutual_friends_count || Math.floor(Math.random() * 20),
      followersCount:
        user.followers_count ||
        user.followersCount ||
        Math.floor(Math.random() * 5000),
      isVerified: user.is_verified || false,
      isPrivate: user.is_private || false,
      followStatus: user.followStatus || "none", // none, following, requested
      isFollowed: user.isFollowed || false,
      isRequestSent: user.isRequestSent || false,
    };
  };

  const fetchSuggestedUsers = useCallback(async () => {
    if (!currentUser?.id) {
      console.log("[SuggestedUsers] No current user, skipping fetch");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const headers = getAuthHeaders();
      const currentUserId = currentUser.id;
      let allFetchedUsers = [];
      let followingIds = []; // Store users we're already following

      // First, try to get users who follow me but I don't follow back
      try {
        const [followersResponse, followingResponse] = await Promise.all([
          apiClient.get("/follows/followers/", { headers }),
          apiClient.get("/follows/following/", { headers }),
        ]);

        const followers = followersResponse.data.results || [];
        const following = followingResponse.data.results || [];
        followingIds = following.map((f) => f.following.id);
        console.log(
          `[SuggestedUsers] Currently following ${followingIds.length} users:`,
          followingIds
        );

        // Users who follow me but I don't follow back (excluding current user)
        const notFollowingBack = followers
          .filter((follower) => {
            const followerId = follower.follower.id;
            const isNotFollowing = !followingIds.includes(followerId);
            const isNotCurrentUser =
              followerId !== currentUserId &&
              String(followerId) !== String(currentUserId);

            return isNotFollowing && isNotCurrentUser;
          })
          .map((item) => formatUserData(item.follower));

        allFetchedUsers.push(...notFollowingBack);
      } catch (followError) {
        console.warn(
          "[SuggestedUsers] Could not fetch follow relationships:",
          followError
        );
        // If we can't get following data, set empty array so suggestions still work
        followingIds = [];
      }

      // If we don't have enough users, get random users
      if (allFetchedUsers.length < 15) {
        try {
          let randomUsersResponse;
          try {
            randomUsersResponse = await apiClient.get("/users/", { headers });
          } catch {
            try {
              randomUsersResponse = await apiClient.get("/accounts/users/", {
                headers,
              });
            } catch {
              randomUsersResponse = await apiClient.get("/auth/users/", {
                headers,
              });
            }
          }

          const allUsers =
            randomUsersResponse.data.results || randomUsersResponse.data || [];

          // Filter out current user, users already added, and users we're already following
          const existingIds = allFetchedUsers.map((u) => u.id);
          const availableUsers = allUsers.filter((user) => {
            const userId = user.id;
            const isNotCurrentUser =
              userId !== currentUserId &&
              String(userId) !== String(currentUserId);
            const isNotExisting = !existingIds.includes(userId);
            const isNotAlreadyFollowing = !followingIds.includes(userId);

            return isNotCurrentUser && isNotExisting && isNotAlreadyFollowing;
          });

          // Add random users up to 15 total
          const remainingSlots = 15 - allFetchedUsers.length;
          const randomUsers = availableUsers
            .sort(() => 0.5 - Math.random())
            .slice(0, remainingSlots)
            .map(formatUserData);

          allFetchedUsers.push(...randomUsers);
        } catch (usersError) {
          console.warn(
            "[SuggestedUsers] Could not fetch random users:",
            usersError
          );
        }
      }

      // If still no users, use default fallback
      if (allFetchedUsers.length === 0) {
        allFetchedUsers = [
          {
            id: "default-1",
            username: "azunyan_s",
            fullName: "Azunyan Senpal",
            avatar: "/user-profile-illustration.png",
            mutualFriends: 12,
            followersCount: 2500,
            isVerified: false,
          },
          {
            id: "default-2",
            username: "oarackbabama",
            fullName: "Oarack Babama",
            avatar: "/user-profile-illustration.png",
            mutualFriends: 8,
            followersCount: 500,
            isVerified: true,
          },
          {
            id: "default-3",
            username: "john_doe",
            fullName: "John Doe",
            avatar: "/user-profile-illustration.png",
            mutualFriends: 15,
            followersCount: 1200,
            isVerified: false,
          },
        ];
      }

      // Final safety filter to ensure current user and already followed users are never included
      const finalFilteredUsers = allFetchedUsers.filter((user) => {
        const userId = user.id;
        const isNotCurrentUser =
          userId !== currentUserId && String(userId) !== String(currentUserId);
        const isNotAlreadyFollowing = !followingIds.includes(userId);

        return isNotCurrentUser && isNotAlreadyFollowing;
      });

      // Store all users and show first 4
      setAllUsers(finalFilteredUsers);
      setSuggestedUsers(finalFilteredUsers.slice(0, 4));
      setShowingMore(false);

      console.log(
        `[SuggestedUsers] Final suggestions (${finalFilteredUsers.length} users, excluding ${followingIds.length} followed users):`,
        finalFilteredUsers.map((u) => u.username)
      );
    } catch (error) {
      console.error("[SuggestedUsers] Error fetching suggested users:", error);
      setError(error.message);

      // Use default suggestions on error
      const defaultUsers = [
        {
          id: "default-1",
          username: "azunyan_s",
          fullName: "Azunyan Senpal",
          avatar: "/user-profile-illustration.png",
          mutualFriends: 12,
          followersCount: 2500,
          isVerified: false,
        },
        {
          id: "default-2",
          username: "oarackbabama",
          fullName: "Oarack Babama",
          avatar: "/user-profile-illustration.png",
          mutualFriends: 8,
          followersCount: 500,
          isVerified: true,
        },
      ];

      setAllUsers(defaultUsers);
      setSuggestedUsers(defaultUsers);
    } finally {
      setLoading(false);
    }
  }, [currentUser]); // Add currentUser as dependency

  // Show more/less suggestions functionality
  const showMoreSuggestions = useCallback(() => {
    if (allUsers.length > 4) {
      if (showingMore) {
        // Show less - back to 4 users
        setSuggestedUsers(allUsers.slice(0, 4));
        setShowingMore(false);
      } else {
        // Show more - all users
        setSuggestedUsers(allUsers);
        setShowingMore(true);
      }
    }
  }, [allUsers, showingMore]);

  // Follow functionality using same pattern as ConnectionPage
  const followUser = useCallback(
    async (userId) => {
      setProcessingId(userId);

      // Find the user to check if they're private
      const targetUser = [...allUsers, ...suggestedUsers].find(
        (u) => u.id === userId
      );
      const targetIsPrivate = targetUser?.isPrivate || false;

      // Optimistic UI update for public accounts
      let prevAllUsers = allUsers;
      let prevSuggestedUsers = suggestedUsers;

      try {
        if (!targetIsPrivate) {
          // Update follow status immediately for public users
          const updateUserStatus = (user) => {
            if (user.id === userId) {
              return {
                ...user,
                followStatus: "following",
                isFollowed: true,
              };
            }
            return user;
          };

          setAllUsers((prev) => prev.map(updateUserStatus));
          setSuggestedUsers((prev) => prev.map(updateUserStatus));
        }

        // Small UX delay and prevent double clicks (same as ConnectionPage)
        await new Promise((r) => setTimeout(r, 2000));

        const headers = getAuthHeaders();
        await apiClient.post(
          "/follows/follow_user/",
          { user_id: userId },
          { headers }
        );

        // Use target user's privacy to decide whether the follow is immediate or a request
        if (targetIsPrivate) {
          // Store the request locally with timestamp so UI shows "Request Sent"
          const map = loadRequestMap();
          map[String(userId)] = Date.now();
          saveRequestMap(map);
          setRequestSent(Object.keys(map).map((k) => Number(k)));

          // Update UI to show request sent for private users
          const updateUserStatus = (user) => {
            if (user.id === userId) {
              return {
                ...user,
                followStatus: "requested",
                isRequestSent: true,
              };
            }
            return user;
          };

          setAllUsers((prev) => prev.map(updateUserStatus));
          setSuggestedUsers((prev) => prev.map(updateUserStatus));
        }

        return {
          success: true,
          isPrivate: targetIsPrivate,
          status: targetIsPrivate ? "requested" : "following",
        };
      } catch (error) {
        // Revert optimistic update on failure
        if (!targetIsPrivate) {
          setAllUsers(prevAllUsers);
          setSuggestedUsers(prevSuggestedUsers);
        }
        console.error("[SuggestedUsers] Error following user:", error);
        return {
          success: false,
          error: error.message,
        };
      } finally {
        setTimeout(() => setProcessingId(null), 300);
      }
    },
    [
      allUsers,
      suggestedUsers,
      loadRequestMap,
      saveRequestMap,
      setRequestSent,
      setProcessingId,
    ]
  );

  useEffect(() => {
    fetchSuggestedUsers();

    // Initialize requestSent from localStorage (same as ConnectionPage)
    const map = loadRequestMap();
    setRequestSent(Object.keys(map).map((k) => Number(k)));
  }, [fetchSuggestedUsers, loadRequestMap]);

  return {
    suggestedUsers,
    allUsers,
    showingMore,
    loading,
    error,
    requestSent,
    processingId,
    refreshSuggestions: fetchSuggestedUsers,
    showMoreSuggestions,
    followUser,
  };
}
