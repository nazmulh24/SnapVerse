import React from "react";
import { MdLocationOn } from "react-icons/md";
import { BiGlobe, BiGroup, BiLock } from "react-icons/bi";
import UserProfileLink from "../shared/UserProfileLink";
import useAuthContext from "../../hooks/useAuthContext";

const PostHeader = ({ user, timeAgo, location, isEdited, privacy }) => {
  const { user: currentUser } = useAuthContext();
  
  // Check if this post belongs to the current user
  const isOwnPost = currentUser && user && (
    currentUser.id === user.id || 
    currentUser.username === user.username
  );

  // Function to get privacy tag details
  const getPrivacyTag = (privacyLevel) => {
    switch (privacyLevel) {
      case "public":
        return {
          icon: BiGlobe,
          label: "Public",
          className: "text-green-700 bg-green-100",
        };
      case "followers":
        return {
          icon: BiGroup,
          label: "Followers Only",
          className: "text-blue-700 bg-blue-100",
        };
      case "private":
        return {
          icon: BiLock,
          label: "Private",
          className: "text-red-700 bg-red-100",
        };
      default:
        return {
          icon: BiGlobe,
          label: "Public",
          className: "text-green-700 bg-green-100",
        };
    }
  };

  const privacyInfo = getPrivacyTag(privacy);
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center">
        {/* Clickable Profile Picture */}
        <UserProfileLink
          username={user.username}
          asDiv={true}
          className="flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <img
            src={user.avatar || "/user-profile-illustration.png"}
            alt={user.full_name || user.username}
            className="w-10 h-10 rounded-full object-cover"
          />
        </UserProfileLink>

        <div className="ml-3">
          {/* Clickable Username */}
          <UserProfileLink
            username={user.username}
            className="font-semibold text-gray-900 text-sm hover:text-blue-600 transition-colors text-left"
          >
            {user.full_name || user.username}
          </UserProfileLink>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{timeAgo}</span>
            {isEdited && (
              <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                Edited
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {location && (
          <div className="flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
            <MdLocationOn className="text-xs" />
            <span>{location}</span>
          </div>
        )}
        {isOwnPost && privacy && (
          <span
            className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${privacyInfo.className}`}
          >
            <privacyInfo.icon className="text-xs" />
            {privacyInfo.label}
          </span>
        )}
      </div>
    </div>
  );
};

export default PostHeader;
