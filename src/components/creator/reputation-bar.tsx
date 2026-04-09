"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

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

export function ReputationBar({ points, className }: ReputationBarProps) {
  const t = useTranslations("profile.reputation");
  const reduce = useReducedMotion();
  const current = reputationLevel(points);
  const idx = LEVEL_ORDER.indexOf(current);
  const next = LEVEL_ORDER[idx + 1];
  const currentMeta = REPUTATION_META[current];

  // Compute progress to next level on the inter-level segment.
  const lower = REPUTATION_THRESHOLDS[current];
  const upper = next ? REPUTATION_THRESHOLDS[next] : lower;
  const progress = next
    ? Math.min(100, Math.max(0, ((points - lower) / (upper - lower)) * 100))
    : 100;

  return (
    <div className={cn("space-y-2", className)} role="img" aria-label={`${t("level")}: ${currentMeta.label}, ${points} points`}>
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            {t("level")}
          </span>
          <span className="text-base font-semibold text-fg">{currentMeta.label}</span>
          <span className="font-mono text-xs tabular-nums text-fg-muted">{points}</span>
        </div>
        <span className="text-xs text-fg-subtle">
          {next ? t("next", { level: REPUTATION_META[next].label }) : t("max")}
        </span>
      </div>
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-bg-raised">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-brand"
          initial={reduce ? { width: `${progress}%` } : { width: 0 }}
          whileInView={{ width: `${progress}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
