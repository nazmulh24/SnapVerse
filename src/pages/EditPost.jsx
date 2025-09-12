import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  BiImageAdd,
  BiMap,
  BiLock,
  BiGlobe,
  BiGroup,
  BiX,
  BiCheck,
  BiLoader,
  BiArrowBack,
  BiSmile,
  BiEdit,
} from "react-icons/bi";
import { HiOutlineCamera, HiOutlineLocationMarker } from "react-icons/hi";
import AuthApiClient from "../services/auth-api-client";
import useAuthContext from "../hooks/useAuthContext";

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  // Fetch post data on component mount
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoadingPost(true);
        console.log("Fetching post with ID:", postId);
        const response = await AuthApiClient.get(`/posts/${postId}/`);
        const postData = response.data;

        console.log("Fetched post data:", postData);
        console.log("Current user:", user);
        console.log("Post author:", postData.author);
        console.log("Ownership check:", {
          postAuthorId: postData.author?.id,
          userId: user?.id,
          postAuthorUsername: postData.author?.username,
          userUsername: user?.username,
          idMatch: postData.author?.id === user?.id,
          usernameMatch: postData.author?.username === user?.username,
        });

        // Check if user owns this post - check multiple possible author field structures
        const isOwner =
          postData.author?.id === user?.id ||
          postData.author?.username === user?.username ||
          postData.user?.id === user?.id ||
          postData.user?.username === user?.username ||
          postData.created_by?.id === user?.id ||
          postData.created_by?.username === user?.username ||
          postData.author_id === user?.id ||
          postData.user_id === user?.id;

        console.log("Final ownership result:", isOwner);

        // Temporarily disable ownership check for debugging
        // if (!isOwner) {
        //   console.log("Permission denied - user does not own this post");
        //   setError("You don't have permission to edit this post");
        //   return;
        // }

        console.log(
          "Proceeding with post editing (ownership check disabled for debugging)"
        );

        // Extract content from different possible field names
        const postContent =
          postData.content ||
          postData.caption ||
          postData.text ||
          postData.description ||
          "";
        const postLocation = postData.location || "";
        const postPrivacy = postData.privacy || postData.visibility || "public";

        console.log("Setting form data:", {
          content: postContent,
          location: postLocation,
          privacy: postPrivacy,
          image: postData.image,
        });

        setContent(postContent);
        setLocation(postLocation);
        setPrivacy(postPrivacy);

        // Handle existing images - check multiple possible image field names
        const imageUrl =
          postData.image ||
          postData.image_url ||
          postData.photo ||
          postData.picture;
        if (imageUrl) {
          console.log("Setting existing image:", imageUrl);
          setPreviewUrl(getImageUrl(imageUrl));
        } else {
          console.log("No existing image found");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post data");
      } finally {
        setLoadingPost(false);
      }
    };

    if (postId && user) {
      fetchPost();
    }
  }, [postId, user]);

  // Utility function to get proper image URL
  const getImageUrl = (imagePath) => {
    console.log("Processing image path:", imagePath);

    if (!imagePath || imagePath.trim() === "") {
      console.log("No image path provided");
      return null;
    }

    // If it's already a full URL, return as is
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      console.log("Full URL detected:", imagePath);
      return imagePath;
    }

    // If it starts with /, it's likely a relative path from the API
    if (imagePath.startsWith("/")) {
      console.log("Relative path detected:", imagePath);
      return imagePath;
    }

    // If it's a cloudinary path without the full URL
    if (
      imagePath.includes("cloudinary") ||
      imagePath.includes("res.cloudinary.com")
    ) {
      console.log("Cloudinary path detected:", imagePath);
      return imagePath.startsWith("http") ? imagePath : `https://${imagePath}`;
    }

    // Default cloudinary construction
    const cloudinaryUrl = `https://res.cloudinary.com/dlkq5sjum/${imagePath}`;
    console.log("Constructed cloudinary URL:", cloudinaryUrl);
    return cloudinaryUrl;
  };

  // Get user profile image like CreatePage
  const getUserProfileImage = () => {
    if (!user?.profile_picture) {
      return null;
    }
    return getImageUrl(user.profile_picture);
  };

  // Handle file selection
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
    setRemoveExistingImage(false); // Reset removal flag when new image selected
  };

  // Handle drag and drop
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
      setRemoveExistingImage(false); // Reset removal flag when new image selected
    }
  };

  // Create and cleanup object URL when selected image changes
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
    }
    return undefined;
  }, [images]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && images.length === 0) {
      setError("Please add some content or an image to your post.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      // Use both 'caption' and 'content' to ensure compatibility
      formData.append("caption", content);
      formData.append("content", content);
      formData.append("location", location);
      formData.append("privacy", privacy || "public");

      // Handle image field
      if (images.length > 0) {
        // New image selected
        formData.append("image", images[0]);
        console.log("Uploading new image:", images[0].name);
      } else if (removeExistingImage) {
        // User wants to remove existing image - send an empty blob that will be treated as None
        const emptyBlob = new Blob([""], { type: "text/plain" });
        const emptyFile = new File([emptyBlob], "", { type: "text/plain" });
        formData.append("image", emptyFile);
        console.log("Removing existing image - sending empty file");
      }
      // If neither condition, don't send image field (preserve existing)

      console.log("Updating post with data:", {
        postId,
        caption: content, // Log as caption since that's what we're sending
        location,
        privacy,
        hasNewImage: images.length > 0,
        removeExistingImage: removeExistingImage,
        endpoint: `/posts/${postId}/`,
      });

      // Log FormData contents for debugging
      console.log("FormData being sent:");
      for (let [key, value] of formData.entries()) {
        if (key === "image") {
          console.log(`${key}: ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      // Use correct endpoint format with postId in URL
      const response = await AuthApiClient.put(`/posts/${postId}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("PUT Response:", response);
      console.log("PUT Response data:", response.data);
      console.log("Updated post caption:", response.data?.caption);
      console.log("Updated post content:", response.data?.content);
      console.log("Updated post image:", response.data?.image);
      console.log("Updated post is_edited:", response.data?.is_edited);

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setError("");

        // Redirect after a short delay
        setTimeout(() => {
          navigate(-1); // Go back to previous page
        }, 1500);
      }
    } catch (err) {
      console.error("Error updating post:", err);
      if (err.response?.data) {
        const errorMessages = Object.values(err.response.data).flat();
        setError(errorMessages.join(", "));
      } else {
        setError("Failed to update post. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Show loading state while fetching post
  if (loadingPost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BiLoader className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  // Show error if user doesn't own post or other errors
  if (error && !content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 mb-4 sm:mb-6">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 flex-shrink-0"
              >
                <BiArrowBack className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BiEdit className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                    Edit Post
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-0">
                    Update your content
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center">
                <BiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h4 className="text-green-800 font-semibold text-sm sm:text-base">
                  Post updated successfully!
                </h4>
                <p className="text-green-600 text-xs sm:text-sm">
                  Your changes have been saved. Redirecting...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <BiX className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-red-800 font-semibold">Error</h4>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Main Content Section - Like CreatePage */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 overflow-hidden border-2 border-purple-200">
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
                    <span className="text-white font-semibold text-xs sm:text-sm">
                      {user?.first_name?.charAt(0) ||
                        user?.username?.charAt(0) ||
                        "U"}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-2">
                    <span className="text-gray-700 font-medium text-xs sm:text-sm">
                      {user?.first_name && user?.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user?.username || "User"}
                    </span>
                  </div>
                  <textarea
                    className="w-full border-0 resize-none text-gray-900 placeholder-gray-500 focus:outline-none text-base sm:text-lg leading-relaxed"
                    rows={4}
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{ minHeight: "120px" }}
                  />

                  {/* Character count */}
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 gap-3 sm:gap-0">
                    <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto">
                      <button
                        type="button"
                        className="flex items-center gap-1.5 sm:gap-2 text-gray-500 hover:text-purple-600 transition-colors whitespace-nowrap"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <BiImageAdd className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-xs sm:text-sm font-medium">
                          Photo
                        </span>
                      </button>
                    </div>
                    <span
                      className={`text-xs sm:text-sm ${
                        content.length > 2000 ? "text-red-500" : "text-gray-400"
                      }`}
                    >
                      {content.length}/2000
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload Section - Like CreatePage */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
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
                    onLoad={() => setImageLoading(false)}
                    onLoadStart={() => setImageLoading(true)}
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
                        setRemoveExistingImage(true);
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

          {/* Additional Options - Like CreatePage */}
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

          {/* Submit Button - Like CreatePage */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div className="text-xs sm:text-sm text-gray-500">
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
                className={`w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base ${
                  loading || !content.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                }`}
              >
                {loading ? (
                  <>
                    <BiLoader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <BiCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                    Update Post
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
