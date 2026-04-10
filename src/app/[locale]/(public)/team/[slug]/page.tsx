"use client";

import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { use, useMemo } from "react";

import { RulesetCard } from "@/components/marketplace/ruleset-card";
import { TeamHero } from "@/components/team/team-hero";
import { TeamMemberList } from "@/components/team/team-member-list";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { IconByName } from "@/components/ui/icon-map";
import { useRulesets } from "@/hooks/use-rulesets";
import { useTeam } from "@/hooks/use-team";
import { CATEGORY_META, CATEGORY_ORDER } from "@/constants/categories";
import type { Category } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function TeamPage({ params }: PageProps) {
  const { slug } = use(params);
  const { data: team, error, isLoading, mutate } = useTeam(slug);
  // Fetch all rulesets and filter client-side by team slug — the mock API
  // does not expose a `teamSlug` query param.
  const { data: rulesetsPage } = useRulesets({ pageSize: 50 });

  const teamRulesets = useMemo(() => {
    if (!rulesetsPage || !team) return [];
    return rulesetsPage.data.filter((r) => r.team?.slug === team.slug);
  }, [rulesetsPage, team]);

  /** Team-level aggregate stats derived from published rulesets. */
  const aggregateStats = useMemo(() => {
    if (teamRulesets.length === 0) return undefined;
    const totalInstalls = teamRulesets.reduce(
      (sum, r) => sum + r.downloadCount + r.purchaseCount,
      0,
    );
    const avgQualityScore =
      teamRulesets.reduce((sum, r) => sum + r.qualityScore, 0) /
      teamRulesets.length;
    return {
      totalItems: teamRulesets.length,
      totalInstalls,
      avgQualityScore,
    };
  }, [teamRulesets]);

  /** Group rulesets by primary category. Only used when multiple categories exist. */
  const groupedRulesets = useMemo(() => {
    if (teamRulesets.length === 0) return null;
    const map = new Map<Category, typeof teamRulesets>();
    for (const r of teamRulesets) {
      const existing = map.get(r.category);
      if (existing) existing.push(r);
      else map.set(r.category, [r]);
    }
    if (map.size <= 1) return null;
    return CATEGORY_ORDER.filter((cat) => map.has(cat)).map((cat) => ({
      category: cat,
      items: map.get(cat)!,
    }));
  }, [teamRulesets]);

  const t = useTranslations("team");

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

  if (!team) notFound();

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      <TeamHero team={team} aggregateStats={aggregateStats} />

      {team.members.length > 0 && <TeamMemberList team={team} />}

      <section className="space-y-6">
        <h2 className="font-display text-xl font-semibold uppercase tracking-wider text-fg">
          {t("stats.rulesets")}
        </h2>
        {teamRulesets.length > 0 ? (
          groupedRulesets ? (
            <div className="space-y-8">
              {groupedRulesets.map(({ category, items }) => {
                const meta = CATEGORY_META[category];
                return (
                  <div key={category} className="space-y-4">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="inline-flex items-center justify-center rounded-md p-1.5"
                        style={{ backgroundColor: `${meta.color}20`, color: meta.color }}
                      >
                        <IconByName name={meta.icon} className="h-4 w-4" />
                      </span>
                      <h3
                        className="font-display text-sm font-semibold uppercase tracking-widest"
                        style={{ color: meta.color }}
                      >
                        {meta.label}
                        <span className="ml-2 text-xs font-normal text-fg-subtle">
                          ({items.length})
                        </span>
                      </h3>
                      <div
                        className="h-px flex-1 opacity-20"
                        style={{ backgroundColor: meta.color }}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((r) => (
                        <RulesetCard key={r.id} ruleset={r} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {teamRulesets.map((r) => (
                <RulesetCard key={r.id} ruleset={r} />
              ))}
            </div>
          )
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
