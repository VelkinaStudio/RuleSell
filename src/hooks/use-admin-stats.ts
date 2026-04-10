"use client";

import { useState } from "react";
import type { AdminStats } from "@/types";
import { ADMIN_STATS } from "@/constants/mock-admin";

export function useAdminStats() {
  const [stats] = useState<AdminStats>(ADMIN_STATS);
  return { stats, isLoading: false };
}
