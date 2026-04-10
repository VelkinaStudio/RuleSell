"use client";

import type { CreatorMark } from "@/types";
import { CREATOR_MARK_META } from "@/constants/badges";
import { IconByName } from "@/components/ui/icon-map";
import { cn } from "@/lib/utils";

interface CreatorMarksProps {
  marks: CreatorMark[];
  /** When provided, wraps an avatar with rings rather than rendering chip pills. */
  children?: React.ReactNode;
  className?: string;
  /** Show inline as chip row when no children. */
  size?: "sm" | "md";
}

const RING_CLASS: Record<CreatorMark, string> = {
  VERIFIED_CREATOR: "ring-emerald-500/70",
  TRADER: "ring-amber-500/70",
  CERTIFIED_DEV: "ring-violet-500/70",
  PRO: "ring-cyan-500/70",
  TEAM: "ring-rose-500/70",
  MAINTAINER: "ring-blue-500/70",
  TOP_RATED: "ring-pink-500/70",
};

const ACCENT_BG: Record<string, string> = {
  emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  sky: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  violet: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  rose: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  blue: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  pink: "bg-pink-500/15 text-pink-300 border-pink-500/30",
};

export function CreatorMarks({
  marks,
  children,
  className,
  size = "md",
}: CreatorMarksProps) {
  if (children) {
    // Avatar wrapper variant — concatenate rings (Tailwind ring stacks via box-shadow)
    const primary = marks[0];
    return (
      <div
        className={cn(
          "relative inline-block rounded-full ring-2 ring-offset-2 ring-offset-bg",
          primary ? RING_CLASS[primary] : "ring-border-soft",
          className,
        )}
      >
        {children}
      </div>
    );
  }

  // Chip row variant
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {marks.map((mark) => {
        const meta = CREATOR_MARK_META[mark];
        const accent = ACCENT_BG[meta.accent] ?? ACCENT_BG.sky;
        return (
          <span
            key={mark}
            title={meta.tooltip}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border font-semibold",
              accent,
              size === "sm"
                ? "px-2 py-0.5 text-[10px]"
                : "px-3 py-1 text-xs",
            )}
          >
            <IconByName
              name={meta.icon}
              className={size === "sm" ? "h-3 w-3" : "h-4 w-4"}
            />
            <span>{meta.label}</span>
          </span>
        );
      })}
    </div>
  );
}
