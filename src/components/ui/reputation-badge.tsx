import type { ReputationLevel } from "@/types";
import { REPUTATION_META } from "@/constants/reputation";
import { cn } from "@/lib/utils";

interface ReputationBadgeProps {
  level: ReputationLevel;
  points: number;
  className?: string;
}

const ACCENT_BG: Record<string, string> = {
  zinc: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  sky: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  violet: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  rose: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export function ReputationBadge({ level, points, className }: ReputationBadgeProps) {
  const meta = REPUTATION_META[level];
  const accent = ACCENT_BG[meta.accent] ?? ACCENT_BG.zinc;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
        accent,
        className,
      )}
      title={meta.description}
    >
      <span>{meta.label}</span>
      <span className="font-mono tabular-nums opacity-80">{points}</span>
    </span>
  );
}
