"use client";

import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";

import type { QualityBreakdown as QualityBreakdownType } from "@/types";
import { QualityBar } from "@/components/ui/quality-bar";

interface QualityBreakdownProps {
  breakdown: QualityBreakdownType;
  total: number;
}

export function QualityBreakdown({ breakdown, total }: QualityBreakdownProps) {
  const t = useTranslations("ruleset.about");

  const rows: Array<{ key: string; label: string; value: number | null }> = [
    { key: "tokenEfficiency", label: t("tokenEfficiency"), value: breakdown.tokenEfficiency },
    { key: "installSuccess", label: t("installSuccess"), value: breakdown.installSuccess },
    { key: "schemaClean", label: t("schemaClean"), value: breakdown.schemaClean },
    { key: "freshness", label: t("freshness"), value: breakdown.freshness },
    { key: "reviewScore", label: t("reviewScore"), value: breakdown.reviewScore },
  ];

  return (
    <section className="space-y-4 rounded-2xl border border-border-soft bg-bg-surface p-6">
      <header className="flex items-end justify-between gap-4">
        <h2 className="text-xl font-semibold uppercase tracking-wider text-fg">
          {t("qualityBreakdown")}
        </h2>
        <span className="font-mono text-2xl font-semibold tabular-nums text-fg">
          {total}
        </span>
      </header>
      <div className="space-y-3">
        {rows.map((row) =>
          row.value === null ? (
            <div key={row.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-fg-muted">{row.label}</span>
                <span className="text-fg-subtle">{t("notApplicable")}</span>
              </div>
              <div className="h-1 w-full rounded-full bg-bg-raised" aria-hidden />
            </div>
          ) : (
            <QualityBar
              key={row.key}
              score={row.value}
              label={row.label}
            />
          ),
        )}
        {/* Security pass row */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-fg-muted">{t("securityPass")}</span>
            <span
              className={
                breakdown.securityPass
                  ? "inline-flex items-center gap-1 font-semibold text-success"
                  : "inline-flex items-center gap-1 font-semibold text-danger"
              }
            >
              {breakdown.securityPass ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  {t("securityPassed")}
                </>
              ) : (
                <>
                  <X className="h-3.5 w-3.5" />
                  {t("securityFailed")}
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
