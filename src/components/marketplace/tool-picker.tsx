"use client";

import { Check, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import {
  ENVIRONMENT_META,
  ENVIRONMENT_ORDER,
  PRIMARY_ENVIRONMENTS,
} from "@/constants/environments";
import { IconByName } from "@/components/ui/icon-map";
import { cn } from "@/lib/utils";
import { usePreferredEnvironments } from "@/hooks/use-preferred-environments";

interface ToolPickerProps {
  className?: string;
  withLabel?: boolean;
}

export function ToolPicker({ className, withLabel = true }: ToolPickerProps) {
  const t = useTranslations("marketplace.toolPicker");
  const { envs, toggle } = usePreferredEnvironments();
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? ENVIRONMENT_ORDER : PRIMARY_ENVIRONMENTS;

  return (
    <div className={cn("w-full", className)}>
      {withLabel && (
        <p className="mb-2 text-xs text-fg-subtle">{t("label")}</p>
      )}
      <div
        role="group"
        aria-label={t("label")}
        className="flex flex-wrap items-center gap-1.5"
      >
        {visible.map((env) => {
          const meta = ENVIRONMENT_META[env];
          const active = envs.includes(env);
          return (
            <button
              key={env}
              type="button"
              aria-pressed={active}
              aria-label={`${active ? t("remove") : t("add")}: ${meta.label}`}
              onClick={() => toggle(env)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fg/20",
                active
                  ? "border-fg/20 bg-fg/5 text-fg"
                  : "border-border-soft bg-transparent text-fg-subtle hover:border-border-strong hover:text-fg-muted",
              )}
            >
              <IconByName name={meta.icon} className="h-3 w-3" />
              <span>{meta.label}</span>
              {active && <Check className="h-2.5 w-2.5" />}
            </button>
          );
        })}
        {!showAll && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-1 rounded-md border border-dashed border-border-soft px-2.5 py-1.5 text-xs text-fg-subtle transition hover:border-border-strong hover:text-fg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fg/20"
          >
            <Plus className="h-3 w-3" />
            {t("seeAll")}
          </button>
        )}
      </div>
    </div>
  );
}
