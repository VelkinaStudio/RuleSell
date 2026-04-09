"use client";

import useSWR from "swr";
import { keys } from "@/lib/query-keys";
import { analytics } from "@/lib/api-client";

export function useAnalytics(period?: string) {
  const overview = useSWR(keys.analytics.overview, () => analytics.overview());
  // TODO: endpoint not yet built — earnings API pending
  const earnings = useSWR(
    ["analytics", "earnings", period] as const,
    () => Promise.resolve(undefined),
  );

  return {
    overview: overview.data,
    earnings: earnings.data,
    isLoading: overview.isLoading || earnings.isLoading,
    error: overview.error || earnings.error,
  };
}
