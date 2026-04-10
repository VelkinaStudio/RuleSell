"use client";

import { useCallback, useMemo, useState } from "react";
import type { AdminReport } from "@/types";
import { ADMIN_REPORTS } from "@/constants/mock-admin";

type StatusFilter = "all" | "pending" | "resolved" | "dismissed";

export function useAdminReports(statusFilter: StatusFilter = "all") {
  const [reports, setReports] = useState<AdminReport[]>(ADMIN_REPORTS);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return reports;
    return reports.filter((r) => r.status === statusFilter);
  }, [reports, statusFilter]);

  const resolve = useCallback((id: string, note: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "resolved" as const,
              moderatorNote: note,
              resolvedAt: new Date().toISOString(),
            }
          : r,
      ),
    );
  }, []);

  const dismiss = useCallback((id: string, note: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "dismissed" as const,
              moderatorNote: note,
              resolvedAt: new Date().toISOString(),
            }
          : r,
      ),
    );
  }, []);

  return { reports: filtered, resolve, dismiss, isLoading: false };
}
