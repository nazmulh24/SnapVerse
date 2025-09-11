import {
  MdLocationOn,
  MdCalendarMonth,
  MdLink,
  MdLock,
  MdPublic,
  MdVerified,
  MdPersonAdd,
  MdPersonRemove,
  MdMessage,
  MdMoreVert,
  MdEdit,
} from "react-icons/md";
import { useNavigate } from "react-router";
// import { getAvatarUrl } from "../Account/accountUtils";

const ProfileInfo = ({
  profileUser,
  avatarUrl,
  fullName,
  handleFollow,
  handleMessage,
  joinDate,
  followersCount,
  isFollowing,
  isOwnProfile,
  canViewPrivateContent,
}) => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  // Return early if profileUser is null
  if (!profileUser) {
    return (
      <div className="relative px-8 pb-8 bg-white">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    //--> Profile Info Section
    <div className="relative px-8 pb-8 bg-white">
      {/* Account Visibility Badge - Top Right */}
      <div className="absolute top-6 right-8">
        <div
          className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm border backdrop-blur-sm ${
            profileUser.is_private
              ? "bg-amber-50/90 text-amber-800 border-amber-200"
              : "bg-emerald-50/90 text-emerald-800 border-emerald-200"
          }`}
        >
          {profileUser.is_private ? (
            <>
              <MdLock className="w-4 h-4" />
              Private
            </>
          ) : (
            <>
              <MdPublic className="w-4 h-4" />
              Public
            </>
          )}
        </div>
      </div>

      {/* Profile Picture */}
      <div className="absolute -top-20 left-8">
        <div className="relative">
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 p-1 shadow-2xl">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-full h-full rounded-full shadow-lg object-cover"
                onError={(e) => {
                  // Hide the image and show the fallback
                  e.target.style.display = "none";
                  const fallback = e.target.nextElementSibling;
                  if (fallback) {
                    fallback.style.display = "flex";
                  }
                }}
              />
            ) : null}
            {/* Fallback: Show first letter of name */}
            <div
              className={`w-full h-full rounded-full shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center ${
                avatarUrl ? "hidden" : "flex"
              }`}
            >
              <span className="text-white text-4xl font-bold">
                {fullName
                  ? fullName.trim().split(" ")[0].charAt(0).toUpperCase() +
                    fullName.trim().split(" ")[1].charAt(0).toUpperCase()
                  : "U"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="pt-24">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                    {fullName || "Full Name"}
                  </h1>
                  {profileUser.is_verified && (
                    <MdVerified className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <p className="text-slate-600 text-lg font-medium">
                  {profileUser.username || "Username"}
                </p>

                {/* Bio */}
                {profileUser.bio ? (
                  <p className="text-slate-700 text-base leading-relaxed max-w-2xl">
                    {profileUser.bio || "Bio"}
                  </p>
                ) : (
                  <p className="text-slate-400 italic">No bio available</p>
                )}
              </div>

              {/* Action Buttons - Mobile/Tablet */}
              {!isOwnProfile && (
                <div className="flex flex-col sm:flex-row gap-3 sm:hidden lg:hidden">
                  <button
                    onClick={handleFollow}
                    className={`group px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl ${
                      isFollowing
                        ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <MdPersonRemove className="w-4 h-4" />
                        <span>Unfollow</span>
                      </>
                    ) : (
                      <>
                        <MdPersonAdd className="w-4 h-4" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleMessage}
                    className="group bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 border-2 border-slate-200 hover:border-slate-300 font-semibold shadow-md hover:shadow-lg"
                  >
                    <MdMessage className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                </div>
              )}

              {/* Edit Profile Button - Mobile/Tablet */}
              {isOwnProfile && (
                <div className="flex flex-col sm:flex-row gap-3 sm:hidden lg:hidden">
                  <button
                    onClick={handleEditProfile}
                    className="group bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <MdEdit className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              )}
            </div>

            {/* Profile Stats */}
            <div className="flex items-center justify-start gap-8 py-4">
              {/* Posts */}
              <div className="text-center min-w-0">
                <div className="text-xl font-bold text-slate-900">
                  {canViewPrivateContent
                    ? (profileUser.posts_count || 0).toLocaleString()
                    : profileUser.is_private && !isOwnProfile
                    ? "—"
                    : (profileUser.posts_count || 0).toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">Posts</div>
              </div>

              {/* Followers */}
              <div className="text-center min-w-0 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-1 transition-colors">
                <div className="text-xl font-bold text-slate-900">
                  {canViewPrivateContent
                    ? followersCount.toLocaleString()
                    : profileUser.is_private && !isOwnProfile
                    ? "—"
                    : followersCount.toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">Followers</div>
              </div>

              {/* Following */}
              <div className="text-center min-w-0 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-1 transition-colors">
                <div className="text-xl font-bold text-slate-900">
                  {canViewPrivateContent
                    ? (profileUser.following_count || 0).toLocaleString()
                    : profileUser.is_private && !isOwnProfile
                    ? "—"
                    : (profileUser.following_count || 0).toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">Following</div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Desktop */}
          {!isOwnProfile && (
            <div className="hidden sm:flex lg:flex flex-col gap-3 lg:mt-0 min-w-[180px]">
              <button
                onClick={handleFollow}
                className={`group px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl ${
                  isFollowing
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isFollowing ? (
                  <>
                    <MdPersonRemove className="w-4 h-4" />
                    <span>Unfollow</span>
                  </>
                ) : (
                  <>
                    <MdPersonAdd className="w-4 h-4" />
                    <span>Follow</span>
                  </>
                )}
              </button>

              <button
                onClick={handleMessage}
                className="group bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 border-2 border-slate-200 hover:border-slate-300 font-semibold shadow-md hover:shadow-lg"
              >
                <MdMessage className="w-4 h-4" />
                <span>Message</span>
              </button>
            </div>
          )}

          {/* Edit Profile Button for own profile */}
          {isOwnProfile && (
            <div className="hidden sm:flex lg:flex flex-col gap-3 lg:mt-0 min-w-[180px]">
              <button
                onClick={handleEditProfile}
                className="group bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                <MdEdit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="flex flex-wrap gap-6 mt-6 text-sm text-slate-600">
          {profileUser.location && (
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
              <MdLocationOn className="w-4 h-4 text-slate-500" />
              <span className="font-medium">
                {profileUser.location || "Location"}
              </span>
            </div>
          )}
          {joinDate && (
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
              <MdCalendarMonth className="w-4 h-4 text-slate-500" />
              <span className="font-medium">Joined {joinDate || "Date"}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
