"use client";

import { ArrowRight, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Link } from "@/i18n/navigation";
import { RulesetCard } from "@/components/marketplace/ruleset-card";
import { usePurchases } from "@/hooks/use-purchases";

export default function PurchasesPage() {
  const t = useTranslations("dashboard.purchases");
  const { purchases, isLoading, error } = usePurchases();

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

      {!purchases || purchases.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="h-5 w-5" />}
          title={t("empty.title")}
          description={t("empty.description")}
          action={
            <Button asChild className="bg-brand text-brand-fg hover:bg-brand/90">
              <Link href="/browse/paid">
                {t("empty.cta")}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          }
        />
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {purchases.map((r) => (
            <li key={r.id} className="space-y-2">
              <RulesetCard ruleset={r} />
              <Button
                asChild
                size="sm"
                variant="outline"
                className="w-full"
              >
                <Link href={`/r/${r.slug}#install`}>{t("openInstall")}</Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
