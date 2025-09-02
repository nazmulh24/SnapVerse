import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import usePosts from "../hooks/usePosts";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import {
  AccountHeader,
  TabNavigation,
  ProfileSection,
  DiscoverSection,
  BusinessSection,
  SettingsSection,
} from "../components/Account";
import {
  discoverItems,
  businessItems,
  settingsItems,
  tabs,
  getAvatarUrl,
  getCoverPhotoUrl,
} from "../components/Account/accountUtils";

const AccountPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthContext();
  const {
    posts,
    loadMyPosts,
    likePostHandler,
    commentOnPost,
    sharePost,
    loading,
    hasNextPage,
    loadMorePosts,
  } = usePosts();

  const [activeTab, setActiveTab] = useState("profile");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Load user's posts on component mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) {
        console.log("[AccountPage] No user ID available");
        return;
      }

      console.log(
        "[AccountPage] Starting to load user posts for user:",
        user.username
      );
      setIsLoadingProfile(true);
      try {
        // Load posts for the current user using the specific my_posts endpoint
        const result = await loadMyPosts({}, { pageSize: 10 });
        console.log("[AccountPage] loadMyPosts result:", result);

        if (!result.success) {
          console.error("[AccountPage] Failed to load posts:", result.error);
        }
      } catch (error) {
        console.error("[AccountPage] Error loading user posts:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadUserData();
  }, [user?.id, user?.username, loadMyPosts]);

  const handleBack = () => {
    // Simple and reliable back navigation
    const hasModal = searchParams.get("modal") === "true";

    if (hasModal) {
      // If in modal, go back to home (most reliable)
      navigate("/");
    } else {
      // For regular page, try history back, fallback to home
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      const wasAutoSwitched = sessionStorage.getItem("accountAutoSwitched");

      const currentModal = searchParams.get("modal") === "true";

      if (mobile && !currentModal) {
        setSearchParams({ modal: "true" });
        sessionStorage.setItem("accountAutoSwitched", "true");
      } else if (!mobile && currentModal && wasAutoSwitched) {
        setSearchParams({});
        sessionStorage.removeItem("accountAutoSwitched");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      sessionStorage.removeItem("accountAutoSwitched");
    };
  }, [searchParams, setSearchParams]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AccountHeader onBack={handleBack} />

      <div className="max-w-5xl mx-auto">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="p-6">
          {activeTab === "profile" && (
            <ProfileSection
              user={user}
              posts={posts}
              isLoadingProfile={isLoadingProfile}
              hasNextPage={hasNextPage}
              loading={loading}
              onLike={likePostHandler}
              onComment={commentOnPost}
              onShare={sharePost}
              onLoadMore={loadMorePosts}
              getAvatarUrl={getAvatarUrl}
              getCoverPhotoUrl={getCoverPhotoUrl}
            />
          )}

          {activeTab === "discover" && (
            <DiscoverSection discoverItems={discoverItems} />
          )}

          {activeTab === "business" && (
            <BusinessSection businessItems={businessItems} />
          )}

          {activeTab === "settings" && (
            <SettingsSection settingsItems={settingsItems} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
