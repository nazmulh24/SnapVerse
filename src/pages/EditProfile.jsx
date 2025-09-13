import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import useApi from "../hooks/useApi";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import ComingSoonPage from "../components/shared/ComingSoonPage";
import {
  MdArrowBack,
  MdEdit,
  MdSave,
  MdCancel,
  MdCamera,
  MdPerson,
  MdLocationOn,
  MdEmail,
  MdPhone,
  MdCalendarToday,
  MdFavorite,
  MdLock,
  MdVisibility,
  MdAdminPanelSettings,
} from "react-icons/md";

const EditProfile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, updateUserProfile } = useAuthContext();
  const { get, put } = useApi();

  // Form state
  const [formData, setFormData] = useState({
    cover_photo: "",
    profile_picture: "",
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    bio: "",
    location: "",
    website: "",
    phone_number: "",
    date_of_birth: "",
    gender: "",
    relationship_status: "",
    is_private: false,
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [targetUser, setTargetUser] = useState(null); // For admin editing

  // Check if admin is editing another user
  const targetUsername = searchParams.get("user");
  const isAdminEditing = targetUsername && user?.is_staff === true;

  // Initialize form with user data from context or fetched user data
  useEffect(() => {
    const initializeForm = async () => {
      // Skip initialization for admin editing (will show Coming Soon page)
      if (isAdminEditing) {
        setIsLoading(false);
        return;
      }

      // Permission check - only allow admin to edit other users
      if (targetUsername && !user?.is_staff) {
        setErrors({
          general: "Unauthorized: Only admins can edit other users' profiles",
        });
        setIsLoading(false);
        return;
      }

      let userData = user;

      // If admin is editing another user, fetch that user's data
      if (isAdminEditing) {
        try {
          const result = await get(`/users/${targetUsername}/`);
          if (result.success) {
            userData = result.data;
            setTargetUser(userData);
          } else {
            setErrors({ general: "Failed to load user data" });
            setIsLoading(false);
            return;
          }
        } catch {
          setErrors({ general: "Error fetching user data" });
          setIsLoading(false);
          return;
        }
      }

      if (userData) {
        setFormData({
          cover_photo: userData.cover_photo || "",
          profile_picture: userData.profile_picture || "",
          username: userData.username || "",
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          email: userData.email || "",
          bio: userData.bio || "",
          location: userData.location || "",
          website: userData.website || "",
          phone_number: userData.phone_number || userData.phone || "",
          date_of_birth: userData.date_of_birth || "",
          gender: userData.gender || "",
          relationship_status: userData.relationship_status || "",
          is_private:
            userData.is_private === true || userData.is_private === "true",
        });
        setIsLoading(false);
      }
    };

    if (user) {
      initializeForm();
    }
  }, [user, isAdminEditing, targetUsername, get]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Real-time validation for username
    if (name === "username" && value.trim()) {
      let usernameError = "";

      if (!value.startsWith("@")) {
        usernameError = "Username must start with @";
      } else if (value.length < 4) {
        usernameError = "Username must be at least 4 characters (including @)";
      } else if (value.length > 21) {
        usernameError = "Username must be at most 21 characters (including @)";
      } else if (!/^@[a-zA-Z0-9_]{3,20}$/.test(value.trim())) {
        usernameError =
          "Username must start with @ and contain only letters, numbers, and underscores (min 3 after @)";
      }

      if (usernameError) {
        setErrors((prev) => ({
          ...prev,
          username: usernameError,
        }));
      }
    }
  };

  // Handle file uploads
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [type === "profile" ? "profile_picture" : "cover_photo"]:
            "Please select a valid image file (JPEG, PNG)",
        }));
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          [type === "profile" ? "profile_picture" : "cover_photo"]:
            "File size must be less than 5MB",
        }));
        return;
      }

      // Clear any previous errors for this field
      setErrors((prev) => ({
        ...prev,
        [type === "profile" ? "profile_picture" : "cover_photo"]: "",
      }));

      if (type === "profile") {
        setProfilePicture(file);
        console.log(
          "Profile picture selected:",
          file.name,
          file.size,
          file.type
        );
      } else if (type === "cover") {
        setCoverPhoto(file);
        console.log("Cover photo selected:", file.name, file.size, file.type);
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (!formData.username.startsWith("@")) {
      newErrors.username = "Username must start with @";
    } else if (formData.username.length < 4) {
      newErrors.username =
        "Username must be at least 4 characters (including @)";
    } else if (formData.username.length > 21) {
      newErrors.username =
        "Username must be at most 21 characters (including @)";
    } else if (!/^@[a-zA-Z0-9_]{3,20}$/.test(formData.username.trim())) {
      newErrors.username =
        "Username must start with @ and contain only letters, numbers, and underscores (min 3 after @)";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = "Website must start with http:// or https://";
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = "Bio must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setErrors({});
    setSuccessMessage("");

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        const value = formData[key];
        // Include the field if it has a value OR if it's a boolean (to handle false values)
        if (value || typeof value === "boolean") {
          formDataToSend.append(key, value);
        }
      });

      // Add files if selected
      if (profilePicture) {
        formDataToSend.append("profile_picture", profilePicture);
        console.log(
          "Adding profile picture:",
          profilePicture.name,
          profilePicture.size,
          profilePicture.type
        );
      }
      if (coverPhoto) {
        formDataToSend.append("cover_photo", coverPhoto);
        console.log(
          "Adding cover photo:",
          coverPhoto.name,
          coverPhoto.size,
          coverPhoto.type
        );
      }

      // Debug: Log what's being sent
      console.log("FormData contents:");
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(key, ":", value.name, value.size, value.type);
        } else {
          console.log(key, ":", value);
        }
      }

      let result;

      if (isAdminEditing) {
        // Admin editing another user - use direct API call
        result = await put(`/auth/users/${targetUser.id}/`, formDataToSend);
      } else {
        // Regular user editing their own profile
        result = await updateUserProfile(formDataToSend);
      }

      if (result.success) {
        setSuccessMessage(result.message || "Profile updated successfully!");

        // Show success message for 2 seconds then navigate
        setTimeout(() => {
          const navigationUsername = isAdminEditing
            ? targetUsername
            : user.username;
          navigate(`/profile/${navigationUsername}`);
        }, 2000);
      } else {
        setErrors({
          general:
            result.message || "Failed to update profile. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error in profile update:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error headers:", error.response?.headers);

      setErrors({
        general:
          error.response?.data?.message ||
          error.response?.data?.detail ||
          "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    const navigationUsername = isAdminEditing ? targetUsername : user?.username;
    navigate(`/profile/${navigationUsername}`);
  };

  // Get the current user data being edited (either own profile or target user for admin)
  const getCurrentUserData = () => {
    return isAdminEditing ? targetUser : user;
  };

  // Get image preview URL
  const getImagePreview = (file, existingUrl) => {
    if (file) {
      return URL.createObjectURL(file);
    }
    if (existingUrl && existingUrl.startsWith("http")) {
      return existingUrl;
    }
    if (existingUrl) {
      return `https://res.cloudinary.com/dlkq5sjum/${existingUrl}`;
    }
    return null;
  };

  if (!user || user.is_private === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Show Coming Soon page for admin editing
  if (isAdminEditing) {
    return (
      <ComingSoonPage
        icon={<MdAdminPanelSettings className="w-12 h-12 text-white" />}
        title="Admin Profile Editing"
        subtitle="This feature is coming soon! Admin profile editing API is currently under development."
        emoji="⚙️"
        progress={75}
        bgColors={{ from: "blue-50", via: "purple-50", to: "indigo-50" }}
        iconColors={{ from: "blue-500", to: "indigo-600" }}
        titleColors={{ from: "indigo-600", to: "purple-600" }}
        accentColor="indigo"
        statusCard={{
          icon: <MdEdit className="w-5 h-5 text-blue-500" />,
          text: "API in Development",
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:bg-gray-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg"
            >
              <MdArrowBack className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base hidden xs:inline">
                Back to Profile
              </span>
              <span className="font-medium text-sm sm:text-base xs:hidden">
                Back
              </span>
            </button>
            <div className="text-center">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {isAdminEditing
                  ? `Edit ${
                      targetUser?.first_name || targetUser?.username || "User"
                    }'s Profile`
                  : "Edit Profile"}
              </h1>
              {isAdminEditing && (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <MdAdminPanelSettings className="w-4 h-4 text-red-600" />
                  <p className="text-xs sm:text-sm text-red-600 font-medium">
                    Admin Mode - Editing as {targetUser?.username}
                  </p>
                </div>
              )}
              {!isAdminEditing && (
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                  Update your personal information
                </p>
              )}
            </div>
            <div className="w-16 sm:w-32"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Loading state for initial data fetch */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner className="h-8 w-8 mr-2" />
            <span className="text-gray-600">Loading profile data...</span>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-lg sm:rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            {/* Cover Photo Section */}
            <div className="relative h-48 sm:h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
              {getImagePreview(
                coverPhoto,
                getCurrentUserData()?.cover_photo
              ) && (
                <img
                  src={getImagePreview(
                    coverPhoto,
                    getCurrentUserData()?.cover_photo
                  )}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <label className="cursor-pointer bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/30">
                  <MdCamera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "cover")}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white text-xs sm:text-sm bg-black/30 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
                Cover Photo
              </div>
            </div>

            {/* Profile Picture Section */}
            <div className="relative px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-0 -mt-8 sm:-mt-12">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-200">
                    {getImagePreview(
                      profilePicture,
                      getCurrentUserData()?.profile_picture
                    ) ? (
                      <img
                        src={getImagePreview(
                          profilePicture,
                          getCurrentUserData()?.profile_picture
                        )}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg sm:text-xl font-bold">
                        {formData.first_name?.[0] ||
                          formData.username?.[0] ||
                          "U"}
                      </div>
                    )}
                  </div>
                  <label className="absolute -bottom-1 -right-1 cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors rounded-full p-1.5 sm:p-2 shadow-lg border-2 border-white">
                    <MdCamera className="w-3 h-3 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "profile")}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8"
            >
              {/* Success Message */}
              {successMessage && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <MdSave className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <p className="text-emerald-800 font-medium text-sm sm:text-base">
                    {successMessage}
                  </p>
                </div>
              )}

              {/* General Error */}
              {errors.general && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl">
                  <p className="text-red-800 text-sm sm:text-base">
                    {errors.general}
                  </p>
                </div>
              )}

              {/* Personal Information Section */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <MdPerson className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                      First Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm sm:text-base text-gray-900 placeholder-gray-500 ${
                          errors.first_name
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 bg-white"
                        }`}
                        placeholder="Enter your first name"
                      />
                    </div>
                    {errors.first_name && (
                      <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
                        <span className="w-3 h-3 sm:w-4 sm:h-4 bg-red-100 rounded-full flex items-center justify-center text-xs">
                          !
                        </span>
                        {errors.first_name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 bg-white rounded-lg sm:rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm sm:text-base text-gray-900 placeholder-gray-500"
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                      Username *
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm sm:text-base ${
                        errors.username
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 bg-white"
                      } text-gray-900 placeholder-gray-500}`}
                      placeholder="@username"
                    />
                    {errors.username && (
                      <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
                        <span className="w-3 h-3 sm:w-4 sm:h-4 bg-red-100 rounded-full flex items-center justify-center text-xs">
                          !
                        </span>
                        {errors.username}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-1.5 sm:gap-2">
                      <MdEmail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl transition-all duration-200 bg-gray-100 cursor-not-allowed text-sm sm:text-base text-gray-600 placeholder-gray-400 ${
                        errors.email
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
                        <span className="w-3 h-3 sm:w-4 sm:h-4 bg-red-100 rounded-full flex items-center justify-center text-xs">
                          !
                        </span>
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <MdEdit className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    About You
                  </h3>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none text-sm sm:text-base text-gray-900 placeholder-gray-500 ${
                      errors.bio
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 bg-white"
                    }`}
                    placeholder="Tell us about yourself..."
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs sm:text-sm text-gray-500">
                      {formData.bio.length}/180 characters
                    </p>
                    {errors.bio && (
                      <p className="text-xs sm:text-sm text-red-600">
                        {errors.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <MdLocationOn className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Contact & Location
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-1.5 sm:gap-2">
                      <MdLocationOn className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 bg-white rounded-lg sm:rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm sm:text-base text-gray-900 placeholder-gray-500"
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-1.5 sm:gap-2">
                      <MdPhone className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 bg-white rounded-lg sm:rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm sm:text-base text-gray-900 placeholder-gray-500"
                      placeholder="01234567"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Details Section */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                    <MdFavorite className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Personal Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-1.5 sm:gap-2">
                      <MdCalendarToday className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 bg-white rounded-lg sm:rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm sm:text-base text-gray-900"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 bg-white rounded-lg sm:rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 appearance-none text-sm sm:text-base text-gray-900"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                      Relationship Status
                    </label>
                    <select
                      name="relationship_status"
                      value={formData.relationship_status}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 bg-white rounded-lg sm:rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 appearance-none text-sm sm:text-base text-gray-900"
                    >
                      <option value="single">Single</option>
                      <option value="in_a_relationship">
                        In a Relationship
                      </option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Privacy Settings Section */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-600 rounded-lg flex items-center justify-center">
                    <MdLock className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Privacy Settings
                  </h3>
                </div>

                <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <MdLock className="w-4 h-4 sm:w-6 sm:h-6 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                          Account Privacy
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          Control who can see your posts and profile
                        </p>
                      </div>
                    </div>

                    {/* Privacy Toggle with Labels */}
                    <div className="flex items-center justify-between sm:justify-center gap-3 sm:gap-3 bg-white/70 p-3 sm:p-2 rounded-lg sm:rounded-xl border sm:border-0 border-gray-200">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <MdVisibility
                          className={`w-4 h-4 transition-colors duration-200 ${
                            !formData.is_private
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium transition-colors duration-200 ${
                            !formData.is_private
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          Public
                        </span>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="is_private"
                          checked={Boolean(formData.is_private)}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              is_private: e.target.checked,
                            }));
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/50 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
                      </label>

                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <MdLock
                          className={`w-4 h-4 transition-colors duration-200 ${
                            formData.is_private
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium transition-colors duration-200 ${
                            formData.is_private
                              ? "text-blue-600"
                              : "text-gray-500"
                          }`}
                        >
                          Private
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Status Indicator */}
                  <div className="mt-4 p-3 rounded-lg border-l-4 transition-all duration-200 bg-blue-50 border-blue-400">
                    <div className="flex items-start gap-2">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          formData.is_private ? "bg-blue-600" : "bg-green-600"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                          {formData.is_private ? (
                            <>
                              <strong className="text-blue-700">
                                Private Account:
                              </strong>{" "}
                              Only approved followers can see your posts and
                              profile details. Others can only see your basic
                              info.
                            </>
                          ) : (
                            <>
                              <strong className="text-green-700">
                                Public Account:
                              </strong>{" "}
                              Anyone can see your posts, followers, and profile
                              information on SnapVerse.
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-4 sm:pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
                >
                  <MdCancel className="w-4 h-4 sm:w-5 sm:h-5" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isSaving ? (
                    <>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <MdSave className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
