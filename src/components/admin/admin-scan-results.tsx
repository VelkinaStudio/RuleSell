"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { AdminScanResult } from "@/types";
import { SCAN_RESULTS } from "@/constants/mock-admin";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function scanBadge(status: "pass" | "fail" | "warning" | "pending") {
  switch (status) {
    case "pass": return "bg-success/15 text-success";
    case "fail": return "bg-danger/15 text-danger";
    case "warning": return "bg-warning/15 text-warning";
    case "pending": return "bg-fg-muted/15 text-fg-muted";
  }
}

export function AdminScanResults() {
  const t = useTranslations("admin.scanning");
  const [results] = useState<AdminScanResult[]>(SCAN_RESULTS);

  return (
    <div className="overflow-x-auto rounded-lg border border-border-soft">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-soft bg-bg-raised/50">
            <th className="px-4 py-3 text-left font-medium text-fg-muted">{t("ruleset")}</th>
            <th className="px-4 py-3 text-center font-medium text-fg-muted">VirusTotal</th>
            <th className="px-4 py-3 text-center font-medium text-fg-muted">Semgrep</th>
            <th className="px-4 py-3 text-center font-medium text-fg-muted">Sandbox</th>
            <th className="px-4 py-3 text-left font-medium text-fg-muted">{t("scannedAt")}</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr
              key={r.rulesetId}
              className="border-b border-border-soft transition hover:bg-bg-raised/30"
            >
              <td className="px-4 py-3">
                <p className="font-medium text-fg">{r.rulesetTitle}</p>
                <p className="text-xs text-fg-muted">{r.rulesetSlug}</p>
              </td>
              <td className="px-4 py-3 text-center">
                <Badge className={cn("text-xs", scanBadge(r.virusTotal))}>
                  {t(`status.${r.virusTotal}`)}
                </Badge>
              </td>
              <td className="px-4 py-3 text-center">
                <Badge className={cn("text-xs", scanBadge(r.semgrep))}>
                  {t(`status.${r.semgrep}`)}
                </Badge>
              </td>
              <td className="px-4 py-3 text-center">
                <Badge className={cn("text-xs", scanBadge(r.sandbox))}>
                  {t(`status.${r.sandbox}`)}
                </Badge>
              </td>
              <td className="px-4 py-3 text-fg-muted">
                {new Date(r.scannedAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
