"use client";

import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Ruleset, Status } from "@/types";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { QualityBar } from "@/components/ui/quality-bar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import { CATEGORY_META } from "@/constants/categories";
import { cn } from "@/lib/utils";
import { formatNumber, formatPrice, formatRelative } from "./format";

interface RulesetRowProps {
  ruleset: Ruleset;
  selected: boolean;
  onToggle: (id: string) => void;
}

const STATUS_STYLES: Record<Status, string> = {
  DRAFT: "bg-zinc-700/60 text-zinc-200 border-zinc-600/60",
  PUBLISHED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  ARCHIVED: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  FLAGGED: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export function RulesetRow({ ruleset, selected, onToggle }: RulesetRowProps) {
  const t = useTranslations("dashboard.rulesets");
  const meta = CATEGORY_META[ruleset.category];

  return (
    <tr
      data-state={selected ? "selected" : undefined}
      className={cn(
        "border-b border-border-soft transition hover:bg-bg-raised/30",
        selected && "bg-brand/5",
      )}
    >
      <td className="w-10 px-4 py-3">
        <Checkbox
          checked={selected}
          onCheckedChange={() => onToggle(ruleset.id)}
          aria-label={`Select ${ruleset.title}`}
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 h-9 w-9 shrink-0 rounded-md border border-border-soft"
            style={{
              backgroundColor: `${meta.color}1f`,
              borderColor: `${meta.color}40`,
            }}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <Link
              href={`/r/${ruleset.slug}`}
              className="block truncate text-sm font-medium text-fg hover:text-brand"
            >
              {ruleset.title}
            </Link>
            <p className="mt-0.5 truncate text-xs text-fg-subtle">
              {meta.label} · /{ruleset.slug}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
            STATUS_STYLES[ruleset.status],
          )}
        >
          {t(`status.${ruleset.status}`)}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex w-24 items-center gap-2">
          <QualityBar score={ruleset.qualityScore} compact />
          <span className="text-xs font-mono tabular-nums text-fg-muted">
            {ruleset.qualityScore}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-sm text-fg">
        {formatNumber(ruleset.downloadCount + ruleset.purchaseCount)}
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-sm">
        {ruleset.price > 0 ? (
          <span className="text-emerald-300">
            {formatPrice(ruleset.price * ruleset.purchaseCount, ruleset.currency)}
          </span>
        ) : (
          <span className="text-fg-subtle">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-xs text-fg-muted">
        {formatRelative(ruleset.updatedAt)}
      </td>
      <td className="w-10 px-4 py-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t("actionsLabel")}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem asChild>
              <Link href={`/r/${ruleset.slug}`}>{t("actionView")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/rulesets/${ruleset.id}/edit`}>
                {t("actionEdit")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/rulesets/${ruleset.id}/analytics`}>
                {t("actionAnalytics")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t("actionUnpublish")}</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              {t("actionDelete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
