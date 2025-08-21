import React from "react";

const RecentActivity = ({ activities = [] }) => {
  const defaultActivities = [
    {
      id: 1,
      user: "alice_wonder",
      action: "liked your photo",
      time: "2h",
      avatar: "/user-profile-illustration.png",
      type: "like",
    },
    {
      id: 2,
      user: "bob_builder",
      action: "started following you",
      time: "4h",
      avatar: "/user-profile-illustration.png",
      type: "follow",
    },
    {
      id: 3,
      user: "charlie_brown",
      action: "commented on your post",
      time: "6h",
      avatar: "/user-profile-illustration.png",
      type: "comment",
    },
    {
      id: 4,
      user: "diana_prince",
      action: "mentioned you in a comment",
      time: "1d",
      avatar: "/user-profile-illustration.png",
      type: "mention",
    },
    {
      id: 5,
      user: "emma_watson",
      action: "shared your post",
      time: "2d",
      avatar: "/user-profile-illustration.png",
      type: "share",
    },
  ];

  const displayActivities =
    activities.length > 0 ? activities : defaultActivities;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {displayActivities.slice(0, 5).map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer"
          >
            <img
              src={activity.avatar}
              alt={activity.user}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{activity.user}</span>{" "}
                {activity.action}
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
