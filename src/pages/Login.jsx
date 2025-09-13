import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import ErrorAlert from "../components/Alert/ErrorAlert";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { errorMsg, loginUser, resendActivation } = useAuthContext();

  // State management
  const [loading, setLoading] = useState(false);
  const [needsActivation, setNeedsActivation] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form submission handler
  const onSubmit = async (data) => {
    setLoading(true);
    setNeedsActivation(false);

    try {
      const result = await loginUser(data);

      if (result.success) {
        navigate("/");
      } else if (result.needsActivation) {
        setNeedsActivation(true);
        setUserEmail(result.email);
      } else if (result.needsRegistration) {
        navigate("/register");
      }
    } catch (error) {
      console.error("Login Failed", error);
    } finally {
      setLoading(false);
    }
  };

  // Resend activation handler
  const handleResendActivation = async () => {
    setResendLoading(true);

    try {
      await resendActivation(userEmail);
      setNeedsActivation(false);
    } catch (error) {
      console.error("Resend activation failed", error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center px-3 sm:px-4 py-6 sm:py-12 relative overflow-hidden">
      {/* Background Decorations - Smaller on mobile */}
      <div className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-sm sm:max-w-md relative">
        {/* Glassmorphism Card - Responsive padding and border radius */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          {/* Card Background Decoration - Smaller on mobile */}
          <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-400/5 to-pink-400/5 rounded-full blur-2xl"></div>

          {/* Error Alert - Responsive margin */}
          {errorMsg && (
            <div className="mb-4 sm:mb-6">
              <ErrorAlert error={errorMsg} />
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
              Welcome Back
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Sign in to continue to SnapVerse
            </p>
          </div>

          {/* Login Form - Responsive spacing */}
          <form
            className="space-y-4 sm:space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Email Field */}
            <div className="space-y-1.5 sm:space-y-2">
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/70 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 ${
                    errors.email
                      ? "border-red-300 focus:ring-red-500/50 focus:border-red-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <div className="absolute -bottom-5 sm:-bottom-6 left-0">
                    <span className="text-xs sm:text-sm text-red-600 flex items-center">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
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
                  </div>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 sm:space-y-2 mt-6 sm:mt-8">
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
                  placeholder="Enter your password"
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base bg-white/70 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500/50 focus:border-red-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-2.5 sm:px-3 flex items-center hover:bg-gray-100/50 rounded-r-lg sm:rounded-r-xl focus:outline-none transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 hover:text-gray-700" />
                  ) : (
                    <AiOutlineEye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 hover:text-gray-700" />
                  )}
                </button>
                {errors.password && (
                  <div className="absolute -bottom-5 sm:-bottom-6 left-0">
                    <span className="text-xs sm:text-sm text-red-600 flex items-center">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
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
                  </div>
                )}
              </div>
            </div>

            {/* Forgot Password Link - Responsive spacing and text */}
            <div className="text-center mt-6 sm:mt-8">
              <Link
                to="/forgot-password"
                className="text-xs sm:text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Login Button - Responsive padding and text */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-purple-500/25"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
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
                  <span className="text-sm sm:text-base">Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Activation Warning Box - Responsive padding and text */}
          {needsActivation && (
            <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl sm:rounded-2xl shadow-sm">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-xs sm:text-sm font-semibold text-amber-800 mb-1 sm:mb-2">
                    Account Activation Required
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-700 mb-2 sm:mb-3">
                    Your login attempt was unsuccessful. This could be due to:
                  </p>
                  <ul className="text-xs sm:text-sm text-amber-700 space-y-0.5 sm:space-y-1 mb-3 sm:mb-4 ml-3 sm:ml-4">
                    <li>• Incorrect email or password</li>
                    <li>• Account not activated yet</li>
                    <li>• Email not registered in our system</li>
                  </ul>
                  <button
                    onClick={handleResendActivation}
                    disabled={resendLoading}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                        <span className="text-xs sm:text-sm">Sending...</span>
                      </div>
                    ) : (
                      "Resend Activation Email"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Register Link - Responsive spacing and text */}
          <div className="text-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100">
            <p className="text-sm sm:text-base text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
