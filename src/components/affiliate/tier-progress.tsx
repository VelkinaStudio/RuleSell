"use client";

import { Award } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { useAffiliateStats } from "@/hooks/use-affiliate-stats";
import { AFFILIATE_TIERS } from "@/constants/mock-affiliates";

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function TierProgress() {
  const t = useTranslations("dashboard.affiliates");
  const reduce = useReducedMotion();
  const { stats } = useAffiliateStats();

  // Calculate position on the 3-tier progress bar
  const maxThreshold = AFFILIATE_TIERS[AFFILIATE_TIERS.length - 1].threshold;
  const earningsDollars = stats.totalEarnings / 100;
  const progressPct = Math.min(100, (earningsDollars / maxThreshold) * 100);

  return (
    <section className="rounded-xl border border-border-soft bg-bg-surface p-5">
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-4 w-4 text-brand" />
        <h2 className="text-sm font-semibold text-fg">{t("tierTitle")}</h2>
      </div>

      {/* Current tier badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-brand/15 px-2.5 py-1 text-xs font-bold text-brand">
            {stats.currentTier.name}
          </span>
          <span className="text-sm tabular-nums text-fg">
            {(stats.currentTier.rate * 100).toFixed(0)}% {t("commission")}
          </span>
        </div>
        {stats.nextTier && (
          <span className="text-xs text-fg-muted">
            {formatCents(stats.earningsToNextTier)} {t("toNextTier")} ({stats.nextTier.name})
          </span>
        )}
      </div>

      {/* Progress bar with tier markers */}
      <div className="relative">
        <div className="h-3 w-full rounded-full bg-bg-raised overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand/80 to-brand"
            initial={reduce ? false : { width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Tier markers */}
        <div className="relative mt-1">
          {AFFILIATE_TIERS.map((tier, i) => {
            const position =
              i === 0 ? 0 : (tier.threshold / maxThreshold) * 100;
            const isActive = earningsDollars >= tier.threshold;
            return (
              <div
                key={tier.name}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${position}%`,
                  transform: i === 0 ? "none" : "translateX(-50%)",
                }}
              >
                <div
                  className={cn(
                    "mt-1 h-2 w-2 rounded-full",
                    isActive ? "bg-brand" : "bg-fg-subtle/30",
                  )}
                />
                <span
                  className={cn(
                    "mt-1 text-[10px] font-medium whitespace-nowrap",
                    isActive ? "text-fg" : "text-fg-subtle",
                  )}
                >
                  {tier.name} ({(tier.rate * 100).toFixed(0)}%)
                </span>
                {i > 0 && (
                  <span className="text-[9px] tabular-nums text-fg-dim">
                    ${tier.threshold}+
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
