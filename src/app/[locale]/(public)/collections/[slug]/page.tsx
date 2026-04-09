"use client";

import { Layers } from "lucide-react";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { use, useMemo } from "react";

import { FollowButton } from "@/components/creator/follow-button";
import { RulesetCard } from "@/components/marketplace/ruleset-card";
import { ErrorState } from "@/components/ui/error-state";
import { useCollection } from "@/hooks/use-collections";
import { useRulesets } from "@/hooks/use-rulesets";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CollectionPage({ params }: PageProps) {
  const { slug } = use(params);
  const { data: collection, error, isLoading, mutate } = useCollection(slug);
  // Fetch all rulesets and filter by collection.rulesetIds — the mock layer
  // does not expose a per-collection list endpoint.
  const { data: allRulesets } = useRulesets({ pageSize: 50 });

  const collectionRulesets = useMemo(() => {
    if (!collection || !allRulesets) return [];
    const idSet = new Set(collection.rulesetIds);
    // Preserve the curator's ordering by mapping over rulesetIds, not the page.
    const map = new Map(allRulesets.data.map((r) => [r.id, r]));
    return collection.rulesetIds
      .filter((id) => idSet.has(id))
      .map((id) => map.get(id))
      .filter((r): r is NonNullable<typeof r> => r !== undefined);
  }, [collection, allRulesets]);

  const t = useTranslations("collections");

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-8 px-6 py-12">
        <div className="h-48 animate-pulse rounded-2xl bg-bg-surface/60" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-xl border border-border-soft bg-bg-surface/60"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    const apiError = error as Error & { code?: string };
    if (apiError.code === "NOT_FOUND") notFound();
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <ErrorState message={apiError.message} retry={() => mutate()} />
      </div>
    );
  }

  if (!collection) notFound();

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      {/* Collection hero */}
      <header className="relative overflow-hidden rounded-3xl border border-border-soft bg-bg-surface p-8 sm:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-brand/10 via-bg-surface to-transparent"
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-bg-elevated px-3 py-1 text-xs font-medium uppercase tracking-wider text-fg-muted">
              <Layers className="h-3.5 w-3.5" />
              {t("title")}
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
              {collection.title}
            </h1>
            <p className="text-base leading-relaxed text-fg-muted">
              {collection.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-fg-muted">
              <span>
                {t("by")} <span className="font-medium text-fg">@{collection.curatedBy}</span>
              </span>
              <span aria-hidden className="text-fg-subtle">·</span>
              <span>{t("items", { count: collection.itemCount })}</span>
              <span aria-hidden className="text-fg-subtle">·</span>
              <span>{t("followers", { count: collection.followerCount })}</span>
            </div>
          </div>
          <FollowButton target={collection.slug} scope="collection" />
        </div>
      </header>

      {/* Items grid */}
      <section className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collectionRulesets.map((r) => (
            <RulesetCard key={r.id} ruleset={r} />
          ))}
        </div>
      </section>
    </div>
  );
}
