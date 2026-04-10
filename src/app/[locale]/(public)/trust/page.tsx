"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Code,
  FileCheck,
  Shield,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { heroEntrance, heroChild, sectionReveal, sectionChild } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

const REPUTATION_LEVELS = [
  { key: "newcomer" as const, points: 0 },
  { key: "member" as const, points: 10 },
  { key: "contributor" as const, points: 50 },
  { key: "trusted" as const, points: 100 },
  { key: "expert" as const, points: 300 },
  { key: "authority" as const, points: 500 },
];

export default function TrustPage() {
  const t = useTranslations("trust");
  const reduce = useReducedMotion();

  return (
    <div>
      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
          variants={heroEntrance}
          initial={reduce ? "visible" : "hidden"}
          animate="visible"
        >
          <motion.div variants={heroChild}>
            <ShieldCheck className="mx-auto h-10 w-10 text-brand" />
          </motion.div>
          <motion.h1
            variants={heroChild}
            className="mt-4 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl lg:text-5xl"
          >
            {t("hero.title")}
          </motion.h1>
          <motion.p
            variants={heroChild}
            className="mt-4 max-w-2xl text-base text-fg-muted"
          >
            {t("hero.subtitle")}
          </motion.p>
        </motion.div>
      </section>

      {/* Quality Score */}
      <ScrollReveal>
        <section className="bg-bg-surface py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
              {t("qualityScore.title")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">
              {t("qualityScore.desc")}
            </p>

            {/* Visual quality bars */}
            <div className="mt-8 space-y-3">
              {[
                { label: "Token efficiency", score: 91, weight: "25%" },
                { label: "Install success", score: 88, weight: "25%" },
                { label: "Schema cleanliness", score: 95, weight: "20%" },
                { label: "Freshness", score: 78, weight: "15%" },
                { label: "Security scan", score: 82, weight: "15%" },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-fg-muted">{m.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-fg-subtle">{m.weight}</span>
                      <span className="font-mono font-medium tabular-nums text-fg">
                        {m.score}
                      </span>
                    </div>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-bg-raised">
                    <motion.div
                      className={cn(
                        "h-full rounded-full",
                        m.score >= 85
                          ? "bg-qs-a"
                          : m.score >= 70
                            ? "bg-qs-b"
                            : "bg-qs-c",
                      )}
                      initial={reduce ? { width: `${m.score}%` } : { width: 0 }}
                      whileInView={{ width: `${m.score}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.1,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs text-fg-subtle">
              {t("qualityScore.disclaimer")}
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* Security pipeline */}
      <ScrollReveal>
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-display text-2xl font-semibold text-fg sm:text-3xl">
              {t("pipeline.title")}
            </h2>

            <motion.div
              className="mt-10 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-0"
              variants={sectionReveal}
              initial={reduce ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {([
                { key: "step1", icon: Upload },
                { key: "step2", icon: Shield },
                { key: "step3", icon: Code },
                { key: "step4", icon: FileCheck },
                { key: "step5", icon: CheckCircle },
              ] as const).map((step, i, arr) => (
                <motion.div
                  key={step.key}
                  variants={sectionChild}
                  className="flex items-center gap-2 sm:flex-col"
                >
                  <div className="flex items-center gap-2 sm:flex-col sm:gap-0">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        i === arr.length - 1
                          ? "bg-qs-a/15 text-qs-a"
                          : "bg-bg-raised text-fg-muted",
                      )}
                    >
                      <step.icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium text-fg-muted sm:mt-2">
                      {t(`pipeline.${step.key}`)}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <ArrowRight className="hidden h-4 w-4 text-fg-subtle sm:mx-4 sm:block" />
                  )}
                </motion.div>
              ))}
            </motion.div>

            <p className="mt-8 text-center text-xs text-fg-subtle">
              {t("pipeline.paidNote")}
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* Reputation levels */}
      <ScrollReveal>
        <section className="bg-bg-surface py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-display text-2xl font-semibold text-fg sm:text-3xl">
              {t("reputation.title")}
            </h2>
            <p className="mt-3 text-center text-sm text-fg-muted">
              {t("reputation.desc")}
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {REPUTATION_LEVELS.map((level, i) => (
                <div
                  key={level.key}
                  className={cn(
                    "flex flex-col items-center rounded-lg border p-4",
                    i === REPUTATION_LEVELS.length - 1
                      ? "border-brand/30 bg-brand/5"
                      : "border-border-soft bg-bg",
                  )}
                  style={{ minWidth: "100px" }}
                >
                  <span className="font-mono text-xs tabular-nums text-fg-subtle">
                    {level.points}+
                  </span>
                  <span className="mt-1 text-sm font-medium text-fg">
                    {t(`reputation.${level.key}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Review integrity */}
      <ScrollReveal>
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
              {t("reviews.title")}
            </h2>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
              {(["step1", "step2", "step3"] as const).map((key, i, arr) => (
                <div key={key} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-raised text-fg-muted">
                      <span className="font-mono text-sm font-bold">
                        {i + 1}
                      </span>
                    </div>
                    <span className="mt-2 text-xs font-medium text-fg-muted">
                      {t(`reviews.${key}`)}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <ArrowRight className="hidden h-4 w-4 text-fg-subtle sm:block" />
                  )}
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm leading-relaxed text-fg-muted">
              {t("reviews.desc")}
            </p>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
