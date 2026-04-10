"use client";

import { ChevronLeft, ChevronRight, Filter, SearchX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useMemo } from "react";

import type { Category, Environment, Platform, Type } from "@/types";
import { CATEGORY_META, CATEGORY_ORDER, categoryFromSlug } from "@/constants/categories";
import { environmentFromSlug } from "@/constants/environments";
import {
  FilterSidebar,
  type FilterValue,
} from "@/components/marketplace/filter-sidebar";
import { RulesetCard } from "@/components/marketplace/ruleset-card";
import { SortSelect } from "@/components/marketplace/sort-select";
import { TabBar } from "@/components/marketplace/tab-bar";
import { Stagger } from "@/components/motion/stagger";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, useRouter } from "@/i18n/navigation";
import type { RulesetSort, RulesetTab } from "@/lib/api/types";
import { useRulesets } from "@/hooks/use-rulesets";

const PAGE_SIZE = 24;

function isPlatform(s: string | null): s is Platform {
  if (!s) return false;
  return [
    "CURSOR",
    "VSCODE",
    "OBSIDIAN",
    "N8N",
    "MAKE",
    "CLAUDE",
    "CHATGPT",
    "GEMINI",
    "CUSTOM",
  ].includes(s);
}
function isType(s: string | null): s is Type {
  if (!s) return false;
  return ["RULESET", "PROMPT", "WORKFLOW", "AGENT", "BUNDLE", "DATASET"].includes(s);
}
function isCategory(s: string | null): s is Category {
  if (!s) return false;
  return categoryFromSlug(s.toLowerCase()) !== null || [
    "RULES",
    "MCP_SERVER",
    "SKILL",
    "AGENT_TEAM",
    "WORKFLOW",
    "PROMPT",
    "CLI",
    "DATASET",
    "BUNDLE",
  ].includes(s);
}
function isEnvironment(s: string | null): s is Environment {
  if (!s) return false;
  return environmentFromSlug(s) !== null;
}
function isTab(s: string | null): s is RulesetTab {
  return s === "trending" || s === "new" || s === "top" || s === "editors";
}
function isSort(s: string | null): s is RulesetSort {
  return (
    s === "quality" ||
    s === "popular" ||
    s === "recent" ||
    s === "price_asc" ||
    s === "price_desc"
  );
}

