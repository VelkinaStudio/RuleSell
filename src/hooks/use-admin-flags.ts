"use client";

import { useCallback, useState } from "react";
import type { FeatureFlag } from "@/types";
import { FEATURE_FLAGS } from "@/constants/mock-admin";

export function useAdminFlags() {
  const [flags, setFlags] = useState<FeatureFlag[]>(FEATURE_FLAGS);

  const toggle = useCallback((id: string) => {
    setFlags((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, enabled: !f.enabled, updatedAt: new Date().toISOString() }
          : f,
      ),
    );
  }, []);

  return { flags, toggle, isLoading: false };
}
