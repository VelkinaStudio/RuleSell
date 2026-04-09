"use client";

import { useTranslations } from "next-intl";

import type { RulesetTab } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface TabBarProps {
  /** undefined = "All" tab. */
  value: RulesetTab | undefined;
  onChange: (tab: RulesetTab | undefined) => void;
  className?: string;
}

const ORDER: (RulesetTab | undefined)[] = [
  undefined,
  "trending",
  "new",
  "top",
  "editors",
];

export function TabBar({ value, onChange, className }: TabBarProps) {
  const t = useTranslations("browse.tabs");
  const tBar = useTranslations("browse.tabBar");
  const labels: Record<string, string> = {
    all: t("all"),
    trending: t("trending"),
    new: t("new"),
    top: t("top"),
    editors: t("editors"),
  };

  return (
    <div
      role="tablist"
      aria-label={tBar("label")}
      className={cn(
        "flex flex-wrap items-center gap-1 border-b border-border-soft",
        className,
      )}
    >
      {ORDER.map((tab) => {
        const key = tab ?? "all";
        const active = value === tab;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab)}
            className={cn(
              "relative -mb-px inline-flex h-10 items-center px-4 text-sm font-medium transition",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              active
                ? "text-brand"
                : "text-fg-muted hover:text-fg",
            )}
          >
            {labels[key]}
            {active && (
              <span
                aria-hidden
                className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
