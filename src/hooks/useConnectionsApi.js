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
          // include the pending-request record id (item.id) so accept/reject can act on the request record
          return {
            id: user.id,
            requestId: item.id,
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

  // handleAction(userId, action, requestId?) - requestId is the pending-request record id (if available)
  const handleAction = async (userId, action, requestId = null) => {
    if (action === "Follow Back") {
      try {
        await apiClient.post("/follows/follow_user/", { user_id: userId });
        if (user?.is_private) {
          // For private accounts, record that a request was sent so the UI shows "Request Sent"
          setRequestSent((prev) => [...prev, userId]);
        } else {
          // For public accounts, refresh counts, followers and following so isFollowing updates immediately
          const [countsRes, followersRes, followingRes] = await Promise.all([
            apiClient.get("/follows/"),
            apiClient.get("/follows/followers/"),
            apiClient.get("/follows/following/"),
          ]);
          setCounts(countsRes.data);
          const mappedFollowers = (followersRes.data.results || []).map(
            (item) => {
              const user = item.follower;
              return {
                id: user.id,
                name:
                  `${user.first_name} ${user.last_name}`.trim() ||
                  user.username,
                username: user.username,
                avatar:
                  user.profile_picture || "/user-profile-illustration.png",
              };
            }
          );
          setFollowers(mappedFollowers);
          const mappedFollowing = (followingRes.data.results || []).map(
            (item) => {
              const user = item.following;
              return {
                id: user.id,
                name:
                  `${user.first_name} ${user.last_name}`.trim() ||
                  user.username,
                username: user.username,
                avatar:
                  user.profile_picture || "/user-profile-illustration.png",
              };
            }
          );
          setFollowing(mappedFollowing);
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
      // Accept/Reject pending requests: post to the pending_requests endpoint
      if (action === "Accept" || action === "Reject") {
        try {
          const actionStr = action === "Accept" ? "Approve" : "Reject";
          // If the server expects a pending-request record id, prefer that (requestId).
          const payload = requestId
            ? { id: requestId, action: actionStr }
            : { id: userId, action: actionStr };

          // Try several possible endpoint shapes until one succeeds.
          const attempts = [
            // list endpoint with id+action in body
            {
              method: "post",
              url: "/follows/pending_requests/",
              data: payload,
            },
            // list endpoint with user_id / request_id variants
            {
              method: "post",
              url: "/follows/pending_requests/",
              data: { user_id: userId, action: actionStr },
            },
            {
              method: "post",
              url: "/follows/pending_requests/",
              data: { request_id: userId, action: actionStr },
            },
            // id-specific endpoint (POST)
            // id-specific attempts - try requestId first, then userId
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
            // approve/reject sub-endpoints
            {
              method: "post",
              url: `/follows/pending_requests/${userId}/approve/`,
              data: {},
            },
            {
              method: "post",
              url: `/follows/pending_requests/${userId}/reject/`,
              data: {},
            },
            // alternate naming conventions used by some backends
            {
              method: "post",
              url: "/follows/accept_request/",
              data: { user_id: userId },
            },
            {
              method: "post",
              url: "/follows/approve_request/",
              data: { user_id: userId },
            },
            {
              method: "post",
              url: "/follows/accept_request/",
              data: { id: userId },
            },
            {
              method: "post",
              url: "/follows/approve_request/",
              data: { id: userId },
            },
            // hyphenated variant
            {
              method: "post",
              url: "/follows/pending-requests/",
              data: payload,
            },
            {
              method: "post",
              url: `/follows/pending-requests/${userId}/approve/`,
              data: {},
            },
          ];

          let succeeded = false;
          const tried = [];
          let lastErr = null;

          for (const at of attempts) {
            tried.push(at.url);
            try {
              await apiClient[at.method](at.url, at.data);
              succeeded = true;
              break;
            } catch (err) {
              lastErr = err;
              // if 404 try next possibility, otherwise break and surface error
              if (err && err.response && err.response.status === 404) {
                // continue to next attempt
                continue;
              }
              // non-404 error: rethrow to be handled below
              throw err;
            }
          }

          if (!succeeded) {
            console.error("Accept/Reject attempts failed for user", userId, {
              tried,
              error: lastErr,
            });
            throw (
              lastErr ||
              new Error("Accept/Reject failed (no matching endpoint)")
            );
          }

          // Refresh counts and pending/followers lists
          const [countsRes, followersRes, pendingRes] = await Promise.all([
            apiClient.get("/follows/"),
            apiClient.get("/follows/followers/"),
            apiClient.get("/follows/pending_requests/"),
          ]);
          setCounts(countsRes.data);
          const mappedFollowers = (followersRes.data.results || []).map(
            (item) => {
              const user = item.follower;
              return {
                id: user.id,
                name:
                  `${user.first_name} ${user.last_name}`.trim() ||
                  user.username,
                username: user.username,
                avatar:
                  user.profile_picture || "/user-profile-illustration.png",
              };
            }
          );
          setFollowers(mappedFollowers);
          const mappedPending = (pendingRes.data.results || []).map((item) => {
            const user = item.follower;
            return {
              id: user.id,
              name:
                `${user.first_name} ${user.last_name}`.trim() || user.username,
              username: user.username,
              avatar: user.profile_picture || "/user-profile-illustration.png",
            };
          });
          setPending(mappedPending);
        } catch (err) {
          console.error("Accept/Reject error:", err);
          // Friendly message with hint
          alert(
            `${action} failed. Server returned ${
              err?.response?.status || "an error"
            }. Check console for details.`
          );
        }
      } else {
        alert(`Demo: ${action} user with id ${userId}`);
      }
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
