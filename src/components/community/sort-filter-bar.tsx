"use client";

import { Filter, Flame, ArrowUpDown, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

interface SortFilterBarProps {
  sort: string;
  onSortChange: (sort: string) => void;
  sortOptions?: { key: string; labelKey: string }[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: { key: string; labelKey: string }[];
  filterLabel?: string;
}

const SORT_ICONS: Record<string, typeof Flame> = {
  hot: Flame,
  new: ArrowUpDown,
  top: TrendingUp,
};

const DEFAULT_SORT_OPTIONS = [
  { key: "hot", labelKey: "hot" },
  { key: "new", labelKey: "new" },
  { key: "top", labelKey: "top" },
];

export function SortFilterBar({
  sort,
  onSortChange,
  sortOptions = DEFAULT_SORT_OPTIONS,
  filterValue,
  onFilterChange,
  filterOptions,
  filterLabel,
}: SortFilterBarProps) {
  const t = useTranslations("community.sorting");
  const tFilters = useTranslations("community.filters");

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Sort buttons */}
      <div className="flex items-center gap-1 rounded-lg border border-border-soft p-0.5">
        {sortOptions.map(({ key, labelKey }) => {
          const Icon = SORT_ICONS[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSortChange(key)}
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition",
                sort === key
                  ? "bg-fg/5 text-fg"
                  : "text-fg-subtle hover:text-fg-muted",
              )}
            >
              {Icon && <Icon className="h-3 w-3" />}
              {t(labelKey)}
            </button>
          );
        })}
      </div>

      {/* Filter dropdown */}
      {filterOptions && onFilterChange && (
        <div className="flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-fg-dim" />
          {filterLabel && (
            <span className="text-xs text-fg-dim">{filterLabel}</span>
          )}
          <select
            value={filterValue ?? "all"}
            onChange={(e) => onFilterChange(e.target.value)}
            className={cn(
              "rounded-md border border-border-soft bg-bg-surface px-2 py-1 text-xs text-fg",
              "focus:border-brand/40 focus:outline-none focus:ring-1 focus:ring-brand/20",
            )}
          >
            <option value="all">{tFilters("all")}</option>
            {filterOptions.map(({ key, labelKey }) => (
              <option key={key} value={key}>
                {tFilters(labelKey)}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
