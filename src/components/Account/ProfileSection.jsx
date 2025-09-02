import React, { useState } from "react";
import Post from "../HomeComponent/Post";
import LoadingSpinner from "../shared/LoadingSpinner";
import InfiniteScrollTrigger from "../shared/InfiniteScrollTrigger";
import {
  MdEdit,
  MdLocationOn,
  MdCalendarMonth,
  MdLink,
  MdPerson,
  MdLock,
  MdPublic,
  MdVerified,
  MdWork,
  MdSchool,
  MdFavorite,
  MdPhone,
  MdEmail,
  MdInfo,
} from "react-icons/md";

const ProfileSection = ({
  user,
  posts,
  isLoadingProfile,
  hasNextPage,
  loading,
  onLike,
  onComment,
  onShare,
  onLoadMore,
  getAvatarUrl,
  getCoverPhotoUrl,
}) => {
  const [activeTab, setActiveTab] = useState("posts");

  const coverPhotoUrl = getCoverPhotoUrl(user);
  const avatarUrl = getAvatarUrl(user);
  const fullName =
    user.full_name ||
    `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
    user.username;
  const joinDate = user.date_joined
    ? new Date(user.date_joined).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : null;

  // Extract images from posts
  const userImages =
    posts
      ?.filter((post) => post.image)
      .map((post) => ({
        id: post.id,
        url: post.image,
        caption: post.content,
      })) || [];

  // Profile tabs
  const profileTabs = [
    { id: "posts", label: "Posts", count: posts?.length || 0 },
    { id: "about", label: "About" },
    { id: "photos", label: "Photos", count: userImages.length },
  ];

  return (
    <div className="bg-white shadow-xl rounded-b-3xl overflow-hidden">
      {/* Cover Photo Section */}
      <div className="relative h-72 sm:h-80 lg:h-96 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        {coverPhotoUrl ? (
          <img
            src={coverPhotoUrl}
            alt="Cover Photo"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 flex items-center justify-center">
            <div className="text-center text-white/80">
              <MdPerson className="w-24 h-24 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Add a cover photo</p>
            </div>
          </div>
        )}

        {/* Edit Cover Button */}
        <button className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm hover:bg-white text-slate-700 hover:text-slate-900 px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl border border-white/20 font-medium">
          <MdEdit className="w-4 h-4" />
          Edit Cover
        </button>

        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
      </div>

      {/* Profile Info Section */}
      <div className="relative px-8 pb-8 bg-white">
        {/* Account Visibility Badge - Top Right */}
        <div className="absolute top-6 right-8">
          <div
            className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm border backdrop-blur-sm ${
              user.is_private || user.account_type === "private"
                ? "bg-amber-50/90 text-amber-800 border-amber-200"
                : "bg-emerald-50/90 text-emerald-800 border-emerald-200"
            }`}
          >
            {user.is_private || user.account_type === "private" ? (
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
          <div className="relative group">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 p-1 shadow-2xl">
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover"
              />
            </div>
            <button className="absolute bottom-3 right-3 bg-slate-700 hover:bg-slate-800 text-white p-2.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-110">
              <MdEdit className="w-4 h-4" />
            </button>
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
                      {fullName}
                    </h1>
                    {user.is_verified && (
                      <MdVerified className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <p className="text-slate-600 text-lg font-medium">
                    @{user.username}
                  </p>

                  {/* Bio */}
                  {user.bio ? (
                    <p className="text-slate-700 text-base leading-relaxed max-w-2xl">
                      {user.bio}
                    </p>
                  ) : (
                    <p className="text-slate-400 italic">
                      Add a bio to tell people about yourself
                    </p>
                  )}
                </div>

                {/* Action Buttons - Mobile/Tablet */}
                <div className="flex flex-col sm:flex-row gap-3 sm:hidden lg:hidden">
                  <button className="group bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
                    <MdEdit className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                  <button className="group bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 border-2 border-slate-200 hover:border-slate-300 font-semibold shadow-md hover:shadow-lg">
                    <MdLink className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Profile Stats */}
              <div className="flex gap-8 py-4">
                {/* Posts */}
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-900">
                    {posts.length}
                  </div>
                  <div className="text-sm text-slate-600">Posts</div>
                </div>

                {/* Followers */}
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-900">
                    {(user.followers_count || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-600">Followers</div>
                </div>

                {/* Following */}
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-900">
                    {(user.following_count || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-600">Following</div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Desktop */}
            <div className="hidden sm:flex lg:flex flex-col gap-3 lg:mt-0 min-w-[180px]">
              <button className="group bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
                <MdEdit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>

              <button className="group bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 border-2 border-slate-200 hover:border-slate-300 font-semibold shadow-md hover:shadow-lg">
                <MdLink className="w-4 h-4" />
                <span>Share Profile</span>
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex flex-wrap gap-6 mt-6 text-sm text-slate-600">
            {user.location && (
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
                <MdLocationOn className="w-4 h-4 text-slate-500" />
                <span className="font-medium">{user.location}</span>
              </div>
            )}
            {joinDate && (
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
                <MdCalendarMonth className="w-4 h-4 text-slate-500" />
                <span className="font-medium">Joined {joinDate}</span>
              </div>
            )}
            {user.website && (
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
                <MdLink className="w-4 h-4 text-slate-500" />
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200"
                >
                  {user.website}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-8">
          <nav className="flex space-x-8" aria-label="Profile sections">
            {profileTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-50">
        {activeTab === "posts" && (
          <div className="px-8 py-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              My Posts
            </h3>
            {isLoadingProfile ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <Post
                    key={post.id}
                    post={post}
                    onLike={onLike}
                    onComment={onComment}
                    onShare={onShare}
                  />
                ))}
                {hasNextPage && (
                  <InfiniteScrollTrigger
                    loading={loading}
                    onLoadMore={onLoadMore}
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No posts yet</div>
                <p className="text-gray-500">
                  Share your first post to get started!
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "about" && (
          <div className="px-8 py-6">
            <div className="max-w-3xl">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MdPerson className="w-6 h-6 text-blue-600" />
                  About Me
                </h3>

                <div className="space-y-6">
                  {/* Bio Section */}
                  {user.bio ? (
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <MdEdit className="w-4 h-4 text-blue-600" />
                        Bio
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {user.bio}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-6 border border-gray-200 border-dashed">
                      <h4 className="font-semibold text-gray-500 mb-3 flex items-center gap-2">
                        <MdEdit className="w-4 h-4 text-gray-400" />
                        Bio
                      </h4>
                      <p className="text-gray-400 italic">
                        Tell people about yourself...
                      </p>
                    </div>
                  )}

                  {/* Personal Information */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <MdPerson className="w-4 h-4 text-blue-600" />
                      Personal Information
                    </h4>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Email */}
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex-shrink-0">
                          <MdEmail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-500">
                            Email
                          </p>
                          <p
                            className={`text-sm ${
                              user.email
                                ? "text-gray-800"
                                : "text-gray-400 italic"
                            } truncate`}
                          >
                            {user.email || "Email not set yet"}
                          </p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex-shrink-0">
                          <MdPhone className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-500">
                            Phone
                          </p>
                          <p
                            className={`text-sm ${
                              user.phone || user.phone_number
                                ? "text-gray-800"
                                : "text-gray-400 italic"
                            } truncate`}
                          >
                            {user.phone ||
                              user.phone_number ||
                              "Phone number not set yet"}
                          </p>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex-shrink-0">
                          <MdLocationOn className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-500">
                            Location
                          </p>
                          <p
                            className={`text-sm ${
                              user.location
                                ? "text-gray-800"
                                : "text-gray-400 italic"
                            } truncate`}
                          >
                            {user.location || "Location not set yet"}
                          </p>
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex-shrink-0">
                          <MdFavorite className="w-5 h-5 text-pink-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-500">
                            Date of Birth
                          </p>
                          <p
                            className={`text-sm ${
                              user.date_of_birth
                                ? "text-gray-800"
                                : "text-gray-400 italic"
                            } truncate`}
                          >
                            {user.date_of_birth
                              ? new Date(user.date_of_birth).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : "Date of birth not set yet"}
                          </p>
                        </div>
                      </div>

                      {/* Join Date */}
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex-shrink-0">
                          <MdCalendarMonth className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-500">
                            Joined
                          </p>
                          <p className="text-sm text-gray-800">
                            {joinDate || "Recently joined"}
                          </p>
                        </div>
                      </div>

                      {/* Website */}
                      {user.website && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex-shrink-0">
                            <MdLink className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-500">
                              Website
                            </p>
                            <a
                              href={user.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 truncate transition-colors"
                            >
                              {user.website}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "photos" && (
          <div className="px-8 py-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Photos
            </h3>
            {userImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {userImages.map((image) => (
                  <div
                    key={image.id}
                    className="aspect-square rounded-lg overflow-hidden"
                  >
                    <img
                      src={
                        image.url.startsWith("http")
                          ? image.url
                          : `https://res.cloudinary.com/dlkq5sjum/${image.url}`
                      }
                      alt={`Photo by ${fullName}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No photos yet</div>
                <p className="text-gray-500">
                  Share some photos to see them here!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
