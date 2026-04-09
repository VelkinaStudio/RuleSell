"use client";

import { useCallback, useState } from "react";
import { votes } from "@/lib/api-client";

/**
 * Optimistic vote toggle. Flips currentUserVoted immediately, reverts on error.
 */
export function useVote(rulesetId: string, initialVoted: boolean) {
  const [voted, setVoted] = useState(initialVoted);
  const [isToggling, setIsToggling] = useState(false);

  const toggle = useCallback(async () => {
    if (isToggling) return;
    setIsToggling(true);
    const prev = voted;
    setVoted(!prev); // optimistic
    try {
      const res = await votes.toggle(rulesetId);
      setVoted(res.voted);
    } catch {
      setVoted(prev); // revert
    } finally {
      setIsToggling(false);
    }
  }, [rulesetId, voted, isToggling]);

  return { voted, toggle, isToggling };
}
