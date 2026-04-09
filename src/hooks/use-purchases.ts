"use client";

import { useMemo } from "react";

import type { Ruleset } from "@/types";
import { MOCK_RULESETS } from "@/constants/mock-data";
import { useSession } from "@/hooks/use-session";

/**
 * Mock list of items the current user has purchased. Derived deterministically
 * from MOCK_RULESETS using the user.id as a seed so the same persona always
 * sees the same purchases. v2 will replace this with a real /api/purchases
 * endpoint.
 */
export function usePurchases() {
  const { data: session } = useSession();
  const user = session?.user ?? null;

  const data: Ruleset[] | undefined = useMemo(() => {
    if (!user) return undefined;
    // Persona: only buyers, builders, sellers actually have purchases.
    // Take 4 paid items and mark them as PURCHASED for the current user.
    const paidItems = MOCK_RULESETS.filter((r) => r.price > 0);
    const seed = user.id.charCodeAt(user.id.length - 1) % paidItems.length;
    const ownedSlice = [
      paidItems[seed % paidItems.length],
      paidItems[(seed + 3) % paidItems.length],
      paidItems[(seed + 7) % paidItems.length],
      paidItems[(seed + 11) % paidItems.length],
    ].filter(Boolean);
    return ownedSlice.map((r) => ({
      ...r,
      currentUserAccess: "PURCHASED" as const,
    }));
  }, [user]);

  return {
    purchases: data,
    isLoading: !data && !!user,
    error: null as Error | null,
  };
}
