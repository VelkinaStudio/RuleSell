"use client";

import { cn } from "@/lib/utils";

interface QualityGridProps {
  className?: string;
  /** Number of dots across the width */
  cols?: number;
  /** Number of dots down the height */
  rows?: number;
  /** Overall opacity */
  opacity?: number;
  /** Whether to add the brand glow at center */
  glow?: boolean;
}

/**
 * RuleSell signature background: a subtle dot grid with quality-score
 * colored highlights. Used behind hero sections and card headers.
 * The pattern represents measured quality — each dot is a data point.
 */
export function QualityGrid({
  className,
  cols = 24,
  rows = 12,
  opacity = 0.35,
  glow = false,
}: QualityGridProps) {
  const gap = 100 / cols;

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <svg
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity }}
      >
        <defs>
          <pattern
            id="quality-dots"
            x="0"
            y="0"
            width={gap}
            height={gap}
            patternUnits="userSpaceOnUse"
            patternTransform={`scale(${100 / cols})`}
          >
            <circle cx="0.5" cy="0.5" r="0.4" fill="var(--fg-dim)" opacity="0.3" />
          </pattern>
          {glow && (
            <radialGradient id="quality-glow" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
            </radialGradient>
          )}
        </defs>
        <rect width="100%" height="100%" fill="url(#quality-dots)" />
        {glow && (
          <rect width="100%" height="100%" fill="url(#quality-glow)" />
        )}
      </svg>
    </div>
  );
}
