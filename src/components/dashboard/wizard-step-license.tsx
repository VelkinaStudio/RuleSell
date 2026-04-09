"use client";

import { useTranslations } from "next-intl";

import { LicenseWarning } from "@/components/compliance/license-warning";
import { Label } from "@/components/ui/label";
import { ENVIRONMENT_META } from "@/constants/environments";
import type { Environment } from "@/types";
import { cn } from "@/lib/utils";
import type { WizardDraft } from "@/hooks/use-publish-draft";
import { LICENSES } from "./licenses";

interface Props {
  draft: WizardDraft;
  onChange: (patch: WizardDraft) => void;
}

export function WizardStepLicense({ draft, onChange }: Props) {
  const t = useTranslations("publishWizard.license");

  // Pull the union of environments declared by all variants. This drives
  // the compatibility matrix display — we don't ask the publisher to
  // re-enter them, just confirm they look right.
  const envs: Environment[] = Array.from(
    new Set(
      (draft.variants ?? []).flatMap((v) => v.environments),
    ),
  );

  // Decide which intent to pass to LicenseWarning based on the current
  // pricing intent: if the publisher already set a paid price in step 5,
  // we want the publish_paid classifier so non-commercial licenses surface
  // as a danger/blocker. Otherwise neutral classification.
  const warningIntent =
    (draft.price ?? 0) > 0 ? "publish_paid" : "view";

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight text-fg">
          {t("title")}
        </h2>
        <p className="mt-1 text-sm text-fg-muted">{t("description")}</p>
      </header>

      <section className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          {t("licenseLabel")}
        </Label>
        <div className="space-y-2">
          {LICENSES.map((lic) => {
            const active = draft.license === lic.spdx;
            return (
              <button
                key={lic.spdx}
                type="button"
                onClick={() => onChange({ license: lic.spdx })}
                aria-pressed={active}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                  active
                    ? "border-brand bg-brand/10"
                    : "border-border-soft bg-bg-raised/40 hover:border-border-strong",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                    active ? "border-brand" : "border-border-strong",
                  )}
                >
                  {active && <span className="h-2 w-2 rounded-full bg-brand" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-fg">{lic.name}</span>
                    <span className="rounded-full bg-bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-fg-muted">
                      {lic.spdx}
                    </span>
                    {lic.commercial ? (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                        {t("commercial")}
                      </span>
                    ) : (
                      <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-medium text-rose-300">
                        {t("nonCommercial")}
                      </span>
                    )}
                    {lic.copyleft && (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                        {t("shareAlike")}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-fg-muted">{lic.summary}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            {t("compatTitle")}
          </Label>
          <p className="mt-1 text-[11px] text-fg-subtle">{t("compatHint")}</p>
        </div>
        {envs.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {envs.map((env) => (
              <span
                key={env}
                className="inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-bg-raised/40 px-3 py-1 text-xs text-fg-muted"
              >
                {ENVIRONMENT_META[env]?.label ?? env}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-fg-subtle">
            Add at least one variant in step 3 to populate the matrix.
          </p>
        )}
      </section>

      {draft.license && (
        <LicenseWarning license={draft.license} intent={warningIntent} />
      )}
    </div>
  );
}
