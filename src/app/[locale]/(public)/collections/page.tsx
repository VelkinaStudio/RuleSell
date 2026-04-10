"use client";

import { ArrowUpRight, Layers } from "lucide-react";
import { useTranslations } from "next-intl";

import { CollectionCard } from "@/components/marketplace/collection-card";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Stagger } from "@/components/motion/stagger";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { useCollections } from "@/hooks/use-collections";
import { Link } from "@/i18n/navigation";

export default function CollectionsPage() {
  const t = useTranslations("collections");
  const { data, error, isLoading, mutate } = useCollections();

  const [featured, ...rest] = data ?? [];

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero header */}
      <ScrollReveal>
        <header className="space-y-4">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-fg-muted">
            {t("heroSubtitle")}
          </p>
        </header>
      </ScrollReveal>

      {error && (
        <ErrorState message={(error as Error)?.message} retry={() => mutate()} />
      )}

      {isLoading && !error && (
        <div className="space-y-4">
          {/* Featured skeleton */}
          <div className="h-56 animate-pulse rounded-2xl border border-border-soft bg-bg-surface/60" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-xl border border-border-soft bg-bg-surface/60"
              />
            ))}
          </div>
        </div>
      )}

      {!isLoading && !error && data && (
        data.length > 0 ? (
          <div className="space-y-6">
            {/* Featured collection — full-width hero card */}
            {featured && (
              <ScrollReveal>
                <Link
                  href={`/collections/${featured.slug}`}
                  className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-border-soft bg-bg-surface transition-all hover:border-border-strong hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:flex-row"
                >
                  {/* Gradient accent */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-br from-brand/15 via-brand/5 to-transparent"
                  />
                  <div className="relative z-10 flex flex-1 flex-col justify-between gap-6 p-8 sm:p-10">
                    <div className="space-y-4">
                      <span className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-bg-elevated px-3 py-1 text-xs font-medium uppercase tracking-wider text-fg-muted">
                        <Layers className="h-3.5 w-3.5" />
                        {t("featuredLabel")}
                      </span>
                      <h2 className="font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
                        {featured.title}
                      </h2>
                      <p className="max-w-prose text-sm leading-relaxed text-fg-muted sm:text-base">
                        {featured.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-fg-muted">
                      <span>
                        {t("by")}{" "}
                        <span className="font-medium text-fg">
                          @{featured.curatedBy}
                        </span>
                      </span>
                      <span aria-hidden className="text-fg-subtle">·</span>
                      <span>{t("items", { count: featured.itemCount })}</span>
                      <span aria-hidden className="text-fg-subtle">·</span>
                      <span>{t("followers", { count: featured.followerCount })}</span>
                    </div>
                  </div>
                  <div className="relative z-10 flex items-center justify-end p-6 sm:p-10">
                    <ArrowUpRight className="h-6 w-6 text-fg-subtle transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg" />
                  </div>
                </Link>
              </ScrollReveal>
            )}

            {/* Remaining collections grid */}
            {rest.length > 0 && (
              <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((c) => (
                  <CollectionCard key={c.id} collection={c} />
                ))}
              </Stagger>
            )}
          </div>
        ) : (
          <EmptyState
            title={t("empty.title")}
            description={t("empty.description")}
          />
        )
      )}
    </div>
  );
}
