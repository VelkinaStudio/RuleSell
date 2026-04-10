"use client";

import { useTranslations } from "next-intl";
import {
  Bookmark,
  DollarSign,
  LayoutDashboard,
  Lock,
  Menu,
  Package,
  Settings,
  Share2,
  ShoppingBag,
  Star,
  Users,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Link, usePathname } from "@/i18n/navigation";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";
import type { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavItem {
  href: string;
  labelKey: string;
  icon: LucideIcon;
  badge?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function SidebarNav({
  items,
  isSeller,
  t,
  pathname,
}: {
  items: NavItem[];
  isSeller: boolean;
  t: ReturnType<typeof useTranslations<"dashboard.nav">>;
  pathname: string;
}) {
  return (
    <nav className="flex flex-col gap-0.5">
      {items.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));
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
            {!isSeller && item.labelKey === "earnings" && (
              <Lock className="ml-auto h-3 w-3 text-fg-subtle" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter({
  user,
  isSeller,
  t,
}: {
  user: User | null;
  isSeller: boolean;
  t: ReturnType<typeof useTranslations<"dashboard.nav">>;
}) {
  if (!user) return null;

  const initials = getInitials(user.name || user.username || "?");
  const persona = isSeller
    ? t("personaSeller")
    : user.builderStats
    ? t("personaBuilder")
    : t("personaUser");

  return (
    <div className="mt-auto rounded-lg border border-border-soft bg-bg-raised p-3">
      <div className="flex items-center gap-2.5">
        <Avatar size="sm" className="shrink-0">
          {user.avatar && (
            <AvatarImage src={user.avatar} alt={user.name || user.username} />
          )}
          <AvatarFallback className="bg-brand/20 text-brand text-[10px] font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-fg">{user.name}</p>
          <p className="truncate text-[11px] text-fg-muted">@{user.username}</p>
        </div>
      </div>
      <p className="mt-2 text-[10px] uppercase tracking-wider text-fg-subtle">
        {persona}
      </p>
    </div>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const t = useTranslations("dashboard.nav");
  const { data, status } = useSession();
  const user = data?.user ?? null;
  const isSeller = user?.sellerStats?.traderVerified === true;

  const items: NavItem[] = [
    { href: "/dashboard/overview", labelKey: "overview", icon: LayoutDashboard },
    { href: "/dashboard/rulesets", labelKey: "rulesets", icon: Package },
    ...(isSeller
      ? [{ href: "/dashboard/earnings", labelKey: "earnings", icon: DollarSign }]
      : []),
    { href: "/dashboard/affiliates", labelKey: "affiliates", icon: Share2 },
    { href: "/dashboard/purchases", labelKey: "purchases", icon: ShoppingBag },
    { href: "/dashboard/saved", labelKey: "saved", icon: Bookmark },
    { href: "/dashboard/following", labelKey: "following", icon: Users },
    { href: "/dashboard/reviews", labelKey: "reviews", icon: Star },
    { href: "/dashboard/team", labelKey: "team", icon: UsersRound },
    { href: "/dashboard/settings", labelKey: "settings", icon: Settings },
  ];

  const navProps = { items, isSeller, t, pathname };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 border-r border-border-soft bg-bg-surface/40 lg:block"
        aria-label={t("ariaLabel")}
      >
        <div className="flex h-full flex-col gap-2 p-4">
          <div className="px-2 pb-2 pt-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
              {t("sectionLabel")}
            </p>
          </div>

          <SidebarNav {...navProps} />

          {status === "authenticated" && (
            <SidebarFooter user={user} isSeller={isSeller} t={t} />
          )}
        </div>
      </aside>

      {/* Mobile hamburger + slide-out drawer */}
      <div className="fixed bottom-4 left-4 z-40 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label={t("mobileMenuLabel")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border-soft bg-bg-surface shadow-lg backdrop-blur transition hover:bg-bg-raised"
            >
              <Menu className="h-5 w-5 text-fg-muted" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            showCloseButton={true}
            className="flex w-64 flex-col gap-0 border-r border-border-soft bg-bg-surface p-0"
          >
            <div className="flex flex-col gap-2 p-4 pt-12">
              <div className="px-2 pb-2 pt-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
                  {t("sectionLabel")}
                </p>
              </div>

              <SidebarNav {...navProps} />

              {status === "authenticated" && (
                <SidebarFooter user={user} isSeller={isSeller} t={t} />
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
