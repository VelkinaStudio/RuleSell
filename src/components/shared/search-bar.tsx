"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function SearchBar({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Cmd/Ctrl + K and "/" both focus search
      const isHotkey =
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") ||
        (e.key === "/" && document.activeElement?.tagName !== "INPUT");
      if (isHotkey) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    setOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      {!open ? (
        <button
          type="button"
          aria-label={t("openSearch")}
          onClick={() => setOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border-soft bg-bg-surface text-fg-muted transition hover:border-brand/60 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Search className="h-4 w-4" />
        </button>
      ) : (
        <form
          onSubmit={onSubmit}
          className="flex h-9 w-72 items-center gap-2 rounded-md border border-brand/60 bg-bg-surface px-3 shadow-[var(--shadow-glow-brand)]"
        >
          <Search className="h-4 w-4 text-fg-muted" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => {
              if (!value) setOpen(false);
            }}
            placeholder={t("searchPlaceholder")}
            className="h-full flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-fg-subtle"
            aria-label={t("search")}
          />
          <kbd className="hidden rounded border border-border-strong bg-bg-raised px-1.5 py-0.5 font-mono text-[10px] text-fg-muted sm:inline-flex">
            ⌘K
          </kbd>
        </form>
      )}
    </div>
  );
}
