"use client";

import useSWR from "swr";
import { apiClient } from "@/lib/api-client";
import { useSession } from "@/hooks/use-session";

export type PayoutStatus = "pending" | "paid" | "failed";

export interface PayoutRecord {
  id: string;
  amount: number;
  status: PayoutStatus;
  createdAt: string;
  completedAt: string | null;
  paidAt: string | null;
  periodStart: string;
  periodEnd: string;
}

export interface EarningsTrendPoint {
  date: string;
  revenue: number;
  sales: number;
  installs: number;
}

export interface EarningsData {
  lifetimeRevenue: number;
  pendingPayout: number;
  nextPayoutAt: string;
  payoutMin: number;
  lastPayoutAmount: number;
  lastPayoutDate: string | null;
  timeseries: EarningsTrendPoint[];
  payouts: PayoutRecord[];
}

interface ApiEarningsData {
  lifetimeRevenue: number;
  pendingPayout: number;
  lastPayoutAmount: number;
  lastPayoutDate: string | null;
  timeseries: EarningsTrendPoint[];
  payouts: PayoutRecord[];
}

const PAYOUT_MIN = 5000; // $50 in cents

function nextPayoutDate(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1, 1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function useEarnings(period = "30d") {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? null;

  const { data, error, isLoading } = useSWR(
    userId ? ["analytics", "earnings", period] : null,
    async (): Promise<EarningsData> => {
      const raw = await apiClient<ApiEarningsData>(
        `/api/analytics/earnings?period=${period}`,
      );
      return {
        ...raw,
        nextPayoutAt: nextPayoutDate(),
        payoutMin: PAYOUT_MIN,
      };
    },
  );

  return { earnings: data, error, isLoading };
}
