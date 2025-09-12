import React from "react";
import { MdLocationOn } from "react-icons/md";
import { BiGlobe, BiGroup, BiLock, BiEdit, BiTrash } from "react-icons/bi";
import { useNavigate } from "react-router";
import UserProfileLink from "../shared/UserProfileLink";
import useAuthContext from "../../hooks/useAuthContext";

const PostHeader = ({
  user,
  timeAgo,
  location,
  isEdited,
  privacy,
  postId,
  onDelete,
}) => {
  const { user: currentUser } = useAuthContext();
  const navigate = useNavigate();

  // Check if this post belongs to the current user
  const isOwnPost =
    currentUser &&
    user &&
    (currentUser.id === user.id || currentUser.username === user.username);

  // Check if current user is admin
  const isAdmin = currentUser && currentUser.is_staff === true;

  // Admin can edit any post, or user can edit their own post
  const canEdit = isOwnPost || isAdmin;

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
    <div className="flex items-center justify-between p-3 sm:p-4 bg-white">
      <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
        {/* Clickable Profile Picture */}
        <UserProfileLink
          username={user.username}
          asDiv={true}
          className="flex-shrink-0 hover:opacity-90 transition-opacity duration-200"
        >
          <img
            src={user.avatar || "/user-profile-illustration.png"}
            alt={user.full_name || user.username}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-gray-100"
          />
        </UserProfileLink>

        <div className="flex-1 min-w-0">
          {/* Clickable Username */}
          <UserProfileLink
            username={user.username}
            className="font-semibold text-gray-900 text-sm sm:text-base hover:text-blue-600 transition-colors duration-200 block truncate"
          >
            {user.full_name || user.username}
          </UserProfileLink>

          <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-500 mt-0.5">
            <span className="font-medium">{timeAgo}</span>
            {isEdited && (
              <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                <span className="hidden xs:inline">Edited</span>
                <span className="xs:hidden">✏️</span>
              </span>
            )}
            {isOwnPost && privacy && (
              <span
                className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 text-xs font-medium rounded-full ${privacyInfo.className}`}
              >
                <privacyInfo.icon className="w-3 h-3" />
                <span className="hidden sm:inline">{privacyInfo.label}</span>
              </span>
            )}
          </div>

          {/* Location - moved under name/time */}
          {location && (
            <div className="flex items-center gap-1 mt-1 px-1.5 sm:px-2 py-0.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-md w-fit">
              <MdLocationOn className="w-3 h-3" />
              <span className="max-w-32 sm:max-w-48 truncate">{location}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        {canEdit && (
          <button
            onClick={handleEditPost}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium border border-gray-200 hover:border-blue-200"
            title={isAdmin && !isOwnPost ? "Edit post (Admin)" : "Edit post"}
          >
            <BiEdit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Edit</span>
            {isAdmin && !isOwnPost && (
              <span className="text-xs bg-red-500 text-white px-1 rounded ml-1">
                A
              </span>
            )}
          </button>
        )}

        {canEdit && (
          <button
            onClick={onDelete}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium border border-gray-200 hover:border-red-200"
            title={
              isAdmin && !isOwnPost ? "Delete post (Admin)" : "Delete post"
            }
          >
            <BiTrash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Delete</span>
            {isAdmin && !isOwnPost && (
              <span className="text-xs bg-red-500 text-white px-1 rounded ml-1">
                A
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default PostHeader;
