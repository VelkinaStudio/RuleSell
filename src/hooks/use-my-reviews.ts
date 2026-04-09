"use client";

import useSWR from "swr";
import type { Review } from "@/types";
import { apiClient } from "@/lib/api-client";
import { useSession } from "@/hooks/use-session";

export function useMyReviews() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? null;

  const { data, error, isLoading } = useSWR(
    userId ? ["my-reviews"] : null,
    () => apiClient<{ reviews: Review[]; total: number }>("/api/reviews/mine"),
  );

  return {
    reviews: data?.reviews,
    isLoading,
    error: error as Error | null,
  };
}
