"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

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

// Valid credentials (demo only)
const VALID_CREDENTIALS: Record<string, { password: string; name: string; avatar: string; role: string }> = {
  "info@varnijewels.com": {
    password: "litekart",
    name: "Arjun Mehta",
    avatar: "AM",
    role: "owner",
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const match = VALID_CREDENTIALS[email.toLowerCase().trim()];
    if (match && match.password === password) {
      setUser({
        email: email.toLowerCase().trim(),
        name: match.name,
        avatar: match.avatar,
        role: match.role,
      });
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

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
