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
import { formatDate } from "@/components/dashboard/format";

// The API returns items ordered by createdAt desc; savedAt may be appended
interface SavedRuleset {
  id: string;
  slug: string;
  savedAt?: string;
  createdAt?: string;
  [key: string]: unknown;
}

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
          {(saved as unknown as SavedRuleset[]).map((r) => {
            // savedAt may be added by the API; fall back to undefined
            const savedDate = r.savedAt ?? undefined;

            return (
              <li key={r.id} className="space-y-2">
                <RulesetCard ruleset={r as unknown as Parameters<typeof RulesetCard>[0]["ruleset"]} />
                <div className="flex items-center justify-between gap-2">
                  {savedDate && (
                    <p className="text-[11px] text-fg-subtle">
                      {t("savedOn", { date: formatDate(savedDate) })}
                    </p>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 gap-1"
                    onClick={() => remove(r.id)}
                  >
                    <X className="h-3 w-3" aria-hidden />
                    {t("remove")}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
