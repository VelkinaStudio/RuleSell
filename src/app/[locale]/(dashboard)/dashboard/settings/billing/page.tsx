"use client";

import { useState } from "react";
import { Bell, Check, Sparkles, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { SettingsTabs } from "@/components/dashboard/settings-tabs";
import { cn } from "@/lib/utils";

// current plan: "free" | "pro"
const CURRENT_PLAN = "free" as "free" | "pro";

interface PlanFeature {
  labelKey: string;
  free: boolean;
  pro: boolean;
}

const PLAN_FEATURES: PlanFeature[] = [
  { labelKey: "featureBrowse",           free: true,  pro: true  },
  { labelKey: "featureInstallFree",      free: true,  pro: true  },
  { labelKey: "featureSave",             free: true,  pro: true  },
  { labelKey: "featureFollow",           free: true,  pro: true  },
  { labelKey: "featureOneListing",       free: true,  pro: false },
  { labelKey: "featureUnlimitedListing", free: false, pro: true  },
  { labelKey: "featurePrioritySupport",  free: false, pro: true  },
  { labelKey: "featureAnalytics",        free: false, pro: true  },
  { labelKey: "featureEarlyAccess",      free: false, pro: true  },
];

export default function SettingsBillingPage() {
  const t = useTranslations("dashboard.settings");
  const tBilling = useTranslations("dashboard.settings.billing");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("rulesell:pro-waitlist", "1");
    }
    setSubscribed(true);
    toast.success(tBilling("proSubscribed"));
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-fg-muted">{t("subtitle")}</p>
      </header>

      <SettingsTabs />

      {/* Plan comparison table */}
      <section className="overflow-hidden rounded-2xl border border-border-soft bg-bg-surface">
        <div className="grid grid-cols-3 border-b border-border-soft">
          {/* Feature column header */}
          <div className="p-4" />

          {/* Free plan header */}
          <div
            className={cn(
              "border-l border-border-soft p-4 text-center",
              CURRENT_PLAN === "free" && "border-brand/40 bg-brand/5",
            )}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
              {tBilling("planFree")}
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-fg">
              {tBilling("planFreePrice")}
            </p>
            {CURRENT_PLAN === "free" && (
              <span className="mt-2 inline-block rounded-full border border-brand/40 bg-brand/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand">
                {tBilling("currentPlan")}
              </span>
            )}
          </div>

          {/* Pro plan header */}
          <div
            className={cn(
              "border-l p-4 text-center",
              CURRENT_PLAN === "pro"
                ? "border-brand/40 bg-brand/5"
                : "border-border-soft",
            )}
          >
            <div className="flex items-center justify-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                {tBilling("planPro")}
              </p>
            </div>
            <p className="mt-1 text-2xl font-bold tabular-nums text-fg">
              {tBilling("proPrice")}
            </p>
            {CURRENT_PLAN === "pro" ? (
              <span className="mt-2 inline-block rounded-full border border-brand/40 bg-brand/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand">
                {tBilling("currentPlan")}
              </span>
            ) : (
              <Button
                size="sm"
                onClick={handleSubscribe}
                disabled={subscribed}
                className="mt-2 bg-brand text-brand-fg hover:bg-brand/90"
              >
                <Bell className="h-3.5 w-3.5" />
                {subscribed ? tBilling("notified") : tBilling("proCta")}
              </Button>
            )}
          </div>
        </div>

        {/* Feature rows */}
        {PLAN_FEATURES.map((feature, i) => (
          <div
            key={feature.labelKey}
            className={cn(
              "grid grid-cols-3 border-b border-border-soft last:border-0",
              i % 2 === 1 && "bg-bg-raised/20",
            )}
          >
            <div className="flex items-center px-4 py-3">
              <span className="text-sm text-fg">{tBilling(feature.labelKey)}</span>
            </div>
            <div
              className={cn(
                "flex items-center justify-center border-l border-border-soft px-4 py-3",
                CURRENT_PLAN === "free" && "bg-brand/5",
              )}
            >
              {feature.free ? (
                <Check className="h-4 w-4 text-emerald-400" aria-label="Included" />
              ) : (
                <X className="h-4 w-4 text-fg-dim" aria-label="Not included" />
              )}
            </div>
            <div
              className={cn(
                "flex items-center justify-center border-l px-4 py-3",
                CURRENT_PLAN === "pro" ? "border-brand/40 bg-brand/5" : "border-border-soft",
              )}
            >
              {feature.pro ? (
                <Check className="h-4 w-4 text-emerald-400" aria-label="Included" />
              ) : (
                <X className="h-4 w-4 text-fg-dim" aria-label="Not included" />
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Coming-soon callout */}
      <section className="overflow-hidden rounded-2xl border border-brand/30 bg-gradient-to-br from-bg-surface to-brand/5 px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 rounded-full border border-brand/40 bg-brand/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-brand">
              <Sparkles className="h-3 w-3" />
              {tBilling("comingSoon")}
            </span>
            <p className="max-w-md text-sm text-fg-muted">
              {tBilling("proDescription")}
            </p>
          </div>
          <Button
            onClick={handleSubscribe}
            disabled={subscribed}
            className="bg-brand text-brand-fg hover:bg-brand/90"
          >
            <Bell className="mr-1 h-4 w-4" />
            {subscribed ? tBilling("notified") : tBilling("proCta")}
          </Button>
        </div>
      </section>
    </div>
  );
}
