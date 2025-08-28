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

  // on mount, populate requestSent from localStorage so Request Sent survives reload
  useEffect(() => {
    try {
      const map = loadRequestMap();
      setRequestSent(Object.keys(map).map((k) => Number(k)));
    } catch {
      // ignore
    }
  }, []);

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
            is_private: !!user.is_private,
            name:
              `${user.first_name} ${user.last_name}`.trim() || user.username,
            username: user.username,
            avatar: user.profile_picture || "/user-profile-illustration.png",
          };
        });
        setFollowers(mapped);
        // (no pruning here) keep local requestSent map unchanged when loading followers
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
            is_private: !!user.is_private,
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
          // include the pending-request record id (item.id) so accept/reject can act on the request record
          return {
            id: user.id,
            requestId: item.id,
            is_private: !!user.is_private,
            name:
              `${user.first_name} ${user.last_name}`.trim() || user.username,
            username: user.username,
            avatar: user.profile_picture || "/user-profile-illustration.png",
          };
        });
        setPending(mapped);
        // synchronize client-side request map: add any missing pending entries and prune expired/accepted
        try {
          const map = loadRequestMap();
          // synchronize client-side request map: prefer server-provided created timestamps
          // use server's created timestamp if present and we don't already have a timestamp
          for (const item of res.data.results || []) {
            const follower = item.follower;
            const key = String(follower.id);
            if (!map[key]) {
              const created =
                item.created_at ||
                item.created ||
                item.timestamp ||
                item.createdDate ||
                null;
              if (created) {
                const ts = Date.parse(created);
                if (!Number.isNaN(ts)) map[key] = ts;
              }
            }
          }
          // consider a request accepted when the target appears in our `following` list
          const followersIds =
            (await (async () => {
              try {
                const fr = await apiClient.get("/follows/following/");
                return (fr.data.results || []).map((it) => it.following.id);
              } catch {
                return [];
              }
            })()) || [];
          const pendingIds = mapped.map((p) => p.id);
          const { map: newMap, changed } = pruneRequestMap(
            map,
            followersIds,
            pendingIds
          );
          if (changed) {
            saveRequestMap(newMap);
          }
          setRequestSent(Object.keys(newMap).map((k) => Number(k)));
        } catch {
          // ignore
        }
      } catch {
        setPending([]);
      }
    };
    fetchCounts();
    fetchFollowers();
    fetchFollowing();
    fetchPending();
  }, [user, pruneRequestMap]);

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
        await apiClient.post("/follows/follow_user/", { user_id: userId });

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
            apiClient.get("/follows/"),
            apiClient.get("/follows/followers/"),
            apiClient.get("/follows/following/"),
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
        await apiClient.post("/follows/unfollow_user/", { user_id: userId });
        // Refresh counts, following and followers to keep UI consistent
        const [countsRes, followingRes, followersRes] = await Promise.all([
          apiClient.get("/follows/"),
          apiClient.get("/follows/following/"),
          apiClient.get("/follows/followers/"),
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
            await apiClient[at.method](at.url, at.data);
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
          apiClient.get("/follows/"),
          apiClient.get("/follows/followers/"),
          apiClient.get("/follows/pending_requests/"),
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
