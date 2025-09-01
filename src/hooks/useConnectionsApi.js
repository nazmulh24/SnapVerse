import { useState, useEffect, useCallback } from "react";
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
  const [processingId, setProcessingId] = useState(null);

  // localStorage key for client-side pending follow timestamps
  const LS_KEY = "snapverse_follow_requests";

  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

  const loadRequestMap = () => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return {};
      return JSON.parse(raw || "{}");
    } catch {
      return {};
    }
  };

  const saveRequestMap = (map) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(map));
    } catch {
      // ignore
    }
  };

  const pruneRequestMap = useCallback(
    (map, followersIds = [], pendingIds = []) => {
      const now = Date.now();
      let changed = false;
      for (const idStr of Object.keys(map)) {
        const id = Number(idStr);
        const ts = map[idStr];
        // remove if accepted (now in followers)
        if (followersIds.includes(id)) {
          delete map[idStr];
          changed = true;
          continue;
        }
        // if still pending keep
        if (pendingIds.includes(id)) continue;
        // if older than 3 days remove
        if (now - ts > THREE_DAYS_MS) {
          delete map[idStr];
          changed = true;
        }
      }
      return { map, changed };
    },
    [THREE_DAYS_MS]
  );

  // small helpers to map API items to our UI shape
  const mapFollowerItem = (item) => {
    const u = item.follower;
    return {
      id: u.id,
      is_private: !!u.is_private,
      name: `${u.first_name} ${u.last_name}`.trim() || u.username,
      username: u.username,
      avatar: u.profile_picture || "/user-profile-illustration.png",
    };
  };

  const mapFollowingItem = (item) => {
    const u = item.following;
    return {
      id: u.id,
      is_private: !!u.is_private,
      name: `${u.first_name} ${u.last_name}`.trim() || u.username,
      username: u.username,
      avatar: u.profile_picture || "/user-profile-illustration.png",
    };
  };

  const mapPendingItem = (item) => {
    const u = item.follower;
    return {
      id: u.id,
      requestId: item.id,
      is_private: !!u.is_private,
      name: `${u.first_name} ${u.last_name}`.trim() || u.username,
      username: u.username,
      avatar: u.profile_picture || "/user-profile-illustration.png",
    };
  };

  // prune local saved requests against our current following list and expiry
  const pruneLocalMapNow = async () => {
    try {
      const map = loadRequestMap();
      // get our following ids to detect accepted requests
      const tokensRaw = localStorage.getItem("authTokens");
      const access = tokensRaw ? JSON.parse(tokensRaw)?.access : null;
      const headers = access ? { Authorization: `JWT ${access}` } : {};
      const fr = await apiClient.get("/follows/following/", { headers });
      const followingIds = (fr.data.results || []).map((it) => it.following.id);
      const { map: newMap, changed } = pruneRequestMap(map, followingIds, []);
      if (changed) saveRequestMap(newMap);
      setRequestSent(Object.keys(newMap).map((k) => Number(k)));
    } catch {
      // fall back to raw load
      try {
        const map = loadRequestMap();
        setRequestSent(Object.keys(map).map((k) => Number(k)));
      } catch {
        // ignore
      }
    }
  };

  // on mount, load and prune local request map so Request Sent appears immediately
  useEffect(() => {
    pruneLocalMapNow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user) return; // Don't fetch if no user is logged in

    const getAuthHeaders = () => {
      const tokensRaw = localStorage.getItem("authTokens");
      const access = tokensRaw ? JSON.parse(tokensRaw)?.access : null;
      return access ? { Authorization: `JWT ${access}` } : {};
    };

    const fetchCounts = async () => {
      try {
        const headers = getAuthHeaders();
        console.log("Fetching counts with headers:", headers);
        const res = await apiClient.get("/follows/", { headers });
        console.log("Counts response:", res.data);
        setCounts(res.data);
      } catch (error) {
        console.error(
          "Failed to fetch counts:",
          error.response?.data || error.message
        );
        setCounts({
          followers_count: 0,
          following_count: 0,
          pending_requests_count: 0,
        });
      }
    };
    const fetchFollowers = async () => {
      try {
        const headers = getAuthHeaders();
        console.log("Fetching followers with headers:", headers);
        const res = await apiClient.get("/follows/followers/", { headers });
        console.log("Followers response:", res.data);
        const mapped = (res.data.results || []).map(mapFollowerItem);
        setFollowers(mapped);
      } catch (error) {
        console.error(
          "Failed to fetch followers:",
          error.response?.data || error.message
        );
        setFollowers([]);
      }
    };
    const fetchFollowing = async () => {
      try {
        const headers = getAuthHeaders();
        console.log("Fetching following with headers:", headers);
        const res = await apiClient.get("/follows/following/", { headers });
        console.log("Following response:", res.data);
        const mapped = (res.data.results || []).map(mapFollowingItem);
        setFollowing(mapped);
      } catch (error) {
        console.error(
          "Failed to fetch following:",
          error.response?.data || error.message
        );
        setFollowing([]);
      }
    };
    const fetchPending = async () => {
      try {
        const headers = getAuthHeaders();
        console.log("Fetching pending with headers:", headers);
        const res = await apiClient.get("/follows/pending_requests/", {
          headers,
        });
        console.log("Pending response:", res.data);
        const mapped = (res.data.results || []).map(mapPendingItem);
        setPending(mapped);
      } catch (error) {
        console.error(
          "Failed to fetch pending:",
          error.response?.data || error.message
        );
        setPending([]);
      }
    };
    fetchCounts();
    fetchFollowers();
    fetchFollowing();
    fetchPending();
  }, [user]);

  // handleAction(userId, action, requestId?) - requestId is the pending-request record id (if available)
  const handleAction = async (userId, action, requestId = null) => {
    const getAuthHeaders = () => {
      const tokensRaw = localStorage.getItem("authTokens");
      const access = tokensRaw ? JSON.parse(tokensRaw)?.access : null;
      return access ? { Authorization: `JWT ${access}` } : {};
    };

    // determine target user's privacy from cached lists (followers, following, pending)
    const targetUser =
      followers.find((f) => f.id === userId) ||
      following.find((f) => f.id === userId) ||
      pending.find((p) => p.id === userId) ||
      null;
    const targetIsPrivate = !!(targetUser && targetUser.is_private);

    if (action === "Follow Back") {
      setProcessingId(userId);
      // optimistic UI update for public accounts: add to following immediately
      const wasPrivate = targetIsPrivate;
      let prevFollowing = following;
      let prevCounts = counts;
      try {
        if (!wasPrivate) {
          const followObj = targetUser || {
            id: userId,
            is_private: false,
            name: "",
            username: "",
            avatar: "/user-profile-illustration.png",
          };
          // prepend to following so isFollowing becomes true instantly
          setFollowing((f) => [followObj, ...f]);
          setCounts((c) => ({
            ...c,
            following_count: (c.following_count || 0) + 1,
          }));
        }
        // small UX delay and prevent double clicks
        await new Promise((r) => setTimeout(r, 2000));
        const headers = getAuthHeaders();
        await apiClient.post(
          "/follows/follow_user/",
          { user_id: userId },
          { headers }
        );

        // Use target user's privacy to decide whether the follow is immediate or a request
        if (targetIsPrivate) {
          // store the request locally with timestamp so UI shows "Request Sent"
          const map = loadRequestMap();
          map[String(userId)] = Date.now();
          saveRequestMap(map);
          setRequestSent(Object.keys(map).map((k) => Number(k)));
        } else {
          // refresh lists for public follow
          const headers = getAuthHeaders();
          const [countsRes, followersRes, followingRes] = await Promise.all([
            apiClient.get("/follows/", { headers }),
            apiClient.get("/follows/followers/", { headers }),
            apiClient.get("/follows/following/", { headers }),
          ]);
          setCounts(countsRes.data);
          const mappedFollowers = (followersRes.data.results || []).map(
            (item) => {
              const u = item.follower;
              return {
                id: u.id,
                is_private: !!u.is_private,
                name: `${u.first_name} ${u.last_name}`.trim() || u.username,
                username: u.username,
                avatar: u.profile_picture || "/user-profile-illustration.png",
              };
            }
          );
          setFollowers(mappedFollowers);
          const mappedFollowing = (followingRes.data.results || []).map(
            (item) => {
              const u = item.following;
              return {
                id: u.id,
                is_private: !!u.is_private,
                name: `${u.first_name} ${u.last_name}`.trim() || u.username,
                username: u.username,
                avatar: u.profile_picture || "/user-profile-illustration.png",
              };
            }
          );
          setFollowing(mappedFollowing);
        }
      } catch {
        // revert optimistic update on failure
        try {
          if (!targetIsPrivate) {
            setFollowing(prevFollowing);
            setCounts(prevCounts);
          }
        } catch {
          // ignore
        }
        alert("Failed to follow user. Please try again.");
      } finally {
        setTimeout(() => setProcessingId(null), 300);
      }
      return;
    }

    if (action === "Unfollow") {
      setProcessingId(userId);
      try {
        const headers = getAuthHeaders();
        await apiClient.post(
          "/follows/unfollow_user/",
          { user_id: userId },
          { headers }
        );
        // Refresh counts, following and followers to keep UI consistent
        const [countsRes, followingRes, followersRes] = await Promise.all([
          apiClient.get("/follows/", { headers }),
          apiClient.get("/follows/following/", { headers }),
          apiClient.get("/follows/followers/", { headers }),
        ]);
        setCounts(countsRes.data);
        const mappedFollowing = (followingRes.data.results || []).map(
          (item) => {
            const u = item.following;
            return {
              id: u.id,
              name: `${u.first_name} ${u.last_name}`.trim() || u.username,
              username: u.username,
              avatar: u.profile_picture || "/user-profile-illustration.png",
            };
          }
        );
        setFollowing(mappedFollowing);
        const mappedFollowers = (followersRes.data.results || []).map(
          (item) => {
            const u = item.follower;
            return {
              id: u.id,
              name: `${u.first_name} ${u.last_name}`.trim() || u.username,
              username: u.username,
              avatar: u.profile_picture || "/user-profile-illustration.png",
            };
          }
        );
        setFollowers(mappedFollowers);
      } catch {
        alert("Failed to unfollow user. Please try again.");
      } finally {
        setTimeout(() => setProcessingId(null), 300);
      }
      return;
    }

    // Accept/Reject pending requests
    if (action === "Accept" || action === "Reject") {
      setProcessingId(userId);
      try {
        const headers = getAuthHeaders();
        const actionStr = action === "Accept" ? "Approve" : "Reject";
        const payload = requestId
          ? { id: requestId, action: actionStr }
          : { id: userId, action: actionStr };

        const attempts = [
          { method: "post", url: "/follows/pending_requests/", data: payload },
          {
            method: "post",
            url: "/follows/pending_requests/",
            data: { user_id: userId, action: actionStr },
          },
          {
            method: "post",
            url: `/follows/pending_requests/${requestId || userId}/`,
            data: { action: actionStr },
          },
          {
            method: "patch",
            url: `/follows/pending_requests/${requestId || userId}/`,
            data: { action: actionStr },
          },
          {
            method: "post",
            url: `/follows/pending_requests/${requestId || userId}/approve/`,
            data: {},
          },
          {
            method: "post",
            url: `/follows/pending_requests/${requestId || userId}/reject/`,
            data: {},
          },
          {
            method: "post",
            url: "/follows/approve_request/",
            data: { id: requestId || userId },
          },
        ];

        let succeeded = false;
        let lastErr = null;
        const tried = [];
        for (const at of attempts) {
          tried.push(at.url);
          try {
            await apiClient[at.method](at.url, at.data, { headers });
            succeeded = true;
            break;
          } catch (err) {
            lastErr = err;
            if (err && err.response && err.response.status === 404) continue;
            throw err;
          }
        }

        if (!succeeded) {
          console.error("Accept/Reject attempts failed for user", userId, {
            tried,
            error: lastErr,
          });
          throw lastErr || new Error("Accept/Reject failed");
        }

        const [countsRes, followersRes, pendingRes] = await Promise.all([
          apiClient.get("/follows/", { headers }),
          apiClient.get("/follows/followers/", { headers }),
          apiClient.get("/follows/pending_requests/", { headers }),
        ]);
        setCounts(countsRes.data);
        const mappedFollowers = (followersRes.data.results || []).map(
          (item) => {
            const u = item.follower;
            return {
              id: u.id,
              name: `${u.first_name} ${u.last_name}`.trim() || u.username,
              username: u.username,
              avatar: u.profile_picture || "/user-profile-illustration.png",
            };
          }
        );
        setFollowers(mappedFollowers);
        const mappedPending = (pendingRes.data.results || []).map((item) => {
          const u = item.follower;
          return {
            id: u.id,
            requestId: item.id,
            name: `${u.first_name} ${u.last_name}`.trim() || u.username,
            username: u.username,
            avatar: u.profile_picture || "/user-profile-illustration.png",
          };
        });
        setPending(mappedPending);
      } catch (err) {
        console.error("Accept/Reject error:", err);
        alert(
          `${action} failed. Server returned ${
            err?.response?.status || "an error"
          }. Check console.`
        );
      } finally {
        setTimeout(() => setProcessingId(null), 300);
      }
      return;
    }

    // fallback: demo mode
    alert(`Demo: ${action} user with id ${userId}`);
  };

  return {
    counts,
    followers,
    following,
    pending,
    requestSent,
    handleAction,
    processingId,
  };
}
