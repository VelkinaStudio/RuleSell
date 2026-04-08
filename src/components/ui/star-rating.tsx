import type { HTMLAttributes } from "react";

export interface StarRatingProps extends HTMLAttributes<HTMLDivElement> {
  /** Average rating in the 0–5 range. */
  avgRating: number;
  /** Number of ratings, used to render a "(N)" annotation. */
  ratingCount?: number;
  /** Hide the numeric count suffix. */
  hideCount?: boolean;
  /** Icon size in pixels. Defaults to 16. */
  size?: number;
}

/**
 * Display-only star rating. Does not accept input — use a dedicated
 * input component if you need to collect a rating.
 */
export function StarRating({
  avgRating,
  ratingCount,
  hideCount = false,
  size = 16,
  className = "",
  ...props
}: StarRatingProps) {
  const clamped = Math.max(0, Math.min(5, avgRating));
  const filled = Math.round(clamped * 2) / 2; // nearest half

  return (
    <div
      className={["inline-flex items-center gap-1.5", className]
        .filter(Boolean)
        .join(" ")}
      aria-label={`${clamped.toFixed(1)} out of 5`}
      {...props}
    >
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => {
          const full = i <= filled;
          const half = !full && i - 0.5 === filled;
          return (
            <svg
              key={i}
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id={`half-${i}`}>
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#334155" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <path
                d="M12 2l2.9 6.9 7.4.6-5.6 4.9 1.7 7.3L12 17.8 5.6 21.7l1.7-7.3L1.7 9.5l7.4-.6L12 2z"
                fill={full ? "#fbbf24" : half ? `url(#half-${i})` : "#334155"}
                fillOpacity={full ? 1 : half ? 1 : 0.4}
              />
            </svg>
          );
        })}
      </div>
      {!hideCount && ratingCount !== undefined ? (
        <span className="text-xs text-text-secondary">
          {clamped.toFixed(1)} ({ratingCount})
        </span>
      ) : null}
    </div>
  );
}
