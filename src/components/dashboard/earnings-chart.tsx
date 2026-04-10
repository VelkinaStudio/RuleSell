"use client";

import { useId, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import type { EarningsTrendPoint } from "@/hooks/use-earnings";
import { formatPrice, formatNumber } from "./format";

interface EarningsChartProps {
  data: EarningsTrendPoint[];
  className?: string;
}

const WIDTH = 720;
const HEIGHT = 220;
const PADDING = { top: 16, right: 16, bottom: 28, left: 48 };

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  point: EarningsTrendPoint | null;
  index: number;
}

export function EarningsChart({ data, className }: EarningsChartProps) {
  const t = useTranslations("dashboard.earnings");
  const reduce = useReducedMotion();
  const gradientId = useId();
  const svgRef = useRef<SVGSVGElement>(null);

  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    point: null,
    index: -1,
  });

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

    // Point coords for hover hit areas
    const points = data.map((p, i) => ({
      cx: xAt(i),
      cy: yRev(p.revenue),
    }));

    return { revPath, revArea, instPath, yTicks, xLabels, innerH, innerW, xAt, yRev, points };
  }, [data]);

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!computed || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    // Map client coords to SVG viewBox coords
    const scaleX = WIDTH / rect.width;
    const svgX = (e.clientX - rect.left) * scaleX;

    const innerW = WIDTH - PADDING.left - PADDING.right;
    const xStep = data.length > 1 ? innerW / (data.length - 1) : 0;
    if (xStep === 0) return;

    const rawIndex = (svgX - PADDING.left) / xStep;
    const index = Math.max(0, Math.min(data.length - 1, Math.round(rawIndex)));
    const pt = computed.points[index];

    setTooltip({
      visible: true,
      x: pt.cx,
      y: pt.cy,
      point: data[index],
      index,
    });
  }

  function handleMouseLeave() {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }

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

  // Tooltip pixel position relative to the svg container
  // We use a percentage offset so it scales with the responsive container
  const tooltipLeftPct = computed ? (tooltip.x / WIDTH) * 100 : 0;
  const tooltipTopPct = computed ? (tooltip.y / HEIGHT) * 100 : 0;

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

      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-56 w-full cursor-crosshair"
          role="img"
          aria-label={t("chartTitle")}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
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

          {/* Hover crosshair + dot */}
          {tooltip.visible && computed && (
            <>
              <line
                x1={tooltip.x}
                x2={tooltip.x}
                y1={PADDING.top}
                y2={HEIGHT - PADDING.bottom}
                stroke="#fbbf24"
                strokeOpacity="0.3"
                strokeWidth="1"
                strokeDasharray="2 3"
                pointerEvents="none"
              />
              <circle
                cx={tooltip.x}
                cy={tooltip.y}
                r={4}
                fill="#fbbf24"
                stroke="#1a1a1a"
                strokeWidth="1.5"
                pointerEvents="none"
              />
            </>
          )}
        </svg>

        {/* Tooltip overlay */}
        {tooltip.visible && tooltip.point && (
          <div
            className="pointer-events-none absolute z-10 min-w-[100px] rounded-lg border border-border-strong bg-bg-raised px-3 py-2 shadow-lg"
            style={{
              left: `clamp(4px, calc(${tooltipLeftPct.toFixed(1)}% - 50px), calc(100% - 108px))`,
              top: `clamp(4px, calc(${tooltipTopPct.toFixed(1)}% - 56px), calc(100% - 64px))`,
            }}
          >
            <p className="mb-1 text-[10px] text-fg-subtle">
              {tooltip.point.date.slice(5)}
            </p>
            <p className="flex items-center gap-1.5 text-xs font-semibold tabular-nums text-amber-300">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden />
              {formatPrice(tooltip.point.revenue, "USD")}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-fg-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" aria-hidden />
              {formatNumber(tooltip.point.installs)} installs
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
