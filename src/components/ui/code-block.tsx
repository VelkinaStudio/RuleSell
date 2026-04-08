"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

export interface CodeBlockProps {
  code: string;
  language?: string;
  /** Show 1-indexed line numbers in a gutter column. Defaults to true. */
  showLineNumbers?: boolean;
  /** Render a copy-to-clipboard button in the header. Defaults to true. */
  showCopyButton?: boolean;
  /**
   * Overlay a blur + CTA on top of the rendered code. Used to preview
   * gated/paid content without revealing it.
   */
  locked?: boolean;
  /** Message shown in the blur overlay when `locked` is true. */
  lockedMessage?: string;
  className?: string;
}

/**
 * Syntax-highlighted code block with line numbers, copy button, and
 * optional blur overlay for locked content.
 *
 * Uses shiki's `codeToHtml` at render time. For SSR/RSC callers, consider
 * importing from a server component that pre-renders the HTML — this
 * client variant hydrates into an async effect.
 */
export function CodeBlock({
  code,
  language = "typescript",
  showLineNumbers = true,
  showCopyButton = true,
  locked = false,
  lockedMessage = "Purchase to view the full content",
  className = "",
}: CodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    codeToHtml(code, {
      lang: language,
      theme: "github-dark-dimmed",
    })
      .then((out) => {
        if (!cancelled) setHtml(out);
      })
      .catch(() => {
        if (!cancelled) setHtml(null);
      });
    return () => {
      cancelled = true;
    };
  }, [code, language]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  }

  return (
    <div
      className={[
        "relative rounded-xl overflow-hidden border border-border-primary bg-bg-secondary",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border-primary bg-bg-tertiary/60 px-4 py-2">
        <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">
          {language}
        </span>
        {showCopyButton ? (
          <button
            type="button"
            onClick={copy}
            className="text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        ) : null}
      </div>

      <div
        className={[
          "relative overflow-x-auto text-sm",
          showLineNumbers ? "shiki-lines" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <pre className="p-4 font-mono text-text-primary whitespace-pre">
            {code}
          </pre>
        )}
      </div>

      {locked ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-bg-primary/70 backdrop-blur-md">
          <p className="text-sm font-medium text-text-primary">
            {lockedMessage}
          </p>
        </div>
      ) : null}
    </div>
  );
}
