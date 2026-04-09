"use client";

import { useMemo } from "react";

import type { Review } from "@/types";
import { MOCK_REVIEWS } from "@/constants/mock-reviews";
import { useSession } from "@/hooks/use-session";

/**
 * Mock list of reviews authored by the current user. Filters MOCK_REVIEWS by
 * author username. Real /api/reviews?authorId=me ships in v2.
 */
export function useMyReviews() {
  const { data: session } = useSession();
  const user = session?.user ?? null;

  const reviews: Review[] | undefined = useMemo(() => {
    if (!user) return undefined;
    return MOCK_REVIEWS.filter((r) => r.author.username === user.username);
  }, [user]);

  return {
    reviews,
    isLoading: !reviews && !!user,
    error: null as Error | null,
  };
}
