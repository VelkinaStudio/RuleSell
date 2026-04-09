"use client";

import { useAuthContext } from "@/components/providers/auth-provider";

/**
 * Session hook backed by real NextAuth. Returns the same { data, status }
 * shape the rest of the frontend expects.
 */
export function useSession() {
  const { data, status } = useAuthContext();
  return { data, status };
}
