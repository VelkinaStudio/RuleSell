"use client";

import { useTranslations } from "next-intl";
import { AdminModerationQueue } from "@/components/admin/admin-moderation-queue";

export default function AdminModerationPage() {
  const t = useTranslations("admin.moderation");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-fg">{t("title")}</h1>
        <p className="mt-1 text-sm text-fg-muted">{t("subtitle")}</p>
      </div>

      <AdminModerationQueue />
    </div>
  );
}
