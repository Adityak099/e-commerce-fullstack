import axios from "axios";

const api = axios.create({
  // Use the env variable, and ONLY fall back to 5000 if it's missing
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export default api;
