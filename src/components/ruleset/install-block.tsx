"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Download, Terminal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useMemo, useState } from "react";

import type { Environment, Ruleset, Variant } from "@/types";
import { CodePreview } from "@/components/ruleset/code-preview";
import { CopyButton } from "@/components/ui/copy-button";
import { ENVIRONMENT_META } from "@/constants/environments";
import { Button } from "@/components/ui/button";
import { IconByName } from "@/components/ui/icon-map";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { usePreferredEnvironments } from "@/hooks/use-preferred-environments";

interface InstallBlockProps {
  ruleset: Ruleset;
}

function pickInitialVariant(
  variants: Variant[],
  defaultVariantId: string,
  preferred: Environment[],
): string {
  // 1. URL hash (#variant=cursor) takes priority — set on mount.
  if (typeof window !== "undefined") {
    const hash = window.location.hash.match(/variant=([\w-]+)/);
    if (hash?.[1]) {
      const byEnv = variants.find((v) =>
        v.environments.some((e) => e === hash[1]),
      );
      if (byEnv) return byEnv.id;
      const byId = variants.find((v) => v.id === hash[1]);
      if (byId) return byId.id;
    }
  }
  // 2. User's preferred environment.
  if (preferred.length > 0) {
    const byPref = variants.find((v) =>
      v.environments.some((e) => preferred.includes(e)),
    );
    if (byPref) return byPref.id;
  }
  // 3. Ruleset default.
  if (defaultVariantId && variants.some((v) => v.id === defaultVariantId)) {
    return defaultVariantId;
  }
  // 4. First variant.
  return variants[0]?.id ?? "";
}

export function InstallBlock({ ruleset }: InstallBlockProps) {
  const t = useTranslations("ruleset.install");
  const reduce = useReducedMotion();
  const { envs: preferred } = usePreferredEnvironments();
  const headingId = useId();

  const variants: Variant[] = ruleset.variants ?? [];
  const [activeId, setActiveId] = useState<string>(() =>
    pickInitialVariant(variants, ruleset.defaultVariantId, preferred),
  );

  // Sync active variant to the URL hash so deep-links work both ways.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const variant = variants.find((v) => v.id === activeId);
    if (!variant) return;
    const env = variant.environments[0] ?? variant.id;
    const next = `#variant=${env}`;
    if (window.location.hash !== next) {
      window.history.replaceState(null, "", next);
    }
  }, [activeId, variants]);

  const active = useMemo(
    () => variants.find((v) => v.id === activeId) ?? variants[0],
    [activeId, variants],
  );

  if (!active) return null;

  return (
    <section
      id="install"
      aria-labelledby={headingId}
      className="space-y-5 rounded-2xl border border-border-soft bg-bg-surface p-6"
    >
      <header className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <h2
            id={headingId}
            className="text-xl font-semibold uppercase tracking-wider text-fg"
          >
            {t("title")}
          </h2>
          <p className="text-sm text-fg-muted">{t("subtitle")}</p>
        </div>
      </header>

      {/* Variant tab strip */}
      <div
        role="tablist"
        aria-label={t("title")}
        className="flex flex-wrap gap-1.5 border-b border-border-soft pb-px"
      >
        {variants.map((variant) => {
          const primaryEnv = variant.environments[0];
          const meta = primaryEnv ? ENVIRONMENT_META[primaryEnv] : null;
          const isActive = variant.id === activeId;
          return (
            <button
              key={variant.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(variant.id)}
              className={cn(
                "relative -mb-px inline-flex items-center gap-2 rounded-t-md px-3.5 py-2 text-sm font-medium transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                isActive
                  ? "border-x border-t border-border-soft bg-bg-elevated text-fg"
                  : "text-fg-muted hover:text-fg",
              )}
            >
              {meta && <IconByName name={meta.icon} className="h-3.5 w-3.5" />}
              <span>{variant.label}</span>
              {isActive && (
                <span
                  aria-hidden
                  className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Active variant content with slide animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={reduce ? false : { opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? undefined : { opacity: 0, x: -8 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          {active.install.targetPath && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-fg-subtle">{t("target")}:</span>
              <code className="rounded border border-border-soft bg-bg-raised px-2 py-0.5 font-mono text-fg">
                {active.install.targetPath}
              </code>
            </div>
          )}

          <CodePreview
            content={active.install.content}
            language={active.install.language}
          />

          {/* Action row */}
          <div className="flex flex-wrap items-center gap-2">
            <CopyButton text={active.install.content} label={t("copy")} />
            {active.install.method === "download" && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-border-soft bg-bg-surface"
              >
                <Download className="h-3.5 w-3.5" />
                {t("download")}
              </Button>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-fg-muted"
                  >
                    <Terminal className="h-3.5 w-3.5" />
                    {t("openInCli")}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {t("openInCliHint")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Instructions */}
          {active.instructions && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                {t("instructions")}
              </h3>
              <div className="prose prose-invert prose-sm max-w-none rounded-lg border border-border-soft bg-bg-raised/40 p-4 text-sm leading-relaxed text-fg-muted">
                {active.instructions.split("\n").map((line, i) => (
                  <p key={i} className="mb-2 last:mb-0">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          {active.requirements && active.requirements.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                {t("requirements")}
              </h3>
              <ul className="overflow-hidden rounded-lg border border-border-soft text-sm">
                {active.requirements.map((req) => (
                  <li
                    key={req.key}
                    className="flex items-center justify-between border-b border-border-soft px-4 py-2 last:border-b-0"
                  >
                    <code className="font-mono text-fg">{req.key}</code>
                    <code className="font-mono text-xs text-fg-muted">
                      {req.constraint}
                    </code>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
