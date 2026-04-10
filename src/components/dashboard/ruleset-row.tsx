"use client";

import { BarChart2, EyeOff, MoreHorizontal, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Ruleset, Status } from "@/types";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

function qualityGrade(score: number): { letter: string; classes: string } {
  if (score >= 85) return { letter: "A", classes: "text-qs-a bg-qs-a/15 border-qs-a/30" };
  if (score >= 70) return { letter: "B", classes: "text-qs-b bg-qs-b/15 border-qs-b/30" };
  if (score >= 50) return { letter: "C", classes: "text-qs-c bg-qs-c/15 border-qs-c/30" };
  return { letter: "—", classes: "text-fg-muted bg-bg-raised border-border-soft" };
}

interface RulesetRowProps {
  ruleset: Ruleset;
  selected: boolean;
  onToggle: (id: string) => void;
}

const STATUS_STYLES: Record<Status, string> = {
  DRAFT: "bg-warning/15 text-warning border-warning/30",
  PUBLISHED: "bg-success/15 text-success border-success/30",
  ARCHIVED: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  FLAGGED: "bg-danger/15 text-danger border-danger/30",
};

export function RulesetRow({ ruleset, selected, onToggle }: RulesetRowProps) {
  const t = useTranslations("dashboard.rulesets");
  const meta = CATEGORY_META[ruleset.category] ?? { label: ruleset.category ?? "Other", slug: ruleset.category ?? "other", color: "#6b7280", accent: "gray", icon: "Package", description: "" };

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
        {ruleset.qualityScore > 0 ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-xs font-semibold tabular-nums",
              qualityGrade(ruleset.qualityScore).classes,
            )}
          >
            {qualityGrade(ruleset.qualityScore).letter}{" "}
            {ruleset.qualityScore}
          </span>
        ) : (
          <span className="text-xs text-fg-subtle">—</span>
        )}
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
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            asChild
            variant="ghost"
            size="icon-sm"
            aria-label={t("actionEdit")}
          >
            <Link href={`/dashboard/rulesets/${ruleset.id}/edit`}>
              <Pencil className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon-sm"
            aria-label={t("actionAnalytics")}
          >
            <Link href={`/dashboard/rulesets/${ruleset.id}/analytics`}>
              <BarChart2 className="h-3.5 w-3.5" />
            </Link>
          </Button>
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
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <EyeOff className="mr-2 h-3.5 w-3.5" />
                {t("actionUnpublish")}
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                {t("actionDelete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
}
