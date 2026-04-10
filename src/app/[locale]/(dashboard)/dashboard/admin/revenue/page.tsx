"use client";

import { useTranslations } from "next-intl";
import { DollarSign, TrendingUp, ArrowDownRight } from "lucide-react";

import { useAdminRevenue } from "@/hooks/use-admin-revenue";
import { AdminRevenueChart } from "@/components/admin/admin-revenue-chart";
import { StatsCard } from "@/components/dashboard/stats-card";

export default function AdminRevenuePage() {
  const t = useTranslations("admin.revenue");
  const { data, totals } = useAdminRevenue();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-fg">{t("title")}</h1>
        <p className="mt-1 text-sm text-fg-muted">{t("subtitle")}</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard
          label={t("platformRevenue")}
          value={`$${(totals.platformRevenue / 100).toLocaleString()}`}
          delta={23.1}
          icon={TrendingUp}
        />
        <StatsCard
          label={t("sellerPayouts")}
          value={`$${(totals.sellerPayouts / 100).toLocaleString()}`}
          delta={18.4}
          icon={DollarSign}
        />
        <StatsCard
          label={t("refunds")}
          value={`$${(totals.refunds / 100).toLocaleString()}`}
          delta={-3.2}
          icon={ArrowDownRight}
          accent="text-danger"
          iconBg="bg-danger/10"
        />
      </div>

      <AdminRevenueChart data={data} />
    </div>
  );
}
