"use client";

import { useTranslations } from "next-intl";
import { AdminScanResults } from "@/components/admin/admin-scan-results";

export default function AdminScanningPage() {
  const t = useTranslations("admin.scanning");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-fg">{t("title")}</h1>
        <p className="mt-1 text-sm text-fg-muted">{t("subtitle")}</p>
      </div>

      <AdminScanResults />
    </div>
  );
}
