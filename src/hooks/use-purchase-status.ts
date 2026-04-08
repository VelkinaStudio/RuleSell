"use client";

import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import {
  purchases,
  ApiError,
  type PurchaseStatus,
} from "@/lib/api-client";
import { keys } from "@/lib/query-keys";

export interface UsePurchaseStatusResult {
  data: { status: PurchaseStatus; purchaseId?: string } | null;
  isLoading: boolean;
  error: ApiError | null;
  mutate: () => Promise<unknown>;
}

const POLL_INTERVAL_MS = 2_000;
const POLL_TIMEOUT_MS = 30_000;

/**
 * Polls `/api/purchases/status?rulesetId=...` every 2 s while the purchase
 * is still pending. Stops polling once status resolves to `COMPLETED`
 * (or any terminal state) OR after a 30 s timeout, whichever comes first.
 */
export function usePurchaseStatus(
  rulesetId: string | null | undefined,
): UsePurchaseStatusResult {
  const startedAt = useRef<number>(Date.now());
  const [timedOut, setTimedOut] = useState(false);

  // Reset the timer whenever the target ruleset changes.
  useEffect(() => {
    startedAt.current = Date.now();
    setTimedOut(false);
  }, [rulesetId]);

  const { data, error, isLoading, mutate } = useSWR(
    rulesetId ? keys.purchases.status(rulesetId) : null,
    rulesetId ? () => purchases.status(rulesetId) : null,
    {
      refreshInterval: (latest) => {
        if (!rulesetId) return 0;
        if (timedOut) return 0;
        if (Date.now() - startedAt.current > POLL_TIMEOUT_MS) {
          // Flip to timed-out state on next tick so React re-renders cleanly.
          setTimeout(() => setTimedOut(true), 0);
          return 0;
        }
        const status = latest?.status;
        // Stop polling once we reach any terminal state.
        if (status && status !== "PENDING") return 0;
        return POLL_INTERVAL_MS;
      },
    },
  );

  const isAuthError = error instanceof ApiError && error.isUnauthorized;

  return {
    data: isAuthError ? null : data ?? null,
    isLoading: rulesetId ? isLoading : false,
    error: error instanceof ApiError && !isAuthError ? error : null,
    mutate,
  };
}
