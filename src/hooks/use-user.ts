"use client";

import useSWR from "swr";

import type { User } from "@/types";
import { fetcher, type SWRKey } from "@/lib/api/fetcher";

export function useUser(username: string | null) {
  const key: SWRKey | null = username ? (["user", username] as const) : null;
  return useSWR<User>(key, fetcher);
}
