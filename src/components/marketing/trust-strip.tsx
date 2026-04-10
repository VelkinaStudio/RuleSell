"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Code, Shield, Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { sectionReveal, sectionChild } from "@/lib/motion/variants";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface TrustStripProps {
  className?: string;
}

const SIGNALS = [
  { icon: Shield, key: "virusTotal" as const },
  { icon: Code, key: "semgrep" as const },
  { icon: Star, key: "verifiedReviews" as const },
] as const;

export function TrustStrip({ className }: TrustStripProps) {
  const t = useTranslations("landing.trustStrip");
  const reduce = useReducedMotion();

  return (
    <section className={cn("bg-bg-surface py-16 sm:py-20", className)}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          {t("title")}
        </h2>

        <motion.div
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3"
          variants={sectionReveal}
          initial={reduce ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {SIGNALS.map((signal) => {
            const Icon = signal.icon;
            return (
              <motion.div
                key={signal.key}
                variants={sectionChild}
                className="flex flex-col items-center rounded-lg border border-border-soft bg-bg p-6 text-center"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-raised text-fg-muted">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-fg">
                  {t(`${signal.key}Title`)}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-fg-muted">
                  {t(`${signal.key}Desc`)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        <p className="mt-8 text-center text-sm text-fg-muted">
          <Link
            href="/trust"
            className="text-fg transition hover:text-brand focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
          >
            {t("learnMore")} →
          </Link>
        </p>
      </div>
    </section>
  );
}
