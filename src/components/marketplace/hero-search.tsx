"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface HeroSearchProps {
  className?: string;
  defaultValue?: string;
  autoFocus?: boolean;
}

export function HeroSearch({
  className,
  defaultValue = "",
  autoFocus,
}: HeroSearchProps) {
  const t = useTranslations("landing.hero");
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      router.push("/browse");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className={cn(
        "flex w-full max-w-xl items-center gap-2 rounded-lg border border-border-soft bg-bg-surface px-4 py-2.5 transition-colors",
        "focus-within:border-border-strong",
        className,
      )}
    >
      <Search className="h-4 w-4 shrink-0 text-fg-subtle" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t("searchPlaceholder")}
        autoFocus={autoFocus}
        aria-label={t("searchPlaceholder")}
        className="h-6 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-fg-subtle"
      />
      <button
        type="submit"
        className="shrink-0 rounded border border-border-soft px-3 py-1 text-xs font-medium text-fg-muted transition hover:border-border-strong hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        {t("searchSubmit")}
      </button>
    </form>
  );
}
