import { useEffect, useState } from "react";
import AuthApiClient from "../services/auth-api-client";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const getToken = () => {
    const token = localStorage.getItem("authTokens");
    return token ? JSON.parse(token) : null;
  };

  const [authTokens, setAuthTokens] = useState(getToken());
  const [loading, setLoading] = useState(!!getToken()); // Only load if we have tokens

  //--> Fetch user profile
  useEffect(() => {
    const initializeAuth = async () => {
      if (authTokens) {
        setLoading(true); // Set loading when starting to fetch user
        try {
          const response = await AuthApiClient.get("/auth/users/me");
          //   console.log(response.data);
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          // If token is invalid, clear it
          setAuthTokens(null);
          setUser(null);
          localStorage.removeItem("authTokens");
        }
        setLoading(false); // Set loading false after fetch completes
      } else {
        // No auth tokens, clear user and set loading to false
        setUser(null);
        setLoading(false);
      }
    };

    initializeAuth();
  }, [authTokens]);

  const handleAPIError = (
    error,
    defaultMessage = "Something Went Wrong! Try Again"
  ) => {
    console.log(error);

    // setErrorMsg(
    //   error?.response?.data?.detail || error?.message || defaultMessage
    // );

    if (error.response && error.response.data) {
      const errorMessage = Object.values(error.response.data).flat().join("\n");
      setErrorMsg(errorMessage);
      return { success: false, message: errorMessage };
    }
    setErrorMsg(defaultMessage);
    setTimeout(() => setErrorMsg(""), 10000);
    return {
      success: false,
      message: defaultMessage,
    };
  };

  let successTimeoutId;

  const handleAPISuccess = (
    success,
    clearError = true,
    defaultMessage = "Operation successful"
  ) => {
    if (clearError) setErrorMsg("");
    const successMessage = success || defaultMessage;
    setSuccessMsg(successMessage);
    if (successTimeoutId) clearTimeout(successTimeoutId);
    successTimeoutId = setTimeout(() => setSuccessMsg(""), 10000);
    return { success: true, message: successMessage };
  };

  //---> Update User Profile
  const updateUserProfile = async (data) => {
    setErrorMsg("");

    try {
      await AuthApiClient.put("/auth/users/me/", data);
      return handleAPISuccess("Profile updated successfully");
    } catch (error) {
      return handleAPIError(error);
    }
  };

  //---> Password Change
  const changePassword = async (data) => {
    setErrorMsg("");
    try {
      await AuthApiClient.post("/auth/users/set_password/", data);
      return handleAPISuccess("Password changed successfully");
    } catch (error) {
      return handleAPIError(error);
    }
  };

  //--> Login User with smart error handling
  const loginUser = async (userData) => {
    setErrorMsg("");

    try {
      const response = await AuthApiClient.post("/auth/jwt/create/", userData);

      // console.log(response.data);
      setAuthTokens(response.data);
      localStorage.setItem("authTokens", JSON.stringify(response.data));

      return { success: true, data: response.data };
    } catch (error) {
      console.log("Login error details:", error.response?.data);

      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.non_field_errors?.[0];

      //--> Handle all login failures with the same helpful response
      // Django returns "No active account found with the given credentials" for:
      // - Non-existent email, inactive account, OR wrong password (for security)
      if (
        errorMessage === "No active account found with the given credentials"
      ) {
        setErrorMsg(
          "Login failed. Please check your credentials, ensure your account is activated, or register if you don't have an account."
        );
        return {
          success: false,
          needsActivation: true, //--> Show helpful options
          needsRegistration: false,
          email: userData.email,
          message: "Login failed",
        };
      }

      //---> Handle other unexpected errors
      setErrorMsg(
        errorMessage || "An unexpected error occurred. Please try again."
      );
      return {
        success: false,
        needsActivation: false,
        needsRegistration: false,
        message: errorMessage || "Unexpected error",
      };
    }
  };

  //--> Forgot Password
  const forgotPassword = async (email) => {
    setErrorMsg("");

    try {
      await AuthApiClient.post("/auth/users/reset_password/", { email: email });
      return handleAPISuccess(
        "Password reset link has been sent to your email address. Please check your inbox."
      );
    } catch (error) {
      return handleAPIError(error, "Failed to send reset email");
    }
  };

  //--> Reset Password
  const resetPassword = async (uid, token, newPassword) => {
    setErrorMsg("");

    try {
      await AuthApiClient.post("/auth/users/reset_password_confirm/", {
        uid,
        token,
        new_password: newPassword,
      });
      return handleAPISuccess("Password reset successful!");
    } catch (error) {
      return handleAPIError(error, "Failed to reset password");
    }
  };

  //--> Register User
  const registerUser = async (userData) => {
    setErrorMsg("");

    try {
      await AuthApiClient.post("/auth/users/", userData);
      return {
        success: true,
        message:
          "Registration successfull. Check your email to activate your account.",
      };
    } catch (error) {
      return handleAPIError(error, "Registration Failed! Try Again");
    }
  };

  //--> Resend Activation Email
  const resendActivation = async (email) => {
    setErrorMsg("");

    try {
      await AuthApiClient.post("/auth/users/resend_activation/", { email });
      return handleAPISuccess(
        "Activation link has been resent to your email address. Please check your inbox."
      );
    } catch (error) {
      return handleAPIError(error, "Failed to resend activation email");
    }
  };

  //--> Logout User
  const logoutUser = (onLogout) => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    localStorage.removeItem("cartId");
    if (onLogout && typeof onLogout === "function") {
      onLogout();
    }
  };

  return {
    user,
    authTokens,
    loading,
    loginUser,
    forgotPassword,
    resetPassword,
    registerUser,
    resendActivation,
    logoutUser,
    updateUserProfile,
    changePassword,
    errorMsg,
    successMsg,
  };
};

export default useAuth;
