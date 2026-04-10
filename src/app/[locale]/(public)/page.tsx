"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { CollectionCard } from "@/components/marketplace/collection-card";
import { HeroSearch } from "@/components/marketplace/hero-search";
import { RulesetCard } from "@/components/marketplace/ruleset-card";
import { Shelf } from "@/components/marketplace/shelf";
import { ToolPicker } from "@/components/marketplace/tool-picker";
import { CommunityPreview } from "@/components/marketing/community-preview";
import { CreatorEconomics } from "@/components/marketing/creator-economics";
import { FeaturedRulesetCard } from "@/components/marketing/featured-ruleset-card";
import { FinalCTA } from "@/components/marketing/final-cta";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { QualityShowcase } from "@/components/marketing/quality-showcase";
import { SocialProofBar } from "@/components/marketing/social-proof-bar";
import { TrustStrip } from "@/components/marketing/trust-strip";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Stagger } from "@/components/motion/stagger";
import { ErrorState } from "@/components/ui/error-state";
import { ENVIRONMENT_META } from "@/constants/environments";
import { useCollections } from "@/hooks/use-collections";
import { usePreferredEnvironments } from "@/hooks/use-preferred-environments";
import { useRulesets } from "@/hooks/use-rulesets";
import { Link } from "@/i18n/navigation";
import { heroEntrance, heroChild } from "@/lib/motion/variants";

export default function LandingPage() {
  const t = useTranslations("landing");
  const tShelf = useTranslations("marketplace.shelf");
  const reduce = useReducedMotion();
  const { envs } = usePreferredEnvironments();
  const primaryEnv = envs[0] ?? "claude-code";
  const envLabel = ENVIRONMENT_META[primaryEnv]?.label ?? "Claude Code";

  const top = useRulesets({
    tab: "top",
    pageSize: 8,
    environment: primaryEnv,
  });
  const editors = useRulesets({ tab: "editors", pageSize: 8 });
  const fresh = useRulesets({ tab: "new", pageSize: 8 });
  const collections = useCollections();

  const isLoading =
    top.isLoading || editors.isLoading || fresh.isLoading || collections.isLoading;
  const hasError =
    !!top.error || !!editors.error || !!fresh.error || !!collections.error;

  return (
    <div>
      {/* ── Section 1: Hero ── */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 pb-12 pt-16 sm:px-6 lg:px-8">
        {/* Animated gradient background */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 animate-hero-gradient"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255, 209, 102, 0.08) 0%, rgba(148, 163, 184, 0.04) 40%, transparent 70%)",
          }}
        />

        <motion.div
          className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center"
          variants={heroEntrance}
          initial={reduce ? "visible" : "hidden"}
          animate="visible"
        >
          <motion.span
            variants={heroChild}
            className="text-xs font-medium uppercase tracking-widest text-fg-subtle"
          >
            {t("hero.eyebrow")}
          </motion.span>

          <motion.h1
            variants={heroChild}
            className="max-w-2xl text-balance font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl lg:text-5xl"
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p
            variants={heroChild}
            className="max-w-xl text-balance text-sm text-fg-muted sm:text-base"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div variants={heroChild} className="mt-2 w-full max-w-xl">
            <HeroSearch />
          </motion.div>

          <motion.div variants={heroChild} className="mt-1">
            <ToolPicker withLabel={false} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Section 2: Social Proof Bar ── */}
      <SocialProofBar />

      {/* ── Section 3: How It Works ── */}
      <HowItWorks />

      {/* ── Section 4: Quality Showcase ── */}
      <QualityShowcase />

      {/* ── Section 5: Curated Shelves ── */}
      <div className="mx-auto max-w-7xl space-y-14 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {hasError && (
          <ErrorState
            title={t("errors.title")}
            retry={() => {
              top.mutate();
              editors.mutate();
              fresh.mutate();
              collections.mutate();
            }}
          />
        )}

        {isLoading && !hasError && (
          <div className="space-y-10">
            {[0, 1, 2, 3].map((i) => (
              <ShelfSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && !hasError && (
          <>
            {/* Editor's Picks with featured first card */}
            {editors.data && editors.data.data.length > 0 && (
              <ScrollReveal>
                <section className="space-y-4">
                  <div className="flex items-end justify-between gap-4">
                    <h2 className="font-display text-lg font-semibold text-fg sm:text-xl">
                      {t("shelves.editorsPicks")}
                    </h2>
                    <Link
                      href="/browse?tab=editors"
                      className="shrink-0 text-sm text-fg-muted transition hover:text-fg"
                    >
                      {tShelf("seeAll")} &rarr;
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {editors.data.data.slice(0, 1).map((r) => (
                      <FeaturedRulesetCard key={r.id} ruleset={r} />
                    ))}
                    {editors.data.data.slice(1, 8).map((r) => (
                      <RulesetCard key={r.id} ruleset={r} compact />
                    ))}
                  </div>
                </section>
              </ScrollReveal>
            )}

            {top.data && top.data.data.length > 0 && (
              <ScrollReveal>
                <Shelf
                  title={`Top for ${envLabel}`}
                  rulesets={top.data.data}
                  href="/browse/top"
                />
              </ScrollReveal>
            )}

            {fresh.data && fresh.data.data.length > 0 && (
              <ScrollReveal>
                <Shelf
                  title={t("shelves.newThisWeek")}
                  rulesets={fresh.data.data}
                  href="/browse/new"
                />
              </ScrollReveal>
            )}

            {collections.data && collections.data.length > 0 && (
              <ScrollReveal>
                <section className="space-y-4">
                  <div className="flex items-end justify-between gap-4">
                    <h2 className="font-display text-lg font-semibold text-fg sm:text-xl">
                      {t("shelves.collections")}
                    </h2>
                    <Link
                      href="/collections"
                      className="text-sm text-fg-muted hover:text-fg"
                    >
                      {tShelf("seeAll")} &rarr;
                    </Link>
                  </div>
                  <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {collections.data.slice(0, 6).map((c) => (
                      <CollectionCard key={c.id} collection={c} />
                    ))}
                  </Stagger>
                </section>
              </ScrollReveal>
            )}
          </>
        )}
      </div>

      {/* ── Section 6: Creator Economics ── */}
      <CreatorEconomics />

      {/* ── Section 7: Trust Strip ── */}
      <TrustStrip />

      {/* ── Section 8: Community Preview ── */}
      <CommunityPreview />

      {/* ── Section 9: Final CTA ── */}
      <FinalCTA />
    </div>
  );
}

function ShelfSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-5 w-48 animate-pulse rounded bg-bg-surface/60" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-36 animate-pulse rounded-lg border border-border-soft bg-bg-surface/40"
          />
        ))}
      </div>
    </div>
  );
}
