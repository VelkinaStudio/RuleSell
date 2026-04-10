"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

import { cn } from "@/lib/utils";

const LINES = [
  { text: "$ npx rulesell install cursor-rules-pro", delay: 0, color: "text-fg" },
  { text: "  ✓ Verified — Quality Score 91/100 (Grade A)", delay: 0.8, color: "text-success" },
  { text: "  ✓ Security scan passed (VirusTotal + Semgrep)", delay: 1.2, color: "text-success" },
  { text: "  ✓ Compatible with Cursor, Claude Code, Windsurf", delay: 1.6, color: "text-fg-muted" },
  { text: "  → Installed to .cursor/rules/cursor-rules-pro.md", delay: 2.0, color: "text-brand" },
  { text: "", delay: 2.4, color: "text-fg" },
  { text: "  Done in 1.2s — 1 asset installed", delay: 2.6, color: "text-fg-subtle" },
];

interface HeroTerminalProps {
  className?: string;
}

export function HeroTerminal({ className }: HeroTerminalProps) {
  const reduce = useReducedMotion();

  const lines = useMemo(() => {
    if (reduce) {
      // Show all lines immediately when reduced motion is preferred
      return LINES.map((l) => ({ ...l, delay: 0 }));
    }
    return LINES;
  }, [reduce]);

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border border-border-soft bg-bg-inset shadow-lg",
        className,
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-1.5 border-b border-border-soft px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-fg-subtle/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-fg-subtle/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-fg-subtle/20" />
        <span className="ml-2 text-[11px] text-fg-dim">Terminal</span>
      </div>

      {/* Terminal body */}
      <div className="p-4 font-mono text-[13px] leading-relaxed sm:p-5">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={reduce ? undefined : { opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              delay: line.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={cn("min-h-[1.5em]", line.color)}
          >
            {line.text}
          </motion.div>
        ))}

        {/* Blinking cursor */}
        <motion.span
          initial={reduce ? undefined : { opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: 3.0,
          }}
          className="inline-block h-4 w-2 bg-brand"
        />
      </div>
    </div>
  );
}
