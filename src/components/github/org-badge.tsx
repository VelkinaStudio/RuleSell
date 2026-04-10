"use client";

import { BadgeCheck } from "lucide-react";

import { cn } from "@/lib/utils";

interface OrgBadgeProps {
  name: string;
  verified: boolean;
  avatarUrl: string;
  className?: string;
}

export function OrgBadge({ name, verified, avatarUrl, className }: OrgBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-bg-raised/60 px-2 py-0.5 text-[11px] font-medium text-fg-muted",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avatarUrl}
        alt={name}
        className="h-3.5 w-3.5 rounded-full"
      />
      {name}
      {verified && (
        <BadgeCheck className="h-3 w-3 text-blue-400" aria-label="Verified organization" />
      )}
    </span>
  );
}
