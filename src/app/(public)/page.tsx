import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { listRulesets } from "@/lib/rulesets/queries";
import { RulesetCard } from "@/components/rulesets/ruleset-card";
import Link from "next/link";

/* ── Static data ────────────────────────────────────── */

const categories = [
  { name: "System Prompts", slug: "system-prompts", d: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { name: "Cursor Rules", slug: "cursor-rules", d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
  { name: "n8n Workflows", slug: "n8n-workflows", d: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
  { name: "Agent Blueprints", slug: "agent-blueprints", d: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
  { name: "Automation Packs", slug: "automation", d: "M13 10V3L4 14h7v7l9-11h-7z" },
  { name: "Dev Productivity", slug: "dev-productivity", d: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { name: "Research Templates", slug: "research", d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { name: "Marketing Systems", slug: "marketing", d: "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
];

const trustItems = [
  { label: "Secure Checkout", d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { label: "Instant Access", d: "M13 10V3L4 14h7v7l9-11h-7z" },
  { label: "Verified Creators", d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "30-Day Refunds", d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
  { label: "Community Rated", d: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
];

const buyerSteps = [
  { num: "01", title: "Browse", desc: "Find proven AI assets by category, platform, or use case." },
  { num: "02", title: "Purchase", desc: "Secure checkout with instant access to your download." },
  { num: "03", title: "Deploy", desc: "Apply directly to your tools and workflows. Ready to go." },
];

const creatorSteps = [
  { num: "01", title: "Upload", desc: "Package your best prompts, rules, and workflow configs." },
  { num: "02", title: "Reach", desc: "Get discovered by developers, teams, and AI operators." },
  { num: "03", title: "Earn", desc: "Recurring revenue from your expertise. Sell once, earn always." },
];

const benefits = [
  { title: "Save Hours", desc: "Skip weeks of prompt engineering and config experimentation.", d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { title: "Expert Quality", desc: "Every asset is built by experienced AI practitioners.", d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { title: "Community Tested", desc: "Real ratings and reviews from builders who use them daily.", d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { title: "Deploy Instantly", desc: "Download and apply to your tools in minutes, not days.", d: "M13 10V3L4 14h7v7l9-11h-7z" },
];

const testimonials = [
  {
    quote: "Saved me two weeks of prompt engineering. The system prompts here are genuinely production-grade.",
    name: "Sarah Chen",
    role: "AI Engineer",
    initials: "SC",
  },
  {
    quote: "Listed my first n8n workflow pack and made $500 in the first month. The audience is exactly right.",
    name: "Marcus Webb",
    role: "Automation Consultant",
    initials: "MW",
  },
  {
    quote: "Every Cursor rule I've bought has been worth 10x the price. This is where real builders share work.",
    name: "Aisha Patel",
    role: "Full-Stack Developer",
    initials: "AP",
  },
];

/* ── Page ───────────────────────────────────────────── */

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

  const totalDownloads = rulesets.reduce((sum, r) => sum + r.downloadCount, 0);

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          1. Hero
          ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="hero-glow" aria-hidden="true" />

        <div className="container-page pt-20 pb-16 lg:pt-28 lg:pb-24">
          <div className="grid lg:grid-cols-[1fr,340px] gap-12 lg:gap-16 items-center">
            {/* Copy */}
            <div className="stagger-in">
              <p className="text-sm font-medium text-accent-green tracking-widest mb-6 font-mono uppercase">
                AI Configuration Marketplace
              </p>

              <h1 className="text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-tight mb-6 text-balance">
                <span className="text-text-primary">Buy proven AI assets.</span>
                <br />
                <span className="font-mono bg-gradient-to-r from-[#34d399] via-[#a78bfa] to-[#fbbf24] bg-clip-text text-transparent">
                  Deploy in minutes.
                </span>
              </h1>

              <p className="text-lg text-text-secondary leading-relaxed max-w-lg mb-8">
                The curated marketplace for system prompts, Cursor rules,
                n8n workflows, and agent blueprints — built and tested by
                expert builders.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-10">
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2.5 h-12 px-7 bg-accent-green text-text-inverse font-semibold rounded-xl hover:bg-accent-green-hover transition-colors text-[15px]"
                >
                  Browse Marketplace
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center h-12 px-7 border border-border-secondary text-text-primary font-semibold rounded-xl hover:border-border-hover hover:bg-bg-tertiary/40 transition-colors text-[15px]"
                >
                  Start Selling
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6">
                <div>
                  <span className="block text-2xl font-bold text-text-primary font-mono tabular-nums">
                    {rulesetTotal}+
                  </span>
                  <span className="text-xs text-text-tertiary uppercase tracking-wider">Products</span>
                </div>
                <div className="w-px h-8 bg-border-primary" />
                <div>
                  <span className="block text-2xl font-bold text-text-primary font-mono tabular-nums">
                    {creatorCount}
                  </span>
                  <span className="text-xs text-text-tertiary uppercase tracking-wider">Creators</span>
                </div>
                <div className="w-px h-8 bg-border-primary" />
                <div>
                  <span className="block text-2xl font-bold text-text-primary font-mono tabular-nums">
                    {totalDownloads.toLocaleString()}
                  </span>
                  <span className="text-xs text-text-tertiary uppercase tracking-wider">Downloads</span>
                </div>
              </div>
            </div>

            {/* Proof panel — floating product cards */}
            <div className="hidden lg:block relative" aria-hidden="true">
              <div className="absolute -inset-8 pointer-events-none">
                <div className="absolute top-8 left-4 w-48 h-48 bg-accent-green/8 rounded-full blur-3xl" />
                <div className="absolute bottom-8 right-4 w-48 h-48 bg-accent-purple/8 rounded-full blur-3xl" />
              </div>

              <div className="relative space-y-3">
                {rulesets.slice(0, 3).map((r, i) => (
                  <div
                    key={r.id}
                    className="stagger-in"
                    style={{ animationDelay: `${0.4 + i * 0.12}s` }}
                  >
                    <div
                      className={`card p-4 ${
                        i === 0 ? "translate-x-6" : i === 2 ? "-translate-x-2" : "translate-x-2"
                      }`}
                      style={{ animation: `float 6s ease-in-out infinite ${i * 2}s` }}
                    >
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <span className="text-sm font-medium text-text-primary truncate">
                          {r.title}
                        </span>
                        <span className="text-sm font-mono font-bold text-accent-green shrink-0">
                          {r.price === 0 ? "Free" : `$${r.price.toFixed(0)}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-tertiary">{r.author.name}</span>
                        <span className="text-[10px] uppercase tracking-wider text-text-tertiary px-1.5 py-0.5 rounded bg-bg-tertiary border border-border-primary">
                          {r.platform}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          2. Trust strip
          ═══════════════════════════════════════════════════ */}
      <section className="border-y border-border-primary bg-bg-secondary/30">
        <div className="container-page py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {trustItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-accent-green/70 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.d} />
                </svg>
                <span className="text-sm text-text-secondary whitespace-nowrap">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          3. Category discovery
          ═══════════════════════════════════════════════════ */}
      <section className="container-page section-gap">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Browse by Category</h2>
            <p className="text-sm text-text-tertiary">Find the right AI assets for your stack</p>
          </div>
          <Link
            href="/search"
            className="text-sm text-text-tertiary hover:text-accent-green transition-colors hidden md:block"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/search?category=${cat.slug}`}
              className="group p-5 rounded-2xl bg-bg-secondary border border-border-primary hover:border-border-hover hover:bg-bg-tertiary/50 transition-all duration-200 stagger-in"
              style={{ animationDelay: `${0.1 + i * 0.04}s` }}
            >
              <svg className="w-6 h-6 text-text-tertiary group-hover:text-accent-green transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={cat.d} />
              </svg>
              <h3 className="text-sm font-medium text-text-primary mt-3 group-hover:text-accent-green transition-colors">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          4. Featured products
          ═══════════════════════════════════════════════════ */}
      <section className="container-page section-gap pt-0">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-2xl font-bold text-text-primary">Trending This Week</h2>
          <Link
            href="/search"
            className="text-sm text-text-tertiary hover:text-accent-green transition-colors"
          >
            View all &rarr;
          </Link>
        </div>

        {rulesets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rulesets.map((r, i) => (
              <div
                key={r.id}
                className="stagger-in"
                style={{ animationDelay: `${0.1 + i * 0.04}s` }}
              >
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

      {/* ═══════════════════════════════════════════════════
          5. How it works
          ═══════════════════════════════════════════════════ */}
      <section className="border-y border-border-primary bg-bg-secondary/20">
        <div className="container-page section-gap">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-2">How It Works</h2>
            <p className="text-sm text-text-tertiary">
              Simple for buyers. Powerful for creators.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            {/* Buyers */}
            <div>
              <h3 className="text-xs font-semibold text-accent-green uppercase tracking-widest mb-8 font-mono">
                For Buyers
              </h3>
              <div className="space-y-8">
                {buyerSteps.map((step) => (
                  <div key={step.num} className="flex gap-5">
                    <span className="text-3xl font-bold font-mono text-border-hover leading-none shrink-0 w-10">
                      {step.num}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary mb-1.5">
                        {step.title}
                      </h4>
                      <p className="text-sm text-text-tertiary leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Creators */}
            <div>
              <h3 className="text-xs font-semibold text-accent-purple uppercase tracking-widest mb-8 font-mono">
                For Creators
              </h3>
              <div className="space-y-8">
                {creatorSteps.map((step) => (
                  <div key={step.num} className="flex gap-5">
                    <span className="text-3xl font-bold font-mono text-border-hover leading-none shrink-0 w-10">
                      {step.num}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary mb-1.5">
                        {step.title}
                      </h4>
                      <p className="text-sm text-text-tertiary leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          6. Why Ruleset
          ═══════════════════════════════════════════════════ */}
      <section className="container-page section-gap">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Why Ruleset</h2>
          <p className="text-sm text-text-tertiary max-w-md mx-auto">
            Stop building from scratch. Use proven AI assets that experts already built and tested.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className="p-6 rounded-2xl bg-bg-secondary border border-border-primary stagger-in"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="w-10 h-10 rounded-xl bg-accent-green-subtle border border-accent-green/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={b.d} />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-2">{b.title}</h3>
              <p className="text-sm text-text-tertiary leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          7. Testimonials / Social proof
          ═══════════════════════════════════════════════════ */}
      <section className="container-page section-gap pt-0">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Trusted by Builders</h2>
          <p className="text-sm text-text-tertiary">What our community says</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="p-6 rounded-2xl bg-bg-secondary border border-border-primary stagger-in"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-green/20 to-accent-purple/20 border border-border-primary flex items-center justify-center text-[11px] font-bold text-text-secondary">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{t.name}</p>
                  <p className="text-xs text-text-tertiary">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          8. Creator CTA
          ═══════════════════════════════════════════════════ */}
      <section className="container-page pb-24 pt-8">
        <div className="gradient-border p-8 md:p-12 text-center relative z-0">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4 text-balance">
            Turn your AI expertise into revenue.
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto mb-8 leading-relaxed">
            Package and sell your best system prompts, workflows, and agent configurations.
            Reach thousands of builders. Start earning from day one.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 h-12 px-7 bg-accent-green text-text-inverse font-semibold rounded-xl hover:bg-accent-green-hover transition-colors text-[15px]"
            >
              Start Selling — It&apos;s Free
            </Link>
            <Link
              href="/docs/creators"
              className="inline-flex items-center h-12 px-7 border border-border-secondary text-text-primary font-semibold rounded-xl hover:border-border-hover hover:bg-bg-tertiary/40 transition-colors text-[15px]"
            >
              Learn More
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-text-tertiary">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Zero listing fees
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Keep 85% of revenue
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Instant payouts
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
