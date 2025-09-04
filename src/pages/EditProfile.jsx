import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import LoadingSpinner from "../components/shared/LoadingSpinner";
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
  MdLanguage,
  MdCalendarToday,
  MdFavorite,
  MdLock,
  MdVisibility,
} from "react-icons/md";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuthContext();

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

  // Initialize form with user data from context
  useEffect(() => {
    if (user) {
      console.log("User data from context:", user);

      // Initialize form with user data
      const newFormData = {
        cover_photo: user.cover_photo || "",
        profile_picture: user.profile_picture || "",
        username: user.username || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
        phone_number: user.phone_number || user.phone || "",
        date_of_birth: user.date_of_birth || "",
        gender: user.gender || "",
        relationship_status: user.relationship_status || "",
        is_private: user.is_private || false,
      };
      setFormData(newFormData);
      console.log("Form auto-filled with data:", newFormData);
      console.log("Individual field check:");
      console.log("username:", user.username);
      console.log("first_name:", user.first_name);
      console.log("last_name:", user.last_name);
      console.log("email:", user.email);
      setIsLoading(false);
    }
  }, [user]);

  // Debug: Log when successMessage changes
  useEffect(() => {
    console.log("successMessage changed:", successMessage);
  }, [successMessage]);

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
        // @abc minimum
        usernameError = "Username must be at least 4 characters (including @)";
      } else if (value.length > 21) {
        // @username... maximum
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
      if (type === "profile") {
        setProfilePicture(file);
      } else if (type === "cover") {
        setCoverPhoto(file);
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

    console.log("Form submission started, cleared previous messages");

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add files if selected
      if (profilePicture) {
        formDataToSend.append("profile_picture", profilePicture);
      }
      if (coverPhoto) {
        formDataToSend.append("cover_photo", coverPhoto);
      }

      // Make API call to update profile using the built-in updateUserProfile function
      console.log("Making API call to update profile...");
      console.log("FormData contents:", Array.from(formDataToSend.entries()));

      const result = await updateUserProfile(formDataToSend);

      console.log("Update result:", result);

      if (result.success) {
        console.log("Profile updated successfully!");
        setSuccessMessage(result.message || "Profile updated successfully!");

        // Refresh user data to get the updated profile
        console.log("Refreshing user data...");
        // The updateUserProfile should handle the user update internally

        console.log(
          "Success message set, waiting 3 seconds before navigation..."
        );
        // Navigate back to profile after 3 seconds
        setTimeout(() => {
          console.log("Navigating to profile...");
          navigate(`/profile/${user.username}`);
        }, 3000);
      } else {
        console.error("Profile update failed:", result.message);
        setErrors({
          general:
            result.message || "Failed to update profile. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error in profile update:", error);
      console.error("Error type:", error.constructor.name);
      console.error("Error message:", error.message);

      setErrors({
        general: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(`/profile/${user?.username}`);
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:bg-gray-100 px-3 py-2 rounded-lg"
            >
              <MdArrowBack className="w-5 h-5" />
              <span className="font-medium">Back to Profile</span>
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
              <p className="text-sm text-gray-500">
                Update your personal information
              </p>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading state for initial data fetch */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner className="h-8 w-8 mr-2" />
            <span className="text-gray-600">Loading profile data...</span>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            {/* Cover Photo Section */}
            <div className="relative h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
              {getImagePreview(coverPhoto, user.cover_photo) && (
                <img
                  src={getImagePreview(coverPhoto, user.cover_photo)}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <label className="cursor-pointer bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200 rounded-xl p-4 border border-white/30">
                  <MdCamera className="w-6 h-6 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "cover")}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="absolute top-4 right-4 text-white text-sm bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                Cover Photo
              </div>
            </div>

            {/* Profile Picture Section */}
            <div className="relative px-8 pb-6">
              <div className="flex items-end -mt-12">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-200">
                    {getImagePreview(profilePicture, user.profile_picture) ? (
                      <img
                        src={getImagePreview(
                          profilePicture,
                          user.profile_picture
                        )}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                        {formData.first_name?.[0] ||
                          formData.username?.[0] ||
                          "U"}
                      </div>
                    )}
                  </div>
                  <label className="absolute -bottom-1 -right-1 cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors rounded-full p-2 shadow-lg border-2 border-white">
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
            <form onSubmit={handleSubmit} className="px-8 pb-8">
              {/* Success Message */}
              {successMessage && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <MdSave className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-emerald-800 font-medium">
                    {successMessage}
                  </p>
                </div>
              )}

              {/* General Error */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-800">{errors.general}</p>
                </div>
              )}

              {/* Personal Information Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <MdPerson className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      First Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 ${
                          errors.first_name
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 bg-white/50"
                        }`}
                        placeholder="Enter your first name"
                      />
                    </div>
                    {errors.first_name && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center text-xs">
                          !
                        </span>
                        {errors.first_name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 bg-white/50 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Username *
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 ${
                        errors.username
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 bg-white/50"
                      }`}
                      placeholder="@username"
                    />
                    {errors.username && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center text-xs">
                          !
                        </span>
                        {errors.username}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <MdEmail className="w-4 h-4 text-blue-500" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 bg-gray-100 cursor-not-allowed ${
                        errors.email
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 text-gray-500"
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center text-xs">
                          !
                        </span>
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <MdEdit className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    About You
                  </h3>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none ${
                      errors.bio
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 bg-white/50"
                    }`}
                    placeholder="Tell us about yourself..."
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      {formData.bio.length}/180 characters
                    </p>
                    {errors.bio && (
                      <p className="text-sm text-red-600">{errors.bio}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <MdLocationOn className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Contact & Location
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <MdLocationOn className="w-4 h-4 text-green-500" />
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 bg-white/50 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <MdPhone className="w-4 h-4 text-green-500" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 bg-white/50 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Details Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                    <MdFavorite className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Personal Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <MdCalendarToday className="w-4 h-4 text-purple-500" />
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 bg-white/50 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 bg-white/50 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Relationship Status
                    </label>
                    <select
                      name="relationship_status"
                      value={formData.relationship_status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 bg-white/50 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
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
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
                    <MdLock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Privacy Settings
                  </h3>
                </div>

                <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <MdLock className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Private Account
                        </h4>
                        <p className="text-sm text-gray-600">
                          Only approved followers can see your posts
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_private"
                        checked={
                          formData.is_private === true ||
                          formData.is_private === "true"
                        }
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
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                >
                  <MdCancel className="w-5 h-5" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <MdSave className="w-5 h-5" />
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
