"use client";

import { useCallback, useState } from "react";
import { PENDING_RULESETS, type PendingRuleset } from "@/constants/mock-admin";

export function useAdminModeration() {
  const [rulesets, setRulesets] = useState<PendingRuleset[]>(PENDING_RULESETS);

  const approve = useCallback((id: string) => {
    setRulesets((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const reject = useCallback((id: string, _reason?: string) => {
    setRulesets((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return {
    rulesets,
    approve,
    reject,
    isLoading: false,
    isEmpty: rulesets.length === 0,
  };
}
