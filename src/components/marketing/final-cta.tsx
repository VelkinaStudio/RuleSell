"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { heroEntrance, heroChild } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

interface FinalCTAProps {
  className?: string;
}

export function FinalCTA({ className }: FinalCTAProps) {
  const t = useTranslations("landing.finalCta");
  const reduce = useReducedMotion();

  return (
    <section className={cn("relative overflow-hidden py-20 sm:py-28", className)}>
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255, 209, 102, 0.06) 0%, transparent 70%)",
        }}
      />

      <motion.div
        className="mx-auto flex max-w-2xl flex-col items-center px-4 text-center sm:px-6 lg:px-8"
        variants={heroEntrance}
        initial={reduce ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <motion.h2
          variants={heroChild}
          className="font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl lg:text-4xl"
        >
          {t("title")}
        </motion.h2>
        <motion.p
          variants={heroChild}
          className="mt-3 text-sm text-fg-muted sm:text-base"
        >
          {t("subtitle")}
        </motion.p>
        <motion.div variants={heroChild}>
          <Link
            href="/browse"
            className="mt-8 inline-flex items-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-brand-fg transition hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            {t("cta")}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
