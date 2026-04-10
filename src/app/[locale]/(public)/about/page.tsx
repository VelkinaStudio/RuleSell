"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Globe,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { sectionReveal, sectionChild, heroEntrance, heroChild } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

export default function AboutPage() {
  const t = useTranslations("about");
  const reduce = useReducedMotion();

  return (
    <div>
      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={heroEntrance}
          initial={reduce ? "visible" : "hidden"}
          animate="visible"
        >
          <motion.h1
            variants={heroChild}
            className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl lg:text-5xl"
          >
            {t("hero.title")}
          </motion.h1>
          <motion.p
            variants={heroChild}
            className="mt-4 text-base text-fg-muted sm:text-lg"
          >
            {t("hero.subtitle")}
          </motion.p>
        </motion.div>
      </section>

      {/* Problem / Solution */}
      <ScrollReveal>
        <section className="bg-bg-surface py-16 sm:py-20">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
            {/* Problem */}
            <div>
              <h2 className="font-display text-xl font-semibold text-fg sm:text-2xl">
                {t("problem.title")}
              </h2>
              <ul className="mt-6 space-y-4">
                {(["point1", "point2", "point3", "point4"] as const).map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-qs-c" />
                    <span className="text-sm leading-relaxed text-fg-muted">
                      {t(`problem.${key}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Solution */}
            <div>
              <h2 className="font-display text-xl font-semibold text-fg sm:text-2xl">
                {t("solution.title")}
              </h2>
              <ul className="mt-6 space-y-4">
                {(["point1", "point2", "point3", "point4"] as const).map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-qs-a" />
                    <span className="text-sm leading-relaxed text-fg-muted">
                      {t(`solution.${key}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Features 2x2 grid */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            variants={sectionReveal}
            initial={reduce ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {([
              { icon: Shield, key: "quality" },
              { icon: Users, key: "creators" },
              { icon: Star, key: "reviews" },
              { icon: Globe, key: "crossEnv" },
            ] as const).map(({ icon: Icon, key }) => (
              <motion.div
                key={key}
                variants={sectionChild}
                className="rounded-lg border border-border-soft bg-bg-surface p-6"
              >
                <Icon className="h-5 w-5 text-brand" />
                <h3 className="mt-3 font-display text-base font-semibold text-fg">
                  {t(`features.${key}Title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {t(`features.${key}Desc`)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Business model */}
      <ScrollReveal>
        <section className="bg-bg-surface py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-display text-2xl font-semibold text-fg sm:text-3xl">
              {t("business.title")}
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {([
                { key: "free", accent: false },
                { key: "commission", accent: true },
                { key: "pro", accent: false },
              ] as const).map(({ key, accent }) => (
                <div
                  key={key}
                  className={cn(
                    "rounded-lg border p-6",
                    accent
                      ? "border-brand/30 bg-brand/5"
                      : "border-border-soft bg-bg",
                  )}
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
                    {t(`business.${key}Title`)}
                  </p>
                  <p className="mt-2 font-mono text-2xl font-bold text-fg">
                    {t(`business.${key}Price`)}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                    {t(`business.${key}Desc`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Team */}
      <ScrollReveal>
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
              {t("team.title")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">
              {t("team.body")}
            </p>
            <p className="mt-2 text-sm text-fg-muted">
              <a
                href="https://github.com/rulesell"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-fg transition hover:text-brand"
              >
                {t("team.github")}
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </p>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
