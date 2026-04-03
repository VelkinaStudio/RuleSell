import { auth } from "@/lib/auth";
import { listRulesets } from "@/lib/rulesets/queries";
import { RulesetCard } from "@/components/rulesets/ruleset-card";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Trending — Ruleset" };

export default async function TrendingPage() {
  const session = await auth();
  const { data: rulesets } = await listRulesets(
    { sort: "trending", pageSize: 30 },
    session?.user?.id,
  );

  return (
    <div className="container-page pt-12 pb-24">
      <h1 className="text-2xl font-semibold text-text-primary mb-2">Trending</h1>
      <p className="text-text-tertiary text-sm leading-relaxed mb-8">Most popular rulesets this week</p>

      {rulesets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {rulesets.map((r) => (
            <RulesetCard key={r.id} ruleset={r} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-text-tertiary">
          <p className="text-lg mb-2">Nothing trending yet</p>
          <p className="text-sm leading-relaxed">Be the first to publish and get voted!</p>
        </div>
      )}
    </div>
  );
}
