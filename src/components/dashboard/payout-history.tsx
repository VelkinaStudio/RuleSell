"use client";

import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import type { PayoutRecord, PayoutStatus } from "@/hooks/use-earnings";
import { formatDate, formatPrice } from "./format";

interface PayoutHistoryProps {
  payouts: PayoutRecord[];
  pendingPayout: number;
  payoutMin: number;
  className?: string;
}

const STATUS_STYLES: Record<PayoutStatus, string> = {
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  paid: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  failed: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  processing: "bg-sky-500/15 text-sky-300 border-sky-500/30",
};

export function PayoutHistory({
  payouts,
  pendingPayout,
  payoutMin,
  className,
}: PayoutHistoryProps) {
  const t = useTranslations("dashboard.earnings");

  const progress = Math.min(100, (pendingPayout / payoutMin) * 100);

  return (
    <section
      className={cn(
        "rounded-xl border border-border-soft bg-bg-surface",
        className,
      )}
    >
      <header className="border-b border-border-soft p-5">
        <h2 className="text-sm font-semibold text-fg">{t("payoutsTitle")}</h2>
        <p className="mt-2 text-xs text-fg-muted">
          {t("minPayout", {
            current: formatPrice(pendingPayout, "USD"),
            min: formatPrice(payoutMin, "USD"),
          })}
        </p>
        <div
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-bg-raised"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t("payoutsTitle")}
        >
          <div
            className="h-full bg-brand transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {payouts.length === 0 ? (
        <div className="p-6">
          <EmptyState title={t("payoutEmpty")} description="" />
        </div>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border-soft text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
              <th className="px-5 py-3">{t("payoutPeriod")}</th>
              <th className="px-5 py-3 text-right">{t("payoutAmount")}</th>
              <th className="px-5 py-3">{t("payoutStatus")}</th>
              <th className="px-5 py-3">{t("payoutPaidAt")}</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((p) => (
              <tr
                key={p.id}
                className="border-b border-border-soft last:border-b-0 transition hover:bg-bg-raised/30"
              >
                <td className="px-5 py-3 text-xs text-fg-muted">
                  {formatDate(p.periodStart)} – {formatDate(p.periodEnd)}
                </td>
                <td className="px-5 py-3 text-right text-sm font-mono tabular-nums text-fg">
                  {formatPrice(p.amount, "USD")}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
                      STATUS_STYLES[p.status],
                    )}
                  >
                    {t(`status${p.status[0].toUpperCase()}${p.status.slice(1)}`)}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-fg-muted">
                  {p.paidAt ? formatDate(p.paidAt) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
