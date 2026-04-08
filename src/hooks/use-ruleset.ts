"use client";

import useSWR from "swr";
import { rulesets, ApiError } from "@/lib/api-client";
import { keys } from "@/lib/query-keys";
import type { RulesetCardData } from "@/types";

export interface UseRulesetResult {
  data: (RulesetCardData & { content?: string }) | null;
  isLoading: boolean;
  error: ApiError | null;
  mutate: () => Promise<unknown>;
}

/**
 * Fetch a single ruleset by its slug. `data` will be `null` when the
 * user is unauthenticated for a gated resource; detail-level errors
 * (404, 403) surface via the `error` field.
 */
export function useRuleset(slug: string | null | undefined): UseRulesetResult {
  const { data, error, isLoading, mutate } = useSWR(
    slug ? keys.rulesets.detail(slug) : null,
    slug ? () => rulesets.get(slug) : null,
  );

  const isAuthError = error instanceof ApiError && error.isUnauthorized;

  return {
    data: isAuthError ? null : data ?? null,
    isLoading: slug ? isLoading : false,
    error: error instanceof ApiError && !isAuthError ? error : null,
    mutate,
  };
}
