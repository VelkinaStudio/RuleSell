"use client";

import { Lock, ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";
import type { WizardDraft } from "@/hooks/use-publish-draft";
import { isNonCommercial } from "./licenses";
import { formatPrice } from "./format";

interface Props {
  draft: WizardDraft;
  onChange: (patch: WizardDraft) => void;
}

const CURRENCIES = ["USD", "EUR", "GBP"] as const;

export function WizardStepPricing({ draft, onChange }: Props) {
  const t = useTranslations("publishWizard.pricing");
  const { data: session } = useSession();
  const user = session?.user;
  const canSellPaid = user?.sellerStats?.traderVerified === true;
  const licenseBlocksPaid = isNonCommercial(draft.license);

  const isPaid = (draft.price ?? 0) > 0;
  const priceCents = draft.price ?? 0;
  const priceDollars = priceCents / 100;

  // 5% (first 6 months) cut for the launch window — see plan §9.6.
  const platformCutPct = 5;
  const youNetCents = Math.round(priceCents * (1 - platformCutPct / 100));

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight text-fg">
          {t("title")}
        </h2>
        <p className="mt-1 text-sm text-fg-muted">{t("description")}</p>
      </header>

      {!canSellPaid && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200">
          <Lock className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">{t("lockedSellerTitle")}</p>
            <p className="text-xs text-amber-100/90">
              {t("lockedSellerDescription")}
            </p>
          </div>
        </div>
      )}

      {licenseBlocksPaid && isPaid && (
        <div className="flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-rose-200">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="text-xs">
            Non-commercial licenses cannot be sold paid. Lower the price to 0
            or change the license in step 4.
          </p>
        </div>
      )}

      {/* Free / paid toggle */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange({ price: 0 })}
          aria-pressed={!isPaid}
          className={cn(
            "rounded-lg border px-4 py-4 text-left transition",
            !isPaid
              ? "border-brand bg-brand/10"
              : "border-border-soft bg-bg-raised/40 hover:border-border-strong",
          )}
        >
          <p className={cn("text-sm font-semibold", !isPaid ? "text-brand" : "text-fg")}>
            {t("freeLabel")}
          </p>
          <p className="mt-1 text-[11px] text-fg-subtle">
            Browse → click → install. Goes live as soon as it passes review.
          </p>
        </button>

        <button
          type="button"
          disabled={!canSellPaid}
          onClick={() =>
            onChange({ price: priceCents > 0 ? priceCents : 1900 })
          }
          aria-pressed={isPaid}
          className={cn(
            "rounded-lg border px-4 py-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50",
            isPaid && canSellPaid
              ? "border-brand bg-brand/10"
              : "border-border-soft bg-bg-raised/40 hover:border-border-strong",
          )}
        >
          <p className={cn("text-sm font-semibold", isPaid && canSellPaid ? "text-brand" : "text-fg")}>
            {t("paidLabel")}
          </p>
          <p className="mt-1 text-[11px] text-fg-subtle">
            One-time price. Stripe Connect payouts. 50/50 refund window.
          </p>
        </button>
      </div>

      {isPaid && canSellPaid && (
        <div className="space-y-4 rounded-lg border border-border-soft bg-bg-raised/40 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="wiz-price">{t("priceLabel")}</Label>
              <Input
                id="wiz-price"
                type="number"
                min={1}
                step={0.5}
                value={priceDollars}
                onChange={(e) => {
                  const dollars = parseFloat(e.target.value);
                  if (Number.isNaN(dollars)) return;
                  onChange({ price: Math.round(dollars * 100) });
                }}
              />
              <p className="text-[11px] text-fg-subtle">{t("priceHint")}</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="wiz-currency">{t("currencyLabel")}</Label>
              <select
                id="wiz-currency"
                value={draft.currency ?? "USD"}
                onChange={(e) => onChange({ currency: e.target.value })}
                className="h-9 w-full rounded-md border border-border-soft bg-bg-surface px-3 text-sm text-fg"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-md border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-fg-muted">{t("platformCutLabel")}</span>
              <span className="text-xs font-mono text-fg">
                {t("platformCutFirst6")}
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-sm font-semibold text-fg">
                {t("youNetLabel")}
              </span>
              <span className="text-base font-mono font-semibold text-emerald-300">
                {formatPrice(youNetCents, draft.currency ?? "USD")}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
