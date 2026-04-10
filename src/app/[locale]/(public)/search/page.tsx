"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { HeroSearch } from "@/components/marketplace/hero-search";
import { RulesetCard } from "@/components/marketplace/ruleset-card";
import { Stagger } from "@/components/motion/stagger";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { useRulesets } from "@/hooks/use-rulesets";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

function SearchInner() {
  const t = useTranslations("search");
  const params = useSearchParams();
  const query = params.get("q") ?? "";

  const { data, error, isLoading, mutate } = useRulesets({
    q: query || undefined,
    pageSize: 24,
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      {/* Compact search bar — functional size, no hero treatment */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <HeroSearch defaultValue={query} autoFocus className="w-full max-w-xl" />
      </div>

      {error && (
        <ErrorState message={(error as Error)?.message} retry={() => mutate()} />
      )}

      {isLoading && !error && (
        <div className="space-y-5">
          <div className="h-8 w-48 animate-pulse rounded bg-bg-surface/60" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-xl border border-border-soft bg-bg-surface/60"
              />
            ))}
          </div>
        </div>
      )}

      {!isLoading && !error && data && (
        <>
          {/* Results count — prominent, Space Grotesk */}
          <p
            className={cn(
              "font-display text-2xl font-semibold tracking-tight",
              data.pagination.total === 0 ? "text-fg-muted" : "text-fg",
            )}
          >
            {t("results", { count: data.pagination.total, query: query || "—" })}
          </p>

          {data.data.length > 0 ? (
            <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data.data.map((r) => (
                <RulesetCard key={r.id} ruleset={r} />
              ))}
            </Stagger>
          ) : (
            /* No-results state */
            <div className="flex flex-col items-center gap-6 rounded-2xl border border-border-soft bg-bg-surface/40 px-8 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border-soft bg-bg-elevated">
                <Search className="h-6 w-6 text-fg-muted" aria-hidden />
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-xl font-semibold tracking-tight text-fg">
                  {t("empty.title", { query })}
                </h2>
                <p className="max-w-sm text-sm text-fg-muted">
                  {t("empty.description")}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild variant="default" size="sm">
                  <Link href="/browse">{t("empty.browse")}</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/collections">{t("empty.collections")}</Link>
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="h-10 w-full max-w-xl animate-pulse rounded-lg bg-bg-surface/60" />
        </div>
      }
    >
      <SearchInner />
    </Suspense>
  );
}
