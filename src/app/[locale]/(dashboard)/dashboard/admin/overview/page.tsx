"use client";

import { useTranslations } from "next-intl";
import { AdminOverviewStats } from "@/components/admin/admin-overview-stats";

export default function AdminOverviewPage() {
  const t = useTranslations("admin.overview");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-fg">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-fg-muted">{t("subtitle")}</p>
      </div>

      <AdminOverviewStats />

      {/* Recent activity placeholder */}
      <div className="rounded-xl border border-border-soft bg-bg-surface p-5">
        <h2 className="mb-3 text-sm font-semibold text-fg">{t("recentActivity")}</h2>
        <div className="space-y-2">
          {[
            { text: t("activity.userSignup", { name: "elena-popescu" }), time: "2m" },
            { text: t("activity.rulesetSubmitted", { title: "Claude Code Bootstrap" }), time: "14m" },
            { text: t("activity.reportFiled", { target: "Malicious MCP Server" }), time: "1h" },
            { text: t("activity.rulesetApproved", { title: "Next.js 16 Patterns" }), time: "3h" },
            { text: t("activity.flagToggled", { flag: "ai_quality_scoring" }), time: "5h" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm transition hover:bg-bg-raised/30"
            >
              <span className="text-fg-muted">{item.text}</span>
              <span className="shrink-0 text-xs text-fg-subtle">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
