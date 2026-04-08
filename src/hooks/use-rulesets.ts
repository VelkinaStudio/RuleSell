"use client";

import useSWR from "swr";
import { rulesets, ApiError, type RulesetListParams } from "@/lib/api-client";
import { keys } from "@/lib/query-keys";
import type { PaginationMeta, RulesetCardData } from "@/types";

export interface UseRulesetsResult {
  data: { data: RulesetCardData[]; pagination: PaginationMeta } | null;
  isLoading: boolean;
  error: ApiError | null;
  mutate: () => Promise<unknown>;
}

/**
 * Fetch a paginated list of rulesets with SWR caching.
 * Auth errors resolve to `data: null` rather than throwing.
 */
export function useRulesets(filters: RulesetListParams = {}): UseRulesetsResult {
  const { data, error, isLoading, mutate } = useSWR(
    keys.rulesets.list(filters),
    () => rulesets.list(filters),
  );

  const isAuthError = error instanceof ApiError && error.isUnauthorized;

  return {
    data: isAuthError ? null : data ?? null,
    isLoading,
    error: error instanceof ApiError && !isAuthError ? error : null,
    mutate,
  };
}
