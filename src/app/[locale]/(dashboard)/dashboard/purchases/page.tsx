"use client";

import { ArrowRight, CheckCircle2, Circle, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Link } from "@/i18n/navigation";
import { RulesetCard } from "@/components/marketplace/ruleset-card";
import { usePurchases } from "@/hooks/use-purchases";
import { cn } from "@/lib/utils";
import { formatDate } from "@/components/dashboard/format";

// The API returns purchasedAt alongside the Ruleset fields
interface PurchasedRuleset {
  id: string;
  slug: string;
  title: string;
  purchasedAt?: string;
  currentUserAccess: string;
  [key: string]: unknown;
}

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
              <Link href="/browse">
                {t("empty.cta")}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          }
        />
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(purchases as unknown as PurchasedRuleset[]).map((r) => {
            // Treat PURCHASED access + any further access level as "installed"
            const isInstalled =
              r.currentUserAccess === "PURCHASED" ||
              r.currentUserAccess === "SUBSCRIPTION_ACTIVE" ||
              r.currentUserAccess === "AUTHOR";
            const purchasedAt = r.purchasedAt as string | undefined;

            return (
              <li key={r.id} className="space-y-2">
                <div className="relative">
                  <RulesetCard ruleset={r as unknown as Parameters<typeof RulesetCard>[0]["ruleset"]} />
                  {/* Install status badge */}
                  <div
                    className={cn(
                      "absolute right-2 top-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
                      isInstalled
                        ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                        : "border-border-soft bg-bg-raised text-fg-subtle",
                    )}
                  >
                    {isInstalled ? (
                      <CheckCircle2 className="h-3 w-3" aria-hidden />
                    ) : (
                      <Circle className="h-3 w-3" aria-hidden />
                    )}
                    {isInstalled ? t("installed") : t("notInstalled")}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  {purchasedAt && (
                    <p className="text-[11px] text-fg-subtle">
                      {t("purchasedOn", { date: formatDate(purchasedAt) })}
                    </p>
                  )}
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className={cn("shrink-0", !purchasedAt && "w-full")}
                  >
                    <Link href={`/r/${r.slug}#install`}>{t("openInstall")}</Link>
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
