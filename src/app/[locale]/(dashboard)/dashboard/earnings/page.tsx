"use client";

import { Calendar, CheckCircle2, Circle, DollarSign, Lock, Wallet } from "lucide-react";
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
import { cn } from "@/lib/utils";

const VERIFICATION_STEPS = [
  "verificationStep1",
  "verificationStep2",
  "verificationStep3",
] as const;

function VerificationProgress({
  t,
  builderInstalls,
}: {
  t: ReturnType<typeof useTranslations>;
  builderInstalls: number;
}) {
  const installsDone = builderInstalls >= 50;
  // We only have info about installs from the session; other steps are unknown
  const steps = [
    { key: VERIFICATION_STEPS[0], done: installsDone },
    { key: VERIFICATION_STEPS[1], done: false },
    { key: VERIFICATION_STEPS[2], done: false },
  ] as const;

  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-300">
        {t("verificationStepsTitle")}
      </p>
      <ol className="space-y-2">
        {steps.map(({ key, done }) => (
          <li key={key} className="flex items-center gap-2 text-sm">
            {done ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
            ) : (
              <Circle className="h-4 w-4 shrink-0 text-amber-400/60" aria-hidden />
            )}
            <span className={cn(done ? "text-fg-muted line-through" : "text-fg-muted")}>
              {t(key)}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function EarningsPage() {
  const t = useTranslations("dashboard.earnings");
  const { data: session } = useSession();
  const { earnings, error, isLoading } = useEarnings();

  const isSeller = session?.user?.sellerStats?.traderVerified === true;
  const builderInstalls = session?.user?.builderStats?.verifiedInstallCount ?? 0;

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
        <VerificationProgress t={t} builderInstalls={builderInstalls} />
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
        {/* Hero lifetime revenue */}
        <div className="group relative overflow-hidden rounded-xl border border-amber-500/30 bg-bg-surface p-5 transition hover:border-amber-500/50 sm:col-span-1">
          <p className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
            {t("lifetime")}
          </p>
          <p className="mt-2 font-display text-4xl font-bold tabular-nums text-amber-300">
            {formatPrice(earnings.lifetimeRevenue, "USD")}
          </p>
          <DollarSign
            className="absolute right-4 top-4 h-8 w-8 text-amber-500/20"
            aria-hidden
          />
        </div>

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
