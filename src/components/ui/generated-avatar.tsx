"use client";

import { cn } from "@/lib/utils";

interface GeneratedAvatarProps {
  username: string;
  size?: number;
  className?: string;
}

/**
 * Deterministic avatar generated from a username hash.
 * Produces a geometric pattern using the username's characters as seed.
 * Used as fallback when users have no profile photo.
 */
export function GeneratedAvatar({
  username,
  size = 40,
  className,
}: GeneratedAvatarProps) {
  const hash = simpleHash(username);
  const hue = hash % 360;
  const saturation = 50 + (hash % 30);
  const lightness = 35 + (hash % 20);
  const bgColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const fgColor = `hsl(${hue}, ${saturation}%, ${lightness + 35}%)`;
  const initials = getInitials(username);

  // Generate 4 geometric shapes based on hash
  const shapes = [
    { x: 25, y: 25, r: 8 + (hash % 5), opacity: 0.15 },
    { x: 75, y: 25, r: 6 + ((hash >> 4) % 5), opacity: 0.1 },
    { x: 25, y: 75, r: 7 + ((hash >> 8) % 4), opacity: 0.12 },
    { x: 75, y: 75, r: 5 + ((hash >> 12) % 6), opacity: 0.08 },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={cn("shrink-0 rounded-full", className)}
      role="img"
      aria-label={username}
    >
      <rect width="100" height="100" rx="50" fill={bgColor} />
      {shapes.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill={fgColor}
          opacity={s.opacity}
        />
      ))}
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        fill={fgColor}
        fontSize="36"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
      >
        {initials}
      </text>
    </svg>
  );
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

function getInitials(username: string): string {
  if (username.startsWith("@")) username = username.slice(1);
  const parts = username.split(/[-_\.]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
}
