import axios from "axios";

const apiClient = axios.create({
  // baseURL: "https://snapverse-api-rho.vercel.app/api/v1/",
  baseURL: "http://127.0.0.1:8000/api/v1/",
  timeout: 10000, // 10 seconds timeout
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
