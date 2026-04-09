"use client";

import { useCallback, useState } from "react";

import { saved as saves } from "@/lib/api-client";

/**
 * Optimistic save/bookmark toggle for a ruleset. Flips the local state
 * immediately and reverts on server error. In v1 (mock-only), the toggle
 * just flips client state with no network call.
 */
export function useSave(rulesetId: string, initialSaved = false) {
  const [saved, setSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  const toggle = useCallback(async () => {
    const prev = saved;
    setSaved(!prev); // optimistic
    setIsLoading(true);

    try {
      const res = await saves.toggle(rulesetId);
      setSaved(res.saved);
    } catch {
      setSaved(prev); // revert
    } finally {
      setIsLoading(false);
    }
  }, [rulesetId, saved]);

  return { saved, toggle, isLoading };
}
