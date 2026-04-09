"use client";

import useSWR from "swr";
import type { Ruleset } from "@/types";
import { apiClient } from "@/lib/api-client";
import { useSession } from "@/hooks/use-session";

export function usePurchases() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? null;

  const { data, error, isLoading } = useSWR(
    userId ? ["purchases"] : null,
    () => apiClient<{ items: Ruleset[]; total: number }>("/api/purchases"),
  );

  return {
    purchases: data?.items,
    isLoading,
    error: error as Error | null,
  };
}
