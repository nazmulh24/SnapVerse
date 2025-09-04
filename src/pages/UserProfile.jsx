import React, { useState } from "react";
import { useParams } from "react-router";
import useUserProfile from "../hooks/useUserProfile";
import LoadingSpinner from "../components/shared/LoadingSpinner";

// Modular components
import ProfileHeader from "../components/UserProfile/ProfileHeader";
import ProfileCover from "../components/UserProfile/ProfileCover";
import ProfileInfo from "../components/UserProfile/ProfileInfo";
import ProfileTabs from "../components/UserProfile/ProfileTabs";
import PostsTab from "../components/UserProfile/PostsTab";
import AboutTab from "../components/UserProfile/AboutTab";
import PhotosTab from "../components/UserProfile/PhotosTab";

const UserProfile = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("posts");

  const {
    profileUser,
    userPosts,
    followersCount,
    isFollowing,
    isOwnProfile,
    isLoadingProfile,
    loading,
    loadingUserPosts,
    hasNextPage,
    handleLike,
    handleComment,
    handleShare,
    handleFollow,
    loadMorePosts,
  } = useUserProfile(username);

  // Loading state
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Helper function to get user's full name
  const getFullName = () => {
    if (!profileUser) return "Loading...";

    const name = `${profileUser.first_name || ""} ${
      profileUser.last_name || ""
    }`.trim();
    return name || profileUser.username || "Unknown User";
  };

  // Helper function to get join date
  const getJoinDate = () => {
    if (!profileUser?.date_joined) return "Unknown";

    return new Date(profileUser.date_joined).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // Handle back navigation
  const handleBack = () => window.history.back();

  // Helper function to get proper image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }
    return `https://res.cloudinary.com/dlkq5sjum/${imageUrl}`;
  };

  // Derived values
  const fullName = getFullName();
  const avatarUrl = getImageUrl(profileUser?.profile_picture); // Don't add fallback here, let ProfileInfo handle it
  const coverPhotoUrl = getImageUrl(profileUser?.cover_photo);
  const joinDate = getJoinDate();

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <PostsTab
            userPosts={userPosts}
            loading={loading}
            loadingUserPosts={loadingUserPosts}
            hasNextPage={hasNextPage}
            isOwnProfile={isOwnProfile}
            profileUser={profileUser}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            onLoadMore={loadMorePosts}
          />
        );
      case "about":
        return <AboutTab profileUser={profileUser} />;
      case "photos":
        return (
          <PhotosTab
            userImages={userPosts}
            isOwnProfile={isOwnProfile}
            fullName={fullName}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ProfileHeader fullName={fullName} onBack={handleBack} />

      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-xl rounded-b-3xl overflow-hidden">
          {/* Cover Photo */}
          <ProfileCover coverPhotoUrl={coverPhotoUrl} />

          {/* Profile Info */}
          <ProfileInfo
            profileUser={profileUser}
            avatarUrl={avatarUrl}
            fullName={fullName}
            followersCount={followersCount}
            isFollowing={isFollowing}
            isOwnProfile={isOwnProfile}
            onFollow={handleFollow}
            userPosts={userPosts}
            joinDate={joinDate}
          />

          {/* Tabs */}
          <ProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            userPosts={userPosts}
          />

          {/* Tab Content */}
          <div className="bg-gray-50">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
