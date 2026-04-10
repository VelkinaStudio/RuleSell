"use client";

import { useState } from "react";
import { Check, Code2, Copy, Image, LayoutTemplate } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "badge" as const, icon: Code2 },
  { key: "banner" as const, icon: Image },
  { key: "embed" as const, icon: LayoutTemplate },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const SNIPPETS: Record<TabKey, string> = {
  badge: `<!-- RuleSell Affiliate Badge -->
<a href="https://rulesell.dev/?ref=YOUR_CODE"
   target="_blank" rel="noopener noreferrer"
   style="display:inline-flex;align-items:center;gap:6px;
          padding:6px 14px;border-radius:8px;
          background:#1a1a1a;color:#FFD166;
          font-family:system-ui;font-size:13px;
          font-weight:600;text-decoration:none;
          border:1px solid rgba(255,209,102,0.2);">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
  Find it on RuleSell
</a>`,
  banner: `<!-- RuleSell Affiliate Banner (728x90) -->
<a href="https://rulesell.dev/?ref=YOUR_CODE"
   target="_blank" rel="noopener noreferrer"
   style="display:block;width:728px;max-width:100%;
          padding:16px 24px;border-radius:12px;
          background:linear-gradient(135deg,#1a1a1a 0%,#2a2a2a 100%);
          color:#fff;font-family:system-ui;
          text-decoration:none;
          border:1px solid rgba(255,209,102,0.15);">
  <div style="display:flex;align-items:center;
              justify-content:space-between;gap:16px;">
    <div>
      <div style="font-size:18px;font-weight:700;color:#FFD166;">
        RuleSell
      </div>
      <div style="font-size:13px;color:#999;margin-top:4px;">
        Verified AI development assets — rules, prompts, agents, workflows.
      </div>
    </div>
    <div style="padding:8px 16px;border-radius:8px;
                background:#FFD166;color:#1a1a1a;
                font-size:13px;font-weight:600;
                white-space:nowrap;">
      Browse marketplace &rarr;
    </div>
  </div>
</a>`,
  embed: `<!-- RuleSell Embed Widget -->
<iframe
  src="https://rulesell.dev/embed/card?ref=YOUR_CODE&slug=cursor-rules-pro"
  width="360"
  height="200"
  style="border:none;border-radius:12px;"
  loading="lazy"
  title="RuleSell asset card"
></iframe>`,
};

export function PromotionalMaterials() {
  const t = useTranslations("dashboard.affiliates");
  const [activeTab, setActiveTab] = useState<TabKey>("badge");
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(SNIPPETS[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="rounded-xl border border-border-soft bg-bg-surface">
      <header className="border-b border-border-soft px-5 py-4">
        <h2 className="text-sm font-semibold text-fg">{t("materialsTitle")}</h2>
        <p className="mt-0.5 text-xs text-fg-muted">{t("materialsDesc")}</p>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border-soft px-5 py-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveTab(tab.key);
                setCopied(false);
              }}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition",
                activeTab === tab.key
                  ? "bg-brand/15 text-brand"
                  : "text-fg-muted hover:text-fg hover:bg-bg-raised",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {t(`material_${tab.key}`)}
            </button>
          );
        })}
      </div>

      {/* Code block */}
      <div className="p-5">
        <div className="relative">
          <pre className="overflow-x-auto rounded-lg bg-bg-raised p-4 text-xs text-fg-muted font-mono leading-relaxed">
            <code>{SNIPPETS[activeTab]}</code>
          </pre>
          <Button
            type="button"
            variant={copied ? "default" : "outline"}
            size="sm"
            className={cn(
              "absolute right-3 top-3 gap-1.5 transition-all",
              copied &&
                "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700",
            )}
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                {t("copied")}
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                {t("copy")}
              </>
            )}
          </Button>
        </div>
        <p className="mt-3 text-[11px] text-fg-dim">
          {t("materialsTip")}
        </p>
      </div>
    </section>
  );
}
