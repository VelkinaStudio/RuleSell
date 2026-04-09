"use client";

import { MessageSquare, Pin } from "lucide-react";
import { useState } from "react";

import type { Discussion, DiscussionCategory } from "@/types";
import { Link } from "@/i18n/navigation";
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

interface DiscussionListProps {
  discussions: Discussion[];
  rulesetSlug?: string;
  className?: string;
}

type Sort = "recent" | "reactions" | "unanswered";

export function DiscussionList({
  discussions,
  rulesetSlug,
  className,
}: DiscussionListProps) {
  const [filter, setFilter] = useState<DiscussionCategory | "all">("all");
  const [sort, setSort] = useState<Sort>("recent");

  const filtered = discussions.filter(
    (d) => filter === "all" || d.category === filter,
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "reactions") return b.reactionCount - a.reactionCount;
    if (sort === "unanswered") return a.replyCount - b.replyCount;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className={cn("space-y-3", className)}>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "qa", "tips", "bugs", "feature_request", "showcase"] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={cn(
              "rounded-md border px-2 py-1 text-xs transition",
              filter === cat
                ? "border-fg/20 bg-fg/5 text-fg"
                : "border-border-soft text-fg-subtle hover:text-fg-muted",
            )}
          >
            {cat === "all" ? "All" : CATEGORY_LABEL[cat]}
          </button>
        ))}
        <span className="mx-1 text-fg-dim">|</span>
        {(["recent", "reactions", "unanswered"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSort(s)}
            className={cn(
              "text-xs transition",
              sort === s ? "text-fg" : "text-fg-subtle hover:text-fg-muted",
            )}
          >
            {s === "recent" ? "Recent" : s === "reactions" ? "Most active" : "Unanswered"}
          </button>
        ))}
      </div>

      {/* List */}
      {sorted.length === 0 ? (
        <p className="py-8 text-center text-sm text-fg-muted">No discussions yet.</p>
      ) : (
        <div className="divide-y divide-border-soft">
          {sorted.map((d) => (
            <Link
              key={d.id}
              href={rulesetSlug ? `/r/${rulesetSlug}#disc-${d.id}` : `/r/${d.rulesetId}#disc-${d.id}`}
              className="group flex items-start gap-3 py-3 transition hover:bg-bg-surface/50"
            >
              <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-fg-dim" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {d.isPinned && <Pin className="h-3 w-3 text-fg-muted" />}
                  <span className="line-clamp-1 text-sm font-medium text-fg group-hover:text-fg">
                    {d.title}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-fg-dim">
                  <span className={cn("rounded border px-1.5 py-0.5", CATEGORY_COLOR[d.category])}>
                    {CATEGORY_LABEL[d.category]}
                  </span>
                  <span>@{d.author.username}</span>
                  <span>{d.replyCount} replies</span>
                  <span>{formatRelative(d.createdAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
