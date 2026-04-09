"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { HeroSearch } from "@/components/marketplace/hero-search";
import { RulesetCard } from "@/components/marketplace/ruleset-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Link } from "@/i18n/navigation";
import { useRulesets } from "@/hooks/use-rulesets";

function SearchInner() {
  const t = useTranslations("search");
  const params = useSearchParams();
  const query = params.get("q") ?? "";

  const { data, error, isLoading, mutate } = useRulesets({
    q: query || undefined,
    pageSize: 24,
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-fg">
          {t("title")}
        </h1>
        <HeroSearch defaultValue={query} className="max-w-2xl" />
      </header>

      {error && (
        <ErrorState message={(error as Error)?.message} retry={() => mutate()} />
      )}

      {isLoading && !error && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-xl border border-border-soft bg-bg-surface/60"
            />
          ))}
        </div>
      )}

      {!isLoading && !error && data && (
        <>
          <p className="text-sm text-fg-muted">
            {t("results", { count: data.pagination.total, query: query || "—" })}
          </p>
          {data.data.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data.data.map((r) => (
                <RulesetCard key={r.id} ruleset={r} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={t("empty.title", { query })}
              description={t("empty.description")}
              action={
                <Button asChild variant="outline" size="sm">
                  <Link href="/browse">{t("empty.browse")}</Link>
                </Button>
              }
            />
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
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="h-9 w-64 animate-pulse rounded bg-bg-surface/60" />
        </div>
      }
    >
      <SearchInner />
    </Suspense>
  );
}
