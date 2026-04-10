"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Download, Star } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Ruleset } from "@/types";
import { CATEGORY_META } from "@/constants/categories";
import { IconByName } from "@/components/ui/icon-map";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { formatCount, formatPrice } from "@/lib/utils";

interface FeaturedRulesetCardProps {
  ruleset: Ruleset;
  className?: string;
}

function gradeFor(score: number): { letter: string; colorClass: string } {
  if (score >= 85) return { letter: "A", colorClass: "text-qs-a bg-qs-a/15 border-qs-a/30" };
  if (score >= 70) return { letter: "B", colorClass: "text-qs-b bg-qs-b/15 border-qs-b/30" };
  if (score >= 50) return { letter: "C", colorClass: "text-qs-c bg-qs-c/15 border-qs-c/30" };
  return { letter: "—", colorClass: "text-fg-muted bg-bg-raised border-border-soft" };
}

export function FeaturedRulesetCard({
  ruleset,
  className,
}: FeaturedRulesetCardProps) {
  const t = useTranslations("marketplace.card");
  const reduce = useReducedMotion();

  const meta = CATEGORY_META[ruleset.category] ?? {
    label: ruleset.category ?? "Other",
    slug: ruleset.category ?? "other",
    color: "#6b7280",
    accent: "gray",
    icon: "Package",
    description: "",
  };

  const priceLabel =
    ruleset.price === 0 ? t("free") : formatPrice(ruleset.price, ruleset.currency);
  const installs = (ruleset.downloadCount ?? 0) + (ruleset.purchaseCount ?? 0);
  const qs = ruleset.qualityScore ?? 0;
  const grade = gradeFor(qs);

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -2 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      <Link
        href={`/r/${ruleset.slug}`}
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-xl border border-border-soft bg-bg-surface transition-all",
          "hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          "sm:col-span-2 sm:flex-row",
          className,
        )}
      >
        {/* Category accent stripe */}
        <div
          className="h-1 w-full sm:h-auto sm:w-1"
          style={{ backgroundColor: meta.color }}
          aria-hidden
        />

        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
          {/* Top row: category + quality badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span style={{ color: meta.color }}>
                <IconByName name={meta.icon} className="h-4 w-4" />
              </span>
              <span className="text-xs font-medium text-fg-muted">
                {meta.label}
              </span>
            </div>
            {qs > 0 && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-xs font-semibold tabular-nums",
                  grade.colorClass,
                )}
              >
                {grade.letter} {qs}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-display text-lg font-semibold text-fg group-hover:text-brand sm:text-xl">
            {ruleset.title}
          </h3>

          {/* Description */}
          <p className="line-clamp-3 text-sm leading-relaxed text-fg-muted">
            {ruleset.description}
          </p>

          {/* Author */}
          <p className="text-xs text-fg-subtle">
            @{ruleset.author.username}
            {ruleset.team && (
              <span className="text-fg-subtle"> · {ruleset.team.name}</span>
            )}
          </p>

          {/* Stats + price */}
          <div className="mt-auto flex items-center gap-4 pt-2 text-xs text-fg-subtle">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5" aria-hidden />
              <span className="font-mono tabular-nums">
                {(ruleset.avgRating ?? 0).toFixed(1)}
              </span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Download className="h-3.5 w-3.5" aria-hidden />
              <span className="font-mono tabular-nums">
                {formatCount(installs)}
              </span>
            </span>
            <span
              className={cn(
                "ml-auto font-mono text-sm font-semibold tabular-nums",
                ruleset.price === 0 ? "text-fg-muted" : "text-fg",
              )}
            >
              {priceLabel}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
