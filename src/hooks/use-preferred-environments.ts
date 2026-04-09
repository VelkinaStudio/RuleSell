"use client";

import { useCallback, useSyncExternalStore } from "react";

import type { Environment } from "@/types";
import { useSession } from "./use-session";

const STORAGE_KEY = "rulesell:preferred-envs";
const CHANGE_EVENT = "rulesell:preferred-envs-change";

// Default to Claude Code when the user hasn't picked anything yet.
const DEFAULT: Environment[] = ["claude-code"];
const EMPTY: Environment[] = [];

// Cached snapshot — React 19's useSyncExternalStore REQUIRES getSnapshot to
// return a referentially stable value when nothing has changed, otherwise it
// throws "The result of getSnapshot should be cached to avoid an infinite loop."
//
// We cache the last raw localStorage string AND the parsed array, and only
// produce a new array reference when the raw string changes.
let cachedRaw: string | null | undefined = undefined;
let cachedSnapshot: Environment[] = DEFAULT;

function read(): Environment[] {
  if (typeof window === "undefined") return EMPTY;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cachedRaw) return cachedSnapshot;
  cachedRaw = raw;
  if (!raw) {
    cachedSnapshot = DEFAULT;
    return cachedSnapshot;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    cachedSnapshot = Array.isArray(parsed) ? (parsed as Environment[]) : EMPTY;
  } catch {
    cachedSnapshot = EMPTY;
  }
  return cachedSnapshot;
}

function write(envs: Environment[]) {
  if (typeof window === "undefined") return;
  const next = JSON.stringify(envs);
  // Pre-update the cache so the next read returns the new reference
  // immediately, without re-parsing.
  cachedRaw = next;
  cachedSnapshot = envs;
  window.localStorage.setItem(STORAGE_KEY, next);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      // Cross-tab change — invalidate cache so next read picks up new value.
      cachedRaw = undefined;
      callback();
    }
  };
  const onCustom = () => callback();
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onCustom);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onCustom);
  };
}

function getSnapshot(): Environment[] {
  return read();
}

function getServerSnapshot(): Environment[] {
  return DEFAULT;
}

/**
 * Reads/writes the user's preferred environments. For guests this is
 * persisted in localStorage; for authenticated users we still write to
 * localStorage and the mock layer would sync with `user.preferredEnvironments`
 * in a real backend. Returns a stable identity-aware array via
 * useSyncExternalStore so React 19 hydration is safe.
 */
export function usePreferredEnvironments() {
  const guestEnvs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { data } = useSession();
  const userEnvs = data?.user?.preferredEnvironments;

  // Authenticated users prefer the server value, fall back to local guest set
  // when the server hasn't been populated.
  const envs: Environment[] =
    userEnvs && userEnvs.length > 0 ? userEnvs : guestEnvs;

  const toggle = useCallback(
    (env: Environment) => {
      const current = read();
      const next = current.includes(env)
        ? current.filter((e) => e !== env)
        : [...current, env];
      write(next);
    },
    [],
  );

  const set = useCallback((envs: Environment[]) => {
    write(envs);
  }, []);

  const clear = useCallback(() => {
    write([]);
  }, []);

  return { envs, toggle, set, clear };
}
