"use client";

import { useTranslations } from "next-intl";

import type { Ruleset } from "@/types";

interface AboutSectionProps {
  ruleset: Ruleset;
}

export function AboutSection({ ruleset }: AboutSectionProps) {
  const t = useTranslations("ruleset.about");

  // Tiny markdown shim — preserves blank-line paragraphs and bullet lists.
  // Avoiding react-markdown for v1 keeps the bundle small; we control all
  // mock content so we know it's only headings/lists/paragraphs.
  const blocks = ruleset.description.split(/\n\n+/).filter(Boolean);

  return (
    <section className="space-y-4 rounded-2xl border border-border-soft bg-bg-surface p-6">
      <h2 className="text-xl font-semibold uppercase tracking-wider text-fg">
        {t("title")}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-fg-muted">
        {blocks.map((block, i) => {
          const lines = block.split("\n");
          const isList = lines.every((l) => l.trim().startsWith("- "));
          if (isList) {
            return (
              <ul key={i} className="ml-5 list-disc space-y-1">
                {lines.map((line, j) => (
                  <li key={j}>{line.replace(/^\s*-\s*/, "")}</li>
                ))}
              </ul>
            );
          }
          if (block.startsWith("# ")) {
            return (
              <h3 key={i} className="text-base font-semibold text-fg">
                {block.slice(2)}
              </h3>
            );
          }
          return <p key={i}>{block}</p>;
        })}
      </div>
    </section>
  );
}
