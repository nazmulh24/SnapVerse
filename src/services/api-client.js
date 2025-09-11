import axios from "axios";
import { API_BASE_URL } from "../config/api";

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout (increased from 5s)
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function for exponential backoff delay
const getRetryDelay = (retryCount) => {
  return RETRY_DELAY * Math.pow(2, retryCount); // Exponential backoff
};

// Request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API] Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging and error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      `[API] ${response.status} ${response.config.method?.toUpperCase()} ${
        response.config.url
      }`
    );
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Don't log expected 400 errors for reaction API fallback mechanism
    if (
      error.response?.status === 400 &&
      error.config?.url?.includes("/react/")
    ) {
      // This is likely a fallback case for reaction payload format
      return Promise.reject(error);
    }

    // Handle timeout errors with retry logic
    if (
      (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") &&
      !originalRequest._retry &&
      (!originalRequest._retryCount ||
        originalRequest._retryCount < MAX_RETRIES)
    ) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      const delay = getRetryDelay(originalRequest._retryCount - 1);
      console.warn(
        `[API] Request timeout, retrying in ${delay}ms (attempt ${originalRequest._retryCount}/${MAX_RETRIES})`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
      return apiClient(originalRequest);
    }

    console.error(`[API] ${error.response?.status || "Network"} error:`, error);

    // Handle common HTTP errors
    if (error.response?.status === 401) {
      console.warn("[API] Unauthorized access - token may be expired");
    } else if (error.response?.status >= 500) {
      console.error("[API] Server error - please try again later");
    } else if (error.code === "ECONNABORTED") {
      console.error(
        "[API] Request timeout - server may be slow or unavailable"
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;
