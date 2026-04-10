"use client";

import { useTranslations } from "next-intl";
import { useAdminFlags } from "@/hooks/use-admin-flags";
import { Switch } from "@/components/ui/switch";
import { formatRelative } from "@/lib/utils";

export function AdminFeatureFlagList() {
  const { flags, toggle } = useAdminFlags();
  const t = useTranslations("admin.flags");

  return (
    <div className="space-y-3">
      {flags.map((flag) => (
        <div
          key={flag.id}
          className="flex items-center justify-between gap-4 rounded-xl border border-border-soft bg-bg-surface p-4 transition hover:border-border-strong"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm font-semibold text-fg">{flag.name}</p>
            </div>
            <p className="mt-0.5 text-sm text-fg-muted">{flag.description}</p>
            <p className="mt-1 text-xs text-fg-subtle">
              {t("lastUpdated")}: {formatRelative(flag.updatedAt)}
            </p>
          </div>
          <Switch
            checked={flag.enabled}
            onCheckedChange={() => toggle(flag.id)}
            aria-label={`${t("toggle")} ${flag.name}`}
          />
        </div>
      ))}
    </div>
  );
}
