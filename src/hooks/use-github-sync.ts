"use client";

import { useCallback, useState } from "react";

import type { GitHubSyncStatus } from "@/types";
import { MOCK_SYNC_STATUSES } from "@/constants/mock-github";

interface UseGitHubSyncReturn {
  syncStatus: GitHubSyncStatus | null;
  isRefreshing: boolean;
  refresh: () => Promise<void>;
}

export function useGitHubSync(rulesetId: string | null): UseGitHubSyncReturn {
  const initial = rulesetId ? (MOCK_SYNC_STATUSES[rulesetId] ?? null) : null;
  const [syncStatus, setSyncStatus] = useState<GitHubSyncStatus | null>(initial);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    if (!syncStatus) return;
    setIsRefreshing(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    setSyncStatus({
      ...syncStatus,
      lastSyncAt: new Date().toISOString(),
      status: "synced",
      pendingChanges: 0,
    });
    setIsRefreshing(false);
  }, [syncStatus]);

  return { syncStatus, isRefreshing, refresh };
}
