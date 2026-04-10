"use client";

import { DollarSign, Clock, Wallet, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

import { StatsCard } from "@/components/dashboard/stats-card";
import { useAffiliateStats } from "@/hooks/use-affiliate-stats";

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function EarningsOverview() {
  const t = useTranslations("dashboard.affiliates");
  const { stats } = useAffiliateStats();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        label={t("totalEarnings")}
        value={formatCents(stats.totalEarnings)}
        icon={DollarSign}
        accent="text-brand"
        iconBg="bg-brand/10"
        delta={12.4}
        deltaLabel={t("vsLastMonth")}
      />
      <StatsCard
        label={t("pendingEarnings")}
        value={formatCents(stats.pendingEarnings)}
        icon={Clock}
        accent="text-amber-400"
        iconBg="bg-amber-400/10"
      />
      <StatsCard
        label={t("paidEarnings")}
        value={formatCents(stats.paidEarnings)}
        icon={Wallet}
        accent="text-emerald-400"
        iconBg="bg-emerald-400/10"
      />
      <StatsCard
        label={t("thisMonth")}
        value={formatCents(stats.thisMonthEarnings)}
        icon={TrendingUp}
        accent="text-cyan-400"
        iconBg="bg-cyan-400/10"
        delta={8.3}
        deltaLabel={t("vsLastMonth")}
      />
    </div>
  );
}
