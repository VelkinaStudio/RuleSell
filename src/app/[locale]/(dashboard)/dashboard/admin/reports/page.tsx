"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { useAdminReports } from "@/hooks/use-admin-reports";
import { AdminReportTable } from "@/components/admin/admin-report-table";
import { cn } from "@/lib/utils";

type StatusTab = "all" | "pending" | "resolved" | "dismissed";

const TABS: StatusTab[] = ["all", "pending", "resolved", "dismissed"];

export default function AdminReportsPage() {
  const t = useTranslations("admin.reports");
  const [activeTab, setActiveTab] = useState<StatusTab>("all");
  const { reports, resolve, dismiss } = useAdminReports(activeTab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-fg">{t("title")}</h1>
        <p className="mt-1 text-sm text-fg-muted">{t("subtitle")}</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1 rounded-lg bg-bg-raised/50 p-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition",
              activeTab === tab
                ? "bg-brand/15 text-brand"
                : "text-fg-muted hover:text-fg",
            )}
          >
            {t(`tab.${tab}`)}
          </button>
        ))}
      </div>

      <AdminReportTable reports={reports} onResolve={resolve} onDismiss={dismiss} />
    </div>
  );
}
