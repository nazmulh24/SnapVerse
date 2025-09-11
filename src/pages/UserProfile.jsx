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

  // Helper function to check if user can view private content
  const canViewPrivateContent = () => {
    console.log("🔍 Privacy Check:", {
      isOwnProfile,
      isPrivate: profileUser?.is_private,
      isFollowing,
      username: profileUser?.username,
    });

    // Own profile - can always view
    if (isOwnProfile) {
      console.log("✅ Own profile - can view");
      return true;
    }

    // Public account - anyone can view
    if (!profileUser?.is_private) {
      console.log("✅ Public account - can view");
      return true;
    }

    // Private account - only followers can view
    const canView = isFollowing;
    console.log(
      `${canView ? "✅" : "❌"} Private account - ${
        canView ? "following" : "not following"
      }`
    );
    return canView;
  };

  // Debug userPosts
  console.log("🔍 UserProfile Debug:", {
    userPostsLength: userPosts?.length,
    userPosts: userPosts,
    loadingUserPosts,
    isLoadingProfile,
    profileUser: profileUser?.username,
  });

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
    // Check privacy before rendering content
    if (!canViewPrivateContent()) {
      return (
        <div className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-5V9m0 0V7m0 2h2m-2 0H10M7 12a5 5 0 1110 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              This Account is Private
            </h3>
            <p className="text-gray-600 mb-4">
              Follow this account to see their posts and other content.
            </p>
          </div>
        </div>
      );
    }

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
            canViewPrivateContent={canViewPrivateContent()}
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
