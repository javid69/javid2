"use client";

import { useSession } from "next-auth/react";

export function useCurrentUser() {
  const { data: session } = useSession();
  return session?.user;
}

export function useIsAdmin() {
  const { data: session } = useSession();
  return session?.user?.role === "ADMIN";
}

export function useIsAgent() {
  const { data: session } = useSession();
  return session?.user?.role === "AGENT" || session?.user?.role === "ADMIN";
}

export function useAuth() {
  const { data: session, status } = useSession();
  
  return {
    user: session?.user,
    isAuthenticated: !!session?.user,
    isLoading: status === "loading",
    isAdmin: session?.user?.role === "ADMIN",
    isAgent: session?.user?.role === "AGENT" || session?.user?.role === "ADMIN",
  };
}
