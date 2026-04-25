// src/hooks/useAuth.js
"use client";
import { useEffect, useState } from "react";
import { isAuthenticated, getCurrentUser } from "@/services/auth.service";

const INITIAL_AUTH_STATE = {
  user: null,
  isMounted: false,
};

const getAuthSnapshot = () => {
  if (typeof window === "undefined") {
    return INITIAL_AUTH_STATE;
  }

  return {
    user: isAuthenticated() ? getCurrentUser() : null,
    isMounted: true,
  };
};

export function useAuth() {
  const [authState, setAuthState] = useState(INITIAL_AUTH_STATE);

  useEffect(() => {
    const handleStorageChange = () => {
      setAuthState(getAuthSnapshot());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-change", handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleStorageChange);
    };
  }, []);

  return authState;
}
