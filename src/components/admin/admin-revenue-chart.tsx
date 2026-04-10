"use client";

import { useTranslations } from "next-intl";
import type { RevenueDataPoint } from "@/types";
import { cn } from "@/lib/utils";

interface AdminRevenueChartProps {
  data: RevenueDataPoint[];
}

export function AdminRevenueChart({ data }: AdminRevenueChartProps) {
  const t = useTranslations("admin.revenue");

  if (data.length === 0) return null;

  const maxValue = Math.max(
    ...data.map((d) => d.platformRevenue + d.sellerPayouts + d.refunds),
  );

  const barWidth = 40;
  const gap = 16;
  const chartWidth = data.length * (barWidth + gap);
  const chartHeight = 240;
  const labelOffset = 30;

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-success" />
          <span className="text-fg-muted">{t("platformRevenue")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-brand" />
          <span className="text-fg-muted">{t("sellerPayouts")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-danger" />
          <span className="text-fg-muted">{t("refunds")}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="overflow-x-auto rounded-lg border border-border-soft bg-bg-surface p-4">
        <svg
          viewBox={`0 0 ${chartWidth + 20} ${chartHeight + labelOffset + 10}`}
          className="w-full min-w-[600px]"
          aria-label={t("chartAriaLabel")}
          role="img"
        >
          {data.map((d, i) => {
            const x = i * (barWidth + gap) + 10;
            const total = d.platformRevenue + d.sellerPayouts + d.refunds;
            const scale = chartHeight / maxValue;

            const refundH = d.refunds * scale;
            const sellerH = d.sellerPayouts * scale;
            const platformH = d.platformRevenue * scale;

            // Stack bottom-up: platform, seller, refunds
            const platformY = chartHeight - platformH;
            const sellerY = platformY - sellerH;
            const refundY = sellerY - refundH;

            const monthLabel = d.month.split("-")[1];

            return (
              <g key={d.month}>
                {/* Platform revenue (bottom) */}
                <rect
                  x={x}
                  y={platformY}
                  width={barWidth}
                  height={platformH}
                  rx={2}
                  className="fill-success"
                />
                {/* Seller payouts (middle) */}
                <rect
                  x={x}
                  y={sellerY}
                  width={barWidth}
                  height={sellerH}
                  rx={0}
                  className="fill-brand"
                />
                {/* Refunds (top) */}
                <rect
                  x={x}
                  y={refundY}
                  width={barWidth}
                  height={refundH}
                  rx={2}
                  className="fill-danger"
                />
                {/* Month label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + labelOffset - 5}
                  textAnchor="middle"
                  className="fill-fg-muted text-[10px]"
                >
                  {monthLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
