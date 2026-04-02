"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const PLATFORMS = ["CURSOR", "VSCODE", "OBSIDIAN", "N8N", "MAKE", "GEMINI", "CLAUDE", "CHATGPT", "OTHER"];
const TYPES = ["RULESET", "PROMPT", "WORKFLOW", "AGENT", "BUNDLE", "DATASET"];
const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "trending", label: "Trending" },
  { value: "most_voted", label: "Most Voted" },
  { value: "most_downloaded", label: "Most Downloaded" },
];

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("cursor");
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const currentPlatform = searchParams.get("platform");
  const currentType = searchParams.get("type");
  const currentSort = searchParams.get("sort") || "newest";

  return (
    <div className="space-y-4">
      {/* Sort */}
      <div>
        <label className="block text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Sort</label>
        <div className="space-y-1">
          {SORTS.map((s) => (
            <button
              key={s.value}
              onClick={() => setFilter("sort", s.value)}
              className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                currentSort === s.value
                  ? "text-accent-green bg-accent-green-subtle"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Platform */}
      <div>
        <label className="block text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Platform</label>
        <div className="space-y-1">
          <button
            onClick={() => setFilter("platform", null)}
            className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
              !currentPlatform ? "text-accent-green bg-accent-green-subtle" : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
            }`}
          >
            All
          </button>
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => setFilter("platform", p)}
              className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                currentPlatform === p
                  ? "text-accent-green bg-accent-green-subtle"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Type */}
      <div>
        <label className="block text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Type</label>
        <div className="space-y-1">
          <button
            onClick={() => setFilter("type", null)}
            className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
              !currentType ? "text-accent-green bg-accent-green-subtle" : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
            }`}
          >
            All
          </button>
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setFilter("type", t)}
              className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                currentType === t
                  ? "text-accent-green bg-accent-green-subtle"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Clear all */}
      {(currentPlatform || currentType || searchParams.has("tags")) && (
        <button
          onClick={() => router.push(window.location.pathname)}
          className="text-xs text-status-error hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
