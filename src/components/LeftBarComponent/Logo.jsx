import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  MdSearch,
  MdClear,
  MdPerson,
  MdTag,
  MdAutoAwesome,
} from "react-icons/md";

// Mock search data - in a real app, this would come from an API
const mockData = [
  {
    id: 1,
    type: "user",
    name: "John Doe",
    username: "@johndoe",
    avatar: "/user-profile-illustration.png",
  },
  {
    id: 2,
    type: "user",
    name: "Jane Smith",
    username: "@janesmith",
    avatar: "/user-profile-illustration.png",
  },
  {
    id: 3,
    type: "user",
    name: "Mike Johnson",
    username: "@mikej",
    avatar: "/user-profile-illustration.png",
  },
  { id: 4, type: "hashtag", name: "#photography", posts: "1.2M posts" },
  { id: 5, type: "hashtag", name: "#travel", posts: "856K posts" },
  { id: 6, type: "hashtag", name: "#food", posts: "2.1M posts" },
];

const Logo = ({ className = "", onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

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

  // Handle search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Simulate search with mock data
    const filteredResults = mockData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.username &&
          item.username.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setSearchResults(filteredResults.slice(0, 5)); // Limit to 5 results
    setShowResults(true);
  }, [searchQuery]);

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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Call parent search handler if provided
    if (onSearch) {
      onSearch(value);
    }
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
    setShowResults(false);
    // Handle search submission
    console.log("Search for:", searchQuery);
  };

  const handleResultClick = (result) => {
    setShowResults(false);
    setSearchQuery("");
    console.log("Clicked on:", result);
    // Handle navigation to user profile or hashtag page
  };

  return (
    <div
      className={`sm:pt-6 sm:pb-3 sm:px-6 pt-2 pb-2 px-3 bg-gradient-to-br from-white to-gray-50/30 ${className}`}
    >
      {/* Enhanced Logo Section */}
      <div className="relative sm:mb-12 mb-4">
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
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search amazing content..."
                className="w-full sm:pl-12 sm:pr-12 pl-10 pr-10 sm:py-3.5 py-2.5 bg-transparent sm:rounded-xl rounded-lg focus:outline-none sm:text-sm text-xs placeholder-gray-400 font-medium"
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
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-gray-200/80 rounded-xl shadow-2xl shadow-purple-500/10 z-50 max-h-72 overflow-y-auto">
            <div className="p-2">
              {searchResults.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-lg transition-all duration-200 text-left group transform hover:scale-[1.02]"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: "slideIn 0.3s ease-out forwards",
                  }}
                >
                  {result.type === "user" ? (
                    <>
                      <div className="relative">
                        <img
                          src={result.avatar}
                          alt={result.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-100 group-hover:ring-purple-300 transition-all duration-200"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-purple-700 transition-colors duration-200">
                          {result.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate group-hover:text-gray-600 transition-colors duration-200">
                          {result.username}
                        </p>
                      </div>
                      <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors duration-200">
                        <MdPerson className="text-purple-600 text-sm" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                        <MdTag className="text-white text-sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-purple-700 transition-colors duration-200">
                          {result.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate group-hover:text-gray-600 transition-colors duration-200">
                          {result.posts}
                        </p>
                      </div>
                      <div className="px-2 py-1 bg-pink-100 rounded-md text-xs font-medium text-pink-600 group-hover:bg-pink-200 transition-colors duration-200">
                        Tag
                      </div>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced No Results Message */}
        {showResults &&
          searchResults.length === 0 &&
          searchQuery.trim() !== "" && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-gray-200/80 rounded-xl shadow-xl z-50 p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <MdSearch className="text-gray-400 text-2xl" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                No results found
              </p>
              <p className="text-xs text-gray-500">
                Try searching for "{searchQuery}" with different keywords
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default Logo;
