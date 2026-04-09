"use client";

import { Download } from "lucide-react";

import type { Ruleset } from "@/types";
import { formatCount } from "@/components/marketplace/_format";
import { CATEGORY_META } from "@/constants/categories";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconByName } from "@/components/ui/icon-map";
import { QualityBar } from "@/components/ui/quality-bar";
import { CreatorMarks } from "@/components/creator/creator-marks";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface LeaderboardRowProps {
  rank: number;
  ruleset: Ruleset;
}

const RANK_STYLE: Record<number, string> = {
  1: "text-amber-300",
  2: "text-zinc-300",
  3: "text-orange-400",
};

export function LeaderboardRow({ rank, ruleset }: LeaderboardRowProps) {
  const meta = CATEGORY_META[ruleset.category];
  const rankClass = RANK_STYLE[rank] ?? "text-fg-subtle";

  return (
    <Link
      href={`/r/${ruleset.slug}`}
      className={cn(
        "group grid grid-cols-[60px_minmax(0,1fr)_180px_140px_100px] items-center gap-4 rounded-lg border border-border-soft bg-bg-surface px-4 py-3 transition-all",
        "hover:translate-x-0.5 hover:border-brand/40 hover:bg-bg-elevated",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
      )}
    >
      {/* Rank */}
      <span
        className={cn(
          "font-mono text-2xl font-bold tabular-nums",
          rankClass,
        )}
      >
        {rank.toString().padStart(2, "0")}
      </span>

      {/* Title block */}
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
          style={{ backgroundColor: `${meta.color}1f`, color: meta.color }}
          aria-hidden
        >
          <IconByName name={meta.icon} className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="line-clamp-1 text-sm font-semibold text-fg group-hover:text-brand">
            {ruleset.title}
          </p>
          <p className="line-clamp-1 text-xs text-fg-muted">{meta.label}</p>
        </div>
      </div>

      {/* Author */}
      <div className="flex min-w-0 items-center gap-2">
        <CreatorMarks marks={ruleset.author.creatorMarks}>
          <Avatar size="sm">
            {ruleset.author.avatar && (
              <AvatarImage
                src={ruleset.author.avatar}
                alt={ruleset.author.username}
              />
            )}
            <AvatarFallback className="text-[10px]">
              {ruleset.author.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </CreatorMarks>
        <span className="line-clamp-1 text-xs text-fg-muted">
          @{ruleset.author.username}
        </span>
      </div>

      {/* Quality */}
      <div className="flex items-center gap-2">
        <QualityBar score={ruleset.qualityScore} compact className="flex-1" />
        <span className="font-mono text-xs tabular-nums text-fg">
          {ruleset.qualityScore}
        </span>
      </div>

      {/* Downloads */}
      <span className="inline-flex items-center justify-end gap-1 text-xs text-fg-muted">
        <Download className="h-3 w-3" />
        <span className="font-mono tabular-nums">
          {formatCount(ruleset.downloadCount + ruleset.purchaseCount)}
        </span>
      </span>
    </Link>
  );
}
