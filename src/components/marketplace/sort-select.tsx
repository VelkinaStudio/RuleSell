"use client";

import { useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RulesetSort } from "@/lib/api/types";

interface SortSelectProps {
  value: RulesetSort;
  onChange: (next: RulesetSort) => void;
}

const ORDER: RulesetSort[] = [
  "quality",
  "popular",
  "recent",
  "price_asc",
  "price_desc",
];

export function SortSelect({ value, onChange }: SortSelectProps) {
  const t = useTranslations("browse.sort");
  const labels: Record<RulesetSort, string> = {
    quality: t("quality"),
    popular: t("popular"),
    recent: t("recent"),
    price_asc: t("priceAsc"),
    price_desc: t("priceDesc"),
  };
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
        {t("label")}
      </span>
      <Select value={value} onValueChange={(v) => onChange(v as RulesetSort)}>
        <SelectTrigger className="h-9 w-44 border-border-soft bg-bg-surface text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ORDER.map((sort) => (
            <SelectItem key={sort} value={sort}>
              {labels[sort]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
