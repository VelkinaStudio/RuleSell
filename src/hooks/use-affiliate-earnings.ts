"use client";

import { useMemo } from "react";

import {
  MOCK_MONTHLY_SUMMARIES,
  MOCK_ASSET_PERFORMANCE,
  MOCK_AFFILIATE_CLICKS,
} from "@/constants/mock-affiliates";
import type { AssetPerformance, MonthlySummary } from "@/constants/mock-affiliates";

export interface DailyClickPoint {
  date: string; // "2026-03-15"
  clicks: number;
  conversions: number;
}

/**
 * Returns monthly chart data + per-asset breakdown + daily click data.
 * Replace with SWR + /api/affiliates/earnings when backend is ready.
 */
export function useAffiliateEarnings(period: 30 | 60 | 90 = 30) {
  const monthlySummaries: MonthlySummary[] = MOCK_MONTHLY_SUMMARIES;
  const assetPerformance: AssetPerformance[] = MOCK_ASSET_PERFORMANCE;

  const dailyClicks: DailyClickPoint[] = useMemo(() => {
    const now = new Date("2026-04-08T12:00:00Z");
    const map = new Map<string, { clicks: number; conversions: number }>();

    // Initialize all days in range
    for (let d = 0; d < period; d++) {
      const date = new Date(now.getTime() - d * 86400000);
      const key = date.toISOString().slice(0, 10);
      map.set(key, { clicks: 0, conversions: 0 });
    }

    // Fill from mock clicks
    const cutoff = new Date(now.getTime() - period * 86400000);
    for (const click of MOCK_AFFILIATE_CLICKS) {
      const clickDate = new Date(click.createdAt);
      if (clickDate >= cutoff) {
        const key = click.createdAt.slice(0, 10);
        const entry = map.get(key);
        if (entry) {
          entry.clicks++;
          if (click.converted) entry.conversions++;
        }
      }
    }

    return Array.from(map.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [period]);

  return {
    monthlySummaries,
    assetPerformance,
    dailyClicks,
    isLoading: false,
    error: null,
  };
}
