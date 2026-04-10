"use client";

import { Check, Copy, DollarSign, ExternalLink, Link2, MousePointerClick, ShoppingCart, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

// Mock top-performing referrals — replace with real API data when available
const TOP_REFERRALS = [
  { rank: 1, slug: "cursor-rules-pro", title: "Cursor Rules Pro", conversions: 12, earnings: 4800 },
  { rank: 2, slug: "claude-code-system-prompt", title: "Claude Code System Prompt", conversions: 8, earnings: 3200 },
  { rank: 3, slug: "n8n-automation-workflows", title: "N8N Automation Workflows", conversions: 5, earnings: 1500 },
];

// Mock stat deltas — replace with real API data when available
const MOCK_DELTAS = {
  clicks: { value: 14.2, positive: true },
  conversions: { value: 5.1, positive: true },
  earnings: { value: -2.3, positive: false },
};

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export default function AffiliateDashboardPage() {
  const { data } = useSession();
  const user = data?.user;
  const username = user?.username ?? "you";
  const referralLink = `https://rulesell.dev/r/?ref=${username}`;
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-xl font-semibold text-fg">Affiliates</h1>
        <p className="mt-1 text-sm text-fg-muted">
          Share your referral link. Earn commission on purchases made through it.
        </p>
      </header>

      {/* Referral link — prominent */}
      <section className="rounded-xl border border-brand/20 bg-brand/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Link2 className="h-4 w-4 text-brand" />
          <h2 className="text-sm font-semibold text-fg">Your referral link</h2>
        </div>
        <div className="flex items-stretch gap-2">
          <div className="flex-1 rounded-lg border border-border-soft bg-bg-raised px-4 py-2.5 font-mono text-sm font-medium tracking-tight text-fg overflow-hidden overflow-ellipsis whitespace-nowrap">
            {referralLink}
          </div>
          <Button
            type="button"
            variant={copied ? "default" : "outline"}
            size="sm"
            className={cn(
              "shrink-0 gap-1.5 transition-all",
              copied && "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700",
            )}
            onClick={copyLink}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </>
            )}
          </Button>
        </div>
        <p className="mt-2.5 text-xs text-fg-dim">
          Append <code className="font-mono text-fg-subtle">?ref={username}</code> to
          any item URL to use a per-item link.
        </p>
      </section>

      {/* Stats grid with trend indicators */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          icon={<MousePointerClick className="h-4 w-4" />}
          label="Clicks"
          value="0"
          delta={MOCK_DELTAS.clicks}
        />
        <StatCard
          icon={<ShoppingCart className="h-4 w-4" />}
          label="Conversions"
          value="0"
          delta={MOCK_DELTAS.conversions}
        />
        <StatCard
          icon={<DollarSign className="h-4 w-4" />}
          label="Earnings"
          value="$0.00"
          delta={MOCK_DELTAS.earnings}
        />
      </div>

      {/* Top performing referrals */}
      <section className="rounded-xl border border-border-soft bg-bg-surface">
        <header className="border-b border-border-soft px-5 py-4">
          <h2 className="text-sm font-semibold text-fg">Top performing referrals</h2>
          <p className="mt-0.5 text-xs text-fg-muted">Your most successful referred items</p>
        </header>
        <ol className="divide-y divide-border-soft">
          {TOP_REFERRALS.map((item) => (
            <li key={item.slug} className="flex items-center gap-4 px-5 py-3">
              <span className="w-5 shrink-0 text-center text-xs font-bold tabular-nums text-fg-subtle">
                {item.rank}
              </span>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/r/${item.slug}`}
                  className="flex items-center gap-1 text-sm font-medium text-fg hover:text-brand"
                >
                  <span className="truncate">{item.title}</span>
                  <ExternalLink className="h-3 w-3 shrink-0 text-fg-subtle" aria-hidden />
                </Link>
                <p className="text-[11px] text-fg-subtle">
                  {item.conversions} conversion{item.conversions !== 1 ? "s" : ""}
                </p>
              </div>
              <p className="shrink-0 font-mono text-sm font-semibold tabular-nums text-emerald-300">
                {formatCents(item.earnings)}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Learn more */}
      <div className="rounded-lg border border-border-soft bg-bg-surface p-4 text-sm text-fg-muted">
        <p>
          Commissions are held for 30 days, then paid monthly via Stripe Connect
          once you reach the $50 minimum.{" "}
          <Link
            href="/affiliates"
            className="inline-flex items-center gap-1 text-fg hover:underline"
          >
            Learn more about the affiliate program
            <ExternalLink className="h-3 w-3" />
          </Link>
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  delta,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta?: { value: number; positive: boolean };
}) {
  return (
    <div className="rounded-lg border border-border-soft bg-bg-surface p-4">
      <div className="flex items-center gap-2 text-fg-subtle">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="text-2xl font-semibold tabular-nums text-fg">
          {value}
        </p>
        {delta && (
          <div
            className={cn(
              "mb-0.5 flex items-center gap-0.5 text-xs font-medium tabular-nums",
              delta.positive ? "text-emerald-400" : "text-rose-400",
            )}
          >
            {delta.positive ? (
              <TrendingUp className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" aria-hidden />
            )}
            {Math.abs(delta.value).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
}
