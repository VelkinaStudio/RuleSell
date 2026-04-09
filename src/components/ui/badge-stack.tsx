"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { ItemBadge } from "@/types";
import { ITEM_BADGE_META } from "@/constants/badges";
import { cn } from "@/lib/utils";
import { IconByName } from "./icon-map";

interface BadgeStackProps {
  badges: ItemBadge[];
  limit?: number;
  className?: string;
}

const ACCENT_BG: Record<string, string> = {
  emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  sky: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  zinc: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  orange: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  pink: "bg-pink-500/15 text-pink-300 border-pink-500/30",
  violet: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  rose: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export function BadgeStack({ badges, limit, className }: BadgeStackProps) {
  const reduce = useReducedMotion();
  const visible = limit ? badges.slice(0, limit) : badges;
  const overflow = limit && badges.length > limit ? badges.length - limit : 0;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {visible.map((b, idx) => {
        const meta = ITEM_BADGE_META[b];
        const accent = ACCENT_BG[meta.accent] ?? ACCENT_BG.zinc;
        return (
          <motion.span
            key={b}
            title={meta.tooltip}
            aria-label={`${meta.label}: ${meta.tooltip}`}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium",
              accent,
            )}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04, duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <IconByName name={meta.icon} className="h-3 w-3" />
            <span>{meta.label}</span>
          </motion.span>
        );
      })}
      {overflow > 0 && (
        <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
          +{overflow}
        </span>
      )}
    </div>
  );
}
