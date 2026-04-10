"use client";

import { Heart, Image as ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Showcase } from "@/types";
import { MOCK_RULESETS } from "@/constants/mock-data";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/utils";

interface ShowcaseCardExpandedProps {
  showcase: Showcase;
}

export function ShowcaseCardExpanded({ showcase }: ShowcaseCardExpandedProps) {
  const t = useTranslations("community.showcases");

  return (
    <div className="rounded-lg border border-border-soft bg-bg-surface transition hover:border-border-strong">
      {/* Screenshot placeholder */}
      <div className="flex h-36 items-center justify-center rounded-t-lg bg-bg-raised/50">
        <ImageIcon className="h-8 w-8 text-fg-dim/30" />
      </div>

      <div className="p-5">
        <h3 className="text-sm font-semibold text-fg">{showcase.title}</h3>
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-fg-muted">
          {showcase.description}
        </p>

        {/* Linked rulesets */}
        {showcase.rulesetIds.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {showcase.rulesetIds.map((id) => {
              const ruleset = MOCK_RULESETS.find((r) => r.id === id);
              return ruleset ? (
                <span
                  key={id}
                  className="rounded border border-border-soft bg-bg-raised px-1.5 py-0.5 text-[10px] text-fg-subtle"
                >
                  {ruleset.title}
                </span>
              ) : null;
            })}
          </div>
        )}

        <div className="mt-3 flex items-center gap-3 text-[11px] text-fg-dim">
          <span className="font-medium">@{showcase.author.username}</span>
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-1 rounded-full border border-border-soft px-2 py-0.5 transition",
              "hover:border-rose-400/30 hover:text-rose-400",
            )}
          >
            <Heart className="h-3 w-3" />
            {showcase.reactionCount}
          </button>
          <span>{formatRelative(showcase.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
