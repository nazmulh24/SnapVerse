import React from "react";
import { MdLocationOn } from "react-icons/md";
import UserProfileLink from "../shared/UserProfileLink";

const PostHeader = ({ user, timeAgo, location, isEdited }) => {
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
      </div>
    </div>
  );
};

export default PostHeader;
