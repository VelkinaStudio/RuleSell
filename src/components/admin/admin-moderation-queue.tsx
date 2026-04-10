"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";

import { useAdminModeration } from "@/hooks/use-admin-moderation";
import { AdminModerationCard } from "./admin-moderation-card";
import { EmptyState } from "@/components/ui/empty-state";

export function AdminModerationQueue() {
  const { rulesets, approve, reject, isEmpty } = useAdminModeration();
  const t = useTranslations("admin.moderation");

  if (isEmpty) {
    return (
      <EmptyState
        icon={<CheckCircle2 className="h-5 w-5" />}
        title={t("emptyTitle")}
        description={t("emptyDescription")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-fg-muted">
        {t("queueCount", { count: rulesets.length })}
      </p>
      {rulesets.map((rs) => (
        <AdminModerationCard
          key={rs.id}
          ruleset={rs}
          onApprove={approve}
          onReject={reject}
        />
      ))}
    </div>
  );
}
