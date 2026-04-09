"use client";

import { useTranslations } from "next-intl";

import type { Ruleset } from "@/types";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { RulesetCard } from "./ruleset-card";

interface ShelfProps {
  title: string;
  rulesets: Ruleset[];
  href: string;
  className?: string;
}

export function Shelf({
  title,
  rulesets,
  href,
  className,
}: ShelfProps) {
  const t = useTranslations("marketplace.shelf");

  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-lg font-semibold text-fg">{title}</h2>
        <Link
          href={href}
          className="shrink-0 text-sm text-fg-muted transition hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          {t("seeAll")} &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rulesets.slice(0, 8).map((r) => (
          <RulesetCard key={r.id} ruleset={r} compact />
        ))}
      </div>
    </section>
  );
}
