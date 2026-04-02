export default function HomePage() {
  return (
    <div className="p-6">
      {/* Hero */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-accent-green uppercase tracking-widest mb-4">
          AI Configuration Marketplace
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight mb-4 font-mono">
          The stack behind<br />the best AI builders.
        </h1>
        <p className="text-text-secondary text-lg max-w-lg mb-6">
          Buy, sell, and share system prompts, Cursor rules, n8n workflows, and agent blueprints.
        </p>
        <div className="flex items-center gap-3 mb-4">
          <a
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-green text-text-inverse font-semibold rounded-md hover:bg-accent-green-hover transition-colors"
          >
            Browse Rulesets &rarr;
          </a>
          <a
            href="/sellers"
            className="inline-flex items-center px-5 py-2.5 border border-accent-green text-accent-green font-semibold rounded-md hover:bg-accent-green-subtle transition-colors"
          >
            Start Selling Free
          </a>
        </div>
        <div className="flex items-center gap-4 text-sm text-text-tertiary">
          <span>0 rulesets</span>
          <span>&middot;</span>
          <span>0 creators</span>
          <span>&middot;</span>
          <span>$0 paid to sellers</span>
        </div>
      </div>

      {/* Trust bar */}
      <div className="flex items-center gap-6 text-xs text-text-tertiary uppercase tracking-wider border-y border-border-primary py-3 mb-6">
        <span>Secure Checkout</span>
        <span>30-Day Refunds</span>
        <span>Verified Creators</span>
        <span>Instant Delivery</span>
      </div>

      {/* Tabs placeholder */}
      <div className="flex items-center gap-6 mb-6">
        {["Top", "New", "Trending", "Curated", "Following"].map((tab) => (
          <button
            key={tab}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
              tab === "Top"
                ? "text-text-primary border-text-primary"
                : "text-text-tertiary border-transparent hover:text-text-secondary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className="text-center py-16 text-text-tertiary">
        <p className="text-lg mb-2">No rulesets yet</p>
        <p className="text-sm">Be the first to publish a ruleset!</p>
      </div>
    </div>
  );
}
