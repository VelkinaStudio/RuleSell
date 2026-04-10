"use client";

import { useTranslations } from "next-intl";
import {
  BarChart3,
  FileCheck,
  Flag,
  Paintbrush,
  Users,
  Package,
} from "lucide-react";

import { useAdminStats } from "@/hooks/use-admin-stats";
import { StatsCard } from "@/components/dashboard/stats-card";
import { AdminMiniChart } from "./admin-mini-chart";
import { formatCount, formatPrice } from "@/lib/utils";

// Synthetic sparkline data for each stat card
const SPARKLINES = {
  users: [980, 1020, 1050, 1080, 1120, 1180, 1210, 1247],
  rulesets: [280, 290, 300, 310, 318, 325, 335, 342],
  revenue: [18000, 19200, 20500, 22000, 24000, 25800, 27100, 28450],
  creators: [62, 65, 70, 72, 78, 82, 85, 89],
  reviews: [24, 22, 18, 20, 16, 14, 17, 15],
  reports: [12, 10, 14, 9, 11, 7, 10, 8],
};

export function AdminOverviewStats() {
  const { stats } = useAdminStats();
  const t = useTranslations("admin.overview");

  const cards = [
    {
      label: t("totalUsers"),
      value: formatCount(stats.totalUsers),
      delta: stats.monthlyGrowth.users,
      icon: Users,
      sparkline: SPARKLINES.users,
    },
    {
      label: t("totalRulesets"),
      value: formatCount(stats.totalRulesets),
      delta: stats.monthlyGrowth.rulesets,
      icon: Package,
      sparkline: SPARKLINES.rulesets,
    },
    {
      label: t("totalRevenue"),
      value: formatPrice(stats.totalRevenue),
      delta: stats.monthlyGrowth.revenue,
      icon: BarChart3,
      sparkline: SPARKLINES.revenue,
    },
    {
      label: t("activeCreators"),
      value: stats.activeCreators.toString(),
      delta: 5.2,
      icon: Paintbrush,
      sparkline: SPARKLINES.creators,
    },
    {
      label: t("pendingReviews"),
      value: stats.pendingReviews.toString(),
      delta: -12.5,
      icon: FileCheck,
      sparkline: SPARKLINES.reviews,
    },
    {
      label: t("openReports"),
      value: stats.openReports.toString(),
      delta: -8.3,
      icon: Flag,
      sparkline: SPARKLINES.reports,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="relative">
          <StatsCard
            label={card.label}
            value={card.value}
            delta={card.delta}
            deltaLabel={t("vsLastMonth")}
            icon={card.icon}
          />
          <div className="absolute right-5 bottom-5">
            <AdminMiniChart data={card.sparkline} />
          </div>
        </div>
      ))}
    </div>
  );
}
