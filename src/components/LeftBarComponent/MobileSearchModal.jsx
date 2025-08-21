import React, { useState, useEffect, useRef } from "react";
import { MdSearch, MdClear, MdPerson, MdTag } from "react-icons/md";

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

const MobileSearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);

  // Handle search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    // Simulate search with mock data
    const filteredResults = mockData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.username &&
          item.username.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setSearchResults(filteredResults.slice(0, 8)); // Show more results in modal
  }, [searchQuery]);

  // Focus on search input when modal opens
  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleResultClick = (result) => {
    setSearchQuery("");
    setSearchResults([]);
    onClose();
    console.log("Clicked on:", result);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg mx-4 w-full max-w-md shadow-xl">
        {/* Search Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search users and hashtags..."
                className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm placeholder-gray-400 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-all duration-200"
                >
                  <MdClear className="text-lg" />
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-purple-600 font-medium text-sm hover:bg-purple-50 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {searchQuery.trim() === "" ? (
            <div className="p-6 text-center">
              <MdSearch className="text-gray-400 text-3xl mx-auto mb-3" />
              <p className="text-gray-600 font-medium">
                Search for people and hashtags
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Start typing to see results
              </p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="p-2">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 text-left group"
                >
                  {result.type === "user" ? (
                    <>
                      <div className="relative">
                        <img
                          src={result.avatar}
                          alt={result.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-100 group-hover:ring-purple-300 transition-all duration-200"
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
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                        <MdTag className="text-white text-lg" />
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
          ) : (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <MdSearch className="text-gray-400 text-2xl" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                No results found
              </p>
              <p className="text-xs text-gray-500">
                Try searching with different keywords
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileSearchModal;
