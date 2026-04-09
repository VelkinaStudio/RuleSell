"use client";

import { useTranslations } from "next-intl";
import { Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Link } from "@/i18n/navigation";

export default function RulesetNotFound() {
  const t = useTranslations("ruleset.notFound");
  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <EmptyState
        icon={<Package className="h-5 w-5" />}
        title={t("title")}
        description={t("description")}
        action={
          <Button asChild variant="outline" size="sm">
            <Link href="/browse">{t("browse")}</Link>
          </Button>
        }
      />
    </div>
  );
}
