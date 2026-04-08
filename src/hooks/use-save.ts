"use client";

import { useCallback, useState } from "react";
import { saved as savedApi, ApiError } from "@/lib/api-client";

export interface SaveState {
  saved: boolean;
}

export interface UseSaveResult {
  data: SaveState | null;
  isLoading: boolean;
  error: ApiError | null;
  /** Toggle the current user's save state with optimistic update + rollback. */
  mutate: () => Promise<void>;
}

/**
 * Optimistic save/unsave toggle hook.
 */
export function useSave(
  rulesetId: string,
  initial: SaveState = { saved: false },
): UseSaveResult {
  const [state, setState] = useState<SaveState>(initial);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const mutate = useCallback(async () => {
    const previous = state;
    setState({ saved: !previous.saved });
    setIsLoading(true);
    setError(null);

    try {
      const next = await savedApi.toggle(rulesetId);
      setState(next);
    } catch (e) {
      setState(previous);
      if (e instanceof ApiError && !e.isUnauthorized) {
        setError(e);
      }
    } finally {
      setIsLoading(false);
    }
  }, [rulesetId, state]);

  return { data: state, isLoading, error, mutate };
}
