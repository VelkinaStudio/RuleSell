"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  CheckCircle,
  Clock,
  FileCheck,
  Shield,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { sectionReveal, sectionChild } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

interface QualityShowcaseProps {
  className?: string;
}

const METRICS = [
  { icon: Activity, key: "tokenEfficiency" as const },
  { icon: CheckCircle, key: "installSuccess" as const },
  { icon: FileCheck, key: "schemaCleanliness" as const },
  { icon: Clock, key: "freshness" as const },
  { icon: Shield, key: "securityScan" as const },
] as const;

const EXAMPLE_METRICS = [
  { label: "Token efficiency", score: 91 },
  { label: "Install success", score: 88 },
  { label: "Schema cleanliness", score: 95 },
  { label: "Freshness", score: 78 },
  { label: "Security", score: 82 },
];

function gradeColor(score: number): string {
  if (score >= 85) return "text-qs-a";
  if (score >= 70) return "text-qs-b";
  return "text-qs-c";
}

function barColor(score: number): string {
  if (score >= 85) return "bg-qs-a";
  if (score >= 70) return "bg-qs-b";
  return "bg-qs-c";
}

export function QualityShowcase({ className }: QualityShowcaseProps) {
  const t = useTranslations("landing.qualityShowcase");
  const reduce = useReducedMotion();

  return (
    <section className={cn("bg-bg-surface py-16 sm:py-20", className)}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl lg:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-sm text-fg-muted sm:text-base">
            {t("subtitle")}
          </p>
        </div>

        <motion.div
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={sectionReveal}
          initial={reduce ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.key}
                variants={sectionChild}
                className="rounded-lg border border-border-soft bg-bg p-5"
              >
                <Icon className="h-5 w-5 text-brand" />
                <h3 className="mt-3 text-sm font-semibold text-fg">
                  {t(`${metric.key}`)}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">
                  {t(`${metric.key}Desc`)}
                </p>
              </motion.div>
            );
          })}

          <motion.div
            variants={sectionChild}
            className="rounded-lg border border-brand/20 bg-bg p-5 sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-fg">
                {t("exampleTitle")}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className={cn("font-mono text-2xl font-bold", gradeColor(87))}>
                  {t("exampleScore")}
                </span>
                <span className={cn("font-mono text-sm font-semibold", gradeColor(87))}>
                  /{t("exampleGrade")}
                </span>
              </div>
            </div>
            <div className="mt-4 space-y-2.5">
              {EXAMPLE_METRICS.map((m) => (
                <div key={m.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-fg-muted">{m.label}</span>
                    <span className={cn("font-mono tabular-nums", gradeColor(m.score))}>
                      {m.score}
                    </span>
                  </div>
                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-bg-raised">
                    <motion.div
                      className={cn("h-full rounded-full", barColor(m.score))}
                      initial={reduce ? { width: `${m.score}%` } : { width: 0 }}
                      whileInView={{ width: `${m.score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
