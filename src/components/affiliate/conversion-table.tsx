"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAffiliateConversions } from "@/hooks/use-affiliate-conversions";
import type { AffiliateConversion } from "@/types";
import { formatDate } from "@/components/dashboard/format";

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

const STATUS_STYLES: Record<AffiliateConversion["status"], string> = {
  pending: "bg-amber-500/15 text-amber-400",
  confirmed: "bg-blue-500/15 text-blue-400",
  paid: "bg-emerald-500/15 text-emerald-400",
};

export function ConversionTable() {
  const t = useTranslations("dashboard.affiliates");
  const [statusFilter, setStatusFilter] = useState<
    AffiliateConversion["status"] | "all"
  >("all");

  const {
    conversions,
    total,
    page,
    totalPages,
    setPage,
    hasNext,
    hasPrev,
  } = useAffiliateConversions({ status: statusFilter, pageSize: 10 });

  const filters: Array<{ label: string; value: AffiliateConversion["status"] | "all" }> = [
    { label: t("filterAll"), value: "all" },
    { label: t("filterPending"), value: "pending" },
    { label: t("filterConfirmed"), value: "confirmed" },
    { label: t("filterPaid"), value: "paid" },
  ];

  return (
    <section className="rounded-xl border border-border-soft bg-bg-surface overflow-hidden">
      {/* Filter tabs */}
      <div className="flex items-center gap-1 border-b border-border-soft px-4 py-2">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => {
              setStatusFilter(f.value);
              setPage(1);
            }}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition",
              statusFilter === f.value
                ? "bg-brand/15 text-brand"
                : "text-fg-muted hover:text-fg hover:bg-bg-raised",
            )}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs tabular-nums text-fg-dim">
          {total} {t("total")}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-soft bg-bg-raised/50">
              <th className="px-4 py-3 text-xs font-medium text-fg-subtle">
                {t("ruleset")}
              </th>
              <th className="px-4 py-3 text-xs font-medium text-fg-subtle">
                {t("buyer")}
              </th>
              <th className="px-4 py-3 text-xs font-medium text-fg-subtle text-right">
                {t("saleAmount")}
              </th>
              <th className="px-4 py-3 text-xs font-medium text-fg-subtle text-right">
                {t("commissionAmount")}
              </th>
              <th className="px-4 py-3 text-xs font-medium text-fg-subtle">
                {t("status")}
              </th>
              <th className="px-4 py-3 text-xs font-medium text-fg-subtle">
                {t("date")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft">
            {conversions.map((conv) => (
              <tr
                key={conv.id}
                className="transition hover:bg-bg-raised/30"
              >
                <td className="px-4 py-3 font-medium text-fg truncate max-w-[200px]">
                  {conv.rulesetTitle}
                </td>
                <td className="px-4 py-3 text-fg-muted">
                  @{conv.buyerUsername}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-fg">
                  {formatCents(conv.saleAmount)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-medium text-emerald-400">
                  {formatCents(conv.commission)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium",
                      STATUS_STYLES[conv.status],
                    )}
                  >
                    {t(`status_${conv.status}`)}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-fg-muted whitespace-nowrap">
                  {formatDate(conv.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border-soft px-4 py-3">
          <span className="text-xs text-fg-muted">
            {t("pageOf", { page, total: totalPages })}
          </span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!hasPrev}
              onClick={() => setPage(page - 1)}
              className="h-7 w-7 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!hasNext}
              onClick={() => setPage(page + 1)}
              className="h-7 w-7 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
