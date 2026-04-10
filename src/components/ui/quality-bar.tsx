"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

interface QualityBarProps {
  /** 0-100 */
  score: number;
  label?: string;
  compact?: boolean;
  className?: string;
  /** Override the default score-based color with a specific hex/CSS color. */
  accentColor?: string;
}

function colorForScore(score: number): string {
  if (score >= 85) return "var(--brand)";
  if (score >= 70) return "var(--success)";
  if (score >= 50) return "var(--warning)";
  return "var(--danger)";
}

export function QualityBar({ score, label, compact, className, accentColor }: QualityBarProps) {
  const reduce = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, score));
  const color = accentColor ?? colorForScore(clamped);
  const widthPct = `${clamped}%`;

  return (
    <div className={cn("w-full", className)} role="img" aria-label={`${label ?? "Quality"}: ${clamped} of 100`}>
      {!compact && label && (
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-fg-muted">{label}</span>
          <span className="font-mono font-medium text-fg">{clamped}</span>
        </div>
      )}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-bg-raised",
          compact ? "h-1" : "h-2",
        )}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: color }}
          initial={reduce ? { width: widthPct } : { width: 0 }}
          animate={{ width: widthPct }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
