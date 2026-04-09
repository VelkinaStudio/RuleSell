"use client";

import useSWR from "swr";
import { keys } from "@/lib/query-keys";
import { analytics, apiClient } from "@/lib/api-client";
import type { EarningsData } from "@/hooks/use-earnings";

export function useAnalytics(period?: string) {
  const overview = useSWR(keys.analytics.overview, () => analytics.overview());
  const earnings = useSWR(
    ["analytics", "earnings", period ?? "30d"] as const,
    () => apiClient<EarningsData>(`/api/analytics/earnings?period=${period ?? "30d"}`),
  );

  return {
    overview: overview.data,
    earnings: earnings.data,
    isLoading: overview.isLoading || earnings.isLoading,
    error: overview.error || earnings.error,
  };
}
