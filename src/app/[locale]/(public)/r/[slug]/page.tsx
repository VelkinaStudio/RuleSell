"use client";

import { notFound } from "next/navigation";
import { use, useCallback, useState } from "react";

import { DiscussionList } from "@/components/community/discussion-list";
import { DiscussionThread } from "@/components/community/discussion-thread";
import { AboutSection } from "@/components/ruleset/about-section";
import { DetailHero } from "@/components/ruleset/detail-hero";
import { DetailSidebar } from "@/components/ruleset/detail-sidebar";
import { InstallBlock } from "@/components/ruleset/install-block";
import { LicenseCallout } from "@/components/ruleset/license-callout";
import { QualityBreakdown } from "@/components/ruleset/quality-breakdown";
import { RelatedGrid } from "@/components/ruleset/related-grid";
import { ReviewList } from "@/components/ruleset/review-list";
import { ErrorState } from "@/components/ui/error-state";
import { MOCK_DISCUSSIONS_BY_RULESET } from "@/constants/mock-discussions";
import { useRuleset } from "@/hooks/use-ruleset";
import { cn } from "@/lib/utils";

type DetailTab = "about" | "reviews" | "discussions";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function RulesetDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const { data: ruleset, error, isLoading, mutate } = useRuleset(slug);
  const [tab, setTab] = useState<DetailTab>("about");

  const onInstallClick = useCallback(() => {
    if (typeof window === "undefined") return;
    const target = document.getElementById("install");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (isLoading) return <DetailSkeleton />;

  if (error) {
    const apiError = error as Error & { code?: string };
    if (apiError.code === "NOT_FOUND") notFound();
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <ErrorState message={apiError.message} retry={() => mutate()} />
      </div>
    );
  }

  if (!ruleset) notFound();

  const discussions = MOCK_DISCUSSIONS_BY_RULESET[ruleset.id] ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero + sidebar */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 space-y-6">
          <DetailHero ruleset={ruleset} />
          <InstallBlock ruleset={ruleset} />
        </div>
        <div className="space-y-3 lg:sticky lg:top-20 lg:self-start">
          <DetailSidebar ruleset={ruleset} onInstallClick={onInstallClick} />
          <QualityBreakdown
            breakdown={ruleset.qualityBreakdown}
            total={ruleset.qualityScore}
          />
          <LicenseCallout ruleset={ruleset} />
        </div>
      </div>

      {/* Tabbed content */}
      <div className="mt-8">
        <div className="flex gap-1 border-b border-border-soft">
          <TabBtn active={tab === "about"} onClick={() => setTab("about")}>
            About
          </TabBtn>
          <TabBtn active={tab === "reviews"} onClick={() => setTab("reviews")}>
            Reviews
          </TabBtn>
          <TabBtn active={tab === "discussions"} onClick={() => setTab("discussions")}>
            Discussions{discussions.length > 0 ? ` (${discussions.length})` : ""}
          </TabBtn>
        </div>

        <div className="mt-6">
          {tab === "about" && (
            <div className="space-y-6">
              <AboutSection ruleset={ruleset} />
              <RelatedGrid ruleset={ruleset} />
            </div>
          )}
          {tab === "reviews" && <ReviewList ruleset={ruleset} />}
          {tab === "discussions" && (
            <div className="space-y-4">
              {discussions.length > 0 ? (
                <>
                  <DiscussionList discussions={discussions} rulesetSlug={ruleset.slug} />
                  <div className="space-y-3">
                    {discussions.slice(0, 3).map((d) => (
                      <DiscussionThread key={d.id} discussion={d} />
                    ))}
                  </div>
                </>
              ) : (
                <p className="py-8 text-center text-sm text-fg-muted">
                  No discussions yet. Be the first to start one.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabBtn({
  active, onClick, children,
}: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "relative -mb-px px-4 py-2.5 text-sm font-medium transition",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fg/20",
        active ? "text-fg" : "text-fg-subtle hover:text-fg-muted",
      )}
    >
      {children}
      {active && <span aria-hidden className="absolute inset-x-3 -bottom-px h-px bg-fg" />}
    </button>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-8 w-1/3 animate-pulse rounded bg-bg-surface/60" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-bg-surface/60" />
      <div className="h-48 animate-pulse rounded-lg bg-bg-surface/60" />
    </div>
  );
}
