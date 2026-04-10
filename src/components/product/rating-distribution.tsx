"use client";

import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

interface RatingBucket {
  star: number;
  count: number;
}

interface RatingDistributionProps {
  ratings: RatingBucket[];
  className?: string;
}

export function RatingDistribution({ ratings, className }: RatingDistributionProps) {
  const t = useTranslations("ruleset.reviews");

  const total = ratings.reduce((sum, r) => sum + r.count, 0);

  // Sort descending by star so 5 is always first
  const sorted = [...ratings].sort((a, b) => b.star - a.star);

  if (total === 0) return null;

  return (
    <div className={cn("space-y-1.5", className)} aria-label={t("distributionLabel")}>
      {sorted.map((bucket) => {
        const pct = total > 0 ? (bucket.count / total) * 100 : 0;
        const isHigh = bucket.star >= 4;
        return (
          <div key={bucket.star} className="flex items-center gap-2 text-xs">
            {/* Star count label */}
            <span className="w-3 shrink-0 text-right font-mono tabular-nums text-fg-subtle">
              {bucket.star}
            </span>
            {/* Star icon */}
            <Star
              className={cn(
                "h-3 w-3 shrink-0",
                isHigh
                  ? "fill-amber-400 text-amber-400"
                  : "fill-zinc-600 text-zinc-600",
              )}
              aria-hidden
            />
            {/* Bar track */}
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-bg-raised">
              <div
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ease-out",
                  isHigh ? "bg-amber-400" : "bg-zinc-600",
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
            {/* Count */}
            <span className="w-6 shrink-0 text-right font-mono tabular-nums text-fg-dim">
              {bucket.count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
