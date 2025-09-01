import React from "react";
import { BiPlus } from "react-icons/bi";

const StoriesSection = ({ stories = [] }) => {
  const defaultStories = [
    {
      id: 1,
      username: "Your Story",
      hasNewStory: false,
      isOwnStory: true,
      avatar: "https://via.placeholder.com/64x64/8B5CF6/FFFFFF?text=You",
    },
    {
      id: 2,
      username: "Sarah",
      hasNewStory: true,
      avatar: "https://via.placeholder.com/64x64/EC4899/FFFFFF?text=S",
      lastSeen: "2h",
    },
    {
      id: 3,
      username: "Mike",
      hasNewStory: true,
      avatar: "https://via.placeholder.com/64x64/10B981/FFFFFF?text=M",
      lastSeen: "5h",
    },
    {
      id: 4,
      username: "Emma",
      hasNewStory: true,
      avatar: "https://via.placeholder.com/64x64/F59E0B/FFFFFF?text=E",
      lastSeen: "8h",
    },
    {
      id: 5,
      username: "John",
      hasNewStory: false,
      avatar: "https://via.placeholder.com/64x64/6B7280/FFFFFF?text=J",
      lastSeen: "1d",
    },
    {
      id: 6,
      username: "Lisa",
      hasNewStory: true,
      avatar: "https://via.placeholder.com/64x64/EF4444/FFFFFF?text=L",
      lastSeen: "3h",
    },
    {
      id: 7,
      username: "David",
      hasNewStory: false,
      avatar: "https://via.placeholder.com/64x64/3B82F6/FFFFFF?text=D",
      lastSeen: "2d",
    },
  ];

  const displayStories = stories.length > 0 ? stories : defaultStories;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
        {displayStories.map((story) => (
          <div
            key={story.id}
            className="flex-shrink-0 text-center cursor-pointer group"
          >
            <div className="relative">
              {/* Story Ring */}
              <div
                className={`w-16 h-16 rounded-full p-0.5 ${
                  story.hasNewStory
                    ? "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500"
                    : story.isOwnStory
                    ? "bg-gray-300"
                    : "bg-gray-300"
                }`}
              >
                <div className="w-full h-full bg-white rounded-full p-0.5">
                  <img
                    src={story.avatar}
                    alt={story.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Plus icon for own story */}
              {story.isOwnStory && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                  <BiPlus className="text-white text-sm" />
                </div>
              )}
            </div>

            {/* Username */}
            <p className="text-xs mt-2 truncate w-16 text-gray-800 font-medium">
              {story.username}
            </p>

            {/* Last seen for non-new stories */}
            {!story.hasNewStory && !story.isOwnStory && story.lastSeen && (
              <p className="text-xs text-gray-400">{story.lastSeen}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoriesSection;
