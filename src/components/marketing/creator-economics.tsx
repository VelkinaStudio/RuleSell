"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { sectionReveal, sectionChild } from "@/lib/motion/variants";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface CreatorEconomicsProps {
  className?: string;
}

export function CreatorEconomics({ className }: CreatorEconomicsProps) {
  const t = useTranslations("landing.creatorEconomics");
  const reduce = useReducedMotion();

  return (
    <section className={cn("py-16 sm:py-20", className)}>
      <motion.div
        className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-4 sm:px-6 lg:flex-row lg:gap-16 lg:px-8"
        variants={sectionReveal}
        initial={reduce ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div variants={sectionChild} className="flex-1">
          <h2 className="font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl lg:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-fg-muted sm:text-base">
            {t("body")}
          </p>
          <Link
            href="/dashboard/settings/seller"
            className="mt-6 inline-flex items-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-fg transition hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            {t("cta")}
          </Link>
        </motion.div>

        <motion.div
          variants={sectionChild}
          className="w-full max-w-sm rounded-xl border border-border-soft bg-bg-surface p-6"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
            {t("saleLabel")}
          </p>
          <div className="mt-4 flex h-4 w-full overflow-hidden rounded-full">
            <div className="bg-brand" style={{ width: "85%" }} title="Creator 85%" />
            <div className="bg-secondary-steel" style={{ width: "15%" }} title="Platform 15%" />
          </div>
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-brand" />
                <span className="text-sm text-fg-muted">{t("creatorLabel")}</span>
              </div>
              <span className="font-mono text-lg font-bold tabular-nums text-fg">
                {t("creatorShare")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-secondary-steel" />
                <span className="text-sm text-fg-muted">{t("platformLabel")}</span>
              </div>
              <span className="font-mono text-lg font-bold tabular-nums text-fg-muted">
                {t("platformShare")}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
