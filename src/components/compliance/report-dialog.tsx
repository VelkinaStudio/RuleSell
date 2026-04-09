"use client";

import { Flag } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ReportTargetType } from "@/hooks/use-report";

import { ReportForm } from "./report-form";

interface ReportDialogProps {
  targetType: ReportTargetType;
  targetId: string;
  defaultEmail?: string;
  /** Render prop or fall back to a default ghost button trigger. */
  trigger?: React.ReactNode;
}

export function ReportDialog({
  targetType,
  targetId,
  defaultEmail,
  trigger,
}: ReportDialogProps) {
  const t = useTranslations("compliance.report");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="sm" aria-label={t("iconLabel")}>
            <Flag className="size-4" aria-hidden="true" />
            <span>{t("label")}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("subtitle")}</DialogDescription>
        </DialogHeader>
        <ReportForm
          targetType={targetType}
          targetId={targetId}
          defaultEmail={defaultEmail}
          compact
          onSuccess={() => undefined}
        />
      </DialogContent>
    </Dialog>
  );
}
