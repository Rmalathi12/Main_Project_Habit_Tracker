import axios from "axios";

// Create central Axios instance pointing to Express backend
const API = axios.create({
  baseURL: "https://main-project-habit-tracker.onrender.com/api",
});

// Automatically append Bearer token to request headers if present in local storage
API.interceptors.request.use(
  (config) => {
    let token = null;

    // Check all possible storage keys used across components
    const storedData =
      localStorage.getItem("user") ||
      localStorage.getItem("userInfo") ||
      localStorage.getItem("userData");

    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);

        // Check root level, nested user objects, or data wrappers
        token =
          parsed?.token ||
          parsed?.accessToken ||
          parsed?.jwt ||
          parsed?.user?.token ||
          parsed?.userInfo?.token ||
          parsed?.data?.token;
      } catch (e) {
        token = storedData;
      }
    }

    // Fallback to standalone token key
    if (!token) {
      token = localStorage.getItem("token");
    }

    // Initialize headers if they don't exist
    if (!config.headers) {
      config.headers = {};
    }

    if (token) {
      config.headers.Authorization = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    } else {
      console.warn(
        "API Interceptor: No token found in localStorage for request:",
        config.url,
      );
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default API;
