"use client";

import useSWR from "swr";

import type { Team } from "@/types";
import { fetcher, type SWRKey } from "@/lib/api/fetcher";

export function useTeam(slug: string | null) {
  const key: SWRKey | null = slug ? (["team", slug] as const) : null;
  return useSWR<Team>(key, fetcher);
}
