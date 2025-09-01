import React, { useState, useEffect } from "react";
import StoriesSection from "../components/HomeComponent/StoriesSection";
import PostsFeed from "../components/HomeComponent/PostsFeed";
import { BiX, BiUserPlus, BiTrendingUp, BiRefresh } from "react-icons/bi";
import { AiOutlineShop } from "react-icons/ai";
import useAuthContext from "../hooks/useAuthContext";
import usePosts from "../hooks/usePosts";

const Home = () => {
  const { user } = useAuthContext();
  const {
    posts,
    loadPosts,
    handleLike,
    handleComment,
    handleShare,
    handleMenuClick,
    handleViewComments,
    loading,
    error,
  } = usePosts();
  const [sponsorCards, setSponsorCards] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [hiddenCards, setHiddenCards] = useState({
    sponsors: [],
    suggestions: [],
  });

  // Initialize data
  useEffect(() => {
    // Fetch posts on component mount
    loadPosts();

    // Mock data for sponsors
    const mockSponsors = [
      {
        id: "sp1",
        title: "Nike Air Max Sale",
        description:
          "Up to 50% off on latest Nike collection. Limited time offer!",
        image:
          "https://via.placeholder.com/400x200/000000/FFFFFF?text=Nike+Sale",
        buttonText: "Shop Now",
        link: "#",
        brand: "Nike",
        isPromoted: true,
      },
      {
        id: "sp2",
        title: "iPhone 15 Pro",
        description:
          "Experience the titanium difference. Now available in stores.",
        image:
          "https://via.placeholder.com/400x200/007AFF/FFFFFF?text=iPhone+15+Pro",
        buttonText: "Learn More",
        link: "#",
        brand: "Apple",
        isPromoted: true,
      },
      {
        id: "sp3",
        title: "Netflix Premium",
        description: "Watch unlimited movies and shows. First month free!",
        image: "https://via.placeholder.com/400x200/E50914/FFFFFF?text=Netflix",
        buttonText: "Subscribe",
        link: "#",
        brand: "Netflix",
        isPromoted: true,
      },
    ];

    // Mock data for suggested users
    const mockSuggestedUsers = [
      {
        id: "su1",
        username: "john_photographer",
        name: "John Smith",
        avatar: "https://via.placeholder.com/60x60/8B5CF6/FFFFFF?text=JS",
        followers: "2.5K",
        mutualFriends: 5,
        isVerified: true,
        category: "Photography",
      },
      {
        id: "su2",
        username: "sarah_designs",
        name: "Sarah Wilson",
        avatar: "https://via.placeholder.com/60x60/EC4899/FFFFFF?text=SW",
        followers: "1.8K",
        mutualFriends: 3,
        isVerified: false,
        category: "Design",
      },
      {
        id: "su3",
        username: "travel_mike",
        name: "Mike Johnson",
        avatar: "https://via.placeholder.com/60x60/10B981/FFFFFF?text=MJ",
        followers: "4.2K",
        mutualFriends: 8,
        isVerified: true,
        category: "Travel",
      },
      {
        id: "su4",
        username: "chef_emma",
        name: "Emma Davis",
        avatar: "https://via.placeholder.com/60x60/F59E0B/FFFFFF?text=ED",
        followers: "3.1K",
        mutualFriends: 2,
        isVerified: false,
        category: "Food",
      },
    ];

    setSponsorCards(mockSponsors);
    setSuggestedUsers(mockSuggestedUsers);
  }, [loadPosts]);

  // Handle hiding cards
  const hideCard = (type, id) => {
    setHiddenCards((prev) => ({
      ...prev,
      [type]: [...prev[type], id],
    }));
  };

  // Sponsor Card Component
  const SponsorCard = ({ sponsor }) => {
    if (hiddenCards.sponsors.includes(sponsor.id)) return null;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <BiTrendingUp className="text-blue-500 text-lg" />
            <span className="text-sm font-medium text-gray-600">Sponsored</span>
          </div>
          <button
            onClick={() => hideCard("sponsors", sponsor.id)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <BiX className="text-gray-500 text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="relative">
          <img
            src={sponsor.image}
            alt={sponsor.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-bold text-lg mb-1">{sponsor.title}</h3>
            <p className="text-sm text-gray-200">{sponsor.description}</p>
          </div>
        </div>

        {/* Action */}
        <div className="p-4">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
            <AiOutlineShop className="text-lg" />
            {sponsor.buttonText}
          </button>
        </div>
      </div>
    );
  };

  // Suggested Users Card Component
  const SuggestedUsersCard = () => {
    const visibleUsers = suggestedUsers.filter(
      () => !hiddenCards.suggestions.includes("suggestions-main")
    );

    if (
      hiddenCards.suggestions.includes("suggestions-main") ||
      visibleUsers.length === 0
    )
      return null;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <BiUserPlus className="text-purple-500 text-lg" />
            <span className="font-semibold text-gray-800">
              Suggested for you
            </span>
          </div>
          <button
            onClick={() => hideCard("suggestions", "suggestions-main")}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <BiX className="text-gray-500 text-lg" />
          </button>
        </div>

        {/* Users */}
        <div className="p-4">
          {visibleUsers.slice(0, 4).map((suggestedUser, index) => (
            <div
              key={suggestedUser.id}
              className={`flex items-center justify-between ${
                index !== visibleUsers.length - 1 && index !== 3
                  ? "pb-4 mb-4 border-b border-gray-100"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={suggestedUser.avatar}
                    alt={suggestedUser.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {suggestedUser.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">
                    {suggestedUser.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    @{suggestedUser.username}
                  </p>
                  <p className="text-xs text-gray-400">
                    {suggestedUser.followers} followers •{" "}
                    {suggestedUser.mutualFriends} mutual
                  </p>
                </div>
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Function to insert cards randomly in feed (will be used when connecting to API)
  // const insertCardsInFeed = (posts) => {
  //   const feedItems = [...posts];
  //   const sponsors = sponsorCards.filter(sponsor => !hiddenCards.sponsors.includes(sponsor.id));

  //   // Insert sponsor cards every 3-5 posts
  //   if (sponsors.length > 0) {
  //     let sponsorIndex = 0;
  //     for (let i = 3; i < feedItems.length; i += Math.floor(Math.random() * 3) + 3) {
  //       if (sponsorIndex < sponsors.length) {
  //         feedItems.splice(i, 0, {
  //           type: 'sponsor',
  //           data: sponsors[sponsorIndex],
  //           id: `sponsor-${sponsors[sponsorIndex].id}`
  //         });
  //         sponsorIndex++;
  //       }
  //     }
  //   }

  //   // Insert suggested users card around middle
  //   if (!hiddenCards.suggestions.includes('suggestions-main')) {
  //     const middleIndex = Math.floor(feedItems.length / 2);
  //     feedItems.splice(middleIndex, 0, {
  //       type: 'suggestions',
  //       id: 'suggestions-card'
  //     });
  //   }

  //   return feedItems;
  // };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stories Section */}
      <div className="mb-6">
        <StoriesSection />
      </div>

      {/* Refresh Button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={loadPosts}
          disabled={loading}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          <BiRefresh className={`text-lg ${loading ? "animate-spin" : ""}`} />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Feed with integrated cards */}
      <div className="space-y-6">
        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-gray-600">Loading posts...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                <BiX className="text-red-600 text-sm" />
              </div>
              <div>
                <p className="text-red-800 font-medium">Error loading posts</p>
                <p className="text-red-600 text-sm">{error.error || error}</p>
              </div>
              <button
                onClick={loadPosts}
                className="ml-auto bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        {!loading && !error && (
          <>
            <PostsFeed
              posts={posts}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              onMenuClick={handleMenuClick}
              onViewComments={handleViewComments}
            />

            {/* Debug Info */}
            {import.meta.env.DEV && (
              <div className="bg-gray-100 rounded-lg p-4 mt-4 text-xs">
                <p>
                  <strong>Debug Info:</strong>
                </p>
                <p>Posts loaded: {posts.length}</p>
                <p>User: {user?.username || "Not logged in"}</p>
                <p>Authenticated: {user ? "Yes" : "No"}</p>
                <p>
                  API Response structure: {posts.length > 0 ? "Valid" : "Empty"}
                </p>
              </div>
            )}
          </>
        )}

        {/* Sample sponsor card after some posts */}
        {sponsorCards.length > 0 && <SponsorCard sponsor={sponsorCards[0]} />}

        {/* Continue with more posts */}
        <div className="text-center text-gray-500 py-4">
          <p>More posts...</p>
        </div>

        {/* Suggested users card */}
        <SuggestedUsersCard />

        {/* Another sponsor card */}
        {sponsorCards.length > 1 && <SponsorCard sponsor={sponsorCards[1]} />}

        {/* More posts would continue here */}
        <div className="text-center text-gray-500 py-4">
          <p>End of feed</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
