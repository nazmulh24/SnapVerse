import { useState, useEffect, useCallback } from "react";
import AuthApiClient from "../services/auth-api-client";
import { getAvatarUrl } from "../utils/avatarUtils";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      avatar: getAvatarUrl(u),
    };
  };

  const mapFollowingItem = (item) => {
    const u = item.following;
    return {
      id: u.id,
      is_private: !!u.is_private,
      name: `${u.first_name} ${u.last_name}`.trim() || u.username,
      username: u.username,
      avatar: getAvatarUrl(u),
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
      avatar: getAvatarUrl(u),
    };
  };

  // prune local saved requests against our current following list and expiry
  const pruneLocalMapNow = async () => {
    try {
      const map = loadRequestMap();
      // get our following ids to detect accepted requests
      const fr = await AuthApiClient.get("/follows/following/");
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
    if (!user) {
      setLoading(false);
      return; // Don't fetch if no user is logged in
    }

    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      try {
        await Promise.all([
          fetchCounts(),
          fetchFollowers(),
          fetchFollowing(),
          fetchPending(),
        ]);
      } catch (err) {
        console.error("Error fetching connection data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCounts = async () => {
      try {
        console.log("Fetching counts...");
        const res = await AuthApiClient.get("/follows/");
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
        throw error;
      }
    };
    const fetchFollowers = async () => {
      try {
        console.log("Fetching followers...");
        const res = await AuthApiClient.get("/follows/followers/");
        console.log("Followers response:", res.data);
        const mapped = (res.data.results || []).map(mapFollowerItem);
        setFollowers(mapped);
      } catch (error) {
        console.error(
          "Failed to fetch followers:",
          error.response?.data || error.message
        );
        setFollowers([]);
        throw error;
      }
    };
    const fetchFollowing = async () => {
      try {
        console.log("Fetching following...");
        const res = await AuthApiClient.get("/follows/following/");
        console.log("Following response:", res.data);
        const mapped = (res.data.results || []).map(mapFollowingItem);
        setFollowing(mapped);
      } catch (error) {
        console.error(
          "Failed to fetch following:",
          error.response?.data || error.message
        );
        setFollowing([]);
        throw error;
      }
    };
    const fetchPending = async () => {
      try {
        console.log("Fetching pending...");
        const res = await AuthApiClient.get("/follows/pending_requests/");
        console.log("Pending response:", res.data);
        const mapped = (res.data.results || []).map(mapPendingItem);
        setPending(mapped);
      } catch (error) {
        console.error(
          "Failed to fetch pending:",
          error.response?.data || error.message
        );
        setPending([]);
        throw error;
      }
    };

    fetchAllData();
  }, [user]);

  // handleAction(userId, action, requestId?) - requestId is the pending-request record id (if available)
  const handleAction = async (userId, action, requestId = null) => {
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
            avatar: getAvatarUrl({ username: "", name: "" }),
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
        await AuthApiClient.post("/follows/follow_user/", { user_id: userId });

        // Use target user's privacy to decide whether the follow is immediate or a request
        if (targetIsPrivate) {
          // store the request locally with timestamp so UI shows "Request Sent"
          const map = loadRequestMap();
          map[String(userId)] = Date.now();
          saveRequestMap(map);
          setRequestSent(Object.keys(map).map((k) => Number(k)));
        } else {
          // refresh lists for public follow
          const [countsRes, followersRes, followingRes] = await Promise.all([
            AuthApiClient.get("/follows/"),
            AuthApiClient.get("/follows/followers/"),
            AuthApiClient.get("/follows/following/"),
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
                avatar: getAvatarUrl(u),
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
                avatar: getAvatarUrl(u),
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
        console.error("Failed to follow user:", userId);
        // Removed alert for better UX
      } finally {
        setTimeout(() => setProcessingId(null), 300);
      }
      return;
    }

    if (action === "Unfollow") {
      setProcessingId(userId);
      try {
        await AuthApiClient.post("/follows/unfollow_user/", {
          user_id: userId,
        });
        // Refresh counts, following and followers to keep UI consistent
        const [countsRes, followingRes, followersRes] = await Promise.all([
          AuthApiClient.get("/follows/"),
          AuthApiClient.get("/follows/following/"),
          AuthApiClient.get("/follows/followers/"),
        ]);
        setCounts(countsRes.data);
        const mappedFollowing = (followingRes.data.results || []).map(
          (item) => {
            const u = item.following;
            return {
              id: u.id,
              is_private: !!u.is_private,
              name: `${u.first_name} ${u.last_name}`.trim() || u.username,
              username: u.username,
              avatar: getAvatarUrl(u),
            };
          }
        );
        setFollowing(mappedFollowing);
        const mappedFollowers = (followersRes.data.results || []).map(
          (item) => {
            const u = item.follower;
            return {
              id: u.id,
              is_private: !!u.is_private,
              name: `${u.first_name} ${u.last_name}`.trim() || u.username,
              username: u.username,
              avatar: getAvatarUrl(u),
            };
          }
        );
        setFollowers(mappedFollowers);
      } catch {
        console.error("Failed to unfollow user:", userId, error);
        // Removed alert for better UX
      } finally {
        setTimeout(() => setProcessingId(null), 300);
      }
      return;
    }

    // Accept/Reject pending requests
    if (action === "Accept" || action === "Reject") {
      setProcessingId(userId);
      try {
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
            await AuthApiClient[at.method](at.url, at.data);
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
          AuthApiClient.get("/follows/"),
          AuthApiClient.get("/follows/followers/"),
          AuthApiClient.get("/follows/pending_requests/"),
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
              avatar: getAvatarUrl(u),
            };
          }
        );
        setFollowers(mappedFollowers);
        const mappedPending = (pendingRes.data.results || []).map((item) => {
          const u = item.follower;
          return {
            id: u.id,
            requestId: item.id,
            is_private: !!u.is_private,
            name: `${u.first_name} ${u.last_name}`.trim() || u.username,
            username: u.username,
            avatar: getAvatarUrl(u),
          };
        });
        setPending(mappedPending);
      } catch (err) {
        console.error("Accept/Reject error:", err);
        console.error(
          `${action} failed. Server returned ${
            err?.response?.status || "an error"
          }.`
        );
        // Removed alert for better UX
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
    loading,
    error,
  };
}
