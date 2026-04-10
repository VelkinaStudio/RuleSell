"use client";

import { MessageSquare, Pin } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Discussion, DiscussionCategory } from "@/types";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/utils";

const CATEGORY_LABEL: Record<DiscussionCategory, string> = {
  qa: "Q&A",
  tips: "Tips",
  bugs: "Bug",
  feature_request: "Feature",
  showcase: "Showcase",
};

const CATEGORY_COLOR: Record<DiscussionCategory, string> = {
  qa: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  tips: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  bugs: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  feature_request: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  showcase: "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

interface DiscussionCardEnhancedProps {
  discussion: Discussion;
}

export function DiscussionCardEnhanced({
  discussion: d,
}: DiscussionCardEnhancedProps) {
  const t = useTranslations("community.discussions");

  return (
    <div className="group flex items-start gap-3 rounded-lg border border-border-soft bg-bg-surface p-4 transition hover:border-border-strong">
      {/* Vote count */}
      <div className="flex shrink-0 flex-col items-center rounded-md border border-border-soft px-2 py-1.5">
        <span className="text-sm font-medium tabular-nums text-fg-muted">
          {d.reactionCount}
        </span>
        <span className="text-[10px] text-fg-dim">{t("votes")}</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {d.isPinned && <Pin className="h-3 w-3 text-fg-muted" />}
          <span
            className={cn(
              "rounded border px-1.5 py-0.5 text-[10px] font-medium",
              CATEGORY_COLOR[d.category],
            )}
          >
            {CATEGORY_LABEL[d.category]}
          </span>
          <h3 className="line-clamp-1 text-sm font-semibold text-fg group-hover:text-fg">
            {d.title}
          </h3>
        </div>

        <p className="mt-1 line-clamp-1 text-xs text-fg-muted">{d.body}</p>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-fg-dim">
          <span>@{d.author.username}</span>
          <span className="inline-flex items-center gap-0.5">
            <MessageSquare className="h-3 w-3" />
            {d.replyCount} {t("replies")}
          </span>
          <span>{formatRelative(d.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
