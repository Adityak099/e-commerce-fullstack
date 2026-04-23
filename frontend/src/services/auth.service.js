// src/services/auth.service.js
import api from "../lib/api";

const emitAuthChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-change"));
  }
};

/**
 * Register a new marketplace user
 * @param {Object} userData - { name, email, password }
 */
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Connection to SwiftCart failed" };
  }
};

/**
 * Login user and store JWT token
 * @param {Object} credentials - { email, password }
 */
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      emitAuthChange();
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login attempt failed" };
  }
};

/**
 * Logout user and clear local data
 * Blacklists token in Redis via the backend route
 */
export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Backend logout error (Redis):", error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    emitAuthChange();
  }
};

/**
 * Helper to check if user is currently logged in
 */
export const isAuthenticated = () => {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("token");
  }
  return false;
};

/**
 * Helper to get current user data
 */
export const getCurrentUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
};
