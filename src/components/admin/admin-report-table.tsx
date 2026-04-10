"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, MoreHorizontal } from "lucide-react";
import type { AdminReport } from "@/types";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminReportDetail } from "./admin-report-detail";

interface AdminReportTableProps {
  reports: AdminReport[];
  onResolve: (id: string, note: string) => void;
  onDismiss: (id: string, note: string) => void;
}

function typeBadgeColor(type: AdminReport["type"]) {
  switch (type) {
    case "malicious": return "bg-danger/15 text-danger";
    case "copyright": return "bg-warning/15 text-warning";
    case "spam": return "bg-fg-muted/15 text-fg-muted";
    case "inappropriate": return "bg-danger/10 text-danger";
    default: return "bg-bg-raised text-fg-muted";
  }
}

function statusBadgeColor(status: AdminReport["status"]) {
  switch (status) {
    case "pending": return "bg-warning/15 text-warning";
    case "resolved": return "bg-success/15 text-success";
    case "dismissed": return "bg-fg-muted/15 text-fg-muted";
  }
}

export function AdminReportTable({ reports, onResolve, onDismiss }: AdminReportTableProps) {
  const t = useTranslations("admin.reports");
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-soft bg-bg-raised/50">
              <th className="px-4 py-3 text-left font-medium text-fg-muted">{t("typeColumn")}</th>
              <th className="px-4 py-3 text-left font-medium text-fg-muted">{t("target")}</th>
              <th className="px-4 py-3 text-left font-medium text-fg-muted">{t("reporter")}</th>
              <th className="px-4 py-3 text-left font-medium text-fg-muted">{t("reason")}</th>
              <th className="px-4 py-3 text-left font-medium text-fg-muted">{t("statusColumn")}</th>
              <th className="px-4 py-3 text-right font-medium text-fg-muted">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr
                key={report.id}
                className="border-b border-border-soft transition hover:bg-bg-raised/30"
              >
                <td className="px-4 py-3">
                  <Badge className={cn("text-xs", typeBadgeColor(report.type))}>
                    {t(`type.${report.type}`)}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-fg">{report.targetTitle}</p>
                    <p className="text-xs text-fg-muted capitalize">{report.targetType}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-fg-muted">@{report.reporterUsername}</td>
                <td className="max-w-[200px] px-4 py-3">
                  <p className="truncate text-fg-muted">{report.reason}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge className={cn("text-xs", statusBadgeColor(report.status))}>
                    {t(`status.${report.status}`)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">{t("actions")}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedReport(report);
                          setDetailOpen(true);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {t("viewDetail")}
                      </DropdownMenuItem>
                      {report.status === "pending" && (
                        <>
                          <DropdownMenuItem
                            onClick={() => onResolve(report.id, "Resolved via quick action.")}
                          >
                            {t("resolve")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDismiss(report.id, "Dismissed via quick action.")}
                          >
                            {t("dismiss")}
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminReportDetail
        report={selectedReport}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onResolve={onResolve}
        onDismiss={onDismiss}
      />
    </>
  );
}
