"use client";

import { useMemo, useState } from "react";
import type { Discussion, DiscussionCategory } from "@/types";
import { MOCK_DISCUSSIONS } from "@/constants/mock-discussions";

export type DiscussionSort = "hot" | "new" | "top";

export function useDiscussionsEnhanced() {
  const [sort, setSort] = useState<DiscussionSort>("hot");
  const [categoryFilter, setCategoryFilter] = useState<DiscussionCategory | "all">("all");

  const discussions = useMemo(() => {
    let filtered: Discussion[] = MOCK_DISCUSSIONS;
    if (categoryFilter !== "all") {
      filtered = filtered.filter((d) => d.category === categoryFilter);
    }

    return [...filtered].sort((a, b) => {
      if (sort === "new") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sort === "top") {
        return b.reactionCount - a.reactionCount;
      }
      // hot: combination of reactions, replies, and recency
      const ageA = (Date.now() - new Date(a.createdAt).getTime()) / 86_400_000;
      const ageB = (Date.now() - new Date(b.createdAt).getTime()) / 86_400_000;
      const scoreA = (a.reactionCount + a.replyCount * 2) / Math.pow(ageA + 2, 1.5);
      const scoreB = (b.reactionCount + b.replyCount * 2) / Math.pow(ageB + 2, 1.5);
      return scoreB - scoreA;
    });
  }, [sort, categoryFilter]);

  return {
    discussions,
    sort,
    setSort,
    categoryFilter,
    setCategoryFilter,
  };
}
