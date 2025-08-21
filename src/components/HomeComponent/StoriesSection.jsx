const StoriesSection = ({ stories = [] }) => {
  const defaultStories = [
    { id: 1, username: "User 1", hasNewStory: true },
    { id: 2, username: "User 2", hasNewStory: true },
    { id: 3, username: "User 3", hasNewStory: false },
    { id: 4, username: "User 4", hasNewStory: true },
    { id: 5, username: "User 5", hasNewStory: false },
  ];

  const displayStories = stories.length > 0 ? stories : defaultStories;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Stories</h2>
      <div className="flex space-x-4 overflow-x-auto">
        {displayStories.map((story) => (
          <div
            key={story.id}
            className="flex-shrink-0 text-center cursor-pointer"
          >
            <div
              className={`w-16 h-16 rounded-full p-1 ${
                story.hasNewStory
                  ? "bg-gradient-to-r from-purple-400 to-pink-400"
                  : "bg-gray-300"
              }`}
            >
              <div className="w-full h-full bg-gray-200 rounded-full hover:opacity-90 transition-opacity"></div>
            </div>
            <p className="text-xs mt-1 truncate w-16">{story.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoriesSection;
