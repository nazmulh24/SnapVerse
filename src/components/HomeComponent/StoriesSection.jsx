import React from "react";
import { BiPlus } from "react-icons/bi";
import { generateLocalAvatar } from "../../utils/avatarUtils";

const StoriesSection = ({ stories = [] }) => {
  const defaultStories = [
    {
      id: 1,
      username: "Your Story",
      hasNewStory: false,
      isOwnStory: true,
      avatar: generateLocalAvatar("You", 64, "#8B5CF6"),
    },
    {
      id: 2,
      username: "Sarah",
      hasNewStory: true,
      avatar: generateLocalAvatar("Sarah", 64, "#EC4899"),
      lastSeen: "2h",
    },
    {
      id: 3,
      username: "Mike",
      hasNewStory: true,
      avatar: generateLocalAvatar("Mike", 64, "#10B981"),
      lastSeen: "5h",
    },
    {
      id: 4,
      username: "Emma",
      hasNewStory: true,
      avatar: generateLocalAvatar("Emma", 64, "#F59E0B"),
      lastSeen: "8h",
    },
    {
      id: 5,
      username: "John",
      hasNewStory: false,
      avatar: generateLocalAvatar("John", 64, "#6B7280"),
      lastSeen: "1d",
    },
    {
      id: 6,
      username: "Lisa",
      hasNewStory: true,
      avatar: generateLocalAvatar("Lisa", 64, "#EF4444"),
      lastSeen: "3h",
    },
    {
      id: 7,
      username: "David",
      hasNewStory: false,
      avatar: generateLocalAvatar("David", 64, "#3B82F6"),
      lastSeen: "2d",
    },
  ];

  const displayStories = stories.length > 0 ? stories : defaultStories;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
      <div className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-2 scrollbar-hide">
        {displayStories.map((story) => (
          <div
            key={story.id}
            className="flex-shrink-0 text-center cursor-pointer group"
          >
            <div className="relative">
              {/* Story Ring */}
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 ${
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
                    onError={(e) => {
                      e.target.src = generateLocalAvatar(story.username, 64);
                    }}
                  />
                </div>
              </div>

              {/* Plus icon for own story */}
              {story.isOwnStory && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center border-2 border-white">
                  <BiPlus className="text-white text-xs sm:text-sm" />
                </div>
              )}
            </div>

            {/* Username */}
            <p className="text-xs mt-1.5 sm:mt-2 truncate w-14 sm:w-16 text-gray-800 font-medium">
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
