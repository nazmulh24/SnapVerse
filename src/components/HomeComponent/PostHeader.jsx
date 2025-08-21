import React from "react";
import { MdMoreVert } from "react-icons/md";

const PostHeader = ({ user, timeAgo, onMenuClick }) => {
  return (
    <div className="flex items-center p-4">
      <img
        src={user.avatar || "/user-profile-illustration.png"}
        alt={user.username}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="ml-3 flex-1">
        <p className="font-semibold text-gray-900">{user.username}</p>
        <p className="text-sm text-gray-500">{timeAgo}</p>
      </div>
      <button
        onClick={onMenuClick}
        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
        title="More options"
      >
        <MdMoreVert className="text-xl" />
      </button>
    </div>
  );
};

export default PostHeader;
