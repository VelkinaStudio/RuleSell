"use client";

import { cn } from "@/lib/utils";

interface CodePreviewProps {
  content: string;
  language?: string;
  /** Optional max height in tailwind units (e.g. "max-h-96"). */
  maxHeightClass?: string;
  className?: string;
}

/**
 * Lightweight syntax-styled code block. We deliberately do not pull in a
 * full syntax highlighter for v1 — Shiki + react-shiki adds 200KB+ to the
 * bundle and the install code blocks are short. We render with mono font,
 * dark surface, and language-tagged border for visual signal.
 */
export function CodePreview({
  content,
  language,
  maxHeightClass = "max-h-[420px]",
  className,
}: CodePreviewProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border-soft bg-zinc-950/80",
        className,
      )}
    >
      {language && (
        <div className="absolute right-3 top-2 z-10">
          <span className="rounded-full border border-border-soft bg-bg-surface/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-fg-subtle backdrop-blur">
            {language}
          </span>
        </div>
      )}
      <pre
        className={cn(
          "overflow-auto p-4 text-xs leading-relaxed",
          maxHeightClass,
        )}
      >
        <code className="font-mono text-zinc-200 [&_*]:font-mono">{content}</code>
      </pre>
    </div>
  );
}
