"use client";

import useSWR from "swr";

import type { Page, Ruleset } from "@/types";
import { fetcher, type SWRKey } from "@/lib/api/fetcher";
import type { RulesetQuery } from "@/lib/api/types";

export function useRulesets(query: RulesetQuery = {}) {
  const key: SWRKey = ["rulesets", query] as const;
  return useSWR<Page<Ruleset>>(key, fetcher);
}
