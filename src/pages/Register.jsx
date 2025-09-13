import { useForm } from "react-hook-form";
import { Link } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import ErrorAlert from "../components/Alert/ErrorAlert";
import SuccessAlert from "../components/Alert/SuccessAlert";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Register = () => {
  const { registerUser, resendActivation, errorMsg } = useAuthContext();
  const [successMsg, setSuccessMsg] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //   const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const emailData = data.email;
    delete data.confirm_password;

    try {
      const response = await registerUser(data);
      console.log(response);
      if (response.success) {
        setSuccessMsg(response.message);
        setRegisteredEmail(emailData);
      }
    } catch (error) {
      console.log("Registration failed", error);
    }
  };

  const handleResendActivation = async () => {
    setResendLoading(true);
    try {
      const response = await resendActivation(registeredEmail);
      if (response.success) {
        setSuccessMsg(
          "Activation link has been resent to your email address. Please check your inbox."
        );
      }
    } catch (error) {
      console.log("Resend activation failed", error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center px-3 sm:px-4 py-6 sm:py-12 relative overflow-hidden">
      {/* Background Decorations - Smaller on mobile */}
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-sm sm:max-w-md relative mb-8 sm:mb-0">
        {/* Glassmorphism Card - Responsive padding and border radius */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          {/* Card Background Decoration - Smaller on mobile */}
          <div className="absolute top-0 left-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-400/5 to-pink-400/5 rounded-full blur-2xl"></div>

          {/* Alerts - Responsive margin */}
          {errorMsg && (
            <div className="mb-4 sm:mb-6">
              <ErrorAlert error={errorMsg} />
            </div>
          )}
          {successMsg && (
            <div className="mb-4 sm:mb-6">
              <SuccessAlert success={successMsg} />
            </div>
          )}

          {/* Header Section - Responsive spacing and text sizes */}
          <div className="text-center mb-6 sm:mb-8">
            {/* Logo - Responsive size */}
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 rounded-xl sm:rounded-2xl shadow-lg shadow-purple-500/25 mb-3 sm:mb-4">
              <span className="text-white text-lg sm:text-2xl font-bold">
                S
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1 sm:mb-2">
              Join SnapVerse
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Create your account to get started
            </p>
          </div>

          {/* Registration Form - Responsive spacing */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            {/* Name Fields Row - Stack on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* First Name */}
              <div className="space-y-1.5 sm:space-y-2">
                <label
                  htmlFor="first_name"
                  className="block text-xs sm:text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="first_name"
                  type="text"
                  placeholder="John"
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/70 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 ${
                    errors.first_name
                      ? "border-red-300 focus:ring-red-500/50 focus:border-red-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  {...register("first_name", {
                    required: "First Name is Required",
                  })}
                />
                {errors.first_name && (
                  <span className="text-xs sm:text-xs text-red-600 flex items-center mt-1">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.first_name.message}
                  </span>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-1.5 sm:space-y-2">
                <label
                  htmlFor="last_name"
                  className="block text-xs sm:text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="last_name"
                  type="text"
                  placeholder="Doe"
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/70 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 ${
                    errors.last_name
                      ? "border-red-300 focus:ring-red-500/50 focus:border-red-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  {...register("last_name", {
                    required: "Last Name is Required",
                  })}
                />
                {errors.last_name && (
                  <span className="text-xs sm:text-xs text-red-600 flex items-center mt-1">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.last_name.message}
                  </span>
                )}
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-1.5 sm:space-y-2">
              <label
                htmlFor="username"
                className="block text-xs sm:text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="@username"
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/70 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 ${
                  errors.username
                    ? "border-red-300 focus:ring-red-500/50 focus:border-red-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                {...register("username", {
                  required: "User Name is required",
                  minLength: {
                    value: 4,
                    message:
                      "Username must be at least 4 characters (including @)",
                  },
                  maxLength: {
                    value: 21,
                    message:
                      "Username must be at most 21 characters (including @)",
                  },
                  pattern: {
                    value: /^@[a-zA-Z0-9_]{3,20}$/,
                    message:
                      "Username must start with @ and contain only letters, numbers, and underscores (min 3 after @)",
                  },
                })}
              />
              {errors.username && (
                <span className="text-xs text-red-600 flex items-center mt-1">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.username.message}
                </span>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1.5 sm:space-y-2">
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/70 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 ${
                  errors.email
                    ? "border-red-300 focus:ring-red-500/50 focus:border-red-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                {...register("email", {
                  required: "Email is Required",
                })}
              />
              {errors.email && (
                <span className="text-xs text-red-600 flex items-center mt-1">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password Fields */}
            <div className="space-y-3 sm:space-y-4">
              {/* Password Field */}
              <div className="space-y-1.5 sm:space-y-2">
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base bg-white/70 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 ${
                      errors.password
                        ? "border-red-300 focus:ring-red-500/50 focus:border-red-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-2.5 sm:px-3 flex items-center hover:bg-gray-100/50 rounded-r-lg sm:rounded-r-xl focus:outline-none transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  ></button>
                </div>
                {errors.password && (
                  <span className="text-xs text-red-600 flex items-center mt-1">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5 sm:space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs sm:text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/70 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 ${
                    errors.confirm_password
                      ? "border-red-300 focus:ring-red-500/50 focus:border-red-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  {...register("confirm_password", {
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                />
                {errors.confirm_password && (
                  <span className="text-xs text-red-600 flex items-center mt-1">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.confirm_password.message}
                  </span>
                )}
              </div>

              {/* Show Password Toggle */}
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500/50 focus:ring-2"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  <span className="ml-2 text-xs sm:text-sm text-gray-600">
                    Show passwords
                  </span>
                </label>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-purple-500/25"
            >
              Create Account
            </button>
          </form>

          {/* Login Link & Resend Activation */}
          <div className="text-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100">
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                Sign In
              </Link>
            </p>

            {/* Resend Activation Section */}
            {successMsg && registeredEmail && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl">
                <p className="text-xs sm:text-sm text-purple-700 mb-2 sm:mb-3">
                  Didn't receive the activation email?
                </p>
                <button
                  onClick={handleResendActivation}
                  disabled={resendLoading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {resendLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="text-xs sm:text-sm">Resending...</span>
                    </div>
                  ) : (
                    "Resend Activation Link"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
