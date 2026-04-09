"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface SettingsTabsProps {
  className?: string;
}

const TABS: Array<{ key: string; href: string }> = [
  { key: "profile", href: "/dashboard/settings" },
  { key: "seller", href: "/dashboard/settings/seller" },
  { key: "privacy", href: "/dashboard/settings/privacy" },
  { key: "billing", href: "/dashboard/settings/billing" },
];

export function SettingsTabs({ className }: SettingsTabsProps) {
  const t = useTranslations("dashboard.settings.tabs");
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("ariaLabel")}
      className={cn("border-b border-border-soft", className)}
    >
      <ul className="-mb-px flex flex-wrap items-center gap-1">
        {TABS.map((tab) => {
          const active =
            tab.href === "/dashboard/settings"
              ? pathname === "/dashboard/settings"
              : pathname.startsWith(tab.href);
          return (
            <li key={tab.key}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex items-center border-b-2 px-4 py-2 text-sm font-medium transition",
                  active
                    ? "border-brand text-brand"
                    : "border-transparent text-fg-muted hover:border-border-strong hover:text-fg",
                )}
              >
                {t(tab.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
