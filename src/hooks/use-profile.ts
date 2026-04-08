"use client";

import useSWR from "swr";
import { users, ApiError, type PublicProfile } from "@/lib/api-client";
import { keys } from "@/lib/query-keys";

export interface UseProfileResult {
  data: PublicProfile | null;
  isLoading: boolean;
  error: ApiError | null;
  mutate: () => Promise<unknown>;
}

/**
 * Public user profile lookup by username. Resolves to `data: null` when
 * unauthenticated (for gated profile fields) or when the username is
 * null/undefined. The underlying API endpoint is documented in
 * `src/lib/api-client.ts` → `users.getProfile`.
 */
export function useProfile(username: string | null | undefined): UseProfileResult {
  const { data, error, isLoading, mutate } = useSWR(
    username ? keys.users.profile(username) : null,
    username ? () => users.getProfile(username) : null,
  );

  const isAuthError = error instanceof ApiError && error.isUnauthorized;

  return {
    data: isAuthError ? null : data ?? null,
    isLoading: username ? isLoading : false,
    error: error instanceof ApiError && !isAuthError ? error : null,
    mutate,
  };
}
