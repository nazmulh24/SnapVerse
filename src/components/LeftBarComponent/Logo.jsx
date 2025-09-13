import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import {
  MdSearch,
  MdClear,
  MdPerson,
  MdTag,
  MdAutoAwesome,
  MdImage,
  MdFavorite,
  MdHistory,
} from "react-icons/md";
import useApi from "../../hooks/useApi";

const Logo = ({ className = "", onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { fetchPosts } = useApi();
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem("snapverse_recent_searches");
    return saved ? JSON.parse(saved) : [];
  });

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Real-time search function - Enhanced for live results
  const searchPosts = useCallback(
    async (query) => {
      // Allow search for single character and above
      if (!query || query.trim().length < 1) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        const result = await fetchPosts({
          search: query.trim(),
          page_size: 20,
        });
        if (result.success && result.data) {
          const posts = result.data.results || result.data || [];
          console.log(
            `Live search for "${query}": ${posts.length} results found`
          );
          setSearchResults(posts);
          setShowResults(true);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
        setShowResults(false);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchPosts]
  );

  // Handle search functionality with faster debouncing for live results
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchPosts(searchQuery);
    }, 150); // Reduced to 150ms for faster response

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchPosts]);

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function to save recent searches
  const saveToRecentSearches = (query) => {
    if (!query || query.trim().length < 2) return;

    const trimmedQuery = query.trim();
    const updatedSearches = [
      trimmedQuery,
      ...recentSearches.filter(
        (search) => search.toLowerCase() !== trimmedQuery.toLowerCase()
      ),
    ].slice(0, 5); // Keep only 5 recent searches

    setRecentSearches(updatedSearches);
    localStorage.setItem(
      "snapverse_recent_searches",
      JSON.stringify(updatedSearches)
    );
  };

  // Function to clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("snapverse_recent_searches");
  };

  // Function to remove a specific recent search
  const removeRecentSearch = (searchToRemove) => {
    const updatedSearches = recentSearches.filter(
      (search) => search !== searchToRemove
    );
    setRecentSearches(updatedSearches);
    localStorage.setItem(
      "snapverse_recent_searches",
      JSON.stringify(updatedSearches)
    );
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Show search results immediately when typing or when focused (even if empty)
    setShowResults(true);

    // Call parent search handler if provided
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSearchFocus = () => {
    setShowResults(true);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    if (onSearch) {
      onSearch("");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Save search query if it's valid
    if (searchQuery.trim().length >= 2) {
      saveToRecentSearches(searchQuery);
    }
    // Keep the search results open and focused
    setShowResults(true);
  };

  const handleResultClick = (result) => {
    // Save the search query that led to this result
    if (searchQuery.trim().length >= 2) {
      saveToRecentSearches(searchQuery);
    }
    setShowResults(false);
    setSearchQuery("");

    // Navigate to user profile
    const username = result.username || "unknown";
    if (username && username !== "unknown") {
      navigate(`/profile/${username}`);
    } else {
      console.error("Cannot navigate to profile: invalid username", result);
    }
  };

  return (
    <div
      className={`sm:pt-6 sm:pb-3 sm:px-6 pt-2 pb-2 px-3 bg-gradient-to-br from-white to-gray-50/30 ${className}`}
    >
      {/* Enhanced Logo Section */}
      <div className="relative sm:mb-10 mb-4">
        {/* Background decoration - only on desktop */}
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl blur-xl sm:block hidden"></div>

        <div className="relative sm:bg-white/80 sm:backdrop-blur-sm sm:rounded-2xl sm:p-4 sm:border sm:border-gray-100/50 sm:shadow-lg sm:shadow-purple-500/10 p-2">
          <Link
            to="/"
            className="flex items-center sm:justify-center justify-start sm:space-x-3 space-x-2 group sm:hover:scale-105 hover:scale-102 transition-all duration-300"
          >
            {/* Logo Icon */}
            <div className="relative flex-shrink-0">
              <div className="sm:w-10 sm:h-10 w-8 h-8 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300">
                <MdAutoAwesome className="text-white sm:text-lg text-sm group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="absolute -top-1 -right-1 sm:w-4 sm:h-4 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>

            {/* Logo Text - Smaller on mobile */}
            <div className="flex flex-col flex-shrink-0">
              <span className="sm:text-2xl text-lg font-black bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:via-pink-700 group-hover:to-purple-800 transition-all duration-300">
                SnapVerse
              </span>
              <div className="sm:flex hidden items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                  Inspire • Connect • Share
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Enhanced Search Section */}
      <div ref={searchRef} className="relative sm:block flex-1 sm:ml-0 ml-4">
        <form onSubmit={handleSearchSubmit} className="relative group">
          <div className="relative">
            {/* Search input with enhanced styling */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:block hidden"></div>

            <div className="relative bg-white border border-gray-200 sm:rounded-full rounded-lg shadow-sm hover:shadow-md focus-within:shadow-lg focus-within:border-purple-400 transition-all duration-300">
              <MdSearch className="absolute sm:left-4 left-3 top-1/2 transform -translate-y-1/2 text-gray-400 sm:text-lg text-base group-focus-within:text-purple-500 transition-colors duration-300" />

              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                placeholder="Type to search people..."
                className="w-full sm:pl-12 sm:pr-12 pl-10 pr-10 sm:py-3.5 py-2.5 bg-transparent sm:rounded-xl rounded-lg focus:outline-none sm:text-sm text-xs text-gray-900 placeholder-gray-400 font-medium"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute sm:right-4 right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all duration-200 group"
                  title="Clear search"
                >
                  <MdClear className="sm:text-lg text-base group-hover:rotate-90 transition-transform duration-200" />
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Enhanced Search Results Dropdown */}
        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-gray-200/80 rounded-xl shadow-2xl shadow-purple-500/10 z-50 max-h-72 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
                <p className="text-xs text-gray-500 mt-2">Searching...</p>
              </div>
            ) : searchQuery.trim() === "" ? (
              /* Recent Searches */
              <div className="p-2">
                {recentSearches.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between px-2 py-1 mb-2">
                      <span className="text-xs font-semibold text-gray-600">
                        Recent searches
                      </span>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Clear all
                      </button>
                    </div>
                    {recentSearches.map((search, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between group hover:bg-gray-50 rounded-lg p-2 cursor-pointer"
                        onClick={() => {
                          setSearchQuery(search);
                          saveToRecentSearches(search);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <MdHistory className="text-gray-500 text-sm" />
                          </div>
                          <span className="text-sm text-gray-700">
                            {search}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeRecentSearch(search);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-200 transition-all"
                        >
                          <MdClear className="text-gray-400 text-xs" />
                        </button>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MdSearch className="text-gray-400 text-2xl" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Start typing to search
                    </p>
                    <p className="text-xs text-gray-500">
                      Search for people, posts, and more
                    </p>
                  </div>
                )}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="p-2">
                {searchResults.map((post, index) => {
                  // Format user data exactly like SuggestedUsers does
                  const formatUserData = (post) => {
                    // Check if post has author data (from API response)
                    if (post.author) {
                      // Enhanced Cloudinary image handling
                      let avatarUrl;
                      if (post.author.profile_picture) {
                        console.log(
                          "Profile picture field:",
                          post.author.profile_picture
                        );

                        if (post.author.profile_picture.startsWith("http")) {
                          // Already a full URL
                          avatarUrl = post.author.profile_picture;
                        } else if (
                          post.author.profile_picture.startsWith(
                            "image/upload/"
                          )
                        ) {
                          // Partial Cloudinary path
                          avatarUrl = `https://res.cloudinary.com/dlkq5sjum/${post.author.profile_picture}`;
                        } else {
                          // Just filename, add full Cloudinary path
                          avatarUrl = `https://res.cloudinary.com/dlkq5sjum/image/upload/${post.author.profile_picture}`;
                        }
                        console.log("Generated Cloudinary URL:", avatarUrl);
                      } else {
                        // Fallback to UI Avatars
                        avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          post.author.full_name || post.author.username
                        )}&background=6366f1&color=fff&size=100`;
                        console.log("Using fallback avatar:", avatarUrl);
                      }

                      return {
                        id: post.author.id,
                        username: post.author.username,
                        fullName:
                          post.author.full_name ||
                          `${post.author.first_name || ""} ${
                            post.author.last_name || ""
                          }`.trim() ||
                          post.author.username,
                        avatar: avatarUrl,
                        caption: post.content || post.caption || "No caption",
                        mutualFriends: post.author.mutual_friends_count || 0,
                      };
                    }

                    // Fallback to direct post properties with Cloudinary support
                    let fallbackAvatar;
                    if (post.user_profile_picture || post.profile_picture) {
                      const profilePic =
                        post.user_profile_picture || post.profile_picture;
                      console.log("Fallback profile picture:", profilePic);

                      if (profilePic.startsWith("http")) {
                        fallbackAvatar = profilePic;
                      } else if (profilePic.startsWith("image/upload/")) {
                        fallbackAvatar = `https://res.cloudinary.com/dlkq5sjum/${profilePic}`;
                      } else {
                        fallbackAvatar = `https://res.cloudinary.com/dlkq5sjum/image/upload/${profilePic}`;
                      }
                      console.log("Fallback Cloudinary URL:", fallbackAvatar);
                    } else {
                      fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        post.user_full_name || post.user || "User"
                      )}&background=6366f1&color=fff&size=100`;
                      console.log("Using fallback UI avatar:", fallbackAvatar);
                    }

                    return {
                      id: post.id,
                      username: post.username || "unknown", // username field
                      fullName:
                        post.user_full_name || post.user || "Unknown User", // user field contains fullName
                      avatar: fallbackAvatar,
                      caption: post.content || post.caption || "No caption",
                      mutualFriends: 0,
                    };
                  };

                  const formattedUser = formatUserData(post);

                  // Debug: Log the user data to see what fields are available
                  console.log("Search result - Original post:", post);
                  console.log("Search result - Author data:", post.author);
                  console.log("Search result - Formatted user:", formattedUser);

                  return (
                    <button
                      key={post.id}
                      onClick={() => handleResultClick(post)}
                      className="w-full flex items-start space-x-3 p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-lg transition-all duration-200 text-left group transform hover:scale-[1.02]"
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animation: "slideIn 0.3s ease-out forwards",
                      }}
                    >
                      {/* User Avatar */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={formattedUser.avatar}
                          alt={formattedUser.fullName}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-100 group-hover:ring-purple-300 transition-all duration-200"
                        />
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-purple-700 transition-colors duration-200">
                          {formattedUser.fullName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {formattedUser.username}
                        </p>
                        {/* Caption */}
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {formattedUser.caption}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : searchQuery.trim() !== "" ? (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MdSearch className="text-gray-400 text-2xl" />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  No posts found
                </p>
                <p className="text-xs text-gray-500">
                  Try searching with different keywords
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;
