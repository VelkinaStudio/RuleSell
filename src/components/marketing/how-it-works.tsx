"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Search, ShieldCheck, Terminal } from "lucide-react";
import { useTranslations } from "next-intl";

import { sectionReveal, sectionChild } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

interface HowItWorksProps {
  className?: string;
}

const STEPS = [
  { icon: Search, key: "step1" as const },
  { icon: ShieldCheck, key: "step2" as const },
  { icon: Terminal, key: "step3" as const },
] as const;

export function HowItWorks({ className }: HowItWorksProps) {
  const t = useTranslations("landing.howItWorks");
  const reduce = useReducedMotion();

  return (
    <section className={cn("py-16 sm:py-20", className)}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          {t("title")}
        </h2>

        <motion.div
          className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6"
          variants={sectionReveal}
          initial={reduce ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isHighlighted = i === 1;
            return (
              <motion.div
                key={step.key}
                variants={sectionChild}
                className={cn(
                  "flex flex-col items-center text-center",
                  isHighlighted && "sm:scale-105",
                )}
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    isHighlighted
                      ? "bg-brand/15 text-brand"
                      : "bg-bg-raised text-fg-muted",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div
                  className={cn(
                    "mt-1 font-mono text-xs tabular-nums",
                    isHighlighted ? "text-brand" : "text-fg-subtle",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3
                  className={cn(
                    "mt-3 font-display text-base font-semibold",
                    isHighlighted ? "text-brand" : "text-fg",
                  )}
                >
                  {t(`${step.key}Title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {t(`${step.key}Desc`)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
