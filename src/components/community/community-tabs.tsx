"use client";

import {
  BarChart3,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  Radio,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

export type CommunityTab =
  | "feed"
  | "discussions"
  | "polls"
  | "qa"
  | "showcases"
  | "requests";

const TAB_CONFIG: {
  key: CommunityTab;
  icon: typeof Radio;
  labelKey: string;
}[] = [
  { key: "feed", icon: Radio, labelKey: "feed" },
  { key: "discussions", icon: MessageSquare, labelKey: "discussions" },
  { key: "polls", icon: BarChart3, labelKey: "polls" },
  { key: "qa", icon: HelpCircle, labelKey: "qa" },
  { key: "showcases", icon: Sparkles, labelKey: "showcases" },
  { key: "requests", icon: Lightbulb, labelKey: "requests" },
];

interface CommunityTabsProps {
  active: CommunityTab;
  onChange: (tab: CommunityTab) => void;
}

export function CommunityTabs({ active, onChange }: CommunityTabsProps) {
  const t = useTranslations("community.tabs");

  return (
    <div className="mt-6 -mb-px flex gap-1 overflow-x-auto border-b border-border-soft scrollbar-none">
      {TAB_CONFIG.map(({ key, icon: Icon, labelKey }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={cn(
            "relative inline-flex shrink-0 items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fg/20",
            active === key
              ? "text-fg"
              : "text-fg-subtle hover:text-fg-muted",
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          {t(labelKey)}
          {active === key && (
            <span
              aria-hidden
              className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand"
            />
          )}
        </button>
      ))}
    </div>
  );
}
