import { useState } from "react";

const demoFollowers = [
  {
    id: 1,
    name: "Alice Wonder",
    username: "alice_wonder",
    avatar: "/user-profile-illustration.png",
  },
  {
    id: 2,
    name: "Bob Builder",
    username: "bob_builder",
    avatar: "/user-profile-illustration.png",
  },
];
const demoFollowing = [
  {
    id: 3,
    name: "Charlie Brown",
    username: "charlie_brown",
    avatar: "/user-profile-illustration.png",
  },
];
const demoPending = [
  {
    id: 4,
    name: "Diana Prince",
    username: "diana_prince",
    avatar: "/user-profile-illustration.png",
  },
];

const tabList = [
  { key: "followers", label: "Followers" },
  { key: "following", label: "Following" },
  { key: "pending", label: "Pending Requests" },
];

const ConnectionsPage = () => {
  const [activeTab, setActiveTab] = useState("followers");

  const followersCount = demoFollowers.length;
  const followingCount = demoFollowing.length;
  const pendingCount = demoPending.length;

  const tabCounts = {
    followers: followersCount,
    following: followingCount,
    pending: pendingCount,
  };

  const getList = () => {
    switch (activeTab) {
      case "followers":
        return demoFollowers;
      case "following":
        return demoFollowing;
      case "pending":
        return demoPending;
      default:
        return [];
    }
  };

  const handleAction = (userId, action) => {
    alert(`Demo: ${action} user with id ${userId}`);
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
            {getList().map((user) => (
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
                    @{user.username}
                  </div>
                </div>
                {activeTab === "followers" && (
                  <button
                    className="px-5 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition-colors shadow-sm"
                    onClick={() => handleAction(user.id, "Follow Back")}
                  >
                    Follow Back
                  </button>
                )}
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
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConnectionsPage;
