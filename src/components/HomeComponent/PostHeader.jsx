import React from "react";
import { MdLocationOn } from "react-icons/md";
import { BiGlobe, BiGroup, BiLock, BiEdit } from "react-icons/bi";
import { useNavigate } from "react-router";
import UserProfileLink from "../shared/UserProfileLink";
import useAuthContext from "../../hooks/useAuthContext";

const PostHeader = ({ user, timeAgo, location, isEdited, privacy, postId }) => {
  const { user: currentUser } = useAuthContext();
  const navigate = useNavigate();

  // Check if this post belongs to the current user
  const isOwnPost =
    currentUser &&
    user &&
    (currentUser.id === user.id || currentUser.username === user.username);

  // Handle edit post
  const handleEditPost = () => {
    if (postId) {
      navigate(`/edit-post/${postId}`);
    }
  };

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
    <div className="flex items-center justify-between p-4 bg-white">
      <div className="flex items-center space-x-3">
        {/* Clickable Profile Picture */}
        <UserProfileLink
          username={user.username}
          asDiv={true}
          className="flex-shrink-0 hover:opacity-90 transition-opacity duration-200"
        >
          <img
            src={user.avatar || "/user-profile-illustration.png"}
            alt={user.full_name || user.username}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100"
          />
        </UserProfileLink>

        <div className="flex-1 min-w-0">
          {/* Clickable Username */}
          <UserProfileLink
            username={user.username}
            className="font-semibold text-gray-900 text-sm hover:text-blue-600 transition-colors duration-200 block truncate"
          >
            {user.full_name || user.username}
          </UserProfileLink>

          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
            <span className="font-medium">{timeAgo}</span>
            {isEdited && (
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                Edited
              </span>
            )}
            {isOwnPost && privacy && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${privacyInfo.className}`}
              >
                <privacyInfo.icon className="w-3 h-3" />
                {privacyInfo.label}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {location && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg">
            <MdLocationOn className="w-3.5 h-3.5" />
            <span className="max-w-24 truncate">{location}</span>
          </div>
        )}
        {isOwnPost && (
          <button
            onClick={handleEditPost}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium border border-gray-200 hover:border-blue-200"
            title="Edit post"
          >
            <BiEdit className="w-4 h-4" />
            <span>Edit</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PostHeader;
