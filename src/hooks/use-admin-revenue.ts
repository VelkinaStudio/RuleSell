"use client";

import { useState } from "react";
import type { RevenueDataPoint } from "@/types";
import { REVENUE_DATA } from "@/constants/mock-admin";

export function useAdminRevenue() {
  const [data] = useState<RevenueDataPoint[]>(REVENUE_DATA);

  const totals = data.reduce(
    (acc, d) => ({
      platformRevenue: acc.platformRevenue + d.platformRevenue,
      sellerPayouts: acc.sellerPayouts + d.sellerPayouts,
      refunds: acc.refunds + d.refunds,
    }),
    { platformRevenue: 0, sellerPayouts: 0, refunds: 0 },
  );

  return { data, totals, isLoading: false };
}
