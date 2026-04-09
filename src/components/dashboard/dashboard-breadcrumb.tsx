"use client";

import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";

// Map a path segment to a translation key in the dashboard.crumbs namespace.
// Unknown segments fall back to a humanized version of the slug.
const SEGMENT_KEYS: Record<string, string> = {
  dashboard: "dashboard",
  overview: "overview",
  rulesets: "rulesets",
  earnings: "earnings",
  purchases: "purchases",
  saved: "saved",
  following: "following",
  reviews: "reviews",
  team: "team",
  settings: "settings",
  seller: "seller",
  privacy: "privacy",
  billing: "billing",
  new: "new",
  edit: "edit",
  analytics: "analytics",
};

function humanize(segment: string): string {
  return segment
    .replace(/-/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const t = useTranslations("dashboard.crumbs");

  // Strip a leading "/" then split into non-empty segments.
  const segments = pathname.replace(/^\/+/, "").split("/").filter(Boolean);

  if (segments.length === 0) return null;

  // Build cumulative href for each segment so we can render real links.
  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const key = SEGMENT_KEYS[seg];
    let label: string;
    if (key) {
      try {
        label = t(key);
      } catch {
        label = humanize(seg);
      }
    } else {
      label = humanize(seg);
    }
    return { href, label, isLast: i === segments.length - 1 };
  });

  return (
    <nav
      aria-label={t("ariaLabel")}
      className="border-b border-border-soft bg-bg-surface/60 px-6 py-3 backdrop-blur"
    >
      <ol className="flex flex-wrap items-center gap-1 text-xs text-fg-muted">
        {crumbs.map((crumb, i) => (
          <li key={crumb.href} className="flex items-center gap-1">
            {i > 0 && (
              <ChevronRight
                className="h-3 w-3 text-fg-subtle"
                aria-hidden="true"
              />
            )}
            {crumb.isLast ? (
              <span
                aria-current="page"
                className="font-medium text-fg"
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="rounded transition hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
