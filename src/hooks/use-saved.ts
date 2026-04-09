"use client";

import { useCallback, useMemo, useState } from "react";

import type { Ruleset } from "@/types";
import { MOCK_RULESETS } from "@/constants/mock-data";
import { useSession } from "@/hooks/use-session";

/**
 * Mock list of items the current user has bookmarked. Like usePurchases,
 * derived from a deterministic seed on the persona id. State is held locally
 * so the "Remove" action can update the UI without a backend call.
 */
export function useSaved() {
  const { data: session } = useSession();
  const user = session?.user ?? null;

  const initial = useMemo(() => {
    if (!user) return [] as Ruleset[];
    const seed = user.id.charCodeAt(user.id.length - 1) % MOCK_RULESETS.length;
    return [
      MOCK_RULESETS[seed % MOCK_RULESETS.length],
      MOCK_RULESETS[(seed + 5) % MOCK_RULESETS.length],
      MOCK_RULESETS[(seed + 9) % MOCK_RULESETS.length],
      MOCK_RULESETS[(seed + 13) % MOCK_RULESETS.length],
      MOCK_RULESETS[(seed + 17) % MOCK_RULESETS.length],
    ]
      .filter(Boolean)
      .map((r) => ({ ...r, currentUserSaved: true }));
  }, [user]);

  const [removed, setRemoved] = useState<Set<string>>(new Set());

  const remove = useCallback((id: string) => {
    setRemoved((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const data = useMemo(
    () => initial.filter((r) => !removed.has(r.id)),
    [initial, removed],
  );

  return {
    saved: user ? data : undefined,
    remove,
    isLoading: false,
    error: null as Error | null,
  };
}
