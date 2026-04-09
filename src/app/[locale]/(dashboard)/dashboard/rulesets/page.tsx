"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { RulesetTable } from "@/components/dashboard/ruleset-table";

export default function DashboardRulesetsPage() {
  const t = useTranslations("dashboard.rulesets");

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-fg">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-fg-muted">{t("subtitle")}</p>
        </div>
        <Button
          asChild
          className="bg-brand text-brand-fg hover:bg-brand/90"
        >
          <Link href="/dashboard/rulesets/new">
            <Plus className="mr-1 h-4 w-4" />
            {t("newButton")}
          </Link>
        </Button>
      </header>

      <RulesetTable />
    </div>
  );
}
