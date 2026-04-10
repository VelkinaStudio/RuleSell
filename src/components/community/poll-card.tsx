"use client";

import { Clock, Users } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Poll } from "@/types";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/utils";

interface PollCardProps {
  poll: Poll;
  votedOptionId?: string;
  onVote: (optionId: string) => void;
}

export function PollCard({ poll, votedOptionId, onVote }: PollCardProps) {
  const t = useTranslations("community.polls");
  const hasVoted = !!votedOptionId;

  return (
    <div className="rounded-lg border border-border-soft bg-bg-surface p-5 transition hover:border-border-strong">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-fg">{poll.title}</h3>
          <p className="mt-1 text-xs text-fg-muted">{poll.description}</p>
        </div>
        {!poll.isActive && (
          <span className="shrink-0 rounded-full border border-fg-dim/20 px-2 py-0.5 text-[10px] font-medium text-fg-dim">
            {t("ended")}
          </span>
        )}
      </div>

      <div className="mt-4 space-y-2">
        {poll.options.map((option) => {
          const pct =
            poll.totalVotes > 0
              ? Math.round((option.voteCount / poll.totalVotes) * 100)
              : 0;
          const isSelected = votedOptionId === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => poll.isActive && onVote(option.id)}
              disabled={!poll.isActive}
              className={cn(
                "group relative w-full overflow-hidden rounded-md border px-3 py-2 text-left text-sm transition",
                isSelected
                  ? "border-brand/40 bg-brand/5"
                  : "border-border-soft hover:border-border-strong",
                !poll.isActive && "cursor-default",
              )}
            >
              {/* Progress bar */}
              {(hasVoted || !poll.isActive) && (
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 transition-all duration-500",
                    isSelected ? "bg-brand/10" : "bg-fg/5",
                  )}
                  style={{ width: `${pct}%` }}
                />
              )}
              <div className="relative flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "text-sm",
                    isSelected ? "font-medium text-brand" : "text-fg-muted",
                  )}
                >
                  {option.text}
                </span>
                {(hasVoted || !poll.isActive) && (
                  <span className="shrink-0 text-xs tabular-nums text-fg-dim">
                    {pct}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-3 text-[11px] text-fg-dim">
        <span className="inline-flex items-center gap-1">
          <Users className="h-3 w-3" />
          {poll.totalVotes} {t("votes")}
        </span>
        <span>@{poll.author.username}</span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatRelative(poll.createdAt)}
        </span>
      </div>
    </div>
  );
}
