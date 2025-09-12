import axios from "axios";
import { API_BASE_URL } from "../config/api";

// Retry configuration for auth operations (more conservative)
const MAX_AUTH_RETRIES = 2;
const AUTH_RETRY_DELAY = 500; // 500ms base delay

const AuthApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout (increased from 10s)
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function for exponential backoff delay
const getAuthRetryDelay = (retryCount) => {
  return AUTH_RETRY_DELAY * Math.pow(2, retryCount);
};

// Request interceptor to automatically add auth headers
AuthApiClient.interceptors.request.use(
  (config) => {
    const authTokens = localStorage.getItem("authTokens");
    if (authTokens) {
      try {
        const tokens = JSON.parse(authTokens);
        if (tokens.access) {
          config.headers.Authorization = `JWT ${tokens.access}`;
        }
      } catch (error) {
        console.error("[AuthApiClient] Error parsing auth tokens:", error);
        // Remove invalid tokens
        localStorage.removeItem("authTokens");
      }
    }

    // If the data is FormData, remove the Content-Type header to let the browser set it
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    console.log(`[AuthAPI] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[AuthApiClient] Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
AuthApiClient.interceptors.response.use(
  (response) => {
    console.log(
      `[AuthAPI] ${response.status} ${response.config.method?.toUpperCase()} ${
        response.config.url
      }`
    );
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle timeout errors with retry logic (but don't retry auth failures)
    if (
      (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") &&
      error.response?.status !== 401 &&
      !originalRequest._retry &&
      (!originalRequest._retryCount ||
        originalRequest._retryCount < MAX_AUTH_RETRIES)
    ) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      const delay = getAuthRetryDelay(originalRequest._retryCount - 1);
      console.warn(
        `[AuthAPI] Request timeout, retrying in ${delay}ms (attempt ${originalRequest._retryCount}/${MAX_AUTH_RETRIES})`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
      return AuthApiClient(originalRequest);
    }

    console.error(
      `[AuthAPI] ${error.response?.status || "Network"} error:`,
      error
    );

    // Handle token expiration (don't retry auth failures)
    if (error.response?.status === 401) {
      console.warn("[AuthAPI] Token expired or invalid - clearing auth tokens");
      localStorage.removeItem("authTokens");
      // Optionally redirect to login
      // window.location.href = '/login';
    } else if (error.code === "ECONNABORTED") {
      console.error(
        "[AuthAPI] Request timeout - server may be slow or unavailable"
      );
    }

    return Promise.reject(error);
  }
);

export default AuthApiClient;
