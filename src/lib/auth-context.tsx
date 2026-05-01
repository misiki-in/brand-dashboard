"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface AuthUser {
  email: string;
  name: string;
  avatar: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_KEY = "varni_auth_user";

// Valid credentials (demo only)
const VALID_CREDENTIALS: Record<string, { password: string; name: string; avatar: string; role: string }> = {
  "info@varnijewels.com": {
    password: "litekart",
    name: "Arjun Mehta",
    avatar: "AM",
    role: "owner",
  },
};

// Safe localStorage access (SSR guard)
function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

function storeUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hydrating, setHydrating] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
    }
    setHydrating(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const match = VALID_CREDENTIALS[email.toLowerCase().trim()];
    if (match && match.password === password) {
      const authUser: AuthUser = {
        email: email.toLowerCase().trim(),
        name: match.name,
        avatar: match.avatar,
        role: match.role,
      };
      setUser(authUser);
      storeUser(authUser);
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    storeUser(null);
  }, []);

  // Don't flash login page while hydrating from localStorage
  if (hydrating) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
