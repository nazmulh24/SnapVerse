import React, { useState, useEffect } from "react";
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
  const [isPrivacyCheckComplete, setIsPrivacyCheckComplete] = useState(false);

  const {
    profileUser,
    userPosts,
    apiError,
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

  // Use effect to handle privacy check completion
  useEffect(() => {
    if (!isLoadingProfile && profileUser) {
      // Give a small delay to ensure follow status is properly set
      const timer = setTimeout(() => {
        setIsPrivacyCheckComplete(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsPrivacyCheckComplete(false);
    }
  }, [isLoadingProfile, profileUser, isFollowing]);

  // Loading state
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state - Show when user not found or other errors
  if (apiError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Profile Not Found
            </h3>
            <p className="text-gray-600 mb-6">{apiError}</p>
            <div className="space-y-2">
              <button
                onClick={() => (window.location.href = "/")}
                className="w-full px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to check if user can view private content
  const canViewPrivateContent = () => {
    // Add more detailed debugging
    console.log("🔍 Privacy Check Details:", {
      isOwnProfile,
      isPrivate: profileUser?.is_private,
      isFollowing,
      username: profileUser?.username,
      profileUserExists: !!profileUser,
      isLoadingProfile,
      loadingUserPosts,
    });

    // If we don't have profile data yet, don't allow viewing
    if (!profileUser) {
      console.log("❌ No profile data yet");
      return false;
    }

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

  // Debug userPosts and states
  console.log("🔍 UserProfile Debug:", {
    userPostsLength: userPosts?.length,
    userPosts: userPosts,
    loadingUserPosts,
    isLoadingProfile,
    profileUser: profileUser?.username,
    isFollowing,
    isPrivate: profileUser?.is_private,
    canView: profileUser ? canViewPrivateContent() : "profile not loaded",
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
    // Show loading while profile is still loading, privacy check is incomplete, or if we have a private account and follow status might still be loading
    if (
      !profileUser ||
      !isPrivacyCheckComplete ||
      (profileUser?.is_private && !isOwnProfile && loadingUserPosts)
    ) {
      return (
        <div className="p-8 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
          </div>
        </div>
      );
    }

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

      <div className="max-w-5xl mx-auto sm:px-0 lg:px-4">
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
