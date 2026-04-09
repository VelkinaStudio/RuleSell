"use client";

import useSWR from "swr";

import type { Page, Review } from "@/types";
import { fetcher, type SWRKey } from "@/lib/api/fetcher";

interface UseReviewsArgs {
  rulesetId: string | null;
  page?: number;
  pageSize?: number;
}

export function useReviews({ rulesetId, page, pageSize }: UseReviewsArgs) {
  const key: SWRKey | null = rulesetId
    ? (["reviews", { rulesetId, page, pageSize }] as const)
    : null;
  return useSWR<Page<Review>>(key, fetcher);
}
