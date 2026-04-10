"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

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
  const reduce = useReducedMotion();

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

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

  // Active counts per group
  const counts: Record<string, number> = {
    category: value.category ? 1 : 0,
    type: value.type ? 1 : 0,
    platform: value.platform ? 1 : 0,
    environment: value.environment ? 1 : 0,
    price: value.price ? 1 : 0,
  };

  return (
    <aside
      aria-label={t("title")}
      className={cn(
        "h-full space-y-4 border-r border-border-soft bg-bg-surface/30 px-5 py-6",
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
      <CollapsibleFilterGroup
        label={t("category")}
        groupKey="category"
        activeCount={counts.category}
        collapsed={!!collapsed.category}
        onToggle={() => toggleSection("category")}
        reduce={reduce ?? false}
      >
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
                    ? "text-[var(--cat-color)] ring-1 ring-[var(--cat-color)]/30"
                    : "text-fg-muted hover:bg-bg-elevated/60 hover:text-fg",
                )}
                style={
                  active
                    ? ({
                        "--cat-color": meta.color,
                        backgroundColor: `${meta.color}1a`,
                      } as React.CSSProperties)
                    : ({ "--cat-color": meta.color } as React.CSSProperties)
                }
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
      </CollapsibleFilterGroup>

      {/* Type */}
      <CollapsibleFilterGroup
        label={t("type")}
        groupKey="type"
        activeCount={counts.type}
        collapsed={!!collapsed.type}
        onToggle={() => toggleSection("type")}
        reduce={reduce ?? false}
      >
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
      </CollapsibleFilterGroup>

      {/* Platform */}
      <CollapsibleFilterGroup
        label={t("platform")}
        groupKey="platform"
        activeCount={counts.platform}
        collapsed={!!collapsed.platform}
        onToggle={() => toggleSection("platform")}
        reduce={reduce ?? false}
      >
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
      </CollapsibleFilterGroup>

      {/* Environment (grouped) */}
      <CollapsibleFilterGroup
        label={t("environment")}
        groupKey="environment"
        activeCount={counts.environment}
        collapsed={!!collapsed.environment}
        onToggle={() => toggleSection("environment")}
        reduce={reduce ?? false}
      >
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
      </CollapsibleFilterGroup>

      {/* Price */}
      <CollapsibleFilterGroup
        label={t("price")}
        groupKey="price"
        activeCount={counts.price}
        collapsed={!!collapsed.price}
        onToggle={() => toggleSection("price")}
        reduce={reduce ?? false}
      >
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
      </CollapsibleFilterGroup>
    </aside>
  );
}

const contentVariants = {
  open: { height: "auto", opacity: 1 },
  closed: { height: 0, opacity: 0 },
};

function CollapsibleFilterGroup({
  label,
  groupKey,
  activeCount,
  collapsed,
  onToggle,
  reduce,
  children,
}: {
  label: string;
  groupKey: string;
  activeCount: number;
  collapsed: boolean;
  onToggle: () => void;
  reduce: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-1 text-left"
        aria-expanded={!collapsed}
        aria-controls={`filter-group-${groupKey}`}
      >
        <span className="flex items-center gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            {label}
          </span>
          {activeCount > 0 && (
            <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand/15 px-1 text-[10px] font-semibold tabular-nums text-brand">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-fg-subtle transition-transform duration-200",
            collapsed && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {reduce ? (
        !collapsed && (
          <div id={`filter-group-${groupKey}`}>
            {children}
          </div>
        )
      ) : (
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              id={`filter-group-${groupKey}`}
              key={groupKey}
              variants={contentVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      )}
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
