"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  ExternalLink,
  Link2,
  Megaphone,
  Newspaper,
  Share2,
  Star,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { ScrollReveal } from "@/components/motion/scroll-reveal";
import {
  heroEntrance,
  heroChild,
  sectionReveal,
  sectionChild,
} from "@/lib/motion/variants";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "step1" as const, icon: UserPlus },
  { key: "step2" as const, icon: Link2 },
  { key: "step3" as const, icon: Share2 },
  { key: "step4" as const, icon: Wallet },
] as const;

const PERSONAS = [
  { key: "content" as const, icon: Megaphone },
  { key: "newsletter" as const, icon: Newspaper },
  { key: "community" as const, icon: Users },
] as const;

const EARNINGS = [
  { key: "creator", color: "bg-brand", width: "76.5%" },
  { key: "platform", color: "bg-secondary-steel", width: "15%" },
  { key: "affiliate", color: "bg-qs-a", width: "8.5%" },
] as const;

export default function AffiliatesPage() {
  const t = useTranslations("affiliates");
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
            className="mt-4 text-base text-fg-muted"
          >
            {t("hero.subtitle")}
          </motion.p>
        </motion.div>
      </section>

      {/* How it works — 4-step flow */}
      <ScrollReveal>
        <section className="bg-bg-surface py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-display text-2xl font-semibold text-fg sm:text-3xl">
              {t("howItWorks.title")}
            </h2>

            <motion.div
              className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
              variants={sectionReveal}
              initial={reduce ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.key}
                    variants={sectionChild}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg text-fg-muted">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-1 font-mono text-xs tabular-nums text-fg-subtle">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <p className="mt-2 text-sm font-medium text-fg">
                      {t(`howItWorks.${step.key}`)}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </ScrollReveal>

      {/* Earnings example */}
      <ScrollReveal>
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-display text-2xl font-semibold text-fg sm:text-3xl">
              {t("example.title")}
            </h2>

            <div className="mt-8 rounded-xl border border-border-soft bg-bg-surface p-6">
              <p className="text-center text-xs font-medium uppercase tracking-wider text-fg-subtle">
                {t("example.itemPrice")}
              </p>

              {/* Stacked horizontal bar */}
              <div className="mt-4 flex h-5 w-full overflow-hidden rounded-full">
                {EARNINGS.map((e) => (
                  <div
                    key={e.key}
                    className={e.color}
                    style={{ width: e.width }}
                  />
                ))}
              </div>

              {/* Legend */}
              <div className="mt-5 space-y-3">
                {EARNINGS.map((e) => (
                  <div
                    key={e.key}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn("h-2.5 w-2.5 rounded-full", e.color)}
                      />
                      <span className="text-sm text-fg-muted">
                        {t(`example.${e.key}Label`)}
                      </span>
                      <span className="text-xs text-fg-subtle">
                        {t(`example.${e.key}Percent`)}
                      </span>
                    </div>
                    <span className="font-mono text-base font-bold tabular-nums text-fg">
                      {t(`example.${e.key}Amount`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Personas */}
      <ScrollReveal>
        <section className="bg-bg-surface py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-display text-2xl font-semibold text-fg sm:text-3xl">
              {t("personas.title")}
            </h2>

            <motion.div
              className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3"
              variants={sectionReveal}
              initial={reduce ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {PERSONAS.map((persona) => {
                const Icon = persona.icon;
                return (
                  <motion.div
                    key={persona.key}
                    variants={sectionChild}
                    className="rounded-lg border border-border-soft bg-bg p-6"
                  >
                    <Icon className="h-5 w-5 text-brand" />
                    <h3 className="mt-3 text-sm font-semibold text-fg">
                      {t(`personas.${persona.key}Title`)}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-fg-muted">
                      {t(`personas.${persona.key}Desc`)}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </ScrollReveal>

      {/* Commission tiers */}
      <ScrollReveal>
        <section className="bg-bg-surface py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-display text-2xl font-semibold text-fg sm:text-3xl">
              {t("tiers.title")}
            </h2>
            <p className="mt-2 text-center text-sm text-fg-muted">
              {t("tiers.subtitle")}
            </p>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {(
                [
                  { name: "Starter", rate: "10%", threshold: "$0", key: "starter" },
                  { name: "Growth", rate: "15%", threshold: "$500", key: "growth" },
                  { name: "Partner", rate: "20%", threshold: "$2,000", key: "partner" },
                ] as const
              ).map((tier, i) => (
                <motion.div
                  key={tier.key}
                  variants={sectionChild}
                  className={cn(
                    "rounded-xl border p-6 text-center",
                    i === 2
                      ? "border-brand/30 bg-brand/5"
                      : "border-border-soft bg-bg",
                  )}
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
                    {t(`tiers.${tier.key}Name`)}
                  </p>
                  <p className="mt-2 font-display text-4xl font-bold text-fg">
                    {tier.rate}
                  </p>
                  <p className="mt-1 text-xs text-fg-muted">
                    {t("tiers.commission")}
                  </p>
                  <div className="mt-4 border-t border-border-soft pt-3">
                    <p className="text-xs text-fg-subtle">
                      {t("tiers.threshold")}: <span className="font-semibold text-fg">{tier.threshold}</span>
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Embed widget demo */}
      <ScrollReveal>
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-display text-2xl font-semibold text-fg sm:text-3xl">
              {t("embedDemo.title")}
            </h2>
            <p className="mt-2 text-center text-sm text-fg-muted">
              {t("embedDemo.subtitle")}
            </p>

            <div className="mt-8 flex justify-center">
              <div className="w-full max-w-[360px] rounded-xl border border-border-soft bg-bg-raised p-4 transition hover:border-brand/30">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1 rounded bg-brand/15 px-1.5 py-0.5 text-[10px] font-bold text-brand">
                      RULES
                    </span>
                    <h3 className="mt-1.5 truncate text-sm font-semibold text-fg">
                      Cursor Rules Pro
                    </h3>
                    <p className="mt-0.5 text-[11px] text-fg-muted">
                      by <span className="text-fg-subtle">@pontus_abrahamsson</span>
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-0.5 text-amber-400">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-xs font-semibold tabular-nums">4.8</span>
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-fg-muted">
                  Production-grade Cursor rules for TypeScript, React, and Next.js projects.
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-fg">$19</span>
                  <span className="flex items-center gap-1 rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-brand-fg">
                    View on RuleSell
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
                <div className="mt-2 border-t border-border-soft pt-2 text-center">
                  <span className="text-[10px] text-fg-dim">
                    {t("embedDemo.badge")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* FAQ */}
      <ScrollReveal>
        <section className="bg-bg-surface py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-display text-2xl font-semibold text-fg sm:text-3xl">
              {t("faq.title")}
            </h2>
            <div className="mt-8 space-y-2">
              <FaqItem q={t("faq.q1")} a={t("faq.a1")} />
              <FaqItem q={t("faq.q2")} a={t("faq.a2")} />
              <FaqItem q={t("faq.q3")} a={t("faq.a3")} />
              <FaqItem q={t("faq.q4")} a={t("faq.a4")} />
              <FaqItem q={t("faq.q5")} a={t("faq.a5")} />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal>
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
            <Link
              href="/dashboard/affiliates"
              className="inline-flex items-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-brand-fg transition hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              {t("cta")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <p className="mt-4 text-xs text-fg-dim">
              {t("selfReferral")}
            </p>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border-soft bg-bg">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-medium text-fg">{q}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-fg-subtle transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="border-t border-border-soft px-5 py-4">
          <p className="text-sm leading-relaxed text-fg-muted">{a}</p>
        </div>
      )}
    </div>
  );
}
