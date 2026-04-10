"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Download, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import type { Category, Ruleset } from "@/types";
import { CATEGORY_META, CATEGORY_ORDER } from "@/constants/categories";
import { LeaderboardRow } from "@/components/marketplace/leaderboard-row";
import { ErrorState } from "@/components/ui/error-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconByName } from "@/components/ui/icon-map";
import {
  heroEntrance,
  heroChild,
  sectionReveal,
  sectionChild,
} from "@/lib/motion/variants";
import { useRulesets } from "@/hooks/use-rulesets";
import { formatCount } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

function gradeFor(score: number): { letter: string; colorClass: string } {
  if (score >= 85) return { letter: "A", colorClass: "text-qs-a" };
  if (score >= 70) return { letter: "B", colorClass: "text-qs-b" };
  if (score >= 50) return { letter: "C", colorClass: "text-qs-c" };
  return { letter: "—", colorClass: "text-fg-muted" };
}

const PODIUM_STYLES: Record<number, { ring: string; badge: string; size: string }> = {
  0: {
    ring: "ring-2 ring-amber-300/40",
    badge: "bg-amber-300/15 text-amber-300",
    size: "p-5 sm:p-6",
  },
  1: {
    ring: "ring-1 ring-zinc-300/30",
    badge: "bg-zinc-300/15 text-zinc-300",
    size: "p-4 sm:p-5",
  },
  2: {
    ring: "ring-1 ring-orange-400/30",
    badge: "bg-orange-400/15 text-orange-400",
    size: "p-4 sm:p-5",
  },
};

function PodiumCard({ rank, ruleset }: { rank: number; ruleset: Ruleset }) {
  const meta = CATEGORY_META[ruleset.category] ?? {
    label: ruleset.category ?? "Other",
    slug: ruleset.category ?? "other",
    color: "#6b7280",
    accent: "gray",
    icon: "Package",
    description: "",
  };
  const qs = ruleset.qualityScore ?? 0;
  const grade = gradeFor(qs);
  const style = PODIUM_STYLES[rank] ?? PODIUM_STYLES[2]!;
  const installs = (ruleset.downloadCount ?? 0) + (ruleset.purchaseCount ?? 0);

  return (
    <Link
      href={`/r/${ruleset.slug}`}
      className={cn(
        "group flex flex-col rounded-xl border border-border-soft bg-bg-surface transition-all",
        "hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
        style.ring,
        style.size,
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "inline-flex h-7 w-7 items-center justify-center rounded-full font-mono text-sm font-bold",
            style.badge,
          )}
        >
          {rank + 1}
        </span>
        {qs > 0 && (
          <span className={cn("font-mono text-xl font-bold tabular-nums", grade.colorClass)}>
            {qs}
            <span className="ml-0.5 text-xs">{grade.letter}</span>
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
          style={{ backgroundColor: `${meta.color}1f`, color: meta.color }}
          aria-hidden
        >
          <IconByName name={meta.icon} className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="line-clamp-1 text-sm font-semibold text-fg group-hover:text-brand">
            {ruleset.title}
          </p>
          <p className="line-clamp-1 text-xs text-fg-muted">
            @{ruleset.author.username}
          </p>
        </div>
      </div>
      {ruleset.description && (
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-fg-muted">
          {ruleset.description}
        </p>
      )}
      <div className="mt-auto flex items-center gap-3 pt-3 text-[11px] text-fg-subtle">
        <span className="inline-flex items-center gap-1">
          <Star className="h-3 w-3" />
          <span className="font-mono tabular-nums">
            {(ruleset.avgRating ?? 0).toFixed(1)}
          </span>
        </span>
        <span className="inline-flex items-center gap-1">
          <Download className="h-3 w-3" />
          <span className="font-mono tabular-nums">
            {formatCount(installs)}
          </span>
        </span>
      </div>
    </Link>
  );
}

export default function LeaderboardPage() {
  const t = useTranslations("leaderboard");
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Category | "ALL">("ALL");

  const { data, error, isLoading, mutate } = useRulesets({
    tab: "top",
    sort: "quality",
    pageSize: 50,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === "ALL") return data.data;
    return data.data.filter((r) => r.category === filter);
  }, [data, filter]);

  const podium = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero header */}
      <motion.header
        className="space-y-4 text-center"
        variants={heroEntrance}
        initial={reduce ? "visible" : "hidden"}
        animate="visible"
      >
        <motion.h1
          variants={heroChild}
          className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl lg:text-5xl"
        >
          {t("title")}
        </motion.h1>
        <motion.p
          variants={heroChild}
          className="mx-auto max-w-2xl text-base text-fg-muted"
        >
          {t("subtitle")}{" "}
          <a
            href="/about#quality-score"
            className="font-medium text-brand hover:text-brand/80"
          >
            {t("learnMore")}
          </a>
        </motion.p>
      </motion.header>

      {/* Category filter chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <FilterChip
          active={filter === "ALL"}
          onClick={() => setFilter("ALL")}
        >
          {t("filters.all")}
        </FilterChip>
        {CATEGORY_ORDER.map((c) => {
          const meta = CATEGORY_META[c];
          return (
            <FilterChip
              key={c}
              active={filter === c}
              onClick={() => setFilter(c)}
              accent={meta.color}
            >
              {meta.label}
            </FilterChip>
          );
        })}
      </div>

      {error && (
        <ErrorState message={(error as Error)?.message} retry={() => mutate()} />
      )}

      {isLoading && !error && (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-lg border border-border-soft bg-bg-surface/60"
            />
          ))}
        </div>
      )}

      {!isLoading && !error && filtered.length > 0 && (
        <>
          {/* Top 3 podium */}
          <motion.div
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            variants={sectionReveal}
            initial={reduce ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {podium.map((r, i) => (
              <motion.div key={r.id} variants={sectionChild}>
                <PodiumCard rank={i} ruleset={r} />
              </motion.div>
            ))}
          </motion.div>

          {/* Table header (desktop only) */}
          {rest.length > 0 && (
            <div className="hidden grid-cols-[60px_minmax(0,1fr)_180px_140px_100px] gap-4 px-4 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle md:grid">
              <span>{t("rank")}</span>
              <span>{t("asset")}</span>
              <span>{t("author")}</span>
              <span>{t("score")}</span>
              <span className="text-right">{t("downloads")}</span>
            </div>
          )}

          {/* Remaining rows with stagger */}
          <motion.div
            className="space-y-2"
            variants={sectionReveal}
            initial={reduce ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {rest.map((r, i) => (
              <motion.div key={r.id} variants={sectionChild}>
                <LeaderboardRow rank={i + 4} ruleset={r} />
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  accent,
  children,
}: {
  active: boolean;
  onClick: () => void;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        active
          ? "border-brand bg-brand/10 text-brand"
          : "border-border-soft bg-bg-surface text-fg-muted hover:border-border-strong hover:text-fg",
      )}
      style={
        active && accent
          ? {
              borderColor: accent,
              color: accent,
              backgroundColor: `${accent}1a`,
            }
          : undefined
      }
    >
      {children}
    </button>
  );
}
