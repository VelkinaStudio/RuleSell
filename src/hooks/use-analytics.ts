"use client";

import useSWR from "swr";
import {
  analytics,
  ApiError,
  type AnalyticsOverview,
} from "@/lib/api-client";
import { keys } from "@/lib/query-keys";

export interface UseAnalyticsResult {
  data: AnalyticsOverview | null;
  isLoading: boolean;
  error: ApiError | null;
  mutate: () => Promise<unknown>;
}

/**
 * Seller analytics overview. `period` is currently a pass-through label
 * for the cache key — the underlying `/api/analytics/overview` endpoint
 * does not segment by time window in its current implementation, but
 * keying by period keeps the hook forward-compatible when it does.
 */
export function useAnalytics(period: "7d" | "30d" | "90d" | "all" = "30d"): UseAnalyticsResult {
  const { data, error, isLoading, mutate } = useSWR(
    [...keys.analytics.overview, period] as const,
    () => analytics.overview(),
  );

  const isAuthError = error instanceof ApiError && error.isUnauthorized;

  return {
    data: isAuthError ? null : data ?? null,
    isLoading,
    error: error instanceof ApiError && !isAuthError ? error : null,
    mutate,
  };
}
