"use client";

import { AlertTriangle, ExternalLink, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Ruleset } from "@/types";
import { cn } from "@/lib/utils";

interface LicenseCalloutProps {
  ruleset: Ruleset;
}

function isCommercialFriendly(license: string): boolean {
  const id = license.toUpperCase();
  if (id.includes("CC-BY-NC")) return false;
  if (id === "GPL-3.0" || id === "AGPL-3.0") return false;
  return true;
}

function requiresAttribution(license: string): boolean {
  const id = license.toUpperCase();
  return (
    id === "MIT" ||
    id === "APACHE-2.0" ||
    id === "BSD-3-CLAUSE" ||
    id.includes("CC-BY")
  );
}

export function LicenseCallout({ ruleset }: LicenseCalloutProps) {
  const t = useTranslations("ruleset.about");
  const commercial = isCommercialFriendly(ruleset.license);
  const attribution = requiresAttribution(ruleset.license);
  const isWarning = !commercial && ruleset.price > 0;

  return (
    <section
      className={cn(
        "flex items-start gap-3 rounded-2xl border p-5",
        isWarning
          ? "border-warning/30 bg-warning/5"
          : "border-border-soft bg-bg-surface",
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          isWarning
            ? "bg-warning/15 text-warning"
            : "bg-bg-elevated text-fg-muted",
        )}
        aria-hidden
      >
        {isWarning ? (
          <AlertTriangle className="h-4 w-4" />
        ) : (
          <FileText className="h-4 w-4" />
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-baseline gap-2">
          <h2 className="text-sm font-semibold text-fg">{t("license")}</h2>
          <code className="font-mono text-xs text-fg-muted">{ruleset.license}</code>
        </div>
        <ul className="space-y-1 text-xs text-fg-muted">
          <li>
            {commercial ? "✓ " : "⚠ "}
            {commercial ? t("commercial") : t("nonCommercial")}
          </li>
          {attribution && <li>✓ {t("attribution")}</li>}
        </ul>
        <a
          href={`https://spdx.org/licenses/${ruleset.license}.html`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:text-brand-soft"
        >
          {t("viewLicense")}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </section>
  );
}
