import React, { useState, useRef, useEffect } from "react";
import {
  BiImageAdd,
  BiMap,
  BiLock,
  BiGlobe,
  BiGroup,
  BiX,
  BiCheck,
  BiLoader,
  BiSmile,
} from "react-icons/bi";
import { HiOutlineCamera, HiOutlineLocationMarker } from "react-icons/hi";
import apiClient from "../services/api-client";
import useAuthContext from "../hooks/useAuthContext";

const CreatePage = () => {
  const { user } = useAuthContext();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState("");
  // Set default privacy based on user's account privacy setting
  const [privacy, setPrivacy] = useState(
    user?.is_private ? "followers" : "public"
  );
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  // Update privacy default when user data changes
  useEffect(() => {
    if (user) {
      setPrivacy(user.is_private ? "followers" : "public");
    }
  }, [user]);

  // Utility function to get proper image URL from Cloudinary
  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath.trim() === "") {
      return null;
    }
    if (imagePath.startsWith("http") || imagePath.startsWith("/")) {
      return imagePath;
    }
    return `https://res.cloudinary.com/dlkq5sjum/${imagePath}`;
  };

  // Get user profile image
  const getUserProfileImage = () => {
    if (!user?.profile_picture) {
      return null;
    }
    return getImageUrl(user.profile_picture);
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const first = files[0];
    if (!first) return;

    // Validate file type
    if (!first.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, GIF, etc.)");
      return;
    }

    // Validate file size (10MB max)
    if (first.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB");
      return;
    }

    setImages([first]);
    setError(""); // Clear any previous errors
  };

  // removed image-remove handler (no preview UI)

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const list = Array.from(e.dataTransfer.files);
      const img = list.find((f) => f.type.startsWith("image/"));
      if (!img) {
        setError("Please drop a valid image file");
        return;
      }

      // Validate file size (10MB max)
      if (img.size > 10 * 1024 * 1024) {
        setError("Image size must be less than 10MB");
        return;
      }

      setImages([img]);
      setError(""); // Clear any previous errors
    }
  };

  // create and cleanup object URL when selected image changes
  useEffect(() => {
    if (images && images[0]) {
      try {
        const url = URL.createObjectURL(images[0]);
        setPreviewUrl(url);
        return () => {
          try {
            URL.revokeObjectURL(url);
          } catch {
            // Ignore cleanup errors
          }
        };
      } catch {
        // Ignore preview URL creation errors
      }
    } else {
      setPreviewUrl(null);
    }
    return undefined;
  }, [images]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const tokensRaw = localStorage.getItem("authTokens");
      const access = tokensRaw ? JSON.parse(tokensRaw)?.access : null;
      const headers = access ? { Authorization: `JWT ${access}` } : {};

      let res;

      // Check if we have an image to upload
      if (images && images.length > 0 && images[0]) {
        // Use FormData for posts with images
        const form = new FormData();
        form.append("caption", content || "");
        form.append("image", images[0]);
        if (location && location.trim()) {
          form.append("location", location.trim());
        }
        form.append("privacy", privacy || "public");

        // Use transformRequest to ensure no Content-Type conflicts
        res = await apiClient.post("/posts/", form, {
          headers: {
            ...headers,
          },
          transformRequest: [
            function (data, headers) {
              delete headers["Content-Type"];
              return data;
            },
          ],
        });
      } else {
        // Use regular JSON for text-only posts
        const postData = {
          caption: content || "",
          privacy: privacy || "public",
        };

        // Only include location if it has content
        if (location && location.trim()) {
          postData.location = location.trim();
        }

        // Make a direct fetch call to avoid apiClient's default headers interfering
        const response = await apiClient.post("/posts/", postData, {
          headers: {
            ...headers,
          },
        });

        res = {
          status: response.status,
          data: response.data,
        };
      }

      if (res && (res.status === 200 || res.status === 201)) {
        setSuccess(true);
        setContent("");
        setImages([]);
        setLocation("");
        // Reset privacy to default based on user's account privacy
        setPrivacy(user?.is_private ? "followers" : "public");
      } else {
        setError("Failed to create post. Server returned unexpected status.");
      }
    } catch (err) {
      if (err && err.response) {
        try {
          const errorMessage =
            typeof err.response.data === "string"
              ? err.response.data
              : JSON.stringify(err.response.data, null, 2);
          setError(`Failed to share post: ${errorMessage}`);
        } catch {
          setError(`Failed to share post: ${String(err.response.data)}`);
        }
      } else {
        setError(err.message || "Failed to create post");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <HiOutlineCamera className="w-5 h-5 text-white" />
              </div>
              Create new post
              {user && (
                <span className="text-sm text-gray-500 font-normal">
                  as {user.first_name || user.username}
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content Input */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden border-2 border-purple-200">
                  {getUserProfileImage() ? (
                    <img
                      src={getUserProfileImage()}
                      alt={user.first_name || user.username || "User"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center ${
                      getUserProfileImage() ? "hidden" : "flex"
                    }`}
                  >
                    <span className="text-white font-semibold text-sm">
                      {user?.first_name?.charAt(0) ||
                        user?.username?.charAt(0) ||
                        "U"}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-2">
                    <span className="text-gray-700 font-medium text-sm">
                      {user?.first_name && user?.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user?.username || "User"}
                    </span>
                  </div>
                  <textarea
                    className="w-full border-0 resize-none text-gray-900 placeholder-gray-500 focus:outline-none text-lg leading-relaxed"
                    rows={4}
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    style={{ minHeight: "120px" }}
                  />

                  {/* Character count */}
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <BiImageAdd className="w-5 h-5" />
                        <span className="text-sm font-medium">Photo</span>
                      </button>
                      <div className="flex items-center gap-2 text-gray-500">
                        <BiSmile className="w-5 h-5" />
                        <span className="text-sm font-medium">Feeling</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <HiOutlineLocationMarker className="w-5 h-5" />
                        <span className="text-sm font-medium">Location</span>
                      </div>
                    </div>
                    <span
                      className={`text-sm ${
                        content.length > 280 ? "text-red-500" : "text-gray-400"
                      }`}
                    >
                      {content.length}/500
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add Photos
                </h3>
              </div>

              {!previewUrl ? (
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                    dragActive
                      ? "border-purple-400 bg-purple-50 scale-[1.02]"
                      : "border-gray-300 bg-gray-50 hover:border-purple-300 hover:bg-purple-25"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <BiImageAdd className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">
                      Add photos/videos
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                      or drag and drop
                    </p>
                    <button
                      type="button"
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      Select from computer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden bg-gray-100">
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <BiLoader className="w-8 h-8 text-gray-400 animate-spin" />
                    </div>
                  )}
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover bg-white"
                    onLoad={() => {
                      setImageLoading(false);
                    }}
                    onLoadStart={() => {
                      setImageLoading(true);
                    }}
                    onError={() => {
                      setImageLoading(false);
                      setPreviewUrl(null);
                      setImages([]);
                      setError("Failed to load image preview");
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      onClick={() => {
                        setImages([]);
                        setPreviewUrl(null);
                        setImageLoading(false);
                      }}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <BiX className="w-4 h-4" />
                    </button>
                  </div>
                  {images[0]?.name && (
                    <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      {images[0].name.length > 20
                        ? `${images[0].name.substring(0, 20)}...`
                        : images[0].name}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Additional Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <BiMap className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Location
                </h3>
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where are you?"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Privacy */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <BiLock className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Privacy</h3>
              </div>
              <div className="space-y-3">
                {/* Only show Public option for users with public accounts */}
                {!user?.is_private && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="privacy"
                      value="public"
                      checked={privacy === "public"}
                      onChange={(e) => setPrivacy(e.target.value)}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <BiGlobe className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700 font-medium">Public</span>
                  </label>
                )}

                {/* Always show Followers option */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    value="followers"
                    checked={privacy === "followers"}
                    onChange={(e) => setPrivacy(e.target.value)}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <BiGroup className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">Followers</span>
                </label>

                {/* Always show Private option */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    value="private"
                    checked={privacy === "private"}
                    onChange={(e) => setPrivacy(e.target.value)}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <BiLock className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">Private</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Your post will be visible to{" "}
                <span className="font-medium text-gray-700">
                  {privacy === "public"
                    ? "everyone"
                    : privacy === "followers"
                    ? "your followers"
                    : "only you"}
                </span>
              </div>
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                  loading || !content.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                }`}
              >
                {loading ? (
                  <>
                    <BiLoader className="w-5 h-5 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <BiCheck className="w-5 h-5" />
                    Share Post
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <BiCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-green-800 font-semibold">
                  Post shared successfully!
                </h4>
                <p className="text-green-600 text-sm">
                  Your post is now live and visible to your audience.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <BiX className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-red-800 font-semibold">
                  Failed to share post
                </h4>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePage;
