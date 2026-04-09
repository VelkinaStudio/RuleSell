"use client";

import { CATEGORY_META, CATEGORY_ORDER } from "@/constants/categories";
import { ITEM_BADGE_META } from "@/constants/badges";
import { BadgeStack } from "@/components/ui/badge-stack";
import { CategoryChip } from "@/components/ui/category-chip";
import { CopyButton } from "@/components/ui/copy-button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { QualityBar } from "@/components/ui/quality-bar";
import { ReputationBadge } from "@/components/ui/reputation-badge";

const SURFACE_SWATCHES = [
  { name: "--bg", varName: "var(--bg)" },
  { name: "--bg-surface", varName: "var(--bg-surface)" },
  { name: "--bg-raised", varName: "var(--bg-raised)" },
  { name: "--bg-elevated", varName: "var(--bg-elevated)" },
];

const TEXT_TOKENS = [
  { name: "--fg", className: "text-fg" },
  { name: "--fg-muted", className: "text-fg-muted" },
  { name: "--fg-subtle", className: "text-fg-subtle" },
];

const ALL_BADGES = Object.keys(ITEM_BADGE_META) as Array<keyof typeof ITEM_BADGE_META>;

export default function TokensPreviewPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-12 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Design tokens</h1>
        <p className="text-fg-muted">
          Visual inventory for the RuleSell design system. Use this page to spot
          regressions when token values move.
        </p>
      </header>

      <Section title="Surface tokens">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SURFACE_SWATCHES.map((s) => (
            <div
              key={s.name}
              className="rounded-lg border border-border-soft p-4 text-xs"
              style={{ backgroundColor: s.varName }}
            >
              <div className="font-mono text-fg">{s.name}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Text tokens">
        <div className="space-y-2 rounded-lg border border-border-soft bg-bg-surface p-4">
          {TEXT_TOKENS.map((t) => (
            <p key={t.name} className={t.className}>
              <span className="font-mono text-xs">{t.name}</span> — The quick brown
              fox jumps over the lazy dog.
            </p>
          ))}
        </div>
      </Section>

      <Section title="Brand accent">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-lg bg-brand" />
          <div className="text-sm">
            <div className="font-mono text-fg">--brand</div>
            <div className="text-fg-muted">#FFD166 — used for CTAs and key interactive elements.</div>
          </div>
        </div>
      </Section>

      <Section title="Category accents">
        <div className="flex flex-wrap gap-2">
          {CATEGORY_ORDER.map((c) => (
            <CategoryChip key={c} category={c} />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORY_ORDER.map((c) => (
            <CategoryChip key={`${c}-active`} category={c} active onClick={() => undefined} />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-9">
          {CATEGORY_ORDER.map((c) => (
            <div
              key={`${c}-swatch`}
              className="aspect-square rounded-md"
              style={{ backgroundColor: CATEGORY_META[c].color }}
              title={`${CATEGORY_META[c].label} — ${CATEGORY_META[c].color}`}
            />
          ))}
        </div>
      </Section>

      <Section title="Item badges">
        <BadgeStack badges={ALL_BADGES} />
      </Section>

      <Section title="Reputation badges">
        <div className="flex flex-wrap gap-2">
          <ReputationBadge level="NEWCOMER" points={5} />
          <ReputationBadge level="MEMBER" points={32} />
          <ReputationBadge level="CONTRIBUTOR" points={92} />
          <ReputationBadge level="TRUSTED" points={184} />
          <ReputationBadge level="EXPERT" points={342} />
          <ReputationBadge level="AUTHORITY" points={612} />
        </div>
      </Section>

      <Section title="Quality bar">
        <div className="grid gap-4 sm:grid-cols-2">
          <QualityBar score={96} label="Token efficiency" />
          <QualityBar score={82} label="Install success" />
          <QualityBar score={64} label="Schema clean" />
          <QualityBar score={42} label="Reviews" />
        </div>
      </Section>

      <Section title="Copy button">
        <div className="flex flex-wrap items-center gap-3">
          <CopyButton text="npx @rulesell/example install" label="Copy command" />
          <CopyButton text='{"hello": "world"}' label="Copy JSON" />
        </div>
      </Section>

      <Section title="Empty state">
        <EmptyState
          title="No items match those filters"
          description="Try clearing one of the active filters to see more results."
        />
      </Section>

      <Section title="Error state">
        <ErrorState
          title="Failed to load shelf"
          message="The mock API returned an error. Click retry to fetch again."
          retry={() => undefined}
        />
      </Section>

      <Section title="Loading skeletons">
        <div className="grid gap-4 sm:grid-cols-2">
          <LoadingSkeleton variant="card" count={3} />
          <LoadingSkeleton variant="hero" />
        </div>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium uppercase tracking-wider text-fg-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}
