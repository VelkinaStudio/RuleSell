import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { listRulesets } from "@/lib/rulesets/queries";
import { RulesetCard } from "@/components/rulesets/ruleset-card";

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
    <div className="p-6 md:p-8">
      {/* Hero */}
      <div className="mb-12 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-green/20 bg-accent-green-subtle mb-6 stagger-in">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
          <span className="text-xs font-medium text-accent-green tracking-wide">AI Configuration Marketplace</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] mb-5 tracking-tight stagger-in delay-1">
          <span className="text-text-primary">The stack behind</span><br />
          <span className="font-mono bg-gradient-to-r from-[#34d399] via-[#a78bfa] to-[#fbbf24] bg-clip-text text-transparent">the best AI builders.</span>
        </h1>

        <p className="text-text-secondary text-lg leading-relaxed mb-8 stagger-in delay-2">
          Buy, sell, and share system prompts, Cursor rules, n8n workflows, and agent blueprints.
        </p>

        <div className="flex items-center gap-3 mb-6 stagger-in delay-3">
          <a
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-green text-text-inverse font-semibold rounded-lg hover:bg-accent-green-hover transition-all duration-200 hover:shadow-[0_0_20px_rgba(52,211,153,0.2)]"
          >
            Browse Rulesets
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
          <a
            href="/signup"
            className="inline-flex items-center px-6 py-3 border border-border-secondary text-text-primary font-semibold rounded-lg hover:border-accent-green/40 hover:bg-accent-green-subtle transition-all duration-200"
          >
            Start Selling Free
          </a>
        </div>

        <div className="flex items-center gap-6 text-sm stagger-in delay-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-text-primary font-mono">{rulesetTotal}</span>
            <span className="text-text-tertiary">rulesets</span>
          </div>
          <div className="w-px h-5 bg-border-primary" />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-text-primary font-mono">{creatorCount}</span>
            <span className="text-text-tertiary">creators</span>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="divider-fade mb-6 stagger-in delay-5" />
      <div className="flex items-center gap-8 text-[11px] text-text-tertiary uppercase tracking-[0.15em] mb-6 stagger-in delay-5">
        {["Secure Checkout", "30-Day Refunds", "Verified Creators", "Instant Delivery"].map((item) => (
          <span key={item} className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-accent-green/40" />
            {item}
          </span>
        ))}
      </div>
      <div className="divider-fade mb-8 stagger-in delay-5" />

      {/* Rulesets grid */}
      {rulesets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {rulesets.map((r, i) => (
            <div key={r.id} className="stagger-in" style={{ animationDelay: `${0.3 + i * 0.05}s` }}>
              <RulesetCard ruleset={r} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-text-tertiary">
          <p className="text-lg mb-2">No rulesets yet</p>
          <p className="text-sm">Be the first to publish a ruleset!</p>
        </div>
      )}
    </div>
  );
}
