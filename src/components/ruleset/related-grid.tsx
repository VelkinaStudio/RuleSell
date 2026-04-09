"use client";

import { useTranslations } from "next-intl";

import type { Ruleset } from "@/types";
import { RulesetCard } from "@/components/marketplace/ruleset-card";
import { useRulesets } from "@/hooks/use-rulesets";
import { usePreferredEnvironments } from "@/hooks/use-preferred-environments";

interface RelatedGridProps {
  ruleset: Ruleset;
}

export function RelatedGrid({ ruleset }: RelatedGridProps) {
  const t = useTranslations("ruleset.related");
  const { envs } = usePreferredEnvironments();
  const primaryEnv = envs[0];

  // Try matching both category + environment first.
  const withEnv = useRulesets({
    category: ruleset.category,
    environment: primaryEnv,
    pageSize: 7,
  });
  // Fallback: category-only.
  const categoryOnly = useRulesets({
    category: ruleset.category,
    pageSize: 7,
  });

  const source =
    withEnv.data && withEnv.data.data.length > 1 ? withEnv.data : categoryOnly.data;
  const others = source?.data.filter((r) => r.id !== ruleset.id).slice(0, 6) ?? [];
  const usingEnvMatch =
    withEnv.data && withEnv.data.data.length > 1 && primaryEnv;

  if (others.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold uppercase tracking-wider text-fg">
        {usingEnvMatch ? t("title") : t("fallback")}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {others.map((r) => (
          <RulesetCard key={r.id} ruleset={r} />
        ))}
      </div>
    </section>
  );
}
