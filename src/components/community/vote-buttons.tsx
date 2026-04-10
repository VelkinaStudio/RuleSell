"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

interface VoteButtonsProps {
  count: number;
  userVote?: number; // -1, 0, 1
  onVoteUp?: () => void;
  onVoteDown?: () => void;
  size?: "sm" | "md";
}

export function VoteButtons({
  count,
  userVote = 0,
  onVoteUp,
  onVoteDown,
  size = "md",
}: VoteButtonsProps) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        type="button"
        onClick={onVoteUp}
        className={cn(
          "rounded p-0.5 transition",
          userVote === 1
            ? "text-brand"
            : "text-fg-dim hover:text-fg-muted",
        )}
        aria-label="Vote up"
      >
        <ChevronUp className={iconSize} />
      </button>
      <span
        className={cn(
          "tabular-nums font-medium",
          textSize,
          userVote === 1
            ? "text-brand"
            : userVote === -1
              ? "text-rose-400"
              : "text-fg-muted",
        )}
      >
        {count}
      </span>
      <button
        type="button"
        onClick={onVoteDown}
        className={cn(
          "rounded p-0.5 transition",
          userVote === -1
            ? "text-rose-400"
            : "text-fg-dim hover:text-fg-muted",
        )}
        aria-label="Vote down"
      >
        <ChevronDown className={iconSize} />
      </button>
    </div>
  );
}
