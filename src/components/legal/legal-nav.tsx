"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const LEGAL_LINKS = [
  { href: "/legal/terms", key: "terms" },
  { href: "/legal/privacy", key: "privacy" },
  { href: "/legal/cookies", key: "cookies" },
  { href: "/legal/acceptable-use", key: "acceptableUse" },
  { href: "/legal/dmca", key: "dmca" },
  { href: "/legal/creator-agreement", key: "creatorAgreement" },
  { href: "/legal/accessibility", key: "accessibility" },
  { href: "/legal/transparency", key: "transparency" },
] as const;

export function LegalNav() {
  const t = useTranslations("legal.nav");
  const tLegal = useTranslations("legal");
  const pathname = usePathname();

  return (
    <nav aria-label={tLegal("navTitle")} className="space-y-1">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
        {tLegal("navTitle")}
      </p>
      <ul className="space-y-0.5">
        {LEGAL_LINKS.map((link) => {
          const active = pathname?.startsWith(link.href) ?? false;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block rounded-r-md py-2 pl-3 pr-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                  active
                    ? "border-l-2 border-brand bg-brand/10 pl-[calc(0.75rem-2px)] font-medium text-brand"
                    : "border-l-2 border-transparent text-fg-muted hover:border-border-soft hover:bg-bg-raised hover:text-fg",
                )}
              >
                {t(link.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
