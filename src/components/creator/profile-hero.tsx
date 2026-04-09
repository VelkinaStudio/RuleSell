"use client";

import { Flag, MessageCircle } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import type { User } from "@/types";
import { formatCount, formatPrice } from "@/components/marketplace/_format";
import { ReportDialog } from "@/components/compliance/report-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@/hooks/use-session";

import { CreatorMarks } from "./creator-marks";
import { FollowButton } from "./follow-button";
import { ReputationBar } from "./reputation-bar";

interface ProfileHeroProps {
  creator: User;
  stats?: {
    publishedCount: number;
    totalDownloads: number;
    avgRating: number;
  };
}

export function ProfileHero({ creator, stats }: ProfileHeroProps) {
  const t = useTranslations("profile");
  const f = useFormatter();
  const { data: session } = useSession();
  const isSelf = session?.user?.username === creator.username;

  return (
    <header className="space-y-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <CreatorMarks marks={creator.creatorMarks}>
          <Avatar size="lg" className="size-24">
            {creator.avatar && (
              <AvatarImage src={creator.avatar} alt={creator.username} />
            )}
            <AvatarFallback className="text-2xl">
              {creator.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </CreatorMarks>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-fg">
              {creator.name}
            </h1>
            <p className="text-sm text-fg-muted">
              <span className="font-mono text-fg">@{creator.username}</span>
              <span className="mx-2 text-fg-subtle">·</span>
              <span>
                {t("joined", {
                  date: f.dateTime(new Date(creator.joinedAt), {
                    year: "numeric",
                    month: "short",
                  }),
                })}
              </span>
            </p>
          </div>

          {creator.creatorMarks.length > 0 && (
            <CreatorMarks marks={creator.creatorMarks} size="sm" />
          )}

          <ReputationBar points={creator.reputation} className="max-w-md" />
        </div>

        {!isSelf && (
          <div className="flex flex-wrap items-center gap-2">
            <FollowButton target={creator.username} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="gap-1.5 border-border-soft bg-bg-surface"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    {t("actions.message")}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("actions.messageDisabled")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <ReportDialog
              targetType="user"
              targetId={creator.id}
              trigger={
                <Button variant="ghost" size="sm" className="gap-1.5 text-fg-muted">
                  <Flag className="h-3.5 w-3.5" />
                  {t("actions.report")}
                </Button>
              }
            />
          </div>
        )}
      </div>

      {stats && (
        <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-border-soft bg-bg-surface p-5 sm:grid-cols-4">
          <Stat label={t("stats.published")} value={String(stats.publishedCount)} />
          <Stat label={t("stats.downloads")} value={formatCount(stats.totalDownloads)} />
          <Stat label={t("stats.avgRating")} value={stats.avgRating.toFixed(1)} />
          {isSelf && creator.sellerStats?.totalEarnings != null && (
            <Stat
              label={t("stats.totalEarnings")}
              value={formatPrice(creator.sellerStats.totalEarnings, "USD")}
            />
          )}
        </dl>
      )}
    </header>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
        {label}
      </dt>
      <dd className="mt-1 text-2xl font-semibold tabular-nums text-fg">{value}</dd>
    </div>
  );
}
