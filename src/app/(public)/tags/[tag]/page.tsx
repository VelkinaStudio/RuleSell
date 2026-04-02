import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { listRulesets } from "@/lib/rulesets/queries";
import { RulesetCard } from "@/components/rulesets/ruleset-card";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return { title: `${decoded} — Ruleset` };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const session = await auth();

  const tagRecord = await db.tag.findUnique({ where: { name: decoded } });
  if (!tagRecord) notFound();

  const { data: rulesets } = await listRulesets(
    { tagNames: [decoded], sort: "newest", pageSize: 30 },
    session?.user?.id,
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-text-primary mb-1">#{decoded}</h1>
      <p className="text-text-tertiary text-sm mb-6">{tagRecord.usageCount} rulesets</p>

      {rulesets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {rulesets.map((r) => (
            <RulesetCard key={r.id} ruleset={r} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-text-tertiary">
          <p>No rulesets with this tag yet</p>
        </div>
      )}
    </div>
  );
}
