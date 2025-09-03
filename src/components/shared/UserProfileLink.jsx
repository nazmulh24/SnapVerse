import React from "react";

const UserProfileLink = ({ user, children, className = "" }) => {
  const handleClick = (e) => {
    e.preventDefault();
    // Navigate to user profile - you can implement this with your router
    console.log(`Navigate to profile: ${user.username}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`hover:underline focus:outline-none ${className}`}
    >
      {children || user.full_name || user.username}
    </button>
  );
};

export default UserProfileLink;
