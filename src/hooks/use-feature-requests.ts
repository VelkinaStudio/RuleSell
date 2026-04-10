"use client";

import { useMemo, useState } from "react";
import type { FeatureRequest, FeatureRequestStatus } from "@/types";
import { MOCK_FEATURE_REQUESTS } from "@/constants/mock-requests";

export type RequestSort = "hot" | "new" | "top";

export function useFeatureRequests() {
  const [sort, setSort] = useState<RequestSort>("hot");
  const [statusFilter, setStatusFilter] = useState<FeatureRequestStatus | "all">("all");
  const [votes, setVotes] = useState<Record<string, number>>({});

  const requests = useMemo(() => {
    let filtered: FeatureRequest[] = MOCK_FEATURE_REQUESTS;
    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    const withVotes = filtered.map((r) => ({
      ...r,
      voteCount: r.voteCount + (votes[r.id] ?? 0),
    }));

    return [...withVotes].sort((a, b) => {
      if (sort === "new") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sort === "top") {
        return b.voteCount - a.voteCount;
      }
      // hot: combination of votes and recency
      const ageA = (Date.now() - new Date(a.createdAt).getTime()) / 86_400_000;
      const ageB = (Date.now() - new Date(b.createdAt).getTime()) / 86_400_000;
      const hotA = a.voteCount / Math.pow(ageA + 2, 1.5);
      const hotB = b.voteCount / Math.pow(ageB + 2, 1.5);
      return hotB - hotA;
    });
  }, [sort, statusFilter, votes]);

  const voteOnRequest = (requestId: string) => {
    setVotes((prev) => {
      const current = prev[requestId] ?? 0;
      return { ...prev, [requestId]: current === 1 ? 0 : 1 };
    });
  };

  const getUserVote = (requestId: string): boolean => (votes[requestId] ?? 0) === 1;

  return {
    requests,
    sort,
    setSort,
    statusFilter,
    setStatusFilter,
    voteOnRequest,
    getUserVote,
  };
}
