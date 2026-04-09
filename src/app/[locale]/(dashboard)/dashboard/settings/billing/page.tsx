"use client";

import { useState } from "react";
import { Bell, Check, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { SettingsTabs } from "@/components/dashboard/settings-tabs";

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

      <section className="overflow-hidden rounded-2xl border border-brand/30 bg-gradient-to-br from-bg-surface to-brand/5 p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-brand/40 bg-brand/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-brand">
              <Sparkles className="h-3 w-3" />
              {tBilling("comingSoon")}
            </span>
            <h2 className="text-2xl font-semibold text-fg">
              {tBilling("proTitle")}
            </h2>
            <p className="text-3xl font-bold tabular-nums text-brand">
              {tBilling("proPrice")}
            </p>
            <p className="max-w-md text-sm text-fg-muted">
              {tBilling("proDescription")}
            </p>
          </div>

          <div>
            <Button
              onClick={handleSubscribe}
              disabled={subscribed}
              className="bg-brand text-brand-fg hover:bg-brand/90"
            >
              <Bell className="mr-1 h-4 w-4" />
              {subscribed ? tBilling("proSubscribed") : tBilling("proCta")}
            </Button>
          </div>
        </div>

        <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {(["private", "history", "filters", "early"] as const).map((key) => (
            <li
              key={key}
              className="flex items-center gap-2 rounded-md border border-border-soft bg-bg-raised/40 px-3 py-2 text-sm text-fg"
            >
              <Check className="h-3.5 w-3.5 text-emerald-300" />
              {tBilling(`proFeatures.${key}`)}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
