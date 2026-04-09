"use client";

import { Calendar, DollarSign, Lock, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Link } from "@/i18n/navigation";
import { useEarnings } from "@/hooks/use-earnings";
import { useSession } from "@/hooks/use-session";
import { EarningsChart } from "@/components/dashboard/earnings-chart";
import { PayoutHistory } from "@/components/dashboard/payout-history";
import { StatsCard } from "@/components/dashboard/stats-card";
import { formatDate, formatPrice } from "@/components/dashboard/format";

export default function EarningsPage() {
  const t = useTranslations("dashboard.earnings");
  const { data: session } = useSession();
  const { earnings, error, isLoading } = useEarnings();

  const isSeller = session?.user?.sellerStats?.traderVerified === true;

  if (!isSeller) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-fg">
            {t("title")}
          </h1>
        </header>
        <EmptyState
          icon={<Lock className="h-5 w-5" />}
          title={t("lockedTitle")}
          description={t("lockedDescription")}
          action={
            <Button asChild className="bg-brand text-brand-fg hover:bg-brand/90">
              <Link href="/dashboard/settings/seller">{t("lockedCta")}</Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="hero" />
        <LoadingSkeleton variant="card" count={3} />
      </div>
    );
  }

  if (error || !earnings) return <ErrorState />;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-fg-muted">{t("subtitle")}</p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard
          label={t("lifetime")}
          value={formatPrice(earnings.lifetimeRevenue, "USD")}
          icon={DollarSign}
          accent="text-amber-300"
          iconBg="bg-amber-500/10"
        />
        <StatsCard
          label={t("pending")}
          value={formatPrice(earnings.pendingPayout, "USD")}
          icon={Wallet}
          accent="text-emerald-300"
          iconBg="bg-emerald-500/10"
        />
        <StatsCard
          label={t("next")}
          value={formatDate(earnings.nextPayoutAt)}
          icon={Calendar}
          accent="text-sky-300"
          iconBg="bg-sky-500/10"
        />
      </section>

      <EarningsChart data={earnings.timeseries} />

      <PayoutHistory
        payouts={earnings.payouts}
        pendingPayout={earnings.pendingPayout}
        payoutMin={earnings.payoutMin}
      />
    </div>
  );
}
