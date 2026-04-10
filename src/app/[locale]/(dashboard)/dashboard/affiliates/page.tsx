"use client";

import { useState } from "react";
import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Link2,
  Megaphone,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { EarningsOverview } from "@/components/affiliate/earnings-overview";
import { TierProgress } from "@/components/affiliate/tier-progress";
import { ClickChart } from "@/components/affiliate/click-chart";
import { LinkGenerator } from "@/components/affiliate/link-generator";
import { LinkTable } from "@/components/affiliate/link-table";
import { ConversionTable } from "@/components/affiliate/conversion-table";
import { PayoutHistory } from "@/components/affiliate/payout-history";
import { PerformanceByAsset } from "@/components/affiliate/performance-by-asset";
import { PromotionalMaterials } from "@/components/affiliate/promotional-materials";
import { EmbedWidgetPreview } from "@/components/affiliate/embed-widget-preview";

const TABS = [
  { key: "overview" as const, icon: LayoutDashboard },
  { key: "links" as const, icon: Link2 },
  { key: "analytics" as const, icon: BarChart3 },
  { key: "payouts" as const, icon: CreditCard },
  { key: "materials" as const, icon: Megaphone },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function AffiliateDashboardPage() {
  const t = useTranslations("dashboard.affiliates");
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-fg">{t("title")}</h1>
        <p className="mt-1 text-sm text-fg-muted">{t("subtitle")}</p>
      </header>

      {/* Tab navigation */}
      <nav
        aria-label={t("tabsAriaLabel")}
        className="border-b border-border-soft"
      >
        <ul className="-mb-px flex flex-wrap items-center gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <li key={tab.key}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "inline-flex items-center gap-1.5 border-b-2 px-4 py-2 text-sm font-medium transition",
                    active
                      ? "border-brand text-brand"
                      : "border-transparent text-fg-muted hover:border-border-strong hover:text-fg",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t(`tab_${tab.key}`)}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Tab panels */}
      <div role="tabpanel">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <EarningsOverview />
            <TierProgress />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ClickChart period={30} />
              <PerformanceByAsset />
            </div>
          </div>
        )}

        {activeTab === "links" && (
          <div className="space-y-6">
            <LinkGenerator />
            <LinkTable />
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            <ClickChart period={90} className="w-full" />
            <ConversionTable />
          </div>
        )}

        {activeTab === "payouts" && (
          <div className="space-y-6">
            <PayoutHistory />
          </div>
        )}

        {activeTab === "materials" && (
          <div className="space-y-6">
            <PromotionalMaterials />
            <EmbedWidgetPreview />
          </div>
        )}
      </div>
    </div>
  );
}
