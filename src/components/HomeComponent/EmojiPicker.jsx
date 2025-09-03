import React, { useRef, useEffect } from "react";

const EmojiPicker = ({ onEmojiSelect, isOpen, onClose }) => {
  const pickerRef = useRef(null);

  const commonEmojis = [
    "😀",
    "😂",
    "😍",
    "🤔",
    "😢",
    "😡",
    "👍",
    "👎",
    "❤️",
    "💯",
    "🔥",
    "✨",
    "🎉",
    "😎",
    "🤗",
    "😭",
    "😘",
    "🥰",
    "😊",
    "🙄",
    "😴",
    "🤯",
    "💪",
    "👏",
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50"
      style={{ minWidth: "240px" }}
    >
      <div className="grid grid-cols-8 gap-1">
        {commonEmojis.map((emoji, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              onEmojiSelect(emoji);
              onClose();
            }}
            className="w-8 h-8 text-lg hover:bg-gray-100 rounded transition-colors flex items-center justify-center"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
