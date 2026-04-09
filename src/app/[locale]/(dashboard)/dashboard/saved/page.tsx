"use client";

import { ArrowRight, Bookmark, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Link } from "@/i18n/navigation";
import { RulesetCard } from "@/components/marketplace/ruleset-card";
import { useSaved } from "@/hooks/use-saved";

export default function SavedPage() {
  const t = useTranslations("dashboard.saved");
  const { saved, remove, isLoading, error } = useSaved();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="hero" />
        <LoadingSkeleton variant="card" count={4} />
      </div>
    );
  }
  if (error) return <ErrorState />;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-fg-muted">{t("subtitle")}</p>
      </header>

      {!saved || saved.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="h-5 w-5" />}
          title={t("empty.title")}
          description={t("empty.description")}
          action={
            <Button asChild className="bg-brand text-brand-fg hover:bg-brand/90">
              <Link href="/browse">
                {t("empty.cta")}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          }
        />
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((r) => (
            <li key={r.id} className="space-y-2">
              <RulesetCard ruleset={r} />
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => remove(r.id)}
              >
                <X className="mr-1 h-3 w-3" />
                {t("remove")}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
