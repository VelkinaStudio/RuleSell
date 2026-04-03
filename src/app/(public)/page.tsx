import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { listRulesets } from "@/lib/rulesets/queries";
import { RulesetCard } from "@/components/rulesets/ruleset-card";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth();
  const { data: rulesets } = await listRulesets(
    { sort: "newest", pageSize: 12 },
    session?.user?.id,
  );

  const [creatorCount, rulesetTotal] = await Promise.all([
    db.user.count(),
    db.ruleset.count({ where: { status: "PUBLISHED" } }),
  ]);

  return (
    <div className="container-page">

      {/* ── Hero ── 96px top padding, 80px bottom — breathing room */}
      <section className="pt-24 pb-20 stagger-in">
        <p className="text-sm font-medium text-accent-green tracking-wide mb-6">
          AI Configuration Marketplace
        </p>

        <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.08] tracking-tight mb-6 text-balance">
          <span className="text-text-primary">The stack behind </span>
          <span className="font-mono bg-gradient-to-r from-[#34d399] via-[#a78bfa] to-[#fbbf24] bg-clip-text text-transparent">
            the best AI builders.
          </span>
        </h1>

        <p className="text-lg text-text-secondary leading-relaxed max-w-xl mb-10">
          Buy, sell, and share system prompts, Cursor rules, n8n workflows, and agent blueprints.
        </p>

        {/* CTAs — 16px gap, generous touch targets (48px height) */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
          <Link
            href="/search"
            className="inline-flex items-center gap-2.5 h-12 px-7 bg-accent-green text-text-inverse font-semibold rounded-xl hover:bg-accent-green-hover transition-colors text-[15px]"
          >
            Browse Rulesets
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center h-12 px-7 border border-border-secondary text-text-primary font-semibold rounded-xl hover:border-border-hover hover:bg-bg-tertiary/40 transition-colors text-[15px]"
          >
            Start Selling Free
          </Link>
        </div>

        {/* Social proof — larger numbers, clear labels */}
        <div className="flex items-center gap-8">
          <div>
            <span className="block text-3xl font-bold text-text-primary font-mono tabular-nums">{rulesetTotal}</span>
            <span className="text-sm text-text-tertiary">rulesets</span>
          </div>
          <div className="w-px h-10 bg-border-primary" />
          <div>
            <span className="block text-3xl font-bold text-text-primary font-mono tabular-nums">{creatorCount}</span>
            <span className="text-sm text-text-tertiary">creators</span>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── contained, subtle */}
      <div className="divider-fade" />
      <div className="flex flex-wrap items-center gap-x-8 gap-y-2 py-5 stagger-in delay-1">
        {["Secure Checkout", "30-Day Refunds", "Verified Creators", "Instant Delivery"].map((item) => (
          <span key={item} className="flex items-center gap-2 text-xs text-text-tertiary uppercase tracking-[0.12em]">
            <span className="w-1 h-1 rounded-full bg-accent-green/50" />
            {item}
          </span>
        ))}
      </div>
      <div className="divider-fade mb-12" />

      {/* ── Rulesets grid ── 24px gap, consistent card sizing */}
      <section className="pb-24">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-xl font-semibold text-text-primary">Latest Rulesets</h2>
          <Link href="/search" className="text-sm text-text-tertiary hover:text-accent-green transition-colors">
            View all &rarr;
          </Link>
        </div>

        {rulesets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rulesets.map((r, i) => (
              <div key={r.id} className="stagger-in" style={{ animationDelay: `${0.15 + i * 0.04}s` }}>
                <RulesetCard ruleset={r} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-text-tertiary">
            <p className="text-lg mb-2">No rulesets yet</p>
            <p className="text-sm">Be the first to publish a ruleset!</p>
          </div>
        )}
      </section>
    </div>
  );
}
