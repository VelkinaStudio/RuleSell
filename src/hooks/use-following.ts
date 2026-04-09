"use client";

import { useCallback } from "react";
import useSWR from "swr";
import { apiClient, engagement } from "@/lib/api-client";
import { useSession } from "@/hooks/use-session";

export interface FollowedCreator {
  user: {
    id: string;
    username: string;
    name: string;
    avatar: string | null;
    reputation: number;
    rulesetCount: number;
    followedAt: string;
  };
  latest: {
    id: string;
    slug: string;
    title: string;
    description: string;
    platform: string;
    type: string;
    createdAt: string;
  } | null;
}

export function useFollowing() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? null;

  const { data, error, isLoading, mutate } = useSWR(
    userId ? ["following"] : null,
    () => apiClient<{ following: FollowedCreator[]; total: number }>("/api/following"),
  );

  const unfollow = useCallback(
    async (targetUserId: string) => {
      await engagement.follow(targetUserId);
      mutate();
    },
    [mutate],
  );

  return {
    following: data?.following,
    unfollow,
    isLoading,
    error: error as Error | null,
  };
}
