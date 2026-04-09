"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Ruleset } from "@/types";

/**
 * Stored shape: a partial Ruleset with the wizard step it's on.
 * Persisted to localStorage debounced 500ms after each update so we never
 * thrash the disk and never block UI render. Server-safe — never touches
 * window during SSR.
 */
export type WizardDraft = Partial<Ruleset> & {
  currentStep?: number;
  // Local-only fields used by the wizard for transient state.
  longDescription?: string;
  screenshots?: string[]; // data URLs (mock upload)
};

const PREFIX = "rulesell:draft:ruleset:";
const SAVE_DEBOUNCE_MS = 500;

function readDraft(key: string): WizardDraft {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as WizardDraft) : {};
  } catch {
    return {};
  }
}

export function usePublishDraft(id: string = "new") {
  const key = PREFIX + id;
  const [draft, setDraft] = useState<WizardDraft>(() => readDraft(key));
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced persist on every draft change.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(key, JSON.stringify(draft));
        setSavedAt(Date.now());
      } catch {
        // Quota or serialization issue — silently swallow in v1.
      }
    }, SAVE_DEBOUNCE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [draft, key]);

  const update = useCallback((patch: WizardDraft) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const replace = useCallback((next: WizardDraft) => {
    setDraft(next);
  }, []);

  const clear = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
    setDraft({});
    setSavedAt(null);
  }, [key]);

  return { draft, update, replace, clear, savedAt };
}
