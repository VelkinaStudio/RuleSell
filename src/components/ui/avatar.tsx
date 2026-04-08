"use client";

import { useState, type HTMLAttributes } from "react";

type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  /** Used to compute initials when no src is available. */
  name?: string;
  size?: AvatarSize;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

function initials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export function Avatar({
  src,
  alt,
  name,
  size = "md",
  className = "",
  ...props
}: AvatarProps) {
  const [broken, setBroken] = useState(false);
  const showImage = !!src && !broken;

  return (
    <div
      className={[
        "inline-flex items-center justify-center rounded-full overflow-hidden",
        "bg-bg-tertiary text-text-secondary font-semibold select-none",
        "border border-border-primary",
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={alt ?? name ?? "Avatar"}
      {...props}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt={alt ?? name ?? ""}
          className="h-full w-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  );
}
