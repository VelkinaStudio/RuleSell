import type { HTMLAttributes, ReactNode } from "react";

type BadgeVariant = "platform" | "type" | "status" | "tier" | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  /** Slug token matched against the color map for the variant. */
  value?: string;
  children?: ReactNode;
}

/* Color tokens below map to Tailwind classes available in globals.css. */

const platformColors: Record<string, string> = {
  CURSOR: "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20",
  VSCODE: "bg-blue-500/10 text-blue-300 border border-blue-500/20",
  OBSIDIAN: "bg-purple-500/10 text-purple-300 border border-purple-500/20",
  N8N: "bg-pink-500/10 text-pink-300 border border-pink-500/20",
  MAKE: "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20",
  GEMINI: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
  CLAUDE: "bg-orange-500/10 text-orange-300 border border-orange-500/20",
  CHATGPT: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
  OTHER: "bg-slate-500/10 text-slate-300 border border-slate-500/20",
};

const typeColors: Record<string, string> = {
  RULESET: "bg-accent-green/10 text-accent-green border border-accent-green/20",
  PROMPT: "bg-accent-purple/10 text-accent-purple border border-accent-purple/20",
  WORKFLOW: "bg-pink-500/10 text-pink-300 border border-pink-500/20",
  AGENT: "bg-blue-500/10 text-blue-300 border border-blue-500/20",
  BUNDLE: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
  DATASET: "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20",
};

const statusColors: Record<string, string> = {
  DRAFT: "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20",
  PUBLISHED: "bg-accent-green/10 text-accent-green border border-accent-green/20",
  ARCHIVED: "bg-slate-500/10 text-slate-300 border border-slate-500/20",
  PENDING: "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20",
  COMPLETED: "bg-accent-green/10 text-accent-green border border-accent-green/20",
  FAILED: "bg-status-error/10 text-status-error border border-status-error/20",
  REFUNDED: "bg-slate-500/10 text-slate-300 border border-slate-500/20",
};

const tierColors: Record<string, string> = {
  FREE: "bg-slate-500/10 text-slate-300 border border-slate-500/20",
  PRO: "bg-accent-purple/10 text-accent-purple border border-accent-purple/20",
  PREMIUM: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
  ADMIN: "bg-status-error/10 text-status-error border border-status-error/20",
  USER: "bg-slate-500/10 text-slate-300 border border-slate-500/20",
};

const neutral =
  "bg-bg-tertiary text-text-secondary border border-border-secondary";

function resolveColor(variant: BadgeVariant, value: string | undefined): string {
  const key = value?.toUpperCase();
  if (variant === "platform" && key) return platformColors[key] ?? neutral;
  if (variant === "type" && key) return typeColors[key] ?? neutral;
  if (variant === "status" && key) return statusColors[key] ?? neutral;
  if (variant === "tier" && key) return tierColors[key] ?? neutral;
  return neutral;
}

export function Badge({
  variant = "neutral",
  value,
  className = "",
  children,
  ...props
}: BadgeProps) {
  const color = resolveColor(variant, value);
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em]",
        color,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children ?? value}
    </span>
  );
}
