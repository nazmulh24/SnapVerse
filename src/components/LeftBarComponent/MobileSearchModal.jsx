import { useState, useEffect, useRef, useCallback } from "react";
import {
  MdSearch,
  MdClear,
  MdPerson,
  MdTrendingUp,
  MdHistory,
  MdArrowBack,
  MdOutlineEmojiObjects,
  MdImage,
  MdFavorite,
} from "react-icons/md";
import useApi from "../../hooks/useApi";

const MobileSearchModal = ({ isOpen, onClose }) => {
  const searchRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchPosts } = useApi();

  const [recentSearches, setRecentSearches] = useState([
    "design",
    "photography",
    "travel tips",
  ]);

  // eslint-disable-next-line no-unused-vars
  const [trendingSearches, setTrendingSearches] = useState([
    { query: "photography", count: "1.2M" },
    { query: "design", count: "856K" },
    { query: "technology", count: "2.3M" },
    { query: "food", count: "4.1M" },
  ]);

  // Real-time search function
  const searchPosts = useCallback(
    async (query) => {
      if (!query || query.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const result = await fetchPosts({ search: query.trim(), page_size: 5 });
        if (result.success && result.data) {
          const posts = result.data.results || result.data || [];
          setSearchResults(posts);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchPosts]
  );

  // Handle search functionality with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchPosts(searchQuery);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchPosts]);

  // Focus on search input when modal opens with improved timing
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (query) => {
    // Keep search results visible
    setSearchQuery(query || searchQuery);
  };

  const handleTrendingClick = (query) => {
    setSearchQuery(query);
  };

  const handleRecentClick = (query) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleResultClick = (result) => {
    onClose();
    console.log("Clicked on post:", result);
    // Handle post click navigation if needed
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 mt-4 shadow-2xl overflow-hidden animate-slideInDown">
        {/* Search Header */}
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100"
            >
              <MdArrowBack className="text-xl" />
            </button>

            <form
              className="relative flex-1"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchSubmit(searchQuery);
              }}
            >
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search SnapVerse..."
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-sm placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-all duration-200"
                >
                  <MdClear className="text-lg" />
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Search Results Area */}
        <div className="max-h-[70vh] overflow-y-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-10 px-4">
              <div className="w-10 h-10 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 text-sm">Searching SnapVerse...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !searchQuery && (
            <div className="p-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Recent Searches
                    </h3>
                    <button
                      onClick={handleClearRecent}
                      className="text-xs text-purple-600 font-medium hover:text-purple-800 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentClick(search)}
                        className="flex items-center w-full gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <MdHistory className="text-gray-500" />
                        </div>
                        <span className="text-sm text-gray-700">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MdTrendingUp className="text-purple-500" />
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Trending Now
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {trendingSearches.map((trend, index) => (
                    <button
                      key={index}
                      onClick={() => handleTrendingClick(trend.query)}
                      className="flex flex-col p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-300 border border-purple-100/30"
                    >
                      <span className="text-sm font-medium text-gray-800">
                        #{trend.query}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        {trend.count} posts
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          {!isLoading && searchQuery && searchResults.length > 0 && (
            <div className="p-2">
              {searchResults.map((post) => (
                <button
                  key={post.id}
                  onClick={() => handleResultClick(post)}
                  className="w-full flex items-start gap-3 p-3 hover:bg-purple-50 rounded-xl transition-all duration-200 text-left"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={
                        post.user?.profile_image ||
                        post.user?.profilePicture ||
                        "/user-profile-illustration.png"
                      }
                      alt={
                        post.user?.full_name ||
                        post.user?.fullName ||
                        post.user?.username ||
                        "User"
                      }
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 text-sm leading-tight truncate">
                        {post.user?.full_name ||
                          post.user?.fullName ||
                          post.user?.username ||
                          "Unknown User"}
                      </p>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-400">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Mutual Friends */}
                    {post.user?.mutual_friends_count > 0 && (
                      <p className="text-xs text-purple-600 mb-1">
                        {post.user.mutual_friends_count} mutual friend
                        {post.user.mutual_friends_count !== 1 ? "s" : ""}
                      </p>
                    )}
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {post.content}
                    </p>
                    {post.image && (
                      <div className="mt-2">
                        <div className="w-full h-20 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={post.image}
                            alt="Post"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && searchQuery && searchResults.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                <MdOutlineEmojiObjects className="text-2xl text-purple-400" />
              </div>
              <h3 className="text-gray-800 font-medium mb-2">
                No results found
              </h3>
              <p className="text-gray-500 text-sm max-w-xs">
                We couldn't find anything for "{searchQuery}". Try using
                different keywords or check your spelling.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileSearchModal;
