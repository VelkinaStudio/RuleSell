"use client";

import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

interface CommunitySearchProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function CommunitySearch({
  value,
  onChange,
  className,
}: CommunitySearchProps) {
  const t = useTranslations("community");

  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-dim" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className={cn(
          "w-full rounded-lg border border-border-soft bg-bg-surface py-2 pl-9 pr-9 text-sm text-fg",
          "placeholder:text-fg-dim",
          "focus:border-brand/40 focus:outline-none focus:ring-1 focus:ring-brand/20",
          "transition",
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-dim hover:text-fg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
