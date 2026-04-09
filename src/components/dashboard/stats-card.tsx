"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface StatsCardProps {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  icon: LucideIcon;
  accent?: string;
  iconBg?: string;
  className?: string;
}

export function StatsCard({
  label,
  value,
  delta,
  deltaLabel,
  icon: Icon,
  accent = "text-brand",
  iconBg = "bg-brand/10",
  className,
}: StatsCardProps) {
  const reduce = useReducedMotion();
  const hasDelta = typeof delta === "number";
  const positive = (delta ?? 0) >= 0;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border-soft bg-bg-surface p-5 transition hover:border-border-strong",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
            {label}
          </p>
          <p className="text-2xl font-semibold tabular-nums text-fg">{value}</p>
        </div>
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            iconBg,
          )}
        >
          <Icon className={cn("h-4 w-4", accent)} aria-hidden="true" />
        </div>
      </div>
      {hasDelta && (
        <div
          className={cn(
            "mt-3 flex items-center gap-1 text-xs font-medium",
            positive ? "text-success" : "text-danger",
          )}
        >
          {positive ? (
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          ) : (
            <ArrowDownRight className="h-3 w-3" aria-hidden="true" />
          )}
          <span className="tabular-nums">{Math.abs(delta!).toFixed(1)}%</span>
          {deltaLabel && (
            <span className="text-fg-subtle font-normal">· {deltaLabel}</span>
          )}
        </div>
      )}
    </motion.div>
  );
}
