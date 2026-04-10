"use client";

import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

import type { GitHubSyncStatus } from "@/types";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/utils";

interface SyncIndicatorProps {
  syncStatus: GitHubSyncStatus;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export function SyncIndicator({
  syncStatus,
  isRefreshing = false,
  onRefresh,
  className,
}: SyncIndicatorProps) {
  const t = useTranslations("github.sync");

  const dotColor = {
    synced: "bg-emerald-400",
    outdated: "bg-amber-400",
    error: "bg-red-400",
  }[syncStatus.status];

  const label = {
    synced: t("synced", { time: formatRelative(syncStatus.lastSyncAt) }),
    outdated: t("outdated", { count: syncStatus.pendingChanges }),
    error: t("error"),
  }[syncStatus.status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-bg-raised/60 px-2.5 py-1 text-[11px] text-fg-muted",
        className,
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotColor)}
        aria-hidden
      />
      {label}
      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="ml-0.5 rounded p-0.5 text-fg-subtle transition hover:text-fg disabled:opacity-50"
          aria-label={t("refreshLabel")}
        >
          <RefreshCw
            className={cn(
              "h-3 w-3",
              isRefreshing && "animate-spin",
            )}
          />
        </button>
      )}
    </span>
  );
}
