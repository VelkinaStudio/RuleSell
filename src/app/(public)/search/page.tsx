import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { listRulesets } from "@/lib/rulesets/queries";
import { RulesetCard } from "@/components/rulesets/ruleset-card";
import { SearchFilters } from "@/components/search/search-filters";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Search — Ruleset" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const session = await auth();

  const q = typeof sp.q === "string" ? sp.q : undefined;
  const platform = typeof sp.platform === "string" ? sp.platform : undefined;
  const type = typeof sp.type === "string" ? sp.type : undefined;
  const category = typeof sp.category === "string" ? sp.category : undefined;
  const sort = (typeof sp.sort === "string" ? sp.sort : "newest") as "newest" | "trending" | "most_voted" | "most_downloaded";
  const cursor = typeof sp.cursor === "string" ? sp.cursor : undefined;
  const tags = typeof sp.tags === "string" ? sp.tags.split(",") : undefined;

  const { data: rulesets, total, nextCursor } = await listRulesets(
    { platform, type, category, tagNames: tags, sort, cursor, pageSize: 20 },
    session?.user?.id,
  );

  return (
    <div className="flex">
      {/* Sidebar filters */}
      <aside className="hidden lg:block w-56 border-r border-border-primary p-4">
        <Suspense>
          <SearchFilters />
        </Suspense>
      </aside>

      {/* Results */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-text-primary">
            {q ? `Results for "${q}"` : "Browse Rulesets"}
          </h1>
          <span className="text-sm text-text-tertiary">{total} results</span>
        </div>

        {rulesets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rulesets.map((r) => (
              <RulesetCard key={r.id} ruleset={r} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-text-tertiary">
            <p className="text-lg mb-2">No results found</p>
            <p className="text-sm">Try adjusting your filters or search terms</p>
          </div>
        )}

        {nextCursor && (
          <div className="flex justify-center py-6">
            <a
              href={`?${new URLSearchParams({ ...Object.fromEntries(Object.entries(sp).filter(([, v]) => typeof v === "string") as [string, string][]), cursor: nextCursor }).toString()}`}
              className="px-6 py-2 text-sm font-medium text-text-secondary border border-border-secondary rounded-md hover:border-border-hover hover:text-text-primary transition-colors"
            >
              Load more
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
