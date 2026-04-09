"use client";

import { useMemo } from "react";

import type { Team } from "@/types";
import { MOCK_TEAMS } from "@/constants/mock-teams";
import { useSession } from "@/hooks/use-session";

/**
 * Returns the team the current user belongs to, if any. v1 is read-only —
 * the dashboard /team page just renders this for the active persona. Real
 * /api/team/me endpoint lands in v2 with seat management.
 */
export function useMyTeam() {
  const { data: session } = useSession();
  const username = session?.user?.username ?? null;

  const team: Team | null = useMemo(() => {
    if (!username) return null;
    return (
      MOCK_TEAMS.find((t) => t.members.some((m) => m.username === username)) ??
      null
    );
  }, [username]);

  return { team, isLoading: false, error: null as Error | null };
}
