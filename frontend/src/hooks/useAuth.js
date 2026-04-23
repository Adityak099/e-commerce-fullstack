// src/hooks/useAuth.js
"use client";
import { useEffect, useState } from "react";
import { isAuthenticated, getCurrentUser } from "@/services/auth.service";

const getAuthSnapshot = () => ({
  user: typeof window !== "undefined" && isAuthenticated() ? getCurrentUser() : null,
  isMounted: typeof window !== "undefined",
});

export function useAuth() {
  const [authState, setAuthState] = useState(getAuthSnapshot);

  useEffect(() => {
    const handleStorageChange = () => {
      setAuthState(getAuthSnapshot());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-change", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleStorageChange);
    };
  }, []);

  return authState;
}
