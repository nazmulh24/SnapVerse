/**
 * UserProfile Component
 *
 * This component displays a user's profile page similar to the Account page design.
 * It shows user information, posts, photos, and allows following/unfollowing.
 *
 * Features:
 * - Profile header with cover photo and avatar
 * - User stats (posts, followers, following)
 * - Follow/Unfollow functionality
 * - Tabbed content (Posts, About, Photos)
 * - Responsive design with mobile optimization
 *
 * TODO for production:
 * - Implement real getUserByUsername API call
 * - Add real follow/unfollow API integration
 * - Implement user posts loading from API
 * - Add error handling for non-existent users
 * - Add privacy controls for private accounts
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import usePosts from "../hooks/usePosts";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import {
  MdArrowBack,
  MdEdit,
  MdLocationOn,
  MdCalendarMonth,
  MdLink,
  MdPerson,
  MdLock,
  MdPublic,
  MdVerified,
  MdPersonAdd,
  MdPersonRemove,
  MdMessage,
  MdMoreVert,
  MdEmail,
  MdPhone,
  MdFavorite,
  MdWork,
  MdSchool,
  MdInfo,
} from "react-icons/md";
import Post from "../components/HomeComponent/Post";
import InfiniteScrollTrigger from "../components/shared/InfiniteScrollTrigger";
import {
  getAvatarUrl,
  getCoverPhotoUrl,
} from "../components/Account/accountUtils";

const UserProfile = () => {
  const navigate = useNavigate();
  const { username } = useParams(); // This could be username or ID
  const [searchParams, setSearchParams] = useSearchParams();
  const { user: currentUser } = useAuthContext();

  // Add state for API response
  const [apiResponse, setApiResponse] = useState(null);
  const [apiError, setApiError] = useState(null);

  const {
    posts,
    loadPosts,
    loadMyPosts,
    handleLike,
    handleComment,
    handleShare,
    loading,
    hasNextPage,
    loadMorePosts,
  } = usePosts();

  const [activeTab, setActiveTab] = useState("posts");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileUser, setProfileUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  // Check if viewing own profile
  const isOwnProfile = currentUser?.username === username;

  // Load user profile and posts
  useEffect(() => {
    const loadUserData = async () => {
      if (!username) {
        console.log("[UserProfile] No username/ID provided");
        return;
      }

      console.log("[UserProfile] Loading profile for identifier:", username);
      setIsLoadingProfile(true);
      setApiError(null);

      try {
        // Try to fetch real user data from API first
        // Try multiple username formats to find the user

        console.log("🔗 Attempting to find user with identifier:", username);

        // Create different possible username formats to try
        const possibleUsernames = [
          username, // Original as-is
          username.toLowerCase(), // lowercase
          username
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "_")
            .replace(/_+/g, "_")
            .replace(/^_|_$/g, ""), // converted from full name
          username.toLowerCase().replace(/\s+/g, "_"), // spaces to underscores
          username.toLowerCase().replace(/\s+/g, ""), // remove spaces
        ];

        // Remove duplicates
        const uniqueUsernames = [...new Set(possibleUsernames)];
        console.log("🎯 Will try these username formats:", uniqueUsernames);

        let realUserData = null;

        // Try each username format
        for (const tryUsername of uniqueUsernames) {
          const encodedUsername = encodeURIComponent(tryUsername);
          const apiEndpoint = `http://127.0.0.1:8000/api/v1/users/${encodedUsername}/`;

          console.log(`� Trying endpoint: ${apiEndpoint}`);

          try {
            const response = await fetch(apiEndpoint, {
              headers: {
                Authorization: `JWT ${
                  JSON.parse(localStorage.getItem("authTokens"))?.access
                }`,
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              realUserData = await response.json();
              console.log("✅ API SUCCESS with endpoint:", apiEndpoint);
              console.log("✅ API SUCCESS - Complete user data:", realUserData);
              break; // Stop trying once we find a successful one
            } else {
              console.log(`❌ Failed with ${apiEndpoint}: ${response.status}`);
            }
          } catch (fetchError) {
            console.log(
              `🚫 Network error with ${apiEndpoint}:`,
              fetchError.message
            );
          }
        }

        if (realUserData) {
          setApiResponse(realUserData);
          setProfileUser(realUserData);
          setFollowersCount(realUserData.followers_count || 0);
          setApiError(null);
          
          // Load posts for this user after profile is set
          if (isOwnProfile) {
            const result = await loadMyPosts({}, { pageSize: 10 });
            if (!result.success) {
              console.error("[UserProfile] Failed to load posts:", result.error);
            }
          } else {
            // For other users, use the loaded user data
            const result = await loadPosts(
              { user_id: realUserData.id },
              { pageSize: 10 }
            );
            if (!result.success) {
              console.error("[UserProfile] Failed to load posts:", result.error);
            }
          }
        } else {
          // All attempts failed
          setApiError(`All API attempts failed for username: ${username}`);
          console.log(
            "❌ All API endpoints failed, falling back to simulated data"
          );
          createSimulatedData();
          
          // Load posts for simulated user
          if (isOwnProfile) {
            const result = await loadMyPosts({}, { pageSize: 10 });
            if (!result.success) {
              console.error("[UserProfile] Failed to load posts:", result.error);
            }
          } else {
            // For other users with simulated data, we can't load real posts
            // but we can simulate the loading attempt
            console.log("[UserProfile] Using simulated user - no real posts to load");
          }
        }

        function createSimulatedData() {
          console.log("🔄 Using simulated data as fallback");
          const userData = {
            id: `user_${username}`,
            username: username,
            full_name:
              username.charAt(0).toUpperCase() + username.slice(1) + " User",
            bio: "This is a sample bio for the user profile. Welcome to SnapVerse!",
            email: `${username}@example.com`,
            followers_count: Math.floor(Math.random() * 1000) + 100,
            following_count: Math.floor(Math.random() * 500) + 50,
            posts_count: Math.floor(Math.random() * 200) + 20,
            date_joined: new Date(
              Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
            ).toISOString(),
            location: "New York, NY",
            website: "https://example.com",
            is_verified: Math.random() > 0.8,
            is_private: Math.random() > 0.7,
            profile_picture: null,
            cover_photo: null,
          };
          setProfileUser(userData);
          setFollowersCount(userData.followers_count);
          return userData;
        }

        setIsFollowing(Math.random() > 0.5); // Random follow status for demo
      } catch (error) {
        console.error("[UserProfile] Error loading user profile:", error);
        setApiError(`Error: ${error.message}`);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadUserData();
  }, [username, currentUser, isOwnProfile, loadMyPosts, loadPosts]);

  const handleBack = () => {
    const hasModal = searchParams.get("modal") === "true";

    if (hasModal) {
      navigate("/");
    } else {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/");
      }
    }
  };

  const handleFollow = async () => {
    try {
      // Implement follow/unfollow API call here
      setIsFollowing(!isFollowing);
      setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  const handleMessage = () => {
    navigate(`/messages?user=${username}`);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      const wasAutoSwitched = sessionStorage.getItem("userProfileAutoSwitched");
      const currentModal = searchParams.get("modal") === "true";

      if (mobile && !currentModal) {
        setSearchParams({ modal: "true" });
        sessionStorage.setItem("userProfileAutoSwitched", "true");
      } else if (!mobile && currentModal && wasAutoSwitched) {
        setSearchParams({});
        sessionStorage.removeItem("userProfileAutoSwitched");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      sessionStorage.removeItem("userProfileAutoSwitched");
    };
  }, [searchParams, setSearchParams]);

  if (isLoadingProfile || !profileUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const coverPhotoUrl = getCoverPhotoUrl(profileUser);
  const avatarUrl = getAvatarUrl(profileUser);
  const fullName = profileUser.full_name || profileUser.username;
  const joinDate = profileUser.date_joined
    ? new Date(profileUser.date_joined).toLocaleDateString("en-US", {
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
    <div className="min-h-screen bg-gray-50">
      {/* JSON Data Display Section */}
      <div className="bg-blue-50 border-b border-blue-200 p-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-blue-800 mb-4">
            🔍 Complete User Data (JSON)
          </h2>

          {/* API Response Section */}
          {apiResponse && (
            <div className="mb-4">
              <h3 className="font-semibold text-green-700 mb-2">
                ✅ Real API Response:
              </h3>
              <div className="bg-white p-4 rounded border overflow-auto max-h-64">
                <pre className="text-xs text-green-800">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* API Error Section */}
          {apiError && (
            <div className="mb-4">
              <h3 className="font-semibold text-red-700 mb-2">❌ API Error:</h3>
              <div className="bg-red-100 p-3 rounded border">
                <p className="text-red-800 text-sm">{apiError}</p>
              </div>
            </div>
          )}

          {/* Profile User Data Section */}
          {profileUser && (
            <div className="mb-4">
              <h3 className="font-semibold text-blue-700 mb-2">
                {apiResponse
                  ? "📋 Processed Profile Data:"
                  : "🔄 Simulated Data:"}
              </h3>
              <div className="bg-white p-4 rounded border overflow-auto max-h-64">
                <pre className="text-xs text-blue-800">
                  {JSON.stringify(profileUser, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* URL Parameter Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded border">
              <h4 className="font-semibold text-blue-700 mb-2">
                URL Parameter:
              </h4>
              <p>
                <strong>Received:</strong> {username}
              </p>
              <p>
                <strong>Type:</strong>{" "}
                {/^\d+$/.test(username) ? "User ID" : "Username"}
              </p>
              <p>
                <strong>API Endpoint:</strong>
              </p>
              <code className="text-xs bg-gray-100 px-1 rounded">
                {/^\d+$/.test(username)
                  ? `GET /users/${username}/`
                  : `GET /users/@${username}/`}
              </code>
            </div>
            <div className="bg-white p-3 rounded border">
              <h4 className="font-semibold text-blue-700 mb-2">
                Loading Status:
              </h4>
              <p>
                <strong>Loading:</strong> {isLoadingProfile ? "Yes" : "No"}
              </p>
              <p>
                <strong>Has Data:</strong> {profileUser ? "Yes" : "No"}
              </p>
              <p>
                <strong>API Called:</strong>{" "}
                {apiResponse ? "Success" : apiError ? "Failed" : "Not yet"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MdArrowBack className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">{fullName}</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MdMoreVert className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
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
                </div>
              </div>
            )}

            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          </div>

          {/* Profile Info Section */}
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
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover"
                  />
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
                          {fullName}
                        </h1>
                        {profileUser.is_verified && (
                          <MdVerified className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      <p className="text-slate-600 text-lg font-medium">
                        {profileUser.username}
                      </p>

                      {/* Bio */}
                      {profileUser.bio ? (
                        <p className="text-slate-700 text-base leading-relaxed max-w-2xl">
                          {profileUser.bio}
                        </p>
                      ) : (
                        <p className="text-slate-400 italic">
                          No bio available
                        </p>
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
                  </div>

                  {/* Profile Stats */}
                  <div className="flex items-center justify-start gap-8 py-4">
                    {/* Posts */}
                    <div className="text-center min-w-0">
                      <div className="text-xl font-bold text-slate-900">
                        {(profileUser.posts_count || 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-600">Posts</div>
                    </div>

                    {/* Followers */}
                    <div className="text-center min-w-0 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-1 transition-colors">
                      <div className="text-xl font-bold text-slate-900">
                        {followersCount.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-600">Followers</div>
                    </div>

                    {/* Following */}
                    <div className="text-center min-w-0 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-1 transition-colors">
                      <div className="text-xl font-bold text-slate-900">
                        {(profileUser.following_count || 0).toLocaleString()}
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
                      onClick={() => navigate("/account")}
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
                    <span className="font-medium">{profileUser.location}</span>
                  </div>
                )}
                {joinDate && (
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
                    <MdCalendarMonth className="w-4 h-4 text-slate-500" />
                    <span className="font-medium">Joined {joinDate}</span>
                  </div>
                )}
                {profileUser.website && (
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
                    <MdLink className="w-4 h-4 text-slate-500" />
                    <a
                      href={profileUser.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200"
                    >
                      {profileUser.website}
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
                  {isOwnProfile ? "My Posts" : `${fullName}'s Posts`}
                </h3>
                {(loading || isLoadingProfile) && (!posts || posts.length === 0) ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner />
                  </div>
                ) : posts && posts.length > 0 ? (
                  <div className="space-y-6">
                    {posts.map((post) => (
                      <Post
                        key={post.id}
                        post={post}
                        onLike={handleLike}
                        onComment={handleComment}
                        onShare={handleShare}
                      />
                    ))}
                    {hasNextPage && (
                      <InfiniteScrollTrigger
                        loading={loading}
                        onLoadMore={loadMorePosts}
                      />
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-2">
                      No posts yet
                    </div>
                    <p className="text-gray-500">
                      {isOwnProfile
                        ? "Share your first post to get started!"
                        : `${fullName} hasn't shared any posts yet.`}
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
                      About {isOwnProfile ? "Me" : fullName}
                    </h3>

                    <div className="space-y-6">
                      {/* Bio Section */}
                      {profileUser.bio ? (
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <MdEdit className="w-4 h-4 text-blue-600" />
                            Bio
                          </h4>
                          <p className="text-gray-700 leading-relaxed">
                            {profileUser.bio}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-white rounded-lg p-6 border border-gray-200 border-dashed">
                          <h4 className="font-semibold text-gray-500 mb-3 flex items-center gap-2">
                            <MdEdit className="w-4 h-4 text-gray-400" />
                            Bio
                          </h4>
                          <p className="text-gray-400 italic">
                            No bio available
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
                          {/* Username */}
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex-shrink-0">
                              <MdPerson className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-500">
                                Username
                              </p>
                              <p className="text-sm text-gray-800 truncate">
                                {profileUser.username}
                              </p>
                            </div>
                          </div>

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
                                  profileUser.email
                                    ? "text-gray-800"
                                    : "text-gray-400 italic"
                                } truncate`}
                              >
                                {profileUser.email || "Email not available"}
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
                                  profileUser.location
                                    ? "text-gray-800"
                                    : "text-gray-400 italic"
                                } truncate`}
                              >
                                {profileUser.location ||
                                  "Location not available"}
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
                                  profileUser.phone || profileUser.phone_number
                                    ? "text-gray-800"
                                    : "text-gray-400 italic"
                                } truncate`}
                              >
                                {profileUser.phone ||
                                  profileUser.phone_number ||
                                  "Phone not available"}
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
                                  profileUser.date_of_birth
                                    ? "text-gray-800"
                                    : "text-gray-400 italic"
                                } truncate`}
                              >
                                {profileUser.date_of_birth
                                  ? new Date(
                                      profileUser.date_of_birth
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })
                                  : "Date of birth not available"}
                              </p>
                            </div>
                          </div>

                          {/* Gender */}
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex-shrink-0">
                              <MdPerson className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-500">
                                Gender
                              </p>
                              <p
                                className={`text-sm ${
                                  profileUser.gender
                                    ? "text-gray-800"
                                    : "text-gray-400 italic"
                                } truncate`}
                              >
                                {profileUser.gender || "Gender not specified"}
                              </p>
                            </div>
                          </div>

                          {/* Relationship Status */}
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex-shrink-0">
                              <MdFavorite className="w-5 h-5 text-red-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-500">
                                Relationship Status
                              </p>
                              <p
                                className={`text-sm ${
                                  profileUser.relationship_status
                                    ? "text-gray-800"
                                    : "text-gray-400 italic"
                                } truncate`}
                              >
                                {profileUser.relationship_status ||
                                  "Not specified"}
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
                    <div className="text-gray-400 text-lg mb-2">
                      No photos yet
                    </div>
                    <p className="text-gray-500">
                      {isOwnProfile
                        ? "Share some photos to see them here!"
                        : `${fullName} hasn't shared any photos yet.`}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
