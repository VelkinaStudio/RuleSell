"use client";

import { Bell, MessageCircle, Package, Star, TrendingUp, UserPlus } from "lucide-react";
import { useState } from "react";

import type { NotificationKind } from "@/types";
import { MOCK_NOTIFICATIONS } from "@/constants/mock-notifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/utils";
import { useSession } from "@/hooks/use-session";

const KIND_ICON: Record<NotificationKind, typeof Bell> = {
  reply: MessageCircle,
  publish: Package,
  milestone: TrendingUp,
  update: Star,
  follow: UserPlus,
};

export function NotificationBell() {
  const { data } = useSession();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unread = notifications.filter((n) => !n.read).length;

  // Hide entirely for unauthenticated users
  if (!data.user) return null;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative inline-flex h-8 w-8 items-center justify-center rounded-md text-fg-muted transition hover:text-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fg/20">
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-brand-fg">
            {unread}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border-soft px-3 py-2">
          <span className="text-xs font-semibold text-fg">Notifications</span>
          {unread > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="text-[10px] text-fg-muted hover:text-fg"
            >
              Mark all read
            </button>
          )}
        </div>
        {notifications.length === 0 ? (
          <div className="px-3 py-6 text-center text-xs text-fg-muted">
            No notifications yet
          </div>
        ) : (
          notifications.map((n) => {
            const Icon = KIND_ICON[n.kind];
            return (
              <DropdownMenuItem key={n.id} asChild className="cursor-pointer">
                <Link
                  href={n.href}
                  className={cn(
                    "flex items-start gap-2.5 px-3 py-2.5",
                    !n.read && "bg-bg-surface",
                  )}
                >
                  <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-fg-subtle" />
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-xs", n.read ? "text-fg-muted" : "text-fg font-medium")}>
                      {n.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[11px] text-fg-subtle">
                      {n.body}
                    </p>
                    <p className="mt-1 text-[10px] text-fg-dim">
                      {formatRelative(n.createdAt)}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                  )}
                </Link>
              </DropdownMenuItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
