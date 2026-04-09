"use client";

import { Cookie, Edit3, Globe2, ShieldCheck } from "lucide-react";
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
 * Drop-in compliance panel for /dashboard/settings/privacy. Surfaces:
 * - Current cookie consent state with a "Manage cookies" button that
 *   re-opens the banner via resetCookieConsent()
 * - GPC opt-out indicator (read from middleware-set cookie)
 * - DSR triggers: Export (Art. 20), Correct (Art. 16), Delete (Art. 17)
 *
 * Lives in components/compliance so it can be mounted by either the
 * dashboard builder or the compliance builder without rewiring.
 */
export function PrivacyPanel({ user }: PrivacyPanelProps) {
  const tCookie = useTranslations("cookie");
  const { consent } = useCookieConsent();
  const gpcHonored = useGpcHonored();

  return (
    <div className="space-y-6">
      <section
        aria-labelledby="cookies-heading"
        className="rounded-lg border border-border-soft bg-bg-surface/70 p-5"
      >
        <header className="mb-3 flex items-center gap-2">
          <Cookie className="size-4 text-fg-muted" aria-hidden="true" />
          <h2
            id="cookies-heading"
            className="text-sm font-semibold uppercase tracking-wider text-fg-muted"
          >
            Cookie preferences
          </h2>
        </header>
        <ConsentSummary consent={consent} />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => resetCookieConsent()}>
            {tCookie("customize")}
          </Button>
        </div>
      </section>

      <section
        aria-labelledby="gpc-heading"
        className="rounded-lg border border-border-soft bg-bg-surface/70 p-5"
      >
        <header className="mb-2 flex items-center gap-2">
          <Globe2 className="size-4 text-fg-muted" aria-hidden="true" />
          <h2
            id="gpc-heading"
            className="text-sm font-semibold uppercase tracking-wider text-fg-muted"
          >
            Global Privacy Control
          </h2>
        </header>
        {gpcHonored ? (
          <p className="flex items-start gap-2 rounded-md bg-emerald-500/10 p-3 text-xs text-emerald-200">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            <span>
              Your browser sent the Sec-GPC: 1 signal and we are honoring it as a
              CCPA / CPRA opt-out of the sale and sharing of your personal
              information.
            </span>
          </p>
        ) : (
          <p className="text-xs text-fg-muted">
            Your browser is not currently sending the Sec-GPC signal. You can
            still opt out from the Cookie preferences card above.
          </p>
        )}
      </section>

      <section
        aria-labelledby="dsr-heading"
        className="rounded-lg border border-border-soft bg-bg-surface/70 p-5"
      >
        <header className="mb-3 flex items-center gap-2">
          <Edit3 className="size-4 text-fg-muted" aria-hidden="true" />
          <h2
            id="dsr-heading"
            className="text-sm font-semibold uppercase tracking-wider text-fg-muted"
          >
            Manage your data
          </h2>
        </header>
        <p className="mb-4 text-xs text-fg-muted">
          GDPR Art. 12-22 and CCPA § 1798.100 self-serve flows. Requests are
          logged to a tamper-evident audit trail.
        </p>
        <div className="flex flex-wrap gap-2">
          <DsrExportDialog username={user.username} />
          <CorrectionDialog
            initial={{
              name: user.name,
              email: user.email,
              country: user.countryOfResidence,
            }}
          />
          <DeletionDialog username={user.username} />
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
  if (!consent) {
    return (
      <p className="text-xs text-fg-muted">
        You haven&rsquo;t set a preference yet. The cookie banner will appear on
        your next visit.
      </p>
    );
  }

  const items = [
    { label: "Essential", on: true },
    { label: "Analytics", on: consent.analytics },
    { label: "Advertising", on: consent.ads },
    { label: "Personalization", on: consent.personalization },
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
