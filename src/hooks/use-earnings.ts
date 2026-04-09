"use client";

import { useMemo } from "react";

import { useSession } from "@/hooks/use-session";
import { useAnalyticsOverview } from "@/hooks/use-analytics-overview";

export type PayoutStatus = "pending" | "paid" | "failed";

export interface PayoutRecord {
  id: string;
  amount: number; // cents
  status: PayoutStatus;
  paidAt: string | null;
  periodStart: string;
  periodEnd: string;
}

export interface EarningsTrendPoint {
  date: string; // YYYY-MM-DD
  revenue: number; // cents
  installs: number;
}

export interface EarningsData {
  lifetimeRevenue: number;
  pendingPayout: number;
  nextPayoutAt: string;
  payoutMin: number; // cents threshold
  timeseries: EarningsTrendPoint[];
  payouts: PayoutRecord[];
}

const PAYOUT_MIN = 5000; // $50 in cents

/**
 * Earnings hook for the current user. Reuses the analytics-overview mock
 * (which now exposes 30-day install + revenue series since commit 4c6e631)
 * and synthesizes payout history deterministically from total earnings.
 */
export function useEarnings() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? null;
  const { data, error, isLoading } = useAnalyticsOverview(userId);

  const earnings: EarningsData | undefined = useMemo(() => {
    if (!data || !session?.user) return undefined;

    // Build a 90-day timeseries by stitching the 30-day install + revenue
    // series with two flat-extrapolated 30-day pads. Real backend would
    // return 90 days directly — this is mock-only.
    const installSeries = data.recentInstalls ?? [];
    const revenueSeries = data.recentRevenue ?? [];
    const dailyAvg =
      revenueSeries.length > 0
        ? revenueSeries.reduce((s, p) => s + p.amount, 0) / revenueSeries.length
        : 0;
    const dailyAvgInstalls =
      installSeries.length > 0
        ? installSeries.reduce((s, p) => s + p.count, 0) / installSeries.length
        : 0;

    const timeseries: EarningsTrendPoint[] = [];
    // 60 days of synthesized history (older than the real 30 days)
    for (let i = 60; i > 0; i--) {
      const day = new Date("2026-04-08T12:00:00Z");
      day.setUTCDate(day.getUTCDate() - (i + 29));
      const fade = 0.6 + (60 - i) / 75; // gentle ramp toward today
      timeseries.push({
        date: day.toISOString().slice(0, 10),
        revenue: Math.round(dailyAvg * fade),
        installs: Math.round(dailyAvgInstalls * fade),
      });
    }
    // Real 30-day series from the mock backend
    revenueSeries.forEach((rev, idx) => {
      const inst = installSeries[idx];
      timeseries.push({
        date: rev.date,
        revenue: rev.amount,
        installs: inst?.count ?? 0,
      });
    });

    // Pending payout = sum of last 14 days of revenue (until next pay date)
    const pendingPayout = timeseries
      .slice(-14)
      .reduce((s, p) => s + p.revenue, 0);

    // Next payout date = first day of next month (mock)
    const next = new Date("2026-05-01T00:00:00Z").toISOString();

    // Build a deterministic payout history from total earnings.
    const total = data.totalRevenue ?? 0;
    const payouts: PayoutRecord[] = [];
    if (total > 0) {
      // Three previous monthly payouts. Each ~25% of total.
      const slices = [0.32, 0.28, 0.24];
      slices.forEach((pct, idx) => {
        const amount = Math.round(total * pct);
        const periodEnd = new Date("2026-04-01T00:00:00Z");
        periodEnd.setUTCMonth(periodEnd.getUTCMonth() - idx);
        const periodStart = new Date(periodEnd);
        periodStart.setUTCMonth(periodStart.getUTCMonth() - 1);
        payouts.push({
          id: `payout-${idx}`,
          amount,
          status: idx === 0 ? "pending" : "paid",
          paidAt: idx === 0 ? null : periodEnd.toISOString(),
          periodStart: periodStart.toISOString(),
          periodEnd: periodEnd.toISOString(),
        });
      });
    }

    return {
      lifetimeRevenue: total,
      pendingPayout,
      nextPayoutAt: next,
      payoutMin: PAYOUT_MIN,
      timeseries,
      payouts,
    };
  }, [data, session?.user]);

  return { earnings, error, isLoading };
}
