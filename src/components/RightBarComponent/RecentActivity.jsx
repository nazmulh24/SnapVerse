import React from "react";

const RecentActivity = ({ activities = [] }) => {
  const defaultActivities = [
    {
      id: 1,
      user: "alice_wonder",
      action: "liked your photo",
      time: "2h",
      avatar: "/user-profile-illustration.png",
    },
    {
      id: 2,
      user: "bob_builder",
      action: "started following you",
      time: "4h",
      avatar: "/user-profile-illustration.png",
    },
    {
      id: 3,
      user: "charlie_brown",
      action: "commented on your post",
      time: "6h",
      avatar: "/user-profile-illustration.png",
    },
    {
      id: 4,
      user: "diana_prince",
      action: "mentioned you in a comment",
      time: "1d",
      avatar: "/user-profile-illustration.png",
    },
  ];

  const displayActivities =
    activities.length > 0 ? activities : defaultActivities;

  return (
    <div className="p-6 border-t border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500">Recent Activity</h3>
        <button className="text-xs text-gray-900 hover:text-gray-600 font-semibold">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {displayActivities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-3">
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
