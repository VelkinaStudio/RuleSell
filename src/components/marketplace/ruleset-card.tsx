"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Download, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import type { Ruleset } from "@/types";
import { CATEGORY_META } from "@/constants/categories";
import { IconByName } from "@/components/ui/icon-map";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { cardHover } from "@/lib/motion/variants";
import { usePreferredEnvironments } from "@/hooks/use-preferred-environments";

import { formatCount, formatPrice } from "./_format";

/* ------------------------------------------------------------------ */
/* Quality-score grading — same approach as FeaturedRulesetCard        */
/* ------------------------------------------------------------------ */

function gradeFor(score: number): { letter: string; colorClass: string } {
  if (score >= 85)
    return { letter: "A", colorClass: "text-qs-a bg-qs-a/15 border-qs-a/30" };
  if (score >= 70)
    return { letter: "B", colorClass: "text-qs-b bg-qs-b/15 border-qs-b/30" };
  if (score >= 50)
    return { letter: "C", colorClass: "text-qs-c bg-qs-c/15 border-qs-c/30" };
  return {
    letter: "\u2014",
    colorClass: "text-fg-muted bg-bg-raised border-border-soft",
  };
}

/* ------------------------------------------------------------------ */
/* Visual star row (filled / half / empty)                            */
/* ------------------------------------------------------------------ */

function StarRow({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const diff = rating - i;
    if (diff >= 0.75) return "full";
    if (diff >= 0.25) return "half";
    return "empty";
  });

  return (
    <span className={cn("inline-flex items-center gap-px", className)}>
      {stars.map((type, i) => (
        <Star
          key={i}
          className={cn(
            "h-3 w-3",
            type === "full" && "fill-amber-400 text-amber-400",
            type === "half" && "fill-amber-400/50 text-amber-400",
            type === "empty" && "fill-transparent text-fg-dim",
          )}
          aria-hidden
        />
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* RulesetCard                                                        */
/* ------------------------------------------------------------------ */

interface RulesetCardProps {
  ruleset: Ruleset;
  className?: string;
  compact?: boolean;
}

export function RulesetCard({ ruleset, className, compact }: RulesetCardProps) {
  const t = useTranslations("marketplace.card");
  const reduce = useReducedMotion();
  const { envs: preferred } = usePreferredEnvironments();

  const meta = CATEGORY_META[ruleset.category] ?? {
    label: ruleset.category ?? "Other",
    slug: ruleset.category ?? "other",
    color: "#6b7280",
    accent: "gray",
    icon: "Package",
    description: "",
  };

  const matchesUserTools = useMemo(() => {
    if (preferred.length === 0 || !ruleset.variants) return false;
    return ruleset.variants.some((v) =>
      v.environments.some((e) => preferred.includes(e)),
    );
  }, [preferred, ruleset.variants]);

  const priceLabel =
    ruleset.price === 0
      ? t("free")
      : formatPrice(ruleset.price, ruleset.currency);
  const installs =
    (ruleset.downloadCount ?? 0) + (ruleset.purchaseCount ?? 0);
  const qs = ruleset.qualityScore ?? 0;
  const grade = gradeFor(qs);
  const rating = ruleset.avgRating ?? 0;

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover={reduce ? undefined : "hover"}
      className="h-full"
    >
      <Link
        href={`/r/${ruleset.slug}`}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-lg border border-border-soft bg-bg-surface transition-colors",
          "hover:border-border-strong hover:bg-bg-surface",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fg/20",
          className,
        )}
      >
        {/* Category color accent — thin left border */}
        <div
          className="absolute inset-y-0 left-0 w-[3px] rounded-l-lg"
          style={{ backgroundColor: meta.color }}
          aria-hidden
        />

        <div
          className={cn(
            "flex h-full flex-col gap-2",
            compact ? "py-2.5 pl-4 pr-3" : "py-3.5 pl-5 pr-3.5",
          )}
        >
          {/* ── Header zone ─────────────────────────────────── */}
          <div className="flex items-start gap-2.5">
            {/* Category icon + title + author */}
            <span style={{ color: meta.color }} className="mt-0.5 shrink-0">
              <IconByName
                name={meta.icon}
                className={cn(
                  "transition-colors group-hover:brightness-125",
                  compact ? "h-3.5 w-3.5" : "h-4 w-4",
                )}
              />
            </span>

            <div className="min-w-0 flex-1">
              <h3
                className={cn(
                  "line-clamp-1 font-medium text-fg",
                  compact ? "text-xs" : "text-sm",
                )}
              >
                {ruleset.title}
              </h3>
              <p
                className={cn(
                  "mt-0.5 line-clamp-1 text-fg-subtle",
                  compact ? "text-[10px]" : "text-xs",
                )}
              >
                @{ruleset.author.username}
                {ruleset.team && (
                  <span className="text-fg-subtle">
                    {" "}
                    &middot; {ruleset.team.name}
                  </span>
                )}
              </p>
            </div>

            {/* Quality score badge — most visually prominent element */}
            {qs > 0 && (
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-md border font-mono font-semibold tabular-nums",
                  compact
                    ? "px-1.5 py-px text-[10px]"
                    : "px-2 py-0.5 text-xs",
                  grade.colorClass,
                )}
              >
                {grade.letter} {qs}
              </span>
            )}
          </div>

          {/* ── Body zone ───────────────────────────────────── */}
          <p
            className={cn(
              "leading-relaxed text-fg-muted",
              compact
                ? "line-clamp-1 text-[11px]"
                : "line-clamp-2 text-xs",
            )}
          >
            {ruleset.description}
          </p>

          {/* ── Footer zone ─────────────────────────────────── */}
          <div
            className={cn(
              "mt-auto flex items-center gap-3 border-t border-border-soft pt-2",
              compact ? "text-[10px]" : "text-[11px]",
              "text-fg-subtle",
            )}
          >
            {/* Rating with visual stars */}
            <span className="inline-flex items-center gap-1">
              {!compact && <StarRow rating={rating} />}
              {compact && <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden />}
              <span className="font-mono tabular-nums">
                {rating.toFixed(1)}
              </span>
            </span>

            {/* Installs */}
            <span className="inline-flex items-center gap-1">
              <Download className={compact ? "h-2.5 w-2.5" : "h-3 w-3"} aria-hidden />
              <span className="font-mono tabular-nums">
                {formatCount(installs)}
              </span>
            </span>

            {/* Compatible label */}
            {matchesUserTools && (
              <span className="text-[10px] text-fg-subtle">compatible</span>
            )}

            {/* Price — pushed right */}
            <span
              className={cn(
                "ml-auto font-mono tabular-nums",
                compact ? "text-[10px]" : "text-xs",
                ruleset.price === 0
                  ? "text-fg-muted"
                  : "font-semibold text-fg",
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
