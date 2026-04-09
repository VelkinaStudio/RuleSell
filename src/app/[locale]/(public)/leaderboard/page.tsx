"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import type { Category } from "@/types";
import { CATEGORY_META, CATEGORY_ORDER } from "@/constants/categories";
import { LeaderboardRow } from "@/components/marketplace/leaderboard-row";
import { ErrorState } from "@/components/ui/error-state";
import { useRulesets } from "@/hooks/use-rulesets";
import { cn } from "@/lib/utils";

export default function LeaderboardPage() {
  const t = useTranslations("leaderboard");
  const [filter, setFilter] = useState<Category | "ALL">("ALL");

  // Mock layer caps pageSize at 50; we fetch the top 50 sorted by quality.
  // Phase 11 / v2 backend will paginate properly to expose 100 entries.
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

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mx-auto max-w-2xl text-base text-fg-muted">
          {t("subtitle")}{" "}
          <a
            href="/about#quality-score"
            className="font-medium text-brand hover:text-brand-soft"
          >
            {t("learnMore")}
          </a>
        </p>
      </header>

      {/* Category filter */}
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

      {/* Header row (desktop only) */}
      <div className="hidden grid-cols-[60px_minmax(0,1fr)_180px_140px_100px] gap-4 px-4 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle md:grid">
        <span>{t("rank")}</span>
        <span>{t("asset")}</span>
        <span>{t("author")}</span>
        <span>{t("score")}</span>
        <span className="text-right">{t("downloads")}</span>
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
        <div className="space-y-2">
          {filtered.map((r, i) => (
            <LeaderboardRow key={r.id} rank={i + 1} ruleset={r} />
          ))}
        </div>
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
          ? { borderColor: accent, color: accent, backgroundColor: `${accent}1a` }
          : undefined
      }
    >
      {children}
    </button>
  );
}
