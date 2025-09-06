import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://snapverse-api-rho.vercel.app/api/v1/",
  // baseURL: "http://127.0.0.1:8000/api/v1/",
  timeout: 5000, // 5 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

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
  (error) => {
    // Don't log expected 400 errors for reaction API fallback mechanism
    if (
      error.response?.status === 400 &&
      error.config?.url?.includes("/react/")
    ) {
      // This is likely a fallback case for reaction payload format
      return Promise.reject(error);
    }

    console.error(`[API] ${error.response?.status || "Network"} error:`, error);

    // Handle common HTTP errors
    if (error.response?.status === 401) {
      console.warn("[API] Unauthorized access - token may be expired");
    } else if (error.response?.status >= 500) {
      console.error("[API] Server error - please try again later");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
