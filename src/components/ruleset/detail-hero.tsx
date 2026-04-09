"use client";

import { Bookmark, Flag, GitFork, Star, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Ruleset } from "@/types";
import { formatCount, daysSince } from "@/components/marketplace/_format";
import { ReportDialog } from "@/components/compliance/report-dialog";
import { CATEGORY_META } from "@/constants/categories";
import { Button } from "@/components/ui/button";
import { IconByName } from "@/components/ui/icon-map";
import { Link } from "@/i18n/navigation";

interface DetailHeroProps {
  ruleset: Ruleset;
}

export function DetailHero({ ruleset }: DetailHeroProps) {
  const t = useTranslations("ruleset");
  const meta = CATEGORY_META[ruleset.category] ?? { label: ruleset.category ?? "Other", slug: ruleset.category ?? "other", color: "#6b7280", accent: "gray", icon: "Package", description: "" };
  const updatedDays = daysSince(ruleset.updatedAt);

  return (
    <div className="space-y-5">
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
          <IconByName name={meta.icon} className="h-5 w-5 text-fg-muted" />
          <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
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
        <span className="inline-flex items-center gap-1">
          <Star className="h-3 w-3" />
          <span className="font-mono tabular-nums">{(ruleset.avgRating ?? 0).toFixed(1)}</span>
          <span>({formatCount(ruleset.ratingCount ?? 0)})</span>
        </span>
        <span className="font-mono tabular-nums">
          {formatCount((ruleset.downloadCount ?? 0) + (ruleset.purchaseCount ?? 0))} downloads
        </span>
        <span className="font-mono tabular-nums" title="Quality Score (estimated from automated signals)">QS {ruleset.qualityScore ?? "—"} <span className="text-[9px] text-fg-dim">(est.)</span></span>
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
