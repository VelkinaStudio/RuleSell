"use client";

import useSWR from "swr";

import type { Ruleset } from "@/types";
import { fetcher, type SWRKey } from "@/lib/api/fetcher";

export function useRuleset(slug: string | null) {
  const key: SWRKey | null = slug ? (["ruleset-by-slug", slug] as const) : null;
  return useSWR<Ruleset>(key, fetcher);
}

export function useRulesetById(id: string | null) {
  const key: SWRKey | null = id ? (["ruleset-by-id", id] as const) : null;
  return useSWR<Ruleset>(key, fetcher);
}
