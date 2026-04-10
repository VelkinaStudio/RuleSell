"use client";

import { Compass, LayoutDashboard, Search, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/use-session";

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
  matchPrefix: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/browse", icon: Search, labelKey: "browse", matchPrefix: "/browse" },
  { href: "/explore", icon: Compass, labelKey: "explore", matchPrefix: "/explore" },
  { href: "/dashboard/overview", icon: LayoutDashboard, labelKey: "dashboard", matchPrefix: "/dashboard" },
  { href: "/u/me", icon: User, labelKey: "profile", matchPrefix: "/u/" },
];

export function MobileBottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { data } = useSession();
  const user = data?.user;

  // Strip locale prefix for matching
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border-soft bg-bg/95 backdrop-blur md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto flex h-14 max-w-md items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathWithoutLocale.startsWith(item.matchPrefix);
          const Icon = item.icon;

          // Replace /u/me with actual username if logged in
          const href =
            item.href === "/u/me" && user
              ? `/u/${user.username}`
              : item.href;

          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                "flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-1 text-[10px] font-medium transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                isActive
                  ? "text-brand"
                  : "text-fg-subtle hover:text-fg-muted",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5" />
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </div>
      {/* Safe area padding for devices with home indicator */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
