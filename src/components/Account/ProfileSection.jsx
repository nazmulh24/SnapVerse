import React, { useState } from "react";
import ProfileCover from "../UserProfile/ProfileCover";
import ProfileInfo from "../UserProfile/ProfileInfo";
import ProfileTabs from "../UserProfile/ProfileTabs";
import PostsTab from "../UserProfile/PostsTab";
import AboutTab from "../UserProfile/AboutTab";
import PhotosTab from "../UserProfile/PhotosTab";
import { getAvatarUrl, getCoverPhotoUrl } from "./accountUtils";

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
}) => {
  const [activeTab, setActiveTab] = useState("posts");

  // Helper function to get user's full name
  const getFullName = () => {
    if (!user) return "Loading...";

    const name = `${user.first_name || ""} ${user.last_name || ""}`.trim();
    return name || user.username || "User";
  };

  // Helper function to get join date
  const getJoinDate = () => {
    if (!user?.date_joined) return "Unknown";

    return new Date(user.date_joined).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // Get calculated values using the same logic as UserProfile
  const fullName = getFullName();
  const avatarUrl = getAvatarUrl(user);
  const coverPhotoUrl = getCoverPhotoUrl(user);
  const joinDate = getJoinDate();

  // Extract images from posts for PhotosTab
  const userImages =
    posts
      ?.filter((post) => post.image)
      .map((post) => ({
        id: post.id,
        image: post.image, // PhotosTab expects 'image' property, not 'url'
        content: post.content,
      })) || [];

  // Props for UserProfile components
  const profileData = {
    profileUser: user,
    userPosts: posts,
    followersCount: user?.followers_count || 0,
    isFollowing: false, // Since this is the user's own profile
    isOwnProfile: true, // This is always own profile in account page
    isLoadingProfile,
    loading,
    loadingUserPosts: loading,
    hasNextPage,
    handleLike: onLike,
    handleComment: onComment,
    handleShare: onShare,
    handleFollow: () => {}, // Not needed for own profile
    loadMorePosts: onLoadMore,
  };

  return (
    <div className="bg-white shadow-xl rounded-b-3xl overflow-hidden">
      {/* Reuse existing UserProfile components */}
      <ProfileCover coverPhotoUrl={coverPhotoUrl} />

      <ProfileInfo
        profileUser={user}
        avatarUrl={avatarUrl}
        fullName={fullName}
        followersCount={user?.followers_count || 0}
        isFollowing={false}
        isOwnProfile={true}
        handleFollow={() => {}}
        joinDate={joinDate}
      />

      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="bg-gray-50">
        {activeTab === "posts" && <PostsTab {...profileData} />}

        {activeTab === "about" && (
          <AboutTab profileUser={user} isOwnProfile={true} />
        )}

        {activeTab === "photos" && (
          <PhotosTab
            userImages={userImages}
            isOwnProfile={true}
            fullName={fullName}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
