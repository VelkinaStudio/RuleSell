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
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Returns up to two uppercase initials from a username string. */
function initials(name: string): string {
  const parts = name.replace(/[^a-zA-Z\s]/g, " ").trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

/** Deterministic hue from a string, used for the avatar background. */
function avatarHue(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
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
        <div className="h-56 animate-pulse rounded-3xl bg-bg-surface/60" />
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

  const hue = avatarHue(collection.curatedBy);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      {/* Collection hero */}
      <header className="relative overflow-hidden rounded-3xl border border-border-soft bg-bg-surface p-10 sm:p-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-brand/10 via-bg-surface to-transparent"
        />
        <div className="relative flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-bg-elevated px-3 py-1 text-xs font-medium uppercase tracking-wider text-fg-muted">
              <Layers className="h-3.5 w-3.5" />
              {t("title")}
            </span>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
              {collection.title}
            </h1>
            <p className="text-base leading-relaxed text-fg-muted">
              {collection.description}
            </p>

            {/* Curator info with avatar */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {/* Avatar — initials fallback with deterministic colour */}
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: `hsl(${hue} 55% 42%)` }}
                  aria-hidden
                >
                  {initials(collection.curatedBy)}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-fg-muted">
                  <span>
                    {t("by")}{" "}
                    <span className="font-semibold text-fg">
                      @{collection.curatedBy}
                    </span>
                  </span>
                  <span aria-hidden className="text-fg-subtle">·</span>
                  <span>{t("items", { count: collection.itemCount })}</span>
                  <span aria-hidden className="text-fg-subtle">·</span>
                  <span>{t("followers", { count: collection.followerCount })}</span>
                </div>
              </div>
              <p className="pl-12 text-sm text-fg-subtle">
                {t("curatorBio", { name: collection.curatedBy })}
              </p>
            </div>
          </div>

          <FollowButton target={collection.slug} scope="collection" />
        </div>
      </header>

      {/* Items grid with sequential numbering */}
      <section className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collectionRulesets.map((r, idx) => (
            <div key={r.id} className="relative">
              {/* Ordinal badge */}
              <span
                className={cn(
                  "absolute -left-0.5 -top-0.5 z-10 flex h-6 w-6 items-center justify-center rounded-full",
                  "border border-border-soft bg-bg-elevated text-xs font-semibold tabular-nums text-fg-muted",
                  "shadow-sm",
                )}
                aria-label={t("itemNumber", { number: idx + 1 })}
              >
                {idx + 1}
              </span>
              <RulesetCard ruleset={r} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
