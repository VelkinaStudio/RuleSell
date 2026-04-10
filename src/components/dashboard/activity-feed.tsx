"use client";

import { useTranslations } from "next-intl";
import {
  Download,
  MessageSquare,
  ShoppingBag,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { formatRelative } from "./format";

export type ActivityKind = "install" | "review" | "purchase" | "follow";

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  href: string;
  at: string; // ISO timestamp
  // Free-form fields used by translation interpolation:
  count?: number;
  target?: string;
  actor?: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
  className?: string;
}

const KIND_META: Record<
  ActivityKind,
  { icon: LucideIcon; color: string; bg: string }
> = {
  install: {
    icon: Download,
    color: "text-emerald-300",
    bg: "bg-emerald-500/10 border border-emerald-500/20",
  },
  review: {
    icon: MessageSquare,
    color: "text-amber-300",
    bg: "bg-amber-500/10 border border-amber-500/20",
  },
  purchase: {
    icon: ShoppingBag,
    color: "text-violet-300",
    bg: "bg-violet-500/10 border border-violet-500/20",
  },
  follow: {
    icon: UserPlus,
    color: "text-sky-300",
    bg: "bg-sky-500/10 border border-sky-500/20",
  },
};

export function ActivityFeed({ items, className }: ActivityFeedProps) {
  const t = useTranslations("dashboard.overview");

  if (items.length === 0) {
    return (
      <section
        className={cn(
          "rounded-xl border border-border-soft bg-bg-surface",
          className,
        )}
      >
        <header className="border-b border-border-soft px-5 py-4">
          <h2 className="text-sm font-semibold text-fg">{t("activityTitle")}</h2>
        </header>
        <div className="p-6">
          <EmptyState
            title={t("activityEmpty")}
            description=""
          />
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "rounded-xl border border-border-soft bg-bg-surface",
        className,
      )}
    >
      <header className="flex items-center justify-between border-b border-border-soft px-5 py-4">
        <h2 className="text-sm font-semibold text-fg">{t("activityTitle")}</h2>
      </header>
      <ul className="divide-y divide-border-soft">
        {items.slice(0, 10).map((item) => {
          const meta = KIND_META[item.kind];
          const Icon = meta.icon;
          const text = renderActivityText(t, item);
          const initials = getInitials(item);
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className="group flex items-start gap-3 px-5 py-3 transition hover:bg-bg-raised/40"
              >
                {/* Avatar / initials circle */}
                <span
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border-soft bg-bg-raised text-[10px] font-semibold uppercase text-fg-muted"
                  aria-hidden="true"
                >
                  {initials}
                </span>
                {/* Action type icon */}
                <span
                  className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                    meta.bg,
                  )}
                  aria-hidden="true"
                >
                  <Icon className={cn("h-3.5 w-3.5", meta.color)} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-fg group-hover:text-fg">{text}</p>
                  <p className="mt-0.5 text-[11px] text-fg-subtle">
                    {formatRelative(item.at)}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function getInitials(item: ActivityItem): string {
  const raw = item.kind === "follow" ? (item.actor ?? "") : (item.target ?? "");
  const words = raw.trim().split(/\s+/);
  if (words.length === 0 || !words[0]) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function renderActivityText(
  t: ReturnType<typeof useTranslations>,
  item: ActivityItem,
): string {
  const target = item.target ?? "";
  switch (item.kind) {
    case "install":
      return t("kindInstall", { count: item.count ?? 0, target });
    case "review":
      return t("kindReview", { target });
    case "purchase":
      return t("kindPurchase", { target });
    case "follow":
      return t("kindFollow", { actor: item.actor ?? "" });
    default:
      return "";
  }
}
