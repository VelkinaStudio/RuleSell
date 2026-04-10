"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export function CopyButton({ text, label = "Copy", className }: CopyButtonProps) {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const onClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard may be unavailable in non-secure contexts; the button is
      // still safe to click — it just becomes a no-op.
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-live="polite"
      aria-label={copied ? "Copied to clipboard" : label}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border-soft bg-bg-raised px-2.5 py-1.5 text-xs font-medium text-fg transition",
        "hover:border-brand/60 hover:bg-bg-elevated",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        "active:scale-95",
        className,
      )}
    >
      <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={reduce ? false : { scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduce ? undefined : { scale: 0.6, opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.18 }}
              className="absolute inset-0 flex items-center justify-center text-success"
            >
              <Check className="h-3.5 w-3.5" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={reduce ? false : { scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduce ? undefined : { scale: 0.6, opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.18 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Copy className="h-3.5 w-3.5" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}
