"use client";

import { ArrowRight, UsersRound } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Ruleset } from "@/types";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Link } from "@/i18n/navigation";
import { TeamHero } from "@/components/team/team-hero";
import { TeamMemberList } from "@/components/team/team-member-list";
import { RulesetCard } from "@/components/marketplace/ruleset-card";
import { useMyTeam } from "@/hooks/use-my-team";
import { useRulesets } from "@/hooks/use-rulesets";

export default function DashboardTeamPage() {
  const t = useTranslations("dashboard.team");
  const { team } = useMyTeam();

  const { data: rulesetsPage } = useRulesets({ pageSize: 50 });
  const teamRulesets: Ruleset[] = team
    ? (rulesetsPage?.data ?? []).filter(
        (r) => r.team?.slug === team.slug || r.author.username === team.slug,
      )
    : [];

  if (!team) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-fg">
            {t("title")}
          </h1>
        </header>
        <EmptyState
          icon={<UsersRound className="h-5 w-5" />}
          title={t("noTeamTitle")}
          description={t("noTeamDescription")}
          action={
            <Button asChild variant="outline">
              <Link href="/legal/contact">
                {t("noTeamCta")}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <TeamHero team={team} showEarnings />

      <TeamMemberList team={team} />

      {teamRulesets.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">
            {t("rulesetsTitle")}
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teamRulesets.map((r) => (
              <li key={r.id}>
                <RulesetCard ruleset={r} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
