import axios from "axios";

const AuthApiClient = axios.create({
  baseURL: "https://snapverse-api-rho.vercel.app/api/v1/",
  // baseURL: "http://127.0.0.1:8000/api/v1/",
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

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
  (error) => {
    console.error(
      `[AuthAPI] ${error.response?.status || "Network"} error:`,
      error
    );

    // Handle token expiration
    if (error.response?.status === 401) {
      console.warn("[AuthAPI] Token expired or invalid - clearing auth tokens");
      localStorage.removeItem("authTokens");
      // Optionally redirect to login
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default AuthApiClient;
