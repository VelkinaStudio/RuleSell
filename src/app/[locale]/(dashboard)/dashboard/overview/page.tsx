"use client";

import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Compass,
  DollarSign,
  Download,
  Package,
  Star,
  Upload,
  UserPen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Link } from "@/i18n/navigation";
import { useOverview } from "@/hooks/use-overview";
import { useSession } from "@/hooks/use-session";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { StatsCard } from "@/components/dashboard/stats-card";
import { formatNumber, formatPrice } from "@/components/dashboard/format";

export default function OverviewPage() {
  const t = useTranslations("dashboard.overview");
  const { overview, error, isLoading } = useOverview();
  const { data: session } = useSession();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="hero" />
        <LoadingSkeleton variant="card" count={4} />
      </div>
    );
  }

  if (error || !overview) {
    return <ErrorState />;
  }

  const username = session?.user?.username ?? "";

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          {t("title")}
        </h1>
        <p className="text-sm text-fg-muted">{t("subtitle")}</p>
      </header>

      <section
        aria-label={t("title")}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatsCard
          label={t("installs30d")}
          value={formatNumber(overview.installs30d)}
          delta={overview.installsDelta}
          icon={Download}
          accent="text-emerald-300"
          iconBg="bg-emerald-500/10"
        />
        <StatsCard
          label={t("revenue30d")}
          value={formatPrice(overview.revenue30d, "USD")}
          delta={overview.revenueDelta}
          icon={DollarSign}
          accent="text-amber-300"
          iconBg="bg-amber-500/10"
        />
        <StatsCard
          label={t("avgRating")}
          value={overview.avgRating > 0 ? overview.avgRating.toFixed(1) : "—"}
          icon={Star}
          accent="text-amber-300"
          iconBg="bg-amber-500/10"
        />
        <StatsCard
          label={t("publishedCount")}
          value={String(overview.publishedCount)}
          icon={Package}
          accent="text-sky-300"
          iconBg="bg-sky-500/10"
        />
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityFeed items={overview.activity} />
        </div>

        <aside className="space-y-4">
          <section className="rounded-xl border border-border-soft bg-bg-surface p-5">
            <h2 className="text-sm font-semibold text-fg">
              {t("quickActions")}
            </h2>
            <div className="mt-4 flex flex-col gap-2">
              <Button
                asChild
                className="justify-between bg-brand text-brand-fg hover:bg-brand/90"
              >
                <Link href="/dashboard/rulesets/new">
                  <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    {t("quickActionPublish")}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-between">
                <Link href={`/u/${username}`}>
                  <span className="flex items-center gap-2">
                    <UserPen className="h-4 w-4" />
                    {t("quickActionEditProfile")}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" className="justify-between">
                <Link href="/browse">
                  <span className="flex items-center gap-2">
                    <Compass className="h-4 w-4" />
                    {t("quickActionViewMarket")}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>

          <section className="rounded-xl border border-border-soft bg-bg-surface p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              {t("totalRulesets")}
            </h3>
            <p className="mt-1 text-xl font-semibold tabular-nums text-fg">
              {overview.publishedCount}
            </p>
            <h3 className="mt-4 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              {t("totalInstalls")}
            </h3>
            <p className="mt-1 text-xl font-semibold tabular-nums text-fg">
              {formatNumber(overview.totalInstalls)}
            </p>
            <h3 className="mt-4 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              {t("totalRevenue")}
            </h3>
            <p className="mt-1 text-xl font-semibold tabular-nums text-fg">
              {formatPrice(overview.totalRevenue, "USD")}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
