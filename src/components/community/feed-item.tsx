"use client";

import {
  BarChart3,
  HelpCircle,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type { CommunityFeedItem, FeedItemType } from "@/hooks/use-community-feed";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/utils";

const TYPE_CONFIG: Record<
  FeedItemType,
  { icon: typeof MessageSquare; badgeClass: string; labelKey: string }
> = {
  discussion: {
    icon: MessageSquare,
    badgeClass: "border-info/30 text-info",
    labelKey: "discussion",
  },
  showcase: {
    icon: Sparkles,
    badgeClass: "border-brand/30 text-brand",
    labelKey: "showcase",
  },
  poll: {
    icon: BarChart3,
    badgeClass: "border-violet-400/30 text-violet-400",
    labelKey: "poll",
  },
  question: {
    icon: HelpCircle,
    badgeClass: "border-emerald-400/30 text-emerald-400",
    labelKey: "question",
  },
};

interface FeedItemProps {
  item: CommunityFeedItem;
}

export function FeedItem({ item }: FeedItemProps) {
  const t = useTranslations("community.feedTypes");
  const config = TYPE_CONFIG[item.type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col py-3 transition hover:bg-bg-surface/50 sm:flex-row sm:items-start sm:gap-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-fg-dim" />
        <span
          className={cn(
            "rounded-full border px-1.5 py-0.5 text-[10px] font-medium",
            config.badgeClass,
          )}
        >
          {t(config.labelKey)}
        </span>
      </div>
      <div className="mt-1.5 min-w-0 flex-1">
        <p className="line-clamp-1 text-sm text-fg">{item.title}</p>
        <p className="mt-0.5 line-clamp-1 text-xs text-fg-dim">{item.body}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-fg-dim">
          <span>@{item.authorUsername}</span>
          {item.meta.replyCount != null && (
            <span>{item.meta.replyCount} replies</span>
          )}
          {item.meta.totalVotes != null && (
            <span>{item.meta.totalVotes} votes</span>
          )}
          {item.meta.answerCount != null && (
            <span>{item.meta.answerCount} answers</span>
          )}
          {item.meta.reactionCount != null && (
            <span>{item.meta.reactionCount} reactions</span>
          )}
        </div>
      </div>
      <span className="mt-1.5 shrink-0 text-[10px] text-fg-dim sm:mt-0">
        {formatRelative(item.createdAt)}
      </span>
    </div>
  );
}
