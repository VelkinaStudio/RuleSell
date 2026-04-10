"use client";

import { Check, Heart, MessageSquare, Pin } from "lucide-react";

import type { Discussion } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReputationBadge } from "@/components/ui/reputation-badge";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/utils";

interface DiscussionThreadProps {
  discussion: Discussion;
}

export function DiscussionThread({ discussion: d }: DiscussionThreadProps) {
  return (
    <div className="space-y-4 rounded-lg border border-border-soft bg-bg-surface p-4">
      {/* OP */}
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          {/* Author avatar */}
          <Link href={`/u/${d.author.username}`} className="shrink-0">
            <Avatar size="sm">
              {d.author.avatar && (
                <AvatarImage src={d.author.avatar} alt={d.author.username} />
              )}
              <AvatarFallback className="text-[9px]">
                {d.author.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              {d.isPinned && <Pin className="h-3 w-3 text-fg-muted" />}
              <h3 className="text-sm font-semibold text-fg">{d.title}</h3>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-fg-subtle">
              <Link href={`/u/${d.author.username}`} className="hover:text-fg-muted">
                @{d.author.username}
              </Link>
              <ReputationBadge level={d.author.level} points={d.author.reputation} />
              <span className="text-fg-dim">{formatRelative(d.createdAt)}</span>
            </div>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-fg-muted">{d.body}</p>
        <div className="flex items-center gap-3 text-xs text-fg-dim">
          <span className="inline-flex items-center gap-1">
            <Heart className="h-3 w-3" /> {d.reactionCount}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="h-3 w-3" /> {d.replyCount}
          </span>
        </div>
      </div>

      {/* Replies */}
      {d.replies.length > 0 && (
        <div className="space-y-3 border-t border-border-soft pt-3">
          {d.replies.map((reply) => (
            <div
              key={reply.id}
              className={cn(
                "rounded-md p-3",
                reply.isAnswer
                  ? "border border-emerald-500/20 bg-emerald-500/5"
                  : "bg-bg-raised/50",
              )}
            >
              <div className="flex items-center gap-2 text-xs">
                <Avatar size="sm">
                  <AvatarFallback className="text-[9px]">
                    {reply.author.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Link href={`/u/${reply.author.username}`} className="font-medium text-fg-muted hover:text-fg">
                  @{reply.author.username}
                </Link>
                {reply.isAnswer && (
                  <span className="inline-flex items-center gap-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                    <Check className="h-2.5 w-2.5" /> Answer
                  </span>
                )}
                <span className="text-fg-dim">{formatRelative(reply.createdAt)}</span>
              </div>
              <p className="mt-1.5 text-sm text-fg-muted">{reply.body}</p>
              <div className="mt-1.5 flex items-center gap-2 text-[11px] text-fg-dim">
                <span className="inline-flex items-center gap-0.5">
                  <Heart className="h-2.5 w-2.5" /> {reply.reactions}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
