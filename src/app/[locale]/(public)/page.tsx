"use client";

import { useTranslations } from "next-intl";

import { CollectionCard } from "@/components/marketplace/collection-card";
import { HeroSearch } from "@/components/marketplace/hero-search";
import { Shelf } from "@/components/marketplace/shelf";
import { ToolPicker } from "@/components/marketplace/tool-picker";
import { ErrorState } from "@/components/ui/error-state";
import { useCollections } from "@/hooks/use-collections";
import { usePreferredEnvironments } from "@/hooks/use-preferred-environments";
import { useRulesets } from "@/hooks/use-rulesets";
import { ENVIRONMENT_META } from "@/constants/environments";
import { Link } from "@/i18n/navigation";

export default function LandingPage() {
  const t = useTranslations("landing");
  const tShelf = useTranslations("marketplace.shelf");
  const { envs } = usePreferredEnvironments();
  const primaryEnv = envs[0] ?? "claude-code";
  const envLabel = ENVIRONMENT_META[primaryEnv]?.label ?? "Claude Code";

  const top = useRulesets({
    tab: "top",
    pageSize: 8,
    environment: primaryEnv,
  });
  const editors = useRulesets({ tab: "editors", pageSize: 8 });
  const fresh = useRulesets({ tab: "new", pageSize: 8 });
  const collections = useCollections();

  const isLoading =
    top.isLoading || editors.isLoading || fresh.isLoading || collections.isLoading;
  const hasError =
    !!top.error || !!editors.error || !!fresh.error || !!collections.error;

  return (
    <div>
      {/* Hero — flat dark, no decorative elements */}
      <section className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-16 lg:px-8">
        <h1 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          {t("hero.title")}
        </h1>
        <p className="max-w-xl text-balance text-sm text-fg-muted sm:text-base">
          {t("hero.subtitle")}
        </p>
        <HeroSearch className="mt-1" />
        <ToolPicker withLabel={false} className="mt-3" />
      </section>

      {/* Shelves */}
      <div className="mx-auto max-w-7xl space-y-14 px-4 pb-20 sm:px-6 lg:px-8">
        {hasError && (
          <ErrorState
            title={t("errors.title")}
            retry={() => {
              top.mutate();
              editors.mutate();
              fresh.mutate();
              collections.mutate();
            }}
          />
        )}

        {isLoading && !hasError && (
          <div className="space-y-10">
            {[0, 1, 2, 3].map((i) => (
              <ShelfSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && !hasError && (
          <>
            {top.data && top.data.data.length > 0 && (
              <Shelf
                title={`Top for ${envLabel}`}
                rulesets={top.data.data}
                href="/browse/top"
              />
            )}
            {editors.data && editors.data.data.length > 0 && (
              <Shelf
                title={t("shelves.editorsPicks")}
                rulesets={editors.data.data}
                href="/browse?tab=editors"
              />
            )}
            {fresh.data && fresh.data.data.length > 0 && (
              <Shelf
                title={t("shelves.newThisWeek")}
                rulesets={fresh.data.data}
                href="/browse/new"
              />
            )}
            {collections.data && collections.data.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-end justify-between gap-4">
                  <h2 className="text-lg font-semibold text-fg">
                    {t("shelves.collections")}
                  </h2>
                  <Link
                    href="/collections"
                    className="text-sm text-fg-muted hover:text-fg"
                  >
                    {tShelf("seeAll")} &rarr;
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {collections.data.slice(0, 6).map((c) => (
                    <CollectionCard key={c.id} collection={c} />
                  ))}
                </div>
              </section>
            )}

            {/* Community sections removed — will be enabled when real
                discussions and showcases exist. See copy-audit-2026-04-09.md */}
          </>
        )}
      </div>
    </div>
  );
}

function ShelfSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-5 w-48 animate-pulse rounded bg-bg-surface/60" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-36 animate-pulse rounded-lg border border-border-soft bg-bg-surface/40"
          />
        ))}
      </div>
    </div>
  );
}
