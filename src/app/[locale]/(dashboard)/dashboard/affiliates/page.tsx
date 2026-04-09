"use client";

import { Copy, ExternalLink, Link2, MousePointerClick, ShoppingCart, DollarSign } from "lucide-react";
import { useState } from "react";

import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function AffiliateDashboardPage() {
  const { data } = useSession();
  const user = data?.user;
  const username = user?.username ?? "you";
  const referralLink = `rulesell.dev/r/?ref=${username}`;
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(`https://${referralLink}`);
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

      {/* Referral link */}
      <section className="rounded-lg border border-border-soft bg-bg-surface p-4">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-fg-subtle" />
          <h2 className="text-sm font-medium text-fg">Your referral link</h2>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 rounded-md border border-border-soft bg-bg-raised px-3 py-2 font-mono text-xs text-fg-muted">
            https://{referralLink}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={copyLink}
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        <p className="mt-2 text-xs text-fg-dim">
          Append <code className="font-mono text-fg-subtle">?ref={username}</code> to
          any item URL to use a per-item link.
        </p>
      </section>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          icon={<MousePointerClick className="h-4 w-4" />}
          label="Clicks"
          value="0"
        />
        <StatCard
          icon={<ShoppingCart className="h-4 w-4" />}
          label="Conversions"
          value="0"
        />
        <StatCard
          icon={<DollarSign className="h-4 w-4" />}
          label="Earnings"
          value="$0.00"
        />
      </div>

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
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border-soft bg-bg-surface p-4">
      <div className="flex items-center gap-2 text-fg-subtle">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-fg">
        {value}
      </p>
    </div>
  );
}
