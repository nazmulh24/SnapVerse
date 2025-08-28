import axios from "axios";

const apiClient = axios.create({
  // baseURL: "https://snapverse-api-rho.vercel.app/api/v1/",
  baseURL: "http://127.0.0.1:8000/api/v1/",
});

export default apiClient;
