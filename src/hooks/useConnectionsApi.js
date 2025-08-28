import { useState, useEffect } from "react";
import apiClient from "../services/api-client";

export default function useConnectionsApi(user) {
  const [counts, setCounts] = useState({
    followers_count: 0,
    following_count: 0,
    pending_requests_count: 0,
  });
  const [followers, setFollowers] = useState([]);
  const [requestSent, setRequestSent] = useState([]);
  const [following, setFollowing] = useState([]);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await apiClient.get("/follows/");
        setCounts(res.data);
      } catch {
        setCounts({
          followers_count: 0,
          following_count: 0,
          pending_requests_count: 0,
        });
      }
    };
    const fetchFollowers = async () => {
      try {
        const res = await apiClient.get("/follows/followers/");
        const mapped = (res.data.results || []).map((item) => {
          const user = item.follower;
          return {
            id: user.id,
            name:
              `${user.first_name} ${user.last_name}`.trim() || user.username,
            username: user.username,
            avatar: user.profile_picture || "/user-profile-illustration.png",
          };
        });
        setFollowers(mapped);
      } catch {
        setFollowers([]);
      }
    };
    const fetchFollowing = async () => {
      try {
        const res = await apiClient.get("/follows/following/");
        const mapped = (res.data.results || []).map((item) => {
          const user = item.following;
          return {
            id: user.id,
            name:
              `${user.first_name} ${user.last_name}`.trim() || user.username,
            username: user.username,
            avatar: user.profile_picture || "/user-profile-illustration.png",
          };
        });
        setFollowing(mapped);
      } catch {
        setFollowing([]);
      }
    };
    const fetchPending = async () => {
      try {
        const res = await apiClient.get("/follows/pending_requests/");
        const mapped = (res.data.results || []).map((item) => {
          const user = item.follower;
          return {
            id: user.id,
            name:
              `${user.first_name} ${user.last_name}`.trim() || user.username,
            username: user.username,
            avatar: user.profile_picture || "/user-profile-illustration.png",
          };
        });
        setPending(mapped);
      } catch {
        setPending([]);
      }
    };
    fetchCounts();
    fetchFollowers();
    fetchFollowing();
    fetchPending();
  }, [user]);

  const handleAction = async (userId, action) => {
    if (action === "Follow Back") {
      try {
        await apiClient.post("/follows/follow_user/", { user_id: userId });
        if (user?.is_private) {
          setRequestSent((prev) => [...prev, userId]);
        } else {
          const [countsRes, followersRes] = await Promise.all([
            apiClient.get("/follows/"),
            apiClient.get("/follows/followers/"),
          ]);
          setCounts(countsRes.data);
          const mapped = (followersRes.data.results || []).map((item) => {
            const user = item.follower;
            return {
              id: user.id,
              name:
                `${user.first_name} ${user.last_name}`.trim() || user.username,
              username: user.username,
              avatar: user.profile_picture || "/user-profile-illustration.png",
            };
          });
          setFollowers(mapped);
        }
      } catch {
        alert("Failed to follow user. Please try again.");
      }
    } else if (action === "Unfollow") {
      try {
        await apiClient.post("/follows/unfollow_user/", { user_id: userId });
        const [countsRes, followingRes] = await Promise.all([
          apiClient.get("/follows/"),
          apiClient.get("/follows/following/"),
        ]);
        setCounts(countsRes.data);
        const mapped = (followingRes.data.results || []).map((item) => {
          const user = item.following;
          return {
            id: user.id,
            name:
              `${user.first_name} ${user.last_name}`.trim() || user.username,
            username: user.username,
            avatar: user.profile_picture || "/user-profile-illustration.png",
          };
        });
        setFollowing(mapped);
      } catch {
        alert("Failed to unfollow user. Please try again.");
      }
    } else {
      alert(`Demo: ${action} user with id ${userId}`);
    }
  };

  return {
    counts,
    followers,
    following,
    pending,
    requestSent,
    handleAction,
  };
}
