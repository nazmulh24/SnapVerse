import React, { useState, useRef, useEffect } from "react";
import Logo from "./Logo";
import NavigationItems from "./NavigationItems";
import UserProfileSection from "./UserProfileSection";

const DesktopSidebar = ({ user, onWidthChange }) => {
  const [width, setWidth] = useState(320); // Default width 320px
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(320);
  const sidebarRef = useRef(null);

  // Constraints
  const MIN_WIDTH = 275;
  const MAX_WIDTH = 500;

  // Handle mouse down on resize handle
  const handleMouseDown = (e) => {
    setIsResizing(true);
    setStartX(e.clientX);
    setStartWidth(width);
    e.preventDefault();
  };

  // Handle mouse move during resize
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const deltaX = e.clientX - startX;
      const newWidth = startWidth + deltaX;

      // Apply constraints
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setWidth(newWidth);

        // Callback to parent component if provided
        if (onWidthChange) {
          onWidthChange(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none"; // Prevent text selection during resize
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = ""; // Reset text selection
    };
  }, [isResizing, startX, startWidth, onWidthChange]);

  // Initialize width change callback on mount
  useEffect(() => {
    if (onWidthChange) {
      onWidthChange(320); // Set initial width
    }
  }, [onWidthChange]);

  return (
    <div
      ref={sidebarRef}
      className="hidden sm:flex absolute left-0 top-0 h-screen bg-white border-r border-gray-200 flex-col z-40 overflow-y-auto"
      style={{ width: `${width}px` }}
    >
      {/* Logo */}
      <Logo />

      {/* Navigation Items */}
      <NavigationItems isMobile={false} />

      {/* User Profile Section */}
      <UserProfileSection user={user}  />

      {/* Resize Handle */}
      <div
        className={`absolute right-0 top-0 h-full w-2 cursor-ew-resize transition-colors duration-200 ${
          isResizing
            ? "bg-blue-500 bg-opacity-50"
            : "bg-transparent hover:bg-blue-300 hover:bg-opacity-30"
        }`}
        onMouseDown={handleMouseDown}
        title={`Drag to resize sidebar (${MIN_WIDTH}px - ${MAX_WIDTH}px)`}
      >
        {/* Visual indicator for resize handle */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-gray-400 rounded-l opacity-0 hover:opacity-100 transition-opacity duration-200"></div>

        {/* Width indicator during resize */}
        {isResizing && (
          <div className="absolute right-2 top-4 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {Math.round(width)}px
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopSidebar;
