"use client";

import { ChevronUp, Link as LinkIcon, MessageSquare, User } from "lucide-react";
import { useTranslations } from "next-intl";

import type { FeatureRequest, FeatureRequestStatus } from "@/types";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/utils";

const STATUS_STYLES: Record<FeatureRequestStatus, string> = {
  open: "border-blue-400/30 bg-blue-400/10 text-blue-400",
  claimed: "border-brand/30 bg-brand/10 text-brand",
  completed: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400",
  declined: "border-rose-400/30 bg-rose-400/10 text-rose-400",
};

interface RequestCardProps {
  request: FeatureRequest;
  hasVoted: boolean;
  onVote: () => void;
}

export function RequestCard({ request, hasVoted, onVote }: RequestCardProps) {
  const t = useTranslations("community.requests");

  return (
    <div className="flex gap-3 rounded-lg border border-border-soft bg-bg-surface p-4 transition hover:border-border-strong">
      {/* Vote button */}
      <button
        type="button"
        onClick={onVote}
        className={cn(
          "flex shrink-0 flex-col items-center gap-0.5 rounded-lg border px-2.5 py-2 transition",
          hasVoted
            ? "border-brand/30 bg-brand/10 text-brand"
            : "border-border-soft text-fg-dim hover:border-border-strong hover:text-fg-muted",
        )}
      >
        <ChevronUp className="h-4 w-4" />
        <span className="text-xs font-medium tabular-nums">
          {request.voteCount}
        </span>
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="line-clamp-1 text-sm font-semibold text-fg">
            {request.title}
          </h3>
          <span
            className={cn(
              "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium",
              STATUS_STYLES[request.status],
            )}
          >
            {t(`status_${request.status}`)}
          </span>
        </div>

        <p className="mt-1 line-clamp-2 text-xs text-fg-muted">
          {request.description}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {request.tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-border-soft bg-bg-raised px-1.5 py-0.5 text-[10px] text-fg-subtle"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-fg-dim">
          <span>@{request.author.username}</span>
          <span className="inline-flex items-center gap-0.5">
            <MessageSquare className="h-3 w-3" />
            {request.commentCount}
          </span>
          {request.claimedBy && (
            <span className="inline-flex items-center gap-0.5">
              <User className="h-3 w-3" />
              {t("claimedBy")} @{request.claimedBy}
            </span>
          )}
          {request.linkedRulesetSlug && (
            <span className="inline-flex items-center gap-0.5 text-emerald-400">
              <LinkIcon className="h-3 w-3" />
              {t("linked")}
            </span>
          )}
          <span>{formatRelative(request.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
