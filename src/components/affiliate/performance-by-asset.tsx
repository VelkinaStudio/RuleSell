"use client";

import { ExternalLink, BarChart3 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { useAffiliateEarnings } from "@/hooks/use-affiliate-earnings";

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function PerformanceByAsset() {
  const t = useTranslations("dashboard.affiliates");
  const { assetPerformance } = useAffiliateEarnings();

  const maxEarnings = Math.max(1, ...assetPerformance.map((a) => a.earnings));

  return (
    <section className="rounded-xl border border-border-soft bg-bg-surface">
      <header className="border-b border-border-soft px-5 py-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-brand" />
          <h2 className="text-sm font-semibold text-fg">{t("topAssetsTitle")}</h2>
        </div>
        <p className="mt-0.5 text-xs text-fg-muted">{t("topAssetsDesc")}</p>
      </header>
      <ol className="divide-y divide-border-soft">
        {assetPerformance.map((asset, i) => {
          const barWidth = (asset.earnings / maxEarnings) * 100;
          return (
            <li key={asset.rulesetId} className="relative px-5 py-3">
              {/* Background bar */}
              <div
                className="absolute inset-y-0 left-0 bg-brand/5"
                style={{ width: `${barWidth}%` }}
              />
              <div className="relative flex items-center gap-4">
                <span className="w-5 shrink-0 text-center text-xs font-bold tabular-nums text-fg-subtle">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/r/${asset.rulesetSlug}`}
                    className="flex items-center gap-1 text-sm font-medium text-fg hover:text-brand"
                  >
                    <span className="truncate">{asset.rulesetTitle}</span>
                    <ExternalLink className="h-3 w-3 shrink-0 text-fg-subtle" aria-hidden />
                  </Link>
                  <div className="mt-0.5 flex items-center gap-3 text-[11px] text-fg-subtle">
                    <span>{asset.clicks} {t("clicks")}</span>
                    <span>{asset.conversions} {t("conversions")}</span>
                    <span>{asset.conversionRate.toFixed(1)}% {t("cvr")}</span>
                  </div>
                </div>
                <p className="shrink-0 font-mono text-sm font-semibold tabular-nums text-emerald-400">
                  {formatCents(asset.earnings)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
