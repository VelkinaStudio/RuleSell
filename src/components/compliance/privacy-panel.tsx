"use client";

import {
  AlertTriangle,
  Cookie,
  Download,
  Edit3,
  Globe2,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  resetCookieConsent,
  useCookieConsent,
  useGpcHonored,
} from "@/hooks/use-cookie-consent";

import { CorrectionDialog } from "./correction-dialog";
import { DeletionDialog } from "./deletion-dialog";
import { DsrExportDialog } from "./dsr-export-dialog";

interface PrivacyPanelProps {
  user: {
    username: string;
    name: string;
    email: string;
    countryOfResidence: string;
  };
}

/**
 * Drop-in compliance panel for /dashboard/settings/privacy.
 *
 * Organised into three clearly-separated GDPR/CCPA control areas:
 *   1. Data export (Art. 20)
 *   2. Account deletion (Art. 17) — visually distinguished as destructive
 *   3. Consent management — cookie toggles + GPC signal
 *
 * Lives in components/compliance so it can be mounted by either the
 * dashboard builder or the compliance builder without rewiring.
 */
export function PrivacyPanel({ user }: PrivacyPanelProps) {
  const tPrivacy = useTranslations("dashboard.settings.privacy");
  const tCookie = useTranslations("cookie");
  const { consent } = useCookieConsent();
  const gpcHonored = useGpcHonored();

  return (
    <div className="space-y-5">
      {/* ── 1. Data export ─────────────────────────────────────────────── */}
      <section
        aria-labelledby="gdpr-export-heading"
        className="rounded-xl border border-border-soft bg-bg-surface p-5"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-raised">
              <Download className="h-4 w-4 text-fg-muted" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="gdpr-export-heading"
                className="text-sm font-semibold text-fg"
              >
                {tPrivacy("exportTitle")}
              </h2>
              <p className="mt-0.5 max-w-sm text-xs leading-relaxed text-fg-muted">
                {tPrivacy("exportDescription")}
              </p>
            </div>
          </div>
          <DsrExportDialog
            username={user.username}
            trigger={
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" aria-hidden="true" />
                {tPrivacy("exportData")}
              </Button>
            }
          />
        </div>
      </section>

      {/* ── 2. Correct my data ─────────────────────────────────────────── */}
      <section
        aria-labelledby="gdpr-correct-heading"
        className="rounded-xl border border-border-soft bg-bg-surface p-5"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-raised">
              <Edit3 className="h-4 w-4 text-fg-muted" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="gdpr-correct-heading"
                className="text-sm font-semibold text-fg"
              >
                {tPrivacy("correctTitle")}
              </h2>
              <p className="mt-0.5 max-w-sm text-xs leading-relaxed text-fg-muted">
                {tPrivacy("correctDescription")}
              </p>
            </div>
          </div>
          <CorrectionDialog
            initial={{
              name: user.name,
              email: user.email,
              country: user.countryOfResidence,
            }}
          />
        </div>
      </section>

      {/* ── 3. Account deletion ────────────────────────────────────────── */}
      <section
        aria-labelledby="gdpr-delete-heading"
        className="rounded-xl border border-danger/30 bg-danger/5 p-5"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger/10">
              <AlertTriangle
                className="h-4 w-4 text-danger"
                aria-hidden="true"
              />
            </div>
            <div>
              <h2
                id="gdpr-delete-heading"
                className="text-sm font-semibold text-danger"
              >
                {tPrivacy("deleteTitle")}
              </h2>
              <p className="mt-0.5 max-w-sm text-xs leading-relaxed text-danger/70">
                {tPrivacy("deleteDescription")}
              </p>
            </div>
          </div>
          <DeletionDialog username={user.username} />
        </div>
      </section>

      {/* ── 4. Consent management ──────────────────────────────────────── */}
      <section
        aria-labelledby="consent-heading"
        className="rounded-xl border border-border-soft bg-bg-surface p-5"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-raised">
            <Settings2 className="h-4 w-4 text-fg-muted" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h2
              id="consent-heading"
              className="text-sm font-semibold text-fg"
            >
              {tPrivacy("consentTitle")}
            </h2>
            <p className="mt-0.5 text-xs text-fg-muted">
              {tPrivacy("consentDescription")}
            </p>

            <div className="mt-4 space-y-3">
              <ConsentSummary consent={consent} />
              <div className="flex flex-wrap gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => resetCookieConsent()}
                >
                  <Cookie className="h-3.5 w-3.5" aria-hidden="true" />
                  {tCookie("customize")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Global Privacy Control (informational) ──────────────────── */}
      <section
        aria-labelledby="gpc-heading"
        className="rounded-xl border border-border-soft bg-bg-surface p-5"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-raised">
            <Globe2 className="h-4 w-4 text-fg-muted" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="gpc-heading"
              className="text-sm font-semibold text-fg"
            >
              {tPrivacy("gpcTitle")}
            </h2>
            {gpcHonored ? (
              <p className="mt-2 flex items-start gap-2 rounded-md bg-emerald-500/10 p-3 text-xs text-emerald-200">
                <ShieldCheck
                  className="mt-0.5 h-3.5 w-3.5 shrink-0"
                  aria-hidden="true"
                />
                <span>{tPrivacy("gpcHonored")}</span>
              </p>
            ) : (
              <p className="mt-1 text-xs text-fg-muted">
                {tPrivacy("gpcNotDetected")}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function ConsentSummary({
  consent,
}: {
  consent: ReturnType<typeof useCookieConsent>["consent"];
}) {
  const tPrivacy = useTranslations("dashboard.settings.privacy");

  if (!consent) {
    return (
      <p className="text-xs text-fg-muted">{tPrivacy("consentNotSet")}</p>
    );
  }

  const items = [
    { label: tPrivacy("cookieEssential"), on: true },
    { label: tPrivacy("cookieAnalytics"), on: consent.analytics },
    { label: tPrivacy("cookieAds"), on: consent.ads },
    { label: tPrivacy("cookiePersonalization"), on: consent.personalization },
  ];

  return (
    <ul className="grid grid-cols-2 gap-2 text-xs">
      {items.map((item) => (
        <li
          key={item.label}
          className="flex items-center justify-between rounded-md border border-border-soft bg-bg-raised/40 px-3 py-2"
        >
          <span className="text-fg-muted">{item.label}</span>
          <span
            className={
              item.on
                ? "rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300"
                : "rounded-full bg-bg-raised px-2 py-0.5 text-[10px] font-medium text-fg-subtle"
            }
          >
            {item.on ? "On" : "Off"}
          </span>
        </li>
      ))}
    </ul>
  );
}
