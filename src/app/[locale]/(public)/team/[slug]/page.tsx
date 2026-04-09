"use client";

import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { use, useMemo } from "react";

import { RulesetCard } from "@/components/marketplace/ruleset-card";
import { TeamHero } from "@/components/team/team-hero";
import { TeamMemberList } from "@/components/team/team-member-list";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { useRulesets } from "@/hooks/use-rulesets";
import { useTeam } from "@/hooks/use-team";

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
      <TeamHero team={team} />

      {team.members.length > 0 && <TeamMemberList team={team} />}

      <section className="space-y-5">
        <h2 className="text-xl font-semibold uppercase tracking-wider text-fg">
          {t("stats.rulesets")}
        </h2>
        {teamRulesets.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teamRulesets.map((r) => (
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
