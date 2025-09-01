import React, { useState, useRef, useEffect } from "react";

const ReactionPicker = ({ onReactionSelect, onClose, currentReaction }) => {
  const [hoveredReaction, setHoveredReaction] = useState(null);
  const pickerRef = useRef(null);

  const reactions = [
    {
      type: "like",
      emoji: "👍",
      label: "Like",
      color: "hover:bg-blue-50",
    },
    {
      type: "dislike",
      emoji: "👎",
      label: "Dislike",
      color: "hover:bg-red-50",
    },
    {
      type: "love",
      emoji: "❤️",
      label: "Love",
      color: "hover:bg-red-50",
    },
    {
      type: "haha",
      emoji: "😂",
      label: "Haha",
      color: "hover:bg-yellow-50",
    },
    {
      type: "wow",
      emoji: "😮",
      label: "Wow",
      color: "hover:bg-purple-50",
    },
    {
      type: "sad",
      emoji: "😢",
      label: "Sad",
      color: "hover:bg-gray-50",
    },
    {
      type: "angry",
      emoji: "😠",
      label: "Angry",
      color: "hover:bg-orange-50",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleReactionClick = (reactionType) => {
    onReactionSelect(reactionType);
    onClose();
  };

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg border border-gray-200 p-2 flex space-x-1 z-50"
    >
      {reactions.map((reaction) => (
        <button
          key={reaction.type}
          onClick={() => handleReactionClick(reaction.type)}
          onMouseEnter={() => setHoveredReaction(reaction.type)}
          onMouseLeave={() => setHoveredReaction(null)}
          className={`w-10 h-10 rounded-full transition-all hover:scale-110 flex items-center justify-center ${
            reaction.color
          } ${currentReaction === reaction.type ? "ring-2 ring-blue-400" : ""}`}
        >
          <span className="text-lg">{reaction.emoji}</span>

          {/* Simple tooltip */}
          {hoveredReaction === reaction.type && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
              {reaction.label}
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default ReactionPicker;
