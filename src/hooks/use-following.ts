"use client";

import { useCallback, useMemo, useState } from "react";

import type { Ruleset, User } from "@/types";
import { MOCK_RULESETS } from "@/constants/mock-data";
import { MOCK_USERS } from "@/constants/mock-users";
import { useSession } from "@/hooks/use-session";

export interface FollowedCreator {
  user: User;
  latest: Ruleset | null;
}

/**
 * Mock list of creators the current user follows. Picks 5 builders/sellers
 * deterministically by user.id. Each entry includes the creator's most recent
 * published ruleset, mirroring what a real /api/following endpoint would do.
 */
export function useFollowing() {
  const { data: session } = useSession();
  const user = session?.user ?? null;

  const initial = useMemo(() => {
    if (!user) return [] as FollowedCreator[];
    const creators = MOCK_USERS.filter(
      (u) => u.builderStats || u.sellerStats,
    ).filter((u) => u.id !== user.id);
    const seed = user.id.charCodeAt(user.id.length - 1) % creators.length;
    const slice = [
      creators[seed % creators.length],
      creators[(seed + 2) % creators.length],
      creators[(seed + 4) % creators.length],
      creators[(seed + 6) % creators.length],
      creators[(seed + 8) % creators.length],
    ].filter(Boolean);

    return slice.map((c) => {
      const owned = MOCK_RULESETS.filter((r) => r.author.username === c.username);
      const latest = owned.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )[0];
      return { user: c, latest: latest ?? null };
    });
  }, [user]);

  const [unfollowed, setUnfollowed] = useState<Set<string>>(new Set());

  const unfollow = useCallback((username: string) => {
    setUnfollowed((prev) => {
      const next = new Set(prev);
      next.add(username);
      return next;
    });
  }, []);

  const data = useMemo(
    () => initial.filter((c) => !unfollowed.has(c.user.username)),
    [initial, unfollowed],
  );

  return {
    following: user ? data : undefined,
    unfollow,
    isLoading: false,
    error: null as Error | null,
  };
}
