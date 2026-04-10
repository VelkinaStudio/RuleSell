"use client";

import { useMemo, useState } from "react";

import type { AffiliateConversion } from "@/types";
import { MOCK_AFFILIATE_CONVERSIONS } from "@/constants/mock-affiliates";

export interface UseAffiliateConversionsOptions {
  status?: AffiliateConversion["status"] | "all";
  pageSize?: number;
}

/**
 * Returns a paginated, filterable list of affiliate conversions.
 * Replace with SWR + /api/affiliates/conversions when backend is ready.
 */
export function useAffiliateConversions(
  options: UseAffiliateConversionsOptions = {},
) {
  const { status = "all", pageSize = 10 } = options;
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (status === "all") return MOCK_AFFILIATE_CONVERSIONS;
    return MOCK_AFFILIATE_CONVERSIONS.filter((c) => c.status === status);
  }, [status]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const data = filtered.slice((page - 1) * pageSize, page * pageSize);

  return {
    conversions: data,
    total: filtered.length,
    page,
    totalPages,
    setPage,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    isLoading: false,
    error: null,
  };
}
