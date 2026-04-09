"use client";

import useSWR from "swr";

import type { User } from "@/types";
import { fetcher, type SWRKey } from "@/lib/api/fetcher";

export function useLeaderboard(limit?: number) {
  const key: SWRKey = ["leaderboard", limit] as const;
  return useSWR<User[]>(key, fetcher);
}
