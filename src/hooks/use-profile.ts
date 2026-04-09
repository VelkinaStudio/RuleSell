"use client";

import useSWR from "swr";
import { keys } from "@/lib/query-keys";

// TODO: Remove mock fallback when backend ships GET /api/users/:username
// The profile endpoint does not exist on the backend yet.
// Profile pages are currently SSR only. Do not use useProfile() in client
// components until the backend team confirms the endpoint is live.

import { getUserByUsername } from "@/lib/api/mock-server";

export function useProfile(username: string) {
  return useSWR(
    keys.users.profile(username),
    () => getUserByUsername(username),
  );
}
