"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, X, Calendar, User as UserIcon, Tag } from "lucide-react";
import type { PendingRuleset } from "@/constants/mock-admin";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AdminModerationCardProps {
  ruleset: PendingRuleset;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

export function AdminModerationCard({
  ruleset,
  onApprove,
  onReject,
}: AdminModerationCardProps) {
  const t = useTranslations("admin.moderation");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  return (
    <div className="rounded-xl border border-border-soft bg-bg-surface p-5 transition hover:border-border-strong">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <h3 className="font-semibold text-fg">{ruleset.title}</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs text-fg-muted">
            <span className="flex items-center gap-1">
              <UserIcon className="h-3 w-3" />
              {ruleset.authorUsername}
            </span>
            <span className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {ruleset.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(ruleset.submittedAt).toLocaleDateString()}
            </span>
          </div>
          <p className="line-clamp-2 text-sm text-fg-muted">
            {ruleset.previewContent.replace(/^#.*\n\n/, "")}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {!showRejectInput && (
            <>
              <Button
                size="sm"
                className="bg-success text-white hover:bg-success/90"
                onClick={() => onApprove(ruleset.id)}
              >
                <Check className="mr-1.5 h-3.5 w-3.5" />
                {t("approve")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-danger/30 text-danger hover:bg-danger/10"
                onClick={() => setShowRejectInput(true)}
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                {t("reject")}
              </Button>
            </>
          )}
        </div>
      </div>

      {showRejectInput && (
        <div className="mt-4 flex flex-col gap-2 rounded-lg border border-border-soft bg-bg-raised/30 p-3">
          <label className="text-xs font-medium text-fg-muted">
            {t("rejectReason")}
          </label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder={t("rejectReasonPlaceholder")}
            className="min-h-[60px] w-full rounded-md border border-border-soft bg-bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-danger/30 text-danger hover:bg-danger/10"
              onClick={() => {
                onReject(ruleset.id, rejectReason);
                setRejectReason("");
                setShowRejectInput(false);
              }}
            >
              {t("confirmReject")}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setRejectReason("");
                setShowRejectInput(false);
              }}
            >
              {t("cancelAction")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
