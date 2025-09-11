import React from "react";
import { useNavigate } from "react-router";

const UserProfileLink = ({
  user,
  username,
  children,
  className = "",
  asDiv = false,
}) => {
  const navigate = useNavigate();

  // Support both user object and username string for backward compatibility
  const targetUsername = username || user?.username;

  const handleClick = (e) => {
    e.preventDefault();

    // Get user ID for navigation - this is what we need for full user data
    let userIdentifier = null;

    if (user?.id) {
      userIdentifier = user.id;
      console.log("🆔 Using user ID for profile:", userIdentifier);
    } else if (targetUsername) {
      userIdentifier = targetUsername;
      console.log("📝 Using username for profile:", userIdentifier);
    }

    if (userIdentifier) {
      console.log("🔍 Full user object being passed:", user);
      // Navigate to user profile page with the identifier (no encoding needed)
      navigate(`/profile/${userIdentifier}`);
    }
  };

  const Component = asDiv ? "div" : "button";

  return (
    <Component
      onClick={handleClick}
      className={`hover:underline focus:outline-none cursor-pointer ${className}`}
    >
      {children || user?.full_name || user?.username || username}
    </Component>
  );
};

export default UserProfileLink;
