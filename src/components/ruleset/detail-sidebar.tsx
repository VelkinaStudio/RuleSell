"use client";

import { BadgeCheck, Copy, Download, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import type { Ruleset } from "@/types";
import { formatPrice } from "@/components/marketplace/_format";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface DetailSidebarProps {
  ruleset: Ruleset;
  onInstallClick: () => void;
  className?: string;
}

export function DetailSidebar({
  ruleset,
  onInstallClick,
  className,
}: DetailSidebarProps) {
  const t = useTranslations("ruleset");
  const isFree = ruleset.price === 0;

  return (
    <aside className={cn("space-y-3", className)}>
      {/* Price + CTA */}
      <div className="rounded-lg border border-border-soft bg-bg-surface p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-semibold tabular-nums text-fg">
            {isFree ? t("price.free") : formatPrice(ruleset.price, ruleset.currency)}
          </span>
          {!isFree && (
            <span className="text-xs text-fg-subtle">{t("price.perInstall")}</span>
          )}
        </div>
        <Button
          type="button"
          onClick={onInstallClick}
          variant="outline"
          className="mt-3 h-10 w-full gap-2 border-border-strong text-sm font-medium text-fg transition hover:border-brand hover:text-brand"
        >
          <Download className="h-4 w-4" />
          {isFree ? t("cta.install") : t("cta.purchase")}
        </Button>

        {/* Share & Earn */}
        <ShareAndEarn slug={ruleset.slug} />
      </div>

      {/* Maintainer claim */}
      {ruleset.maintainerClaim?.verified && (
        <div className="flex items-start gap-2.5 rounded-lg border border-border-soft bg-bg-surface p-3.5 text-sm">
          <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-fg-muted" />
          <div className="space-y-1">
            <p className="text-xs font-medium text-fg">Maintainer Verified</p>
            <p className="text-xs text-fg-subtle">
              Claimed by the original author of{" "}
              <a
                href={`https://github.com/${ruleset.maintainerClaim.githubRepo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-fg-muted hover:text-fg hover:underline"
              >
                {ruleset.maintainerClaim.githubRepo}
              </a>
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}

function ShareAndEarn({ slug }: { slug: string }) {
  const { data, status } = useSession();
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const username = data?.user?.username;
  const refUrl = `https://rulesell.dev/r/${slug}?ref=${username ?? "you"}`;

  function copyLink() {
    navigator.clipboard.writeText(refUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="mt-2 flex w-full items-center justify-center gap-1.5 text-xs text-fg-subtle transition hover:text-fg"
      >
        <Share2 className="h-3 w-3" />
        Share &amp; Earn
      </button>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="mt-2 rounded-md border border-border-soft bg-bg-raised p-2.5 text-center text-xs text-fg-muted">
        <Link href="/auth/login" className="text-fg hover:underline">
          Sign in
        </Link>{" "}
        to get your referral link.
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-2 rounded-md border border-border-soft bg-bg-raised p-2.5">
      <p className="text-[11px] text-fg-subtle">Copy your referral link</p>
      <div className="flex items-center gap-1.5">
        <div className="flex-1 truncate rounded border border-border-soft bg-bg px-2 py-1 font-mono text-[10px] text-fg-muted">
          {refUrl}
        </div>
        <button
          type="button"
          onClick={copyLink}
          className="shrink-0 rounded border border-border-soft p-1 text-fg-subtle transition hover:text-fg"
          aria-label="Copy referral link"
        >
          <Copy className="h-3 w-3" />
        </button>
      </div>
      {copied && (
        <p className="text-[10px] text-fg-subtle">Copied to clipboard</p>
      )}
      <p className="text-[10px] text-fg-dim">
        Earn 5–10% commission on purchases made through this link.
      </p>
    </div>
  );
}
