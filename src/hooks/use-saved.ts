"use client";

import { useCallback } from "react";
import useSWR from "swr";
import type { Ruleset } from "@/types";
import { apiClient, saved as savedApi } from "@/lib/api-client";
import { useSession } from "@/hooks/use-session";

export function useSaved() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? null;

  const { data, error, isLoading, mutate } = useSWR(
    userId ? ["saved"] : null,
    () => apiClient<{ items: Ruleset[]; total: number }>("/api/saved"),
  );

  const remove = useCallback(
    async (rulesetId: string) => {
      await savedApi.toggle(rulesetId);
      mutate();
    },
    [mutate],
  );

  return {
    saved: data?.items,
    remove,
    isLoading,
    error: error as Error | null,
  };
}
