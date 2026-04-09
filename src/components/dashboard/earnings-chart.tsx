"use client";

import { useId, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import type { EarningsTrendPoint } from "@/hooks/use-earnings";
import { formatPrice } from "./format";

interface EarningsChartProps {
  data: EarningsTrendPoint[];
  className?: string;
}

const WIDTH = 720;
const HEIGHT = 220;
const PADDING = { top: 16, right: 16, bottom: 28, left: 48 };

export function EarningsChart({ data, className }: EarningsChartProps) {
  const t = useTranslations("dashboard.earnings");
  const reduce = useReducedMotion();
  const gradientId = useId();

  const totalRevenue = data.reduce((s, p) => s + p.revenue, 0);

  const computed = useMemo(() => {
    if (data.length === 0) return null;
    const innerW = WIDTH - PADDING.left - PADDING.right;
    const innerH = HEIGHT - PADDING.top - PADDING.bottom;

    const maxRev = Math.max(1, ...data.map((p) => p.revenue));
    const maxInst = Math.max(1, ...data.map((p) => p.installs));

    const xStep = data.length > 1 ? innerW / (data.length - 1) : 0;
    const yRev = (v: number) => PADDING.top + innerH - (v / maxRev) * innerH;
    const yInst = (v: number) => PADDING.top + innerH - (v / maxInst) * innerH;
    const xAt = (i: number) => PADDING.left + i * xStep;

    const revPath = data
      .map((p, i) => `${i === 0 ? "M" : "L"}${xAt(i)},${yRev(p.revenue)}`)
      .join(" ");
    const revArea =
      `${revPath} L${xAt(data.length - 1)},${PADDING.top + innerH} L${PADDING.left},${PADDING.top + innerH} Z`;

    const instPath = data
      .map((p, i) => `${i === 0 ? "M" : "L"}${xAt(i)},${yInst(p.installs)}`)
      .join(" ");

    // Y-axis ticks at 0, 50%, 100%
    const yTicks = [0, 0.5, 1].map((p) => ({
      y: PADDING.top + innerH - p * innerH,
      label: formatPrice(Math.round(maxRev * p), "USD"),
    }));

    // X-axis labels — first, middle, last
    const xLabels = [0, Math.floor(data.length / 2), data.length - 1].map((i) => ({
      x: xAt(i),
      label: data[i].date.slice(5),
    }));

    return { revPath, revArea, instPath, yTicks, xLabels, innerH, innerW };
  }, [data]);

  if (totalRevenue === 0) {
    return (
      <section
        className={cn(
          "rounded-xl border border-border-soft bg-bg-surface p-6",
          className,
        )}
      >
        <header className="mb-4">
          <h2 className="text-sm font-semibold text-fg">{t("chartTitle")}</h2>
        </header>
        <EmptyState title={t("chartEmpty")} description="" />
      </section>
    );
  }

  return (
    <section
      className={cn(
        "rounded-xl border border-border-soft bg-bg-surface p-5",
        className,
      )}
      aria-label={t("chartTitle")}
    >
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-fg">{t("chartTitle")}</h2>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5 text-fg-muted">
            <span className="h-2 w-2 rounded-full bg-amber-300" aria-hidden />
            {t("chartLegendRevenue")}
          </span>
          <span className="flex items-center gap-1.5 text-fg-muted">
            <span className="h-2 w-2 rounded-full bg-cyan-300" aria-hidden />
            {t("chartLegendInstalls")}
          </span>
        </div>
      </header>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-56 w-full"
        role="img"
        aria-label={t("chartTitle")}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y-axis grid lines + labels */}
        {computed?.yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={PADDING.left}
              x2={WIDTH - PADDING.right}
              y1={tick.y}
              y2={tick.y}
              stroke="currentColor"
              strokeOpacity="0.08"
              strokeDasharray="2 4"
            />
            <text
              x={PADDING.left - 8}
              y={tick.y + 3}
              textAnchor="end"
              className="fill-fg-subtle text-[10px]"
            >
              {tick.label}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {computed?.xLabels.map((lbl, i) => (
          <text
            key={i}
            x={lbl.x}
            y={HEIGHT - 8}
            textAnchor="middle"
            className="fill-fg-subtle text-[10px]"
          >
            {lbl.label}
          </text>
        ))}

        {/* Revenue area */}
        {computed && (
          <motion.path
            d={computed.revArea}
            fill={`url(#${gradientId})`}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
        {/* Revenue line */}
        {computed && (
          <motion.path
            d={computed.revPath}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
        {/* Installs line (faint) */}
        {computed && (
          <motion.path
            d={computed.instPath}
            fill="none"
            stroke="#67e8f9"
            strokeWidth="1.25"
            strokeOpacity="0.6"
            strokeDasharray="3 3"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </svg>
    </section>
  );
}
