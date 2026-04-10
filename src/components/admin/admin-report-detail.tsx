"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { AdminReport } from "@/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface AdminReportDetailProps {
  report: AdminReport | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function AdminReportDetail({
  report,
  open,
  onOpenChange,
  onResolve,
  onDismiss,
}: AdminReportDetailProps) {
  const t = useTranslations("admin.reports");
  const [note, setNote] = useState("");

  if (!report) return null;

  const isPending = report.status === "pending";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("reportDetail")}</DialogTitle>
          <DialogDescription>{report.targetTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Badge className={cn("text-xs", typeBadgeColor(report.type))}>{t(`type.${report.type}`)}</Badge>
            <Badge className={cn("text-xs", statusBadgeColor(report.status))}>{t(`status.${report.status}`)}</Badge>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-fg-muted">{t("targetType")}</span>
              <span className="text-fg capitalize">{report.targetType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">{t("reporter")}</span>
              <span className="text-fg">@{report.reporterUsername}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">{t("submitted")}</span>
              <span className="text-fg">{new Date(report.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <Separator />

          <div>
            <p className="mb-1 font-medium text-fg">{t("reason")}</p>
            <p className="text-fg-muted">{report.reason}</p>
          </div>

          {report.moderatorNote && (
            <>
              <Separator />
              <div>
                <p className="mb-1 font-medium text-fg">{t("moderatorNote")}</p>
                <p className="text-fg-muted">{report.moderatorNote}</p>
              </div>
            </>
          )}

          {isPending && (
            <>
              <Separator />
              <div>
                <label className="mb-1 block text-xs font-medium text-fg-muted">
                  {t("addNote")}
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t("notePlaceholder")}
                  className="min-h-[60px] w-full rounded-md border border-border-soft bg-bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </>
          )}
        </div>

        {isPending && (
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onDismiss(report.id, note);
                setNote("");
                onOpenChange(false);
              }}
            >
              {t("dismiss")}
            </Button>
            <Button
              size="sm"
              className="bg-success text-white hover:bg-success/90"
              onClick={() => {
                onResolve(report.id, note);
                setNote("");
                onOpenChange(false);
              }}
            >
              {t("resolve")}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
