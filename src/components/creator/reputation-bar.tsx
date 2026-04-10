"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";

import type { ReputationLevel } from "@/types";
import {
  REPUTATION_META,
  REPUTATION_THRESHOLDS,
  reputationLevel,
} from "@/constants/reputation";
import { cn } from "@/lib/utils";

interface ReputationBarProps {
  points: number;
  className?: string;
}

const LEVEL_ORDER: ReputationLevel[] = [
  "NEWCOMER",
  "MEMBER",
  "CONTRIBUTOR",
  "TRUSTED",
  "EXPERT",
  "AUTHORITY",
];

/** Tailwind bg class for the bar fill per level accent. */
const LEVEL_BAR_CLASS: Record<string, string> = {
  zinc: "from-zinc-400 to-zinc-300",
  sky: "from-sky-500 to-sky-400",
  emerald: "from-emerald-500 to-emerald-400",
  violet: "from-violet-500 to-violet-400",
  amber: "from-amber-500 to-amber-400",
  rose: "from-rose-500 to-rose-400",
};

const LEVEL_GLOW_CLASS: Record<string, string> = {
  zinc: "shadow-zinc-500/30",
  sky: "shadow-sky-500/40",
  emerald: "shadow-emerald-500/40",
  violet: "shadow-violet-500/40",
  amber: "shadow-amber-500/40",
  rose: "shadow-rose-500/40",
};

const LEVEL_TEXT_CLASS: Record<string, string> = {
  zinc: "text-zinc-300",
  sky: "text-sky-300",
  emerald: "text-emerald-300",
  violet: "text-violet-300",
  amber: "text-amber-300",
  rose: "text-rose-300",
};

export function ReputationBar({ points, className }: ReputationBarProps) {
  const t = useTranslations("profile.reputation");
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  const current = reputationLevel(points);
  const idx = LEVEL_ORDER.indexOf(current);
  const next = LEVEL_ORDER[idx + 1];
  const currentMeta = REPUTATION_META[current];
  const accent = currentMeta.accent;

  // Compute progress to next level on the inter-level segment.
  const lower = REPUTATION_THRESHOLDS[current];
  const upper = next ? REPUTATION_THRESHOLDS[next] : lower;
  const progress = next
    ? Math.min(100, Math.max(0, ((points - lower) / (upper - lower)) * 100))
    : 100;

  const pointsToNext = next ? REPUTATION_THRESHOLDS[next] - points : 0;

  const barGradient = LEVEL_BAR_CLASS[accent] ?? LEVEL_BAR_CLASS.sky;
  const glowClass = LEVEL_GLOW_CLASS[accent] ?? LEVEL_GLOW_CLASS.sky;
  const textClass = LEVEL_TEXT_CLASS[accent] ?? LEVEL_TEXT_CLASS.sky;

  return (
    <div
      ref={ref}
      className={cn("space-y-3", className)}
      role="img"
      aria-label={`${t("level")}: ${currentMeta.label}, ${points} points`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            {t("level")}
          </span>
          <span className={cn("font-display text-lg font-bold tracking-tight", textClass)}>
            {currentMeta.label}
          </span>
        </div>
        <span className="text-xs text-fg-subtle">
          {next
            ? t("next", { level: REPUTATION_META[next].label })
            : t("max")}
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-bg-raised">
        <motion.div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r shadow-md",
            barGradient,
            glowClass,
          )}
          initial={{ width: reduce ? `${progress}%` : "0%" }}
          animate={inView ? { width: `${progress}%` } : { width: "0%" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        />
        {/* Shimmer sweep */}
        {!reduce && inView && (
          <motion.div
            className="absolute inset-y-0 w-12 -translate-x-full skew-x-[-20deg] bg-white/20"
            animate={{ x: ["0%", "900%"] }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.5 }}
          />
        )}
      </div>

      {/* Points row */}
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display tabular-nums text-sm font-semibold text-fg">
          {points.toLocaleString()} <span className="text-xs font-normal text-fg-muted">pts</span>
        </span>
        {next && (
          <span className="text-xs tabular-nums text-fg-subtle">
            {pointsToNext.toLocaleString()} to next
          </span>
        )}
      </div>
    </div>
  );
}
