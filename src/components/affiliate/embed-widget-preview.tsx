"use client";

import { ExternalLink, Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

export function EmbedWidgetPreview() {
  const t = useTranslations("dashboard.affiliates");

  return (
    <section className="rounded-xl border border-border-soft bg-bg-surface p-5">
      <h2 className="text-sm font-semibold text-fg mb-3">
        {t("embedPreviewTitle")}
      </h2>
      <p className="text-xs text-fg-muted mb-4">
        {t("embedPreviewDesc")}
      </p>

      {/* Mock embed card */}
      <div className="mx-auto max-w-[360px]">
        <div className="rounded-xl border border-border-soft bg-bg-raised p-4 transition hover:border-brand/30">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1 rounded bg-brand/15 px-1.5 py-0.5 text-[10px] font-bold text-brand">
                RULES
              </span>
              <h3 className="mt-1.5 truncate text-sm font-semibold text-fg">
                Cursor Rules Pro
              </h3>
              <p className="mt-0.5 text-[11px] text-fg-muted">
                by <span className="text-fg-subtle">@pontus_abrahamsson</span>
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-0.5 text-amber-400">
              <Star className="h-3 w-3 fill-current" />
              <span className="text-xs font-semibold tabular-nums">4.8</span>
            </div>
          </div>

          {/* Description */}
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-fg-muted">
            Production-grade Cursor rules for TypeScript, React, and Next.js
            projects. Includes auto-imports, naming conventions, and test
            patterns.
          </p>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between">
            <span className="font-mono text-base font-bold text-fg">$19</span>
            <span
              className={cn(
                "flex items-center gap-1 rounded-md bg-brand px-3 py-1.5",
                "text-xs font-semibold text-brand-fg",
              )}
            >
              View on RuleSell
              <ExternalLink className="h-3 w-3" />
            </span>
          </div>

          {/* Affiliate badge */}
          <div className="mt-2 border-t border-border-soft pt-2 text-center">
            <span className="text-[10px] text-fg-dim">
              {t("embedAffBadge")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
