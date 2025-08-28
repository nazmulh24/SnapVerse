import { useState, useEffect } from "react";
import useAuthContext from "../hooks/useAuthContext";
import apiClient from "../services/api-client";

// Dynamic lists for following and pending
const tabList = [
  { key: "followers", label: "Followers" },
  { key: "following", label: "Following" },
  { key: "pending", label: "Pending Requests" },
];

const ConnectionsPage = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState("followers");
  const [counts, setCounts] = useState({
    followers_count: 0,
    following_count: 0,
    pending_requests_count: 0,
  });
  const [followers, setFollowers] = useState([]);
  const [requestSent, setRequestSent] = useState([]); // store user ids for whom request sent
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
        console.log("/follows/followers/ response:", res.data);
        // Map API data to UI fields (paginated results)
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
        // Map API data to UI fields (paginated results)
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
        // Map API data to UI fields (paginated results)
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
  }, []);

  const tabCounts = {
    followers: counts.followers_count,
    following: counts.following_count,
    pending: counts.pending_requests_count,
  };

  const getList = () => {
    switch (activeTab) {
      case "followers":
        return followers;
      case "following":
        return following;
      case "pending":
        return pending;
      default:
        return [];
    }
  };

  const handleAction = async (userId, action) => {
    if (action === "Follow Back") {
      try {
        await apiClient.post("/follows/follow_user/", { user_id: userId });
        // If user is private, show 'Request Sent', else refresh followers
        if (user?.is_private) {
          setRequestSent((prev) => [...prev, userId]);
        } else {
          // Refresh counts and followers
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
        // Refresh counts and following
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

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-extrabold mb-4 text-purple-800 tracking-tight">
        Connections
      </h2>
      <div className="flex gap-3 mb-8 justify-center">
        {tabList.map((tab) => (
          <button
            key={tab.key}
            className={`px-5 py-2 rounded-full font-semibold shadow-sm transition-colors duration-150 border text-sm flex items-center gap-2 ${
              activeTab === tab.key
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-purple-700 border-gray-200 hover:bg-purple-50"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span>{tab.label}</span>
            <span
              className={`inline-block min-w-[1.5em] px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === tab.key
                  ? "bg-white text-purple-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {tabCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>
      <div>
        {getList().length === 0 ? (
          <div className="text-gray-400 text-center py-12 text-lg font-medium">
            No users found.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {getList().map((user) => {
              // Only show Follow Back if not already following
              const isFollowing = following.some((f) => f.id === user.id);
              return (
                <li
                  key={user.id}
                  className="flex items-center gap-5 py-5 group hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-purple-100 shadow-sm group-hover:border-purple-400 transition-all"
                    />
                    {/* Online dot for demo */}
                    <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-lg truncate">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {user.username}
                    </div>
                  </div>
                  {activeTab === "followers" &&
                    !isFollowing &&
                    (requestSent.includes(user.id) ? (
                      <span className="px-5 py-2 rounded-full bg-gray-100 text-gray-500 font-semibold shadow-sm border border-gray-200">
                        Request Sent
                      </span>
                    ) : (
                      <button
                        className="px-5 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition-colors shadow-sm"
                        onClick={() => handleAction(user.id, "Follow Back")}
                      >
                        Follow Back
                      </button>
                    ))}
                  {activeTab === "following" && (
                    <button
                      className="px-5 py-2 rounded-full bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition-colors shadow-sm"
                      onClick={() => handleAction(user.id, "Unfollow")}
                    >
                      Unfollow
                    </button>
                  )}
                  {activeTab === "pending" && (
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition-colors shadow-sm"
                        onClick={() => handleAction(user.id, "Accept")}
                      >
                        Accept
                      </button>
                      <button
                        className="px-4 py-2 rounded-full bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition-colors shadow-sm"
                        onClick={() => handleAction(user.id, "Reject")}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConnectionsPage;
