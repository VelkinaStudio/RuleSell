"use client";

import { Bookmark, Flag, GitFork, Star, TrendingUp, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Ruleset } from "@/types";
import { formatCount, daysSince } from "@/components/marketplace/_format";
import { ReportDialog } from "@/components/compliance/report-dialog";
import { CATEGORY_META } from "@/constants/categories";
import { Button } from "@/components/ui/button";
import { IconByName } from "@/components/ui/icon-map";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Quality-score grading                                               */
/* ------------------------------------------------------------------ */

function gradeFor(score: number): { letter: string; colorClass: string } {
  if (score >= 85)
    return { letter: "A", colorClass: "text-qs-a bg-qs-a/15 border-qs-a/30" };
  if (score >= 70)
    return { letter: "B", colorClass: "text-qs-b bg-qs-b/15 border-qs-b/30" };
  if (score >= 50)
    return { letter: "C", colorClass: "text-qs-c bg-qs-c/15 border-qs-c/30" };
  return { letter: "\u2014", colorClass: "text-fg-muted bg-bg-raised border-border-soft" };
}

/* ------------------------------------------------------------------ */
/* Visual star row (filled / half / empty)                             */
/* ------------------------------------------------------------------ */

function StarRow({ rating, className }: { rating: number; className?: string }) {
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
            "h-3.5 w-3.5",
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

interface DetailHeroProps {
  ruleset: Ruleset;
}

export function DetailHero({ ruleset }: DetailHeroProps) {
  const t = useTranslations("ruleset");
  const meta = CATEGORY_META[ruleset.category] ?? { label: ruleset.category ?? "Other", slug: ruleset.category ?? "other", color: "#6b7280", accent: "gray", icon: "Package", description: "" };
  const updatedDays = daysSince(ruleset.updatedAt);
  const installs = (ruleset.downloadCount ?? 0) + (ruleset.purchaseCount ?? 0);
  const qs = ruleset.qualityScore ?? 0;
  const grade = gradeFor(qs);
  const rating = ruleset.avgRating ?? 0;
  const isTrending = installs > 1000;

  return (
    <div className="space-y-5">
      {/* Category accent — top border tint */}
      <div
        className="h-0.5 w-16 rounded-full"
        style={{ backgroundColor: meta.color }}
        aria-hidden
      />

      {/* Breadcrumb */}
      <nav aria-label={t("breadcrumb.label")} className="text-xs text-fg-subtle">
        <Link href="/browse" className="hover:text-fg-muted">
          {t("breadcrumb.browse")}
        </Link>
        <span className="mx-1.5">/</span>
        <Link href={`/browse?category=${ruleset.category}`} className="hover:text-fg-muted">
          {meta.label}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-fg-muted">{ruleset.slug}</span>
      </nav>

      {/* Title */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="shrink-0" style={{ color: meta.color }} aria-hidden>
            <IconByName name={meta.icon} className="h-5 w-5" />
          </span>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            {ruleset.title}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-subtle">
          <Link href={`/u/${ruleset.author.username}`} className="hover:text-fg-muted">
            @{ruleset.author.username}
          </Link>
          {ruleset.team && (
            <>
              <span>·</span>
              <Link href={`/team/${ruleset.team.slug}`} className="hover:text-fg-muted">
                {ruleset.team.name}
              </Link>
            </>
          )}
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-fg-muted">
          {ruleset.description}
        </p>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-fg-subtle">
        {/* Visual star rating */}
        <span className="inline-flex items-center gap-1.5">
          <StarRow rating={rating} />
          <span className="font-mono tabular-nums">{rating.toFixed(1)}</span>
          <span>({formatCount(ruleset.ratingCount ?? 0)})</span>
        </span>

        {/* Installs with optional trending badge */}
        <span className="inline-flex items-center gap-1.5">
          <span className="font-mono tabular-nums">
            {formatCount(installs)} {t("stats.downloadsUnit")}
          </span>
          {isTrending && (
            <span className="inline-flex items-center gap-0.5 rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">
              <TrendingUp className="h-2.5 w-2.5" aria-hidden />
              {t("stats.trending")}
            </span>
          )}
        </span>

        {/* Quality score badge */}
        {qs > 0 && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-xs font-semibold tabular-nums",
              grade.colorClass,
            )}
            title="Quality Score (estimated from automated signals)"
          >
            {grade.letter} {qs}
            <span className="text-[9px] opacity-60">(est.)</span>
          </span>
        )}

        <span>
          {updatedDays === 0
            ? t("stats.freshnessRecent")
            : t("stats.freshness", { days: updatedDays })}
        </span>
        {ruleset.license && <span className="font-mono">{ruleset.license}</span>}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" className="gap-1.5 text-fg-muted">
          <Bookmark className="h-3.5 w-3.5" />
          {t("actions.save")}
        </Button>
        <Button variant="ghost" size="sm" className="gap-1.5 text-fg-muted">
          <UserPlus className="h-3.5 w-3.5" />
          {t("actions.follow")}
        </Button>
        <Button variant="ghost" size="sm" className="gap-1.5 text-fg-muted">
          <GitFork className="h-3.5 w-3.5" />
          {t("actions.fork")}
        </Button>
        <ReportDialog
          targetType="ruleset"
          targetId={ruleset.id}
          trigger={
            <Button variant="ghost" size="sm" className="gap-1.5 text-fg-subtle">
              <Flag className="h-3.5 w-3.5" />
              {t("actions.report")}
            </Button>
          }
        />
      </div>
    </div>
  );
}
