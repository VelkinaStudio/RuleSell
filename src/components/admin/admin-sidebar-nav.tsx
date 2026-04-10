"use client";

import { useTranslations } from "next-intl";
import {
  BarChart3,
  Flag,
  LayoutDashboard,
  MessageSquareWarning,
  ScanSearch,
  Shield,
  ToggleRight,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface AdminNavItem {
  href: string;
  labelKey: string;
  icon: LucideIcon;
}

const ADMIN_NAV: AdminNavItem[] = [
  { href: "/dashboard/admin/overview", labelKey: "overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", labelKey: "users", icon: Users },
  { href: "/dashboard/admin/moderation", labelKey: "moderation", icon: Shield },
  { href: "/dashboard/admin/reports", labelKey: "reports", icon: MessageSquareWarning },
  { href: "/dashboard/admin/revenue", labelKey: "revenue", icon: BarChart3 },
  { href: "/dashboard/admin/scanning", labelKey: "scanning", icon: ScanSearch },
  { href: "/dashboard/admin/flags", labelKey: "flags", icon: ToggleRight },
];

export function AdminSidebarNav() {
  const pathname = usePathname();
  const t = useTranslations("admin.nav");

  return (
    <nav className="flex flex-col gap-0.5">
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
        {t("sectionLabel")}
      </p>
      {ADMIN_NAV.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
              active
                ? "bg-brand/15 text-brand"
                : "text-fg-muted hover:bg-bg-raised hover:text-fg",
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 shrink-0 transition",
                active ? "text-brand" : "text-fg-muted group-hover:text-fg",
              )}
            />
            <span className="truncate">{t(item.labelKey)}</span>
            {item.labelKey === "reports" && (
              <Flag className="ml-auto h-3 w-3 text-danger" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
