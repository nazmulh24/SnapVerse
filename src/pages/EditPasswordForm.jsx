import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { BiArrowBack, BiLock, BiCheck, BiLoader } from "react-icons/bi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import useAuthContext from "../hooks/useAuthContext";
import AuthApiClient from "../services/auth-api-client";

const EditPasswordForm = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onChange", // Enable real-time validation
  });

  const handlePasswordChange = async (data) => {
    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      // Make the request and handle all possible responses
      let response;
      let isSuccess = false;

      try {
        response = await AuthApiClient.post("/auth/users/set_password/", {
          current_password: data.current_password,
          new_password: data.new_password,
        });

        // Any 2xx status code is considered success
        if (response.status >= 200 && response.status < 300) {
          isSuccess = true;
        }
      } catch (apiError) {
        // Check if it's actually a success but axios treated it as error
        if (
          apiError.response?.status >= 200 &&
          apiError.response?.status < 300
        ) {
          isSuccess = true;
          response = apiError.response;
        } else {
          // Re-throw if it's a real error
          throw apiError;
        }
      }

      if (isSuccess) {
        setSuccess(true);
        setError("");

        // Start countdown and redirect after 5 seconds
        let timeLeft = 5;
        setCountdown(timeLeft);

        const countdownInterval = setInterval(() => {
          timeLeft -= 1;
          setCountdown(timeLeft);

          if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            reset(); // Reset form only before redirect
            navigate("/profile/" + user.username);
          }
        }, 1000);
      } else {
        setError("Password change completed but with unexpected response.");
      }
    } catch (err) {
      if (err.response?.data) {
        if (err.response.data.current_password) {
          setError("Current password is incorrect. Please try again.");
        } else if (err.response.data.new_password) {
          setError(
            `${
              err.response.data.new_password[0] || "Invalid new password format"
            }`
          );
        } else if (err.response.data.detail) {
          setError(`${err.response.data.detail}`);
        } else if (err.response.data.non_field_errors) {
          setError(
            `${
              err.response.data.non_field_errors[0] || "Password change failed"
            }`
          );
        } else {
          setError(
            "Failed to change password. Please check your input and try again."
          );
        }
      } else if (
        err.code === "ECONNABORTED" ||
        err.message.includes("timeout")
      ) {
        setError(
          "Request timeout. Please check your internet connection and try again."
        );
      } else if (err.code === "ERR_NETWORK") {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

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
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BiLock className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                    Change Password
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-0">
                    Update your account password
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <form
            onSubmit={handleSubmit(handlePasswordChange)}
            className="space-y-4 sm:space-y-6"
            autoComplete="off"
          >
            {/* Current Password */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div className="relative">
                <BiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter your current password"
                  data-lpignore="true"
                  data-form-type="other"
                  spellCheck="false"
                  {...register("current_password", {
                    required: "Current password is required",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? (
                    <AiOutlineEyeInvisible className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <AiOutlineEye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              {errors.current_password && (
                <p className="text-red-500 text-xs sm:text-sm">
                  {errors.current_password.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <BiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter your new password"
                  data-lpignore="true"
                  data-form-type="other"
                  spellCheck="false"
                  {...register("new_password", {
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <AiOutlineEyeInvisible className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <AiOutlineEye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              {errors.new_password && (
                <p className="text-red-500 text-xs sm:text-sm">
                  {errors.new_password.message}
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="relative">
                <BiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Confirm your new password"
                  data-lpignore="true"
                  data-form-type="other"
                  spellCheck="false"
                  {...register("confirm_new_password", {
                    required: "Please confirm your new password",
                    validate: (value) =>
                      value === watch("new_password") ||
                      "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <AiOutlineEye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              {errors.confirm_new_password && (
                <p className="text-red-500 text-xs sm:text-sm">
                  {errors.confirm_new_password.message}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-bold text-xs sm:text-sm">
                        !
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-red-800 font-semibold text-sm sm:text-base">
                      Error
                    </h3>
                    <p className="text-red-700 text-xs sm:text-sm mt-1">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-shrink-0">
                    <BiCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 bg-green-100 rounded-full p-0.5 sm:p-1" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-green-800 font-semibold text-sm sm:text-base">
                      Password Changed Successfully!
                    </h3>
                    <p className="text-green-700 text-sm mt-1">
                      Your password has been updated securely.
                      {countdown > 0 && (
                        <span className="font-medium">
                          {" "}
                          Redirecting to your profile in {countdown} second
                          {countdown !== 1 ? "s" : ""}...
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={loading || success}
                className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg transition-colors text-sm sm:text-base ${
                  loading || success
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !isValid || success}
                className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base ${
                  loading || !isValid || success
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl"
                }`}
              >
                {loading ? (
                  <>
                    <BiLoader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    Changing Password...
                  </>
                ) : success ? (
                  <>
                    <BiCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                    Password Changed
                  </>
                ) : (
                  <>
                    <BiCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                    Change Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security Tips */}
        <div className="mt-4 sm:mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-medium text-blue-900 mb-2">
            Password Security Tips:
          </h3>
          <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
            <li>• Use at least 8 characters</li>
            <li>• Include at least one number</li>
            <li>• Avoid using personal information</li>
            <li>• Don't reuse passwords from other accounts</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditPasswordForm;
