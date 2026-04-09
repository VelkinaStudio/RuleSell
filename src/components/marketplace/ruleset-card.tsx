"use client";

import { Download, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import type { Ruleset } from "@/types";
import { CATEGORY_META } from "@/constants/categories";
import { IconByName } from "@/components/ui/icon-map";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { usePreferredEnvironments } from "@/hooks/use-preferred-environments";

import { formatCount, formatPrice } from "./_format";

interface RulesetCardProps {
  ruleset: Ruleset;
  className?: string;
  compact?: boolean;
}

export function RulesetCard({ ruleset, className, compact }: RulesetCardProps) {
  const t = useTranslations("marketplace.card");
  const { envs: preferred } = usePreferredEnvironments();
  const meta = CATEGORY_META[ruleset.category];

  const matchesUserTools = useMemo(() => {
    if (preferred.length === 0 || !ruleset.variants) return false;
    return ruleset.variants.some((v) =>
      v.environments.some((e) => preferred.includes(e)),
    );
  }, [preferred, ruleset.variants]);

  const priceLabel = ruleset.price === 0 ? t("free") : formatPrice(ruleset.price, ruleset.currency);
  const installs = (ruleset.downloadCount ?? 0) + (ruleset.purchaseCount ?? 0);

  return (
    <Link
      href={`/r/${ruleset.slug}`}
      className={cn(
        "group flex h-full flex-col gap-2.5 rounded-lg border border-border-soft bg-bg-surface transition-colors",
        "hover:border-border-strong hover:bg-bg-surface",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fg/20",
        compact ? "p-3" : "p-3.5",
        className,
      )}
    >
      {/* Title row */}
      <div className="flex items-start gap-2.5">
        <IconByName
          name={meta.icon}
          className="mt-0.5 h-4 w-4 shrink-0 text-fg-muted transition-colors group-hover:text-fg"
        />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-1 text-sm font-medium text-fg">
            {ruleset.title}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-fg-subtle">
            @{ruleset.author.username}
            {ruleset.team && (
              <span className="text-fg-subtle"> · {ruleset.team.name}</span>
            )}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 font-mono text-xs tabular-nums",
            ruleset.price === 0 ? "text-fg-muted" : "text-fg",
          )}
        >
          {priceLabel}
        </span>
      </div>

      {/* Description */}
      <p className="line-clamp-2 text-xs leading-relaxed text-fg-muted">
        {ruleset.description}
      </p>

      {/* Stats row */}
      <div className="mt-auto flex items-center gap-3 pt-0.5 text-[11px] text-fg-subtle">
        <span className="inline-flex items-center gap-1">
          <Star className="h-3 w-3" aria-hidden />
          <span className="font-mono tabular-nums">{ruleset.avgRating.toFixed(1)}</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <Download className="h-3 w-3" aria-hidden />
          <span className="font-mono tabular-nums">{formatCount(installs)}</span>
        </span>
        <span className="font-mono tabular-nums" title="Quality Score (estimated)">
          QS {ruleset.qualityScore}
          <span className="ml-0.5 text-[9px] text-fg-dim">(est.)</span>
        </span>
        {matchesUserTools && (
          <span className="ml-auto text-[10px] text-fg-subtle">
            compatible
          </span>
        )}
      </div>
    </Link>
  );
}
