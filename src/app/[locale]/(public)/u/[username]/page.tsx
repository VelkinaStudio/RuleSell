"use client";

import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { use, useMemo } from "react";

import { ProfileHero } from "@/components/creator/profile-hero";
import { RulesetCard } from "@/components/marketplace/ruleset-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { useRulesets } from "@/hooks/use-rulesets";
import { useUser } from "@/hooks/use-user";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default function CreatorPage({ params }: PageProps) {
  const { username } = use(params);
  const { data: creator, error, isLoading, mutate } = useUser(username);
  const { data: rulesetsPage } = useRulesets({
    authorId: creator?.id,
    pageSize: 50,
  });

  const ownedRulesets = useMemo(() => {
    if (!rulesetsPage) return [];
    return rulesetsPage.data;
  }, [rulesetsPage]);

  const stats = useMemo(() => {
    if (ownedRulesets.length === 0) {
      return { publishedCount: 0, totalDownloads: 0, avgRating: 0 };
    }
    const totalDownloads = ownedRulesets.reduce(
      (sum, r) => sum + r.downloadCount + r.purchaseCount,
      0,
    );
    const avgRating =
      ownedRulesets.reduce((sum, r) => sum + r.avgRating, 0) /
      ownedRulesets.length;
    return {
      publishedCount: ownedRulesets.length,
      totalDownloads,
      avgRating,
    };
  }, [ownedRulesets]);

  const t = useTranslations("profile");

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-8 px-6 py-12">
        <div className="h-32 animate-pulse rounded-2xl bg-bg-surface/60" />
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

  if (!creator) notFound();

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      <ProfileHero creator={creator} stats={stats} />

      <section className="space-y-5">
        <h2 className="text-xl font-semibold uppercase tracking-wider text-fg">
          {t("publishedItems", { count: ownedRulesets.length })}
        </h2>
        {ownedRulesets.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ownedRulesets.map((r) => (
              <RulesetCard key={r.id} ruleset={r} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={t("empty.title")}
            description={t("empty.description")}
          />
        )}
      </section>
    </div>
  );
}
