"use client";

import { BadgeCheck, Building2 } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Team } from "@/types";
import { formatCount, formatPrice } from "@/components/marketplace/_format";
import { FollowButton } from "@/components/creator/follow-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface TeamAggregateStats {
  totalItems: number;
  totalInstalls: number;
  avgQualityScore: number;
}

interface TeamHeroProps {
  team: Team;
  /** When true, show earnings stat (own-team view). */
  showEarnings?: boolean;
  /** Aggregate stats computed from team rulesets. */
  aggregateStats?: TeamAggregateStats;
}

export function TeamHero({ team, showEarnings, aggregateStats }: TeamHeroProps) {
  const t = useTranslations("team");

  return (
    <header className="space-y-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="relative">
          <Avatar size="lg" className="size-24">
            {team.avatar && <AvatarImage src={team.avatar} alt={team.name} />}
            <AvatarFallback className="text-2xl">
              <Building2 className="h-10 w-10 text-fg-muted" />
            </AvatarFallback>
          </Avatar>
          {team.verified && (
            <span
              title={t("verified")}
              className="absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-bg bg-emerald-500 text-bg"
            >
              <BadgeCheck className="h-3.5 w-3.5" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="space-y-1">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-fg">
              {team.name}
            </h1>
            <p className="font-mono text-sm text-fg-muted">@{team.slug}</p>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-fg-muted">
            {team.description}
          </p>
        </div>

        <div>
          <FollowButton target={team.slug} scope="team" />
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-border-soft bg-bg-surface p-5 sm:grid-cols-4">
        <Stat label={t("membersTitle")} value={String(team.memberCount)} />
        <Stat label={t("stats.rulesets")} value={String(team.rulesetCount)} />
        {aggregateStats && (
          <>
            <Stat
              label={t("stats.downloads")}
              value={formatCount(aggregateStats.totalInstalls)}
            />
            <Stat
              label={t("stats.avgQuality")}
              value={aggregateStats.avgQualityScore.toFixed(0)}
            />
          </>
        )}
        {showEarnings && (
          <Stat label={t("stats.earnings")} value={formatPrice(team.totalEarnings, "USD")} />
        )}
      </dl>
    </header>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
        {label}
      </dt>
      <dd className="font-display mt-1 text-2xl font-semibold tabular-nums text-fg">{value}</dd>
    </div>
  );
}