function BrowseInner() {
  const t = useTranslations("browse");
  const router = useRouter();
  const params = useSearchParams();

  const filters: FilterValue = useMemo(() => {
    const platform = params.get("platform");
    const type = params.get("type");
    const category = params.get("category");
    const environment = params.get("environment");
    const price = params.get("price");
    return {
      platform: isPlatform(platform) ? platform : undefined,
      type: isType(type) ? type : undefined,
      category: isCategory(category) ? category : undefined,
      environment: isEnvironment(environment) ? environment : undefined,
      price: price === "free" || price === "paid" ? price : undefined,
    };
  }, [params]);

  const tab: RulesetTab | undefined = (() => {
    const v = params.get("tab");
    return isTab(v) ? v : undefined;
  })();
  const sort: RulesetSort = (() => {
    const v = params.get("sort");
    return isSort(v) ? v : "quality";
  })();
  const page = (() => {
    const v = parseInt(params.get("page") ?? "1", 10);
    return Number.isFinite(v) && v > 0 ? v : 1;
  })();

  const updateParams = useCallback(
    (next: Partial<Record<string, string | undefined>>) => {
      const merged = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(next)) {
        if (value === undefined || value === "") {
          merged.delete(key);
        } else {
          merged.set(key, value);
        }
      }
      // Reset page when filters/tab/sort change but not when page itself moves.
      if (!("page" in next)) {
        merged.delete("page");
      }
      router.push(`/browse${merged.toString() ? `?${merged.toString()}` : ""}`);
    },
    [params, router],
  );

  const onFilterChange = (next: FilterValue) => {
    updateParams({
      platform: next.platform,
      type: next.type,
      category: next.category,
      environment: next.environment,
      price: next.price,
    });
  };

  const onClearFilters = () => {
    router.push("/browse");
  };

  const onTabChange = (next: RulesetTab | undefined) => {
    updateParams({ tab: next });
  };

  const onSortChange = (next: RulesetSort) => {
    updateParams({ sort: next });
  };

  const onPageChange = (nextPage: number) => {
    updateParams({ page: String(nextPage) });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const { data, error, isLoading, mutate } = useRulesets({
    ...filters,
    tab,
    sort,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      {/* Desktop sidebar */}
      <div className="hidden w-64 shrink-0 lg:block">
        <FilterSidebar
          value={filters}
          onChange={onFilterChange}
          onClear={onClearFilters}
        />
      </div>

      <div className="min-w-0 flex-1 space-y-6">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-fg">
            {t("title")}
          </h1>
          {data && (
            <p className="text-sm text-fg-muted">
              {t("subtitle", { total: data.pagination.total })}
            </p>
          )}
        </header>

        {/* Mobile filter trigger */}
        <div className="flex items-center justify-between gap-3 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-border-soft bg-bg-surface"
              >
                <Filter className="h-3.5 w-3.5" />
                {t("filters.open")}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 border-border-soft bg-bg p-0"
            >
              <SheetTitle className="sr-only">{t("filters.title")}</SheetTitle>
              <FilterSidebar
                value={filters}
                onChange={onFilterChange}
                onClear={onClearFilters}
                className="border-r-0"
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Tabs + sort */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <TabBar value={tab} onChange={onTabChange} className="flex-1" />
          <SortSelect value={sort} onChange={onSortChange} />
        </div>

        {/* Grid */}
        {error && (
          <ErrorState
            title={t("title")}
            message={(error as Error)?.message}
            retry={() => mutate()}
          />
        )}

        {isLoading && !error && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-xl border border-border-soft bg-bg-surface/60"
              />
            ))}
          </div>
        )}

        {!isLoading && !error && data && data.data.length > 0 && (
          <>
            <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data.data.map((r) => (
                <RulesetCard key={r.id} ruleset={r} />
              ))}
            </Stagger>

            {/* Pagination */}
            {(data.pagination.hasNext || data.pagination.hasPrev) && (
              <nav
                aria-label={t("pagination.label")}
                className="flex items-center justify-between border-t border-border-soft pt-6"
              >
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!data.pagination.hasPrev}
                  onClick={() => onPageChange(page - 1)}
                  className="gap-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  {t("pagination.previous")}
                </Button>
                <span className="font-mono text-xs tabular-nums text-fg-muted">
                  {t("pagination.page", {
                    page,
                    total: Math.max(
                      1,
                      Math.ceil(data.pagination.total / PAGE_SIZE),
                    ),
                  })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!data.pagination.hasNext}
                  onClick={() => onPageChange(page + 1)}
                  className="gap-1"
                >
                  {t("pagination.next")}
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </nav>
            )}
          </>
        )}

        {!isLoading && !error && data && data.data.length === 0 && (
          <EmptyState
            icon={<SearchX className="h-6 w-6" />}
            title={t("empty.title")}
            description={t("empty.description")}
            action={
              <div className="flex flex-col items-center gap-4">
                <Button variant="outline" size="sm" onClick={onClearFilters}>
                  {t("empty.clear")}
                </Button>
                <div className="flex flex-wrap justify-center gap-2">
                  {CATEGORY_ORDER.slice(0, 5).map((cat) => {
                    const meta = CATEGORY_META[cat];
                    return (
                      <Link
                        key={cat}
                        href={`/browse?category=${cat}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border-soft px-3 py-1 text-xs text-fg-muted transition hover:border-border hover:text-fg"
                        style={{ color: meta.color }}
                      >
                        {meta.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<BrowseFallback />}>
      <BrowseInner />
    </Suspense>
  );
}

function BrowseFallback() {
  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="hidden w-64 shrink-0 animate-pulse rounded-lg bg-bg-surface/40 lg:block" />
      <div className="min-w-0 flex-1 space-y-6">
        <div className="h-9 w-64 animate-pulse rounded bg-bg-surface/60" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-xl border border-border-soft bg-bg-surface/60"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
