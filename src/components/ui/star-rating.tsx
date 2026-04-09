import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md";
  showValue?: boolean;
  className?: string;
}

/**
 * Display-only star rating. Renders filled/half/empty stars based on the
 * numeric rating value. Not an input — for review forms use a separate
 * interactive component.
 */
export function StarRating({
  rating,
  max = 5,
  size = "sm",
  showValue = true,
  className,
}: StarRatingProps) {
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";

  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      aria-label={`${rating.toFixed(1)} out of ${max}`}
    >
      {Array.from({ length: max }, (_, i) => {
        const filled = rating >= i + 1;
        const half = !filled && rating >= i + 0.5;

        return (
          <Star
            key={i}
            className={cn(
              iconSize,
              filled
                ? "fill-amber-400 text-amber-400"
                : half
                  ? "fill-amber-400/50 text-amber-400"
                  : "text-fg-muted/30",
            )}
            aria-hidden
          />
        );
      })}
      {showValue && (
        <span className="ml-0.5 font-mono text-xs tabular-nums text-fg-subtle">
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  );
}
