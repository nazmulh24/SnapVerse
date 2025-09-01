import React from "react";
import {
  MdFavorite,
  MdPersonAdd,
  MdComment,
  MdAlternateEmail,
  MdShare,
  MdNotifications,
} from "react-icons/md";

const RecentActivity = ({ activities = [] }) => {
  const defaultActivities = [
    {
      id: 1,
      user: "alice_wonder",
      fullName: "Alice Wonderland",
      action: "liked your photo",
      time: "2h",
      avatar:
        "https://ui-avatars.com/api/?name=Alice+Wonderland&background=ff6b6b&color=fff",
      type: "like",
      isRead: false,
    },
    {
      id: 2,
      user: "bob_builder",
      fullName: "Bob Builder",
      action: "started following you",
      time: "4h",
      avatar:
        "https://ui-avatars.com/api/?name=Bob+Builder&background=4ecdc4&color=fff",
      type: "follow",
      isRead: false,
    },
    {
      id: 3,
      user: "charlie_brown",
      fullName: "Charlie Brown",
      action: "commented on your post",
      time: "6h",
      avatar:
        "https://ui-avatars.com/api/?name=Charlie+Brown&background=45b7d1&color=fff",
      type: "comment",
      isRead: true,
    },
    {
      id: 4,
      user: "diana_prince",
      fullName: "Diana Prince",
      action: "mentioned you in a comment",
      time: "1d",
      avatar:
        "https://ui-avatars.com/api/?name=Diana+Prince&background=f7b731&color=fff",
      type: "mention",
      isRead: true,
    },
    {
      id: 5,
      user: "emma_watson",
      fullName: "Emma Watson",
      action: "shared your post",
      time: "2d",
      avatar:
        "https://ui-avatars.com/api/?name=Emma+Watson&background=5f27cd&color=fff",
      type: "share",
      isRead: true,
    },
    {
      id: 6,
      user: "frank_ocean",
      fullName: "Frank Ocean",
      action: "liked your comment",
      time: "3d",
      avatar:
        "https://ui-avatars.com/api/?name=Frank+Ocean&background=00d2d3&color=fff",
      type: "like",
      isRead: true,
    },
  ];

  const displayActivities =
    activities.length > 0 ? activities : defaultActivities;

  // Get icon based on activity type
  const getActivityIcon = (type) => {
    const iconClass = "w-3 h-3";
    switch (type) {
      case "like":
        return <MdFavorite className={`${iconClass} text-red-500`} />;
      case "follow":
        return <MdPersonAdd className={`${iconClass} text-blue-500`} />;
      case "comment":
        return <MdComment className={`${iconClass} text-green-500`} />;
      case "mention":
        return <MdAlternateEmail className={`${iconClass} text-purple-500`} />;
      case "share":
        return <MdShare className={`${iconClass} text-orange-500`} />;
      default:
        return <MdNotifications className={`${iconClass} text-gray-500`} />;
    }
  };

  return (
    <div className="mx-4 my-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Recent Activity
            </h3>
            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">
              View All
            </button>
          </div>
        </div>

        {/* Activities List */}
        <div className="divide-y divide-gray-50">
          {displayActivities.slice(0, 6).map((activity) => (
            <div
              key={activity.id}
              className={`flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                !activity.isRead ? "bg-blue-50/30" : ""
              }`}
            >
              {/* Avatar with activity icon */}
              <div className="relative flex-shrink-0">
                <img
                  src={activity.avatar}
                  alt={activity.fullName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-gray-200">
                  {getActivityIcon(activity.type)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium text-gray-900">
                    {activity.fullName}
                  </span>{" "}
                  <span className="text-gray-600">{activity.action}</span>
                </p>
                <div className="flex items-center space-x-2 mt-0.5">
                  <p className="text-xs text-gray-500">{activity.time}</p>
                  {!activity.isRead && (
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show more button */}
        {displayActivities.length > 6 && (
          <div className="px-4 py-3 border-t border-gray-100">
            <button className="text-xs text-gray-600 hover:text-gray-900 font-medium w-full text-center">
              Show {displayActivities.length - 6} more activities
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
