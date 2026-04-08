"use client";

import { useCallback, useState } from "react";
import { votes, ApiError } from "@/lib/api-client";

export interface VoteState {
  voted: boolean;
  voteCount: number;
}

export interface UseVoteResult {
  data: VoteState | null;
  isLoading: boolean;
  error: ApiError | null;
  /** Toggle the current user's vote with an optimistic update + rollback. */
  mutate: () => Promise<void>;
}

/**
 * Optimistic vote toggle hook. Takes the initial voted state from the
 * parent render (usually provided on the ruleset card payload) and keeps
 * local state from there — no refetch round trip.
 */
export function useVote(
  rulesetId: string,
  initial: VoteState = { voted: false, voteCount: 0 },
): UseVoteResult {
  const [state, setState] = useState<VoteState>(initial);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const mutate = useCallback(async () => {
    const previous = state;
    // Optimistic update
    setState({
      voted: !previous.voted,
      voteCount: previous.voteCount + (previous.voted ? -1 : 1),
    });
    setIsLoading(true);
    setError(null);

    try {
      const next = await votes.toggle(rulesetId);
      setState(next);
    } catch (e) {
      // Rollback
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
