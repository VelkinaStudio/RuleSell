import type { HTMLAttributes } from "react";

type SkeletonSize = "card" | "text" | "avatar";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  size?: SkeletonSize;
}

const sizeClasses: Record<SkeletonSize, string> = {
  card: "h-64 w-full rounded-xl",
  text: "h-4 w-full rounded",
  avatar: "h-10 w-10 rounded-full",
};

export function Skeleton({
  size = "text",
  className = "",
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        "relative overflow-hidden bg-bg-tertiary",
        sizeClasses[size],
        // Shimmer via a moving gradient overlay. Requires `animate-shimmer`
        // keyframes in globals.css (defined alongside other tokens).
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-[shimmer_1.6s_ease-in-out_infinite]",
        "before:bg-gradient-to-r before:from-transparent",
        "before:via-white/5 before:to-transparent",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
