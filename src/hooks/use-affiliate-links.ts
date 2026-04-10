"use client";

import { useCallback, useState } from "react";

import type { AffiliateLink } from "@/types";
import {
  MOCK_AFFILIATE_LINKS,
  AVAILABLE_RULESETS_FOR_LINKING,
} from "@/constants/mock-affiliates";

/**
 * Manages the affiliate links list with mock create/delete operations.
 * Replace with SWR + /api/affiliates/links when backend is ready.
 */
export function useAffiliateLinks() {
  const [links, setLinks] = useState<AffiliateLink[]>(MOCK_AFFILIATE_LINKS);

  const createLink = useCallback(
    (rulesetId: string | null) => {
      const rs = rulesetId
        ? AVAILABLE_RULESETS_FOR_LINKING.find((r) => r.id === rulesetId)
        : null;

      const code = rulesetId
        ? `REF-${(rs?.slug ?? "item").toUpperCase().replace(/-/g, "").slice(0, 8)}-${Date.now().toString(36).slice(-4)}`
        : `REF-GEN-${Date.now().toString(36).slice(-4)}`;

      const url = rs
        ? `https://rulesell.dev/r/${rs.slug}?ref=${code}`
        : `https://rulesell.dev/?ref=${code}`;

      const newLink: AffiliateLink = {
        id: `afl-new-${Date.now()}`,
        userId: "usr-mock-001",
        rulesetId,
        rulesetTitle: rs?.title,
        rulesetSlug: rs?.slug,
        code,
        url,
        clicks: 0,
        conversions: 0,
        earnings: 0,
        createdAt: new Date().toISOString(),
      };

      setLinks((prev) => [newLink, ...prev]);
      return newLink;
    },
    [],
  );

  const deleteLink = useCallback((id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return {
    links,
    createLink,
    deleteLink,
    availableRulesets: AVAILABLE_RULESETS_FOR_LINKING,
    isLoading: false,
    error: null,
  };
}
