"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import type {
  Category,
  Environment,
  Platform,
  Type,
} from "@/types";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
} from "@/constants/categories";
import {
  ENVIRONMENT_FAMILIES,
  ENVIRONMENT_META,
} from "@/constants/environments";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { IconByName } from "@/components/ui/icon-map";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const PLATFORMS: Platform[] = [
  "CURSOR",
  "VSCODE",
  "OBSIDIAN",
  "N8N",
  "MAKE",
  "CLAUDE",
  "CHATGPT",
  "GEMINI",
  "OTHER",
];

const TYPES: Type[] = ["RULESET", "PROMPT", "WORKFLOW", "AGENT", "BUNDLE", "DATASET"];

export interface FilterValue {
  platform?: Platform;
  type?: Type;
  category?: Category;
  environment?: Environment;
  price?: "free" | "paid";
}

interface FilterSidebarProps {
  value: FilterValue;
  onChange: (next: FilterValue) => void;
  onClear: () => void;
  className?: string;
}

export function FilterSidebar({
  value,
  onChange,
  onClear,
  className,
}: FilterSidebarProps) {
  const t = useTranslations("browse.filters");

  const togglePlatform = (p: Platform) =>
    onChange({ ...value, platform: value.platform === p ? undefined : p });
  const toggleType = (ty: Type) =>
    onChange({ ...value, type: value.type === ty ? undefined : ty });
  const toggleCategory = (c: Category) =>
    onChange({ ...value, category: value.category === c ? undefined : c });
  const toggleEnvironment = (e: Environment) =>
    onChange({ ...value, environment: value.environment === e ? undefined : e });
  const setPrice = (p: "free" | "paid" | "any") =>
    onChange({ ...value, price: p === "any" ? undefined : p });

  const hasFilters =
    value.platform || value.type || value.category || value.environment || value.price;

  return (
    <aside
      aria-label={t("title")}
      className={cn(
        "h-full space-y-6 border-r border-border-soft bg-bg-surface/30 px-5 py-6",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-fg">
          {t("title")}
        </h2>
        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-7 gap-1 text-xs text-fg-muted hover:text-fg"
          >
            <X className="h-3 w-3" />
            {t("clear")}
          </Button>
        )}
      </div>

      {/* Category */}
      <FilterGroup label={t("category")}>
        <div className="space-y-1.5">
          {CATEGORY_ORDER.map((c) => {
            const meta = CATEGORY_META[c];
            const active = value.category === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleCategory(c)}
                aria-pressed={active}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition",
                  active
                    ? "bg-bg-elevated text-fg"
                    : "text-fg-muted hover:bg-bg-elevated/60 hover:text-fg",
                )}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded"
                  style={{
                    backgroundColor: `${meta.color}1c`,
                    color: meta.color,
                  }}
                >
                  <IconByName name={meta.icon} className="h-3 w-3" />
                </span>
                <span className="flex-1">{meta.label}</span>
                {active && (
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      {/* Type */}
      <FilterGroup label={t("type")}>
        <div className="space-y-1.5">
          {TYPES.map((ty) => (
            <CheckboxRow
              key={ty}
              label={titleCase(ty)}
              checked={value.type === ty}
              onChange={() => toggleType(ty)}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Platform */}
      <FilterGroup label={t("platform")}>
        <div className="space-y-1.5">
          {PLATFORMS.map((p) => (
            <CheckboxRow
              key={p}
              label={titleCase(p)}
              checked={value.platform === p}
              onChange={() => togglePlatform(p)}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Environment (grouped) */}
      <FilterGroup label={t("environment")}>
        <div className="space-y-3">
          {(["claude", "editor", "agent", "workflow", "other"] as const).map(
            (family) => (
              <div key={family} className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
                  {family}
                </p>
                {ENVIRONMENT_FAMILIES[family].map((env) => (
                  <CheckboxRow
                    key={env}
                    label={ENVIRONMENT_META[env].label}
                    checked={value.environment === env}
                    onChange={() => toggleEnvironment(env)}
                  />
                ))}
              </div>
            ),
          )}
        </div>
      </FilterGroup>

      {/* Price */}
      <FilterGroup label={t("price")}>
        <RadioGroup
          value={value.price ?? "any"}
          onValueChange={(v) => setPrice(v as "free" | "paid" | "any")}
          className="space-y-1.5"
        >
          {(["any", "free", "paid"] as const).map((opt) => {
            const labelKey =
              opt === "any" ? "anyPrice" : (opt as "free" | "paid");
            return (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-fg-muted transition hover:bg-bg-elevated/60 hover:text-fg"
              >
                <RadioGroupItem value={opt} className="h-3.5 w-3.5" />
                {t(labelKey)}
              </label>
            );
          })}
        </RadioGroup>
      </FilterGroup>
    </aside>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
        {label}
      </h3>
      {children}
    </div>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm text-fg-muted transition hover:text-fg">
      <Checkbox
        checked={checked}
        onCheckedChange={onChange}
        className="h-3.5 w-3.5 rounded"
      />
      <span>{label}</span>
    </label>
  );
}

function titleCase(s: string): string {
  return s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, " ");
}
