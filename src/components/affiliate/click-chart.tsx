"use client";

import { useId, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { useAffiliateEarnings, type DailyClickPoint } from "@/hooks/use-affiliate-earnings";

interface ClickChartProps {
  period?: 30 | 60 | 90;
  className?: string;
}

const WIDTH = 720;
const HEIGHT = 220;
const PADDING = { top: 16, right: 16, bottom: 28, left: 40 };

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  point: DailyClickPoint | null;
}

export function ClickChart({ period = 30, className }: ClickChartProps) {
  const t = useTranslations("dashboard.affiliates");
  const reduce = useReducedMotion();
  const gradientId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const { dailyClicks } = useAffiliateEarnings(period);

  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    point: null,
  });

  const computed = useMemo(() => {
    if (dailyClicks.length === 0) return null;
    const data = dailyClicks;
    const innerW = WIDTH - PADDING.left - PADDING.right;
    const innerH = HEIGHT - PADDING.top - PADDING.bottom;

    const maxClicks = Math.max(1, ...data.map((p) => p.clicks));
    const xStep = data.length > 1 ? innerW / (data.length - 1) : 0;
    const yAt = (v: number) => PADDING.top + innerH - (v / maxClicks) * innerH;
    const xAt = (i: number) => PADDING.left + i * xStep;

    const clickPath = data
      .map((p, i) => `${i === 0 ? "M" : "L"}${xAt(i)},${yAt(p.clicks)}`)
      .join(" ");
    const areaPath = `${clickPath} L${xAt(data.length - 1)},${PADDING.top + innerH} L${PADDING.left},${PADDING.top + innerH} Z`;

    const convPath = data
      .map((p, i) => `${i === 0 ? "M" : "L"}${xAt(i)},${yAt(p.conversions)}`)
      .join(" ");

    const yTicks = [0, 0.5, 1].map((p) => ({
      y: PADDING.top + innerH - p * innerH,
      label: String(Math.round(maxClicks * p)),
    }));

    const xLabels = [0, Math.floor(data.length / 2), data.length - 1].map(
      (i) => ({
        x: xAt(i),
        label: data[i].date.slice(5),
      }),
    );

    const points = data.map((p, i) => ({ cx: xAt(i), cy: yAt(p.clicks) }));

    return { clickPath, areaPath, convPath, yTicks, xLabels, points };
  }, [dailyClicks]);

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!computed || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = WIDTH / rect.width;
    const svgX = (e.clientX - rect.left) * scaleX;
    const innerW = WIDTH - PADDING.left - PADDING.right;
    const xStep =
      dailyClicks.length > 1 ? innerW / (dailyClicks.length - 1) : 0;
    if (xStep === 0) return;
    const rawIndex = (svgX - PADDING.left) / xStep;
    const index = Math.max(
      0,
      Math.min(dailyClicks.length - 1, Math.round(rawIndex)),
    );
    const pt = computed.points[index];
    setTooltip({ visible: true, x: pt.cx, y: pt.cy, point: dailyClicks[index] });
  }

  function handleMouseLeave() {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }

  if (!computed) {
    return (
      <section
        className={cn(
          "rounded-xl border border-border-soft bg-bg-surface p-6 text-center",
          className,
        )}
      >
        <p className="text-sm text-fg-muted">{t("noClickData")}</p>
      </section>
    );
  }

  const tooltipLeftPct = (tooltip.x / WIDTH) * 100;
  const tooltipTopPct = (tooltip.y / HEIGHT) * 100;

  return (
    <section
      className={cn(
        "rounded-xl border border-border-soft bg-bg-surface p-5",
        className,
      )}
      aria-label={t("clickChartTitle")}
    >
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-fg">{t("clickChartTitle")}</h2>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5 text-fg-muted">
            <span className="h-2 w-2 rounded-full bg-brand" aria-hidden />
            {t("clicks")}
          </span>
          <span className="flex items-center gap-1.5 text-fg-muted">
            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
            {t("conversions")}
          </span>
        </div>
      </header>

      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-56 w-full cursor-crosshair"
          role="img"
          aria-label={t("clickChartTitle")}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#FFD166" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#FFD166" stopOpacity="0" />
            </linearGradient>
          </defs>

          {computed.yTicks.map((tick, i) => (
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
                x={PADDING.left - 6}
                y={tick.y + 3}
                textAnchor="end"
                className="fill-fg-subtle text-[10px]"
              >
                {tick.label}
              </text>
            </g>
          ))}

          {computed.xLabels.map((lbl, i) => (
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

          <motion.path
            d={computed.areaPath}
            fill={`url(#${gradientId})`}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.path
            d={computed.clickPath}
            fill="none"
            stroke="#FFD166"
            strokeWidth="2"
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.path
            d={computed.convPath}
            fill="none"
            stroke="#34d399"
            strokeWidth="1.25"
            strokeOpacity="0.6"
            strokeDasharray="3 3"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />

          {tooltip.visible && (
            <>
              <line
                x1={tooltip.x}
                x2={tooltip.x}
                y1={PADDING.top}
                y2={HEIGHT - PADDING.bottom}
                stroke="#FFD166"
                strokeOpacity="0.3"
                strokeWidth="1"
                strokeDasharray="2 3"
                pointerEvents="none"
              />
              <circle
                cx={tooltip.x}
                cy={tooltip.y}
                r={4}
                fill="#FFD166"
                stroke="#1a1a1a"
                strokeWidth="1.5"
                pointerEvents="none"
              />
            </>
          )}
        </svg>

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
            <p className="flex items-center gap-1.5 text-xs font-semibold tabular-nums text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
              {tooltip.point.clicks} {t("clicks")}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-fg-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
              {tooltip.point.conversions} {t("conversions")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
