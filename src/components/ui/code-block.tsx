"use client";

import { useCallback, useState } from "react";
import { Check, Copy, Lock } from "lucide-react";

import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  locked?: boolean;
  className?: string;
}

/**
 * Code display block with copy button and optional blur overlay for
 * locked/paid content. Uses plain `<pre>` with syntax-appropriate styling.
 *
 * NOTE: Shiki highlighting is not yet integrated (shiki is not installed).
 * When shiki is added, replace the inner <code> with shiki-highlighted HTML.
 * The component API will stay the same.
 */
export function CodeBlock({
  code,
  language = "text",
  locked = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (locked) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API not available
    }
  }, [code, locked]);

  return (
    <div className={cn("group relative rounded-lg border border-border bg-surface-1", className)}>
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-fg-muted">
          {language}
        </span>
        {!locked && (
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-fg-subtle transition-colors hover:bg-surface-2 hover:text-fg"
            aria-label={copied ? "Copied" : "Copy code"}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" aria-hidden />
            ) : (
              <Copy className="h-3.5 w-3.5" aria-hidden />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>

      {/* Code area */}
      <div className="relative overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed">
          <code className="font-mono text-fg">{code}</code>
        </pre>

        {/* Blur overlay for locked content */}
        {locked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-b-lg bg-surface/80 backdrop-blur-sm">
            <Lock className="h-5 w-5 text-fg-muted" aria-hidden />
            <span className="text-sm font-medium text-fg-muted">
              Purchase to view full content
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
