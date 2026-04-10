"use client";

import type { Environment } from "@/types";
import { ToolIcon } from "@/components/ui/tool-icon";
import { ENVIRONMENT_META } from "@/constants/environments";
import { cn } from "@/lib/utils";

const FEATURED_TOOLS: Environment[] = [
  "claude-code",
  "cursor",
  "windsurf",
  "cline",
  "zed",
  "codex",
  "chatgpt",
  "gemini-cli",
  "copilot",
  "n8n",
];

interface ToolLogoBarProps {
  className?: string;
}

export function ToolLogoBar({ className }: ToolLogoBarProps) {
  return (
    <section className={cn("border-y border-border-soft bg-bg-surface/30", className)}>
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-widest text-fg-dim">
          Works with your tools
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8">
          {FEATURED_TOOLS.map((env) => {
            const meta = ENVIRONMENT_META[env];
            return (
              <div
                key={env}
                className="flex items-center gap-2 text-fg-muted transition hover:text-fg"
              >
                <ToolIcon environment={env} size={18} />
                <span className="whitespace-nowrap text-sm font-medium">
                  {meta.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
