"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { MOCK_AFFILIATE_PAYOUTS } from "@/constants/mock-affiliates";
import type { AffiliatePayout } from "@/types";
import { formatDate } from "@/components/dashboard/format";

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

const STATUS_STYLES: Record<AffiliatePayout["status"], string> = {
  pending: "bg-amber-500/15 text-amber-400",
  processing: "bg-blue-500/15 text-blue-400",
  paid: "bg-emerald-500/15 text-emerald-400",
};

export function PayoutHistory() {
  const t = useTranslations("dashboard.affiliates");
  const payouts = MOCK_AFFILIATE_PAYOUTS;

  if (payouts.length === 0) {
    return (
      <section className="rounded-xl border border-border-soft bg-bg-surface p-6 text-center">
        <p className="text-sm text-fg-muted">{t("noPayouts")}</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border-soft bg-bg-surface overflow-hidden">
      <header className="border-b border-border-soft px-5 py-4">
        <h2 className="text-sm font-semibold text-fg">{t("payoutHistoryTitle")}</h2>
        <p className="mt-0.5 text-xs text-fg-muted">{t("payoutHistoryDesc")}</p>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-soft bg-bg-raised/50">
              <th className="px-4 py-3 text-xs font-medium text-fg-subtle">
                {t("period")}
              </th>
              <th className="px-4 py-3 text-xs font-medium text-fg-subtle text-right">
                {t("amount")}
              </th>
              <th className="px-4 py-3 text-xs font-medium text-fg-subtle text-right">
                {t("conversions")}
              </th>
              <th className="px-4 py-3 text-xs font-medium text-fg-subtle">
                {t("status")}
              </th>
              <th className="px-4 py-3 text-xs font-medium text-fg-subtle">
                {t("paidDate")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft">
            {payouts.map((payout) => (
              <tr
                key={payout.id}
                className="transition hover:bg-bg-raised/30"
              >
                <td className="px-4 py-3 font-medium text-fg">
                  {payout.period}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-medium text-emerald-400">
                  {formatCents(payout.amount)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-fg">
                  {payout.conversions}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium",
                      STATUS_STYLES[payout.status],
                    )}
                  >
                    {t(`payoutStatus_${payout.status}`)}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-fg-muted whitespace-nowrap">
                  {payout.paidAt ? formatDate(payout.paidAt) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
