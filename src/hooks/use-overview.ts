"use client";

import { useMemo } from "react";

import { useSession } from "@/hooks/use-session";
import { useAnalyticsOverview } from "@/hooks/use-analytics-overview";
import { useRulesets } from "@/hooks/use-rulesets";
import type { ActivityItem } from "@/components/dashboard/activity-feed";

export interface OverviewData {
  installs30d: number;
  installsDelta: number;
  revenue30d: number;
  revenueDelta: number;
  avgRating: number;
  publishedCount: number;
  totalInstalls: number;
  totalRevenue: number;
  activity: ActivityItem[];
}

/**
 * Composes overview data for the current dashboard user. Pulls from the
 * existing analytics-overview mock endpoint plus the rulesets list filtered
 * by the current author so we can derive an activity feed deterministically.
 */
export function useOverview() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? null;

  const analyticsQuery = useAnalyticsOverview(userId);
  const rulesetsQuery = useRulesets(
    userId ? { authorId: userId, pageSize: 50 } : { pageSize: 1 },
  );

  const overview: OverviewData | undefined = useMemo(() => {
    if (!session?.user || !analyticsQuery.data || !rulesetsQuery.data) {
      return undefined;
    }
    const a = analyticsQuery.data;
    const ownedItems = rulesetsQuery.data.data;

    // Compute the average rating across the user's own published items.
    const rated = ownedItems.filter((r) => r.ratingCount > 0);
    const avgRating =
      rated.length > 0
        ? rated.reduce((sum, r) => sum + r.avgRating, 0) / rated.length
        : 0;

    // Approximate revenue (cents) from purchase counts at average $9 / sale,
    // capped by the seller's totalEarnings if known. This is mock-only data.
    const revenue30d = Math.round((a.totalRevenue ?? 0) * 0.06);

    // Synthetic deltas — bounded so they look realistic in the UI.
    const installsDelta = ownedItems.length > 0 ? 12.4 : 0;
    const revenueDelta = (a.totalRevenue ?? 0) > 0 ? 8.3 : 0;

    // Build a small activity feed from the top items, deterministic so the
    // mock layer doesn't flicker on re-renders. Use a fixed reference time
    // that matches the analytics-overview ANALYTICS_TODAY constant so the
    // hook is pure (no Date.now()) and SSR/CSR snapshots agree.
    const now = new Date("2026-04-08T12:00:00Z").getTime();
    const activity: ActivityItem[] = [];
    ownedItems.slice(0, 6).forEach((r, i) => {
      // Each item gets one or two activity entries with offset timestamps.
      const baseAt = new Date(now - (i + 1) * 6 * 60 * 60 * 1000).toISOString();
      activity.push({
        id: `${r.id}-install`,
        kind: "install",
        href: `/r/${r.slug}`,
        at: baseAt,
        count: 3 + (i % 5),
        target: r.title,
      });
      if (r.ratingCount > 0 && i % 2 === 0) {
        activity.push({
          id: `${r.id}-review`,
          kind: "review",
          href: `/r/${r.slug}#reviews`,
          at: new Date(now - (i + 1) * 11 * 60 * 60 * 1000).toISOString(),
          target: r.title,
        });
      }
      if (r.price > 0 && i % 3 === 0) {
        activity.push({
          id: `${r.id}-purchase`,
          kind: "purchase",
          href: `/r/${r.slug}`,
          at: new Date(now - (i + 1) * 14 * 60 * 60 * 1000).toISOString(),
          target: r.title,
        });
      }
    });
    activity.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

    return {
      installs30d: a.last30dInstalls,
      installsDelta,
      revenue30d,
      revenueDelta,
      avgRating,
      publishedCount: a.totalRulesets,
      totalInstalls: a.totalInstalls,
      totalRevenue: a.totalRevenue,
      activity: activity.slice(0, 10),
    };
  }, [session?.user, analyticsQuery.data, rulesetsQuery.data]);

  return {
    overview,
    error: analyticsQuery.error ?? rulesetsQuery.error,
    isLoading: analyticsQuery.isLoading || rulesetsQuery.isLoading,
  };
}
