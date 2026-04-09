"use client";

import useSWR from "swr";

import { fetcher, type SWRKey } from "@/lib/api/fetcher";
import type { AnalyticsOverview } from "@/lib/api/mock-server";

export function useAnalyticsOverview(userId: string | null) {
  const key: SWRKey | null = userId
    ? (["analytics-overview", userId] as const)
    : null;
  return useSWR<AnalyticsOverview>(key, fetcher);
}
