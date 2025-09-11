// API Configuration
// Switch between production and development APIs

const API_CONFIG = {
  // Production API (default)
  PRODUCTION_BASE_URL: "https://snapverse-api-rho.vercel.app/api/v1",

  // Local development API
  DEVELOPMENT_BASE_URL: "http://127.0.0.1:8000/api/v1",

  // Current environment - change this to switch between prod and dev
  // Set to 'development' if you want to use local API
  ENVIRONMENT: "production",
};

// Get the current API base URL
export const getApiBaseUrl = () => {
  return API_CONFIG.ENVIRONMENT === "development"
    ? API_CONFIG.DEVELOPMENT_BASE_URL
    : API_CONFIG.PRODUCTION_BASE_URL;
};

// Export the base URL directly for convenience
export const API_BASE_URL = getApiBaseUrl();

export default API_CONFIG;
