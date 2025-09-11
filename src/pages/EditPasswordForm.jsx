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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <BiArrowBack className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Change Password
            </h1>
            <p className="text-gray-600">Update your account password</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form
            onSubmit={handleSubmit(handlePasswordChange)}
            className="space-y-6"
            autoComplete="off"
          >
            {/* Current Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div className="relative">
                <BiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    <AiOutlineEyeInvisible className="w-5 h-5" />
                  ) : (
                    <AiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.current_password && (
                <p className="text-red-500 text-sm">
                  {errors.current_password.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <BiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    <AiOutlineEyeInvisible className="w-5 h-5" />
                  ) : (
                    <AiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.new_password && (
                <p className="text-red-500 text-sm">
                  {errors.new_password.message}
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="relative">
                <BiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    <AiOutlineEyeInvisible className="w-5 h-5" />
                  ) : (
                    <AiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirm_new_password && (
                <p className="text-red-500 text-sm">
                  {errors.confirm_new_password.message}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-bold text-sm">!</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-red-800 font-semibold">Error</h3>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <BiCheck className="w-6 h-6 text-green-600 bg-green-100 rounded-full p-1" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-green-800 font-semibold">
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
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={loading || success}
                className={`flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg transition-colors ${
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
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  loading || !isValid || success
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl"
                }`}
              >
                {loading ? (
                  <>
                    <BiLoader className="w-5 h-5 animate-spin" />
                    Changing Password...
                  </>
                ) : success ? (
                  <>
                    <BiCheck className="w-5 h-5" />
                    Password Changed
                  </>
                ) : (
                  <>
                    <BiCheck className="w-5 h-5" />
                    Change Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Password Security Tips:
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
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
