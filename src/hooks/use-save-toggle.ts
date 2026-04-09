"use client";

import { useCallback, useState } from "react";
import { saved as saves } from "@/lib/api-client";

/**
 * Optimistic save toggle. Same pattern as useVote.
 */
export function useSaveToggle(rulesetId: string, initialSaved: boolean) {
  const [saved, setSaved] = useState(initialSaved);
  const [isToggling, setIsToggling] = useState(false);

  const toggle = useCallback(async () => {
    if (isToggling) return;
    setIsToggling(true);
    const prev = saved;
    setSaved(!prev);
    try {
      const res = await saves.toggle(rulesetId);
      setSaved(res.saved);
    } catch {
      setSaved(prev);
    } finally {
      setIsToggling(false);
    }
  }, [rulesetId, saved, isToggling]);

  return { saved, toggle, isToggling };
}
