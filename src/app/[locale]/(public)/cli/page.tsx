"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Download,
  Globe,
  Key,
  Search,
  Terminal,
  Wallet,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { CodePreview } from "@/components/ruleset/code-preview";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import {
  heroEntrance,
  heroChild,
  sectionReveal,
  sectionChild,
} from "@/lib/motion/variants";

const TYPED_COMMAND = "npx rulesell add @PatrickJS/awesome-cursorrules";

function useTypingEffect(text: string, speed: number = 50) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setDisplayed(text);
      setDone(true);
      return;
    }
    let i = 0;
    setDisplayed("");
    setDone(false);
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, reduce]);

  return { displayed, done };
}

export default function CliPage() {
  const t = useTranslations("cli");
  const reduce = useReducedMotion();
  const { displayed, done } = useTypingEffect(TYPED_COMMAND, 50);

  return (
    <div>
      {/* Hero with terminal */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={heroEntrance}
          initial={reduce ? "visible" : "hidden"}
          animate="visible"
        >
          <motion.div variants={heroChild}>
            <Terminal className="mx-auto h-10 w-10 text-brand" />
          </motion.div>
          <motion.h1
            variants={heroChild}
            className="mt-4 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl lg:text-5xl"
          >
            {t("hero.title")}
          </motion.h1>
          <motion.p
            variants={heroChild}
            className="mt-4 text-base text-fg-muted"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* Animated terminal preview */}
          <motion.div variants={heroChild} className="mt-8">
            <div className="mx-auto max-w-xl overflow-hidden rounded-lg border border-border-soft bg-zinc-950/80">
              {/* Terminal chrome */}
              <div className="flex items-center gap-1.5 border-b border-border-soft px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                <span className="ml-2 text-[10px] text-fg-dim">terminal</span>
              </div>
              <div className="px-4 py-4">
                <pre className="font-mono text-sm text-zinc-200">
                  <span className="text-qs-a">$</span>{" "}
                  {displayed}
                  {!done && (
                    <span className="animate-pulse text-brand">|</span>
                  )}
                </pre>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Getting started — 3 steps */}
      <ScrollReveal>
        <section className="bg-bg-surface py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-display text-2xl font-semibold text-fg sm:text-3xl">
              {t("gettingStarted.title")}
            </h2>

            <motion.div
              className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3"
              variants={sectionReveal}
              initial={reduce ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {([
                { key: "step1", icon: Download },
                { key: "step2", icon: Key },
                { key: "step3", icon: Zap },
              ] as const).map((step, i) => {
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
                    <h3 className="mt-3 text-sm font-semibold text-fg">
                      {t(`gettingStarted.${step.key}Title`)}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">
                      {t(`gettingStarted.${step.key}Desc`)}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </ScrollReveal>

      {/* Feature sections — alternating layout */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl space-y-16 px-4 sm:px-6 lg:px-8">
          {/* Free assets */}
          <ScrollReveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12">
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold text-fg">
                  {t("features.freeTitle")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {t("features.freeDesc")}
                </p>
              </div>
              <div className="flex-1">
                <CodePreview
                  content={`# Install a free item — no auth required
npx rulesell add @PatrickJS/awesome-cursorrules

# The CLI detects your editor:
#   Cursor  → writes to .cursorrules
#   Claude  → writes to ~/.config/claude/mcp_servers.json
#   Windsurf → writes to .windsurfrules`}
                  language="bash"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Paid assets */}
          <ScrollReveal>
            <div className="flex flex-col gap-6 lg:flex-row-reverse lg:items-center lg:gap-12">
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold text-fg">
                  {t("features.paidTitle")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {t("features.paidDesc")}
                </p>
              </div>
              <div className="flex-1">
                <CodePreview
                  content={`# Paid items open your browser for OAuth + payment
npx rulesell add @windsurf-collective/enterprise-cursor-rules

# Flow:
# 1. CLI opens browser → rulesell.com/auth/cli
# 2. Confirm purchase ($29)
# 3. CLI receives token, downloads, writes to target file
# 4. Done — no manual copy-paste`}
                  language="bash"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Environment detection */}
          <ScrollReveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12">
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold text-fg">
                  {t("features.envTitle")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {t("features.envDesc")}
                </p>
              </div>
              <div className="flex-1">
                <CodePreview
                  content={`# Auto-detect (default)
npx rulesell add @author/slug

# Explicit environment
npx rulesell add @author/slug --env cursor
npx rulesell add @author/slug --env claude-code
npx rulesell add @author/slug --env windsurf

# List available environments for an item
npx rulesell info @author/slug`}
                  language="bash"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Full command set */}
          <ScrollReveal>
            <div className="flex flex-col gap-6 lg:flex-row-reverse lg:items-center lg:gap-12">
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold text-fg">
                  {t("features.commandsTitle")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {t("features.commandsDesc")}
                </p>
              </div>
              <div className="flex-1">
                <CodePreview
                  content={`# Search the marketplace
npx rulesell search "mcp server postgres"

# List installed items
npx rulesell list

# Update all items to latest versions
npx rulesell update

# Remove an installed item
npx rulesell remove @author/slug`}
                  language="bash"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Note */}
      <ScrollReveal>
        <section className="pb-16 sm:pb-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-lg border border-border-soft bg-bg-surface p-4 text-xs text-fg-muted">
              <p className="font-medium text-fg">Note</p>
              <p className="mt-1">{t("note")}</p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
