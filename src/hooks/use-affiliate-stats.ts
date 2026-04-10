"use client";

import { useMemo } from "react";

import type { AffiliateStats } from "@/types";
import {
  AFFILIATE_TIERS,
  MOCK_AFFILIATE_LINKS,
  MOCK_AFFILIATE_CONVERSIONS,
  MOCK_AFFILIATE_CLICKS,
} from "@/constants/mock-affiliates";

/**
 * Computes aggregated affiliate stats from mock data.
 * Replace the body with an SWR fetch to /api/affiliates/stats when backend is ready.
 */
export function useAffiliateStats() {
  const stats: AffiliateStats = useMemo(() => {
    const totalClicks = MOCK_AFFILIATE_CLICKS.length;
    const totalConversions = MOCK_AFFILIATE_CONVERSIONS.length;

    const pendingEarnings = MOCK_AFFILIATE_CONVERSIONS
      .filter((c) => c.status === "pending")
      .reduce((s, c) => s + c.commission, 0);

    const confirmedEarnings = MOCK_AFFILIATE_CONVERSIONS
      .filter((c) => c.status === "confirmed")
      .reduce((s, c) => s + c.commission, 0);

    const paidEarnings = MOCK_AFFILIATE_CONVERSIONS
      .filter((c) => c.status === "paid")
      .reduce((s, c) => s + c.commission, 0);

    const totalEarnings = pendingEarnings + confirmedEarnings + paidEarnings;

    // This month (April 2026)
    const thisMonthEarnings = MOCK_AFFILIATE_CONVERSIONS
      .filter((c) => c.createdAt.startsWith("2026-04"))
      .reduce((s, c) => s + c.commission, 0);

    const conversionRate =
      totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    // Determine current tier based on total earnings (in cents → dollars)
    const earningsDollars = totalEarnings / 100;
    let currentTierIdx = 0;
    for (let i = AFFILIATE_TIERS.length - 1; i >= 0; i--) {
      if (earningsDollars >= AFFILIATE_TIERS[i].threshold) {
        currentTierIdx = i;
        break;
      }
    }
    const currentTier = AFFILIATE_TIERS[currentTierIdx];
    const nextTier =
      currentTierIdx < AFFILIATE_TIERS.length - 1
        ? AFFILIATE_TIERS[currentTierIdx + 1]
        : null;
    const earningsToNextTier = nextTier
      ? Math.max(0, nextTier.threshold * 100 - totalEarnings)
      : 0;

    return {
      totalEarnings,
      pendingEarnings: pendingEarnings + confirmedEarnings,
      paidEarnings,
      thisMonthEarnings,
      totalClicks,
      totalConversions,
      conversionRate,
      currentTier,
      nextTier,
      earningsToNextTier,
    };
  }, []);

  return { stats, isLoading: false, error: null };
}
