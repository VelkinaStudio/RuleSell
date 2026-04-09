"use client";

import useSWR from "swr";
import { useRef } from "react";
import { keys } from "@/lib/query-keys";
import { purchases } from "@/lib/api-client";
import type { PurchaseStatus } from "@/lib/api-client";

/**
 * Polls purchase status every 2s, stops after 30s or COMPLETED.
 */
export function usePurchaseStatus(purchaseId: string | null) {
  const iterRef = useRef(0);

  const { data, error, isLoading } = useSWR<{ status: PurchaseStatus; purchaseId?: string }>(
    purchaseId ? keys.purchases.status(purchaseId) : null,
    () => purchases.status(purchaseId!),
    {
      refreshInterval: (data) => {
        if (!data) return 2000;
        if (data.status === 'COMPLETED' || data.status === 'FAILED') return 0;
        iterRef.current++;
        if (iterRef.current >= 15) return 0; // 30s max
        return 2000;
      },
    },
  );

  // Derive polling state from SWR data alone (no ref read during render)
  const isDone = data?.status === 'COMPLETED' || data?.status === 'FAILED';
  const isPolling = !!purchaseId && !error && !isDone && isLoading;

  return { status: data?.status ?? null, isPolling, error };
}
