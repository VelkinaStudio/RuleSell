"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Read a single cookie's value client-side. Returns undefined on the server
 * so this is safe to call during render in client components hydrated from
 * SSR. Used by `useGpcHonored` and `useGeoRestricted`.
 */
function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const prefix = `${name}=`;
  const found = document.cookie.split("; ").find((c) => c.startsWith(prefix));
  return found?.slice(prefix.length);
}

export interface CookieConsent {
  essential: true;
  analytics: boolean;
  ads: boolean;
  personalization: boolean;
  timestamp: string;
  version: "1.0";
}

const STORAGE_KEY = "rulesell:consent";
const EVENTS_KEY = "rulesell:consent-events";
const CHANGE_EVENT = "rulesell:consent-change";

/**
 * Returns true when the visitor's browser sent the Sec-GPC: 1 signal and
 * the proxy middleware honored it by writing the gpc_honored=1 cookie.
 * Used by the cookie banner to surface a "We honored your Global Privacy
 * Control signal" badge instead of asking again.
 *
 * Backed by useSyncExternalStore so it stays consistent across hydration
 * and never triggers the setState-in-effect lint rule.
 */
export function useGpcHonored(): boolean {
  return useSyncExternalStore(
    () => () => undefined, // GPC cookie is set once per request and not mutated
    () => readCookie("gpc_honored") === "1",
    () => false,
  );
}

/**
 * Returns true when the proxy middleware detected an OFAC sanctioned country
 * via the x-vercel-ip-country header. The actual block is enforced at the
 * signup form; this is a hint so the UI can show a banner earlier.
 */
export function useGeoRestricted(): boolean {
  return useSyncExternalStore(
    () => () => undefined,
    () => readCookie("geo_restricted") === "1",
    () => false,
  );
}

/**
 * Imperative read of the GPC cookie. Prefer `useGpcHonored()` inside React
 * components — this function exists for non-React contexts (event handlers,
 * effect bodies, server-side guards).
 */
export function isGpcHonored(): boolean {
  return readCookie("gpc_honored") === "1";
}

/**
 * Imperative read of the geo-restriction cookie. Prefer `useGeoRestricted()`
 * inside React components.
 */
export function isGeoRestricted(): boolean {
  return readCookie("geo_restricted") === "1";
}

/**
 * Imperatively reset stored consent so the banner reappears. Used by the
 * privacy settings page to re-open the preferences dialog.
 */
export function resetCookieConsent() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function readConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookieConsent;
  } catch {
    return null;
  }
}

function writeConsent(value: CookieConsent | null) {
  if (typeof window === "undefined") return;
  if (value) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  // Append an audit log entry for the transparency page.
  const eventsRaw = window.localStorage.getItem(EVENTS_KEY);
  const events = eventsRaw ? (JSON.parse(eventsRaw) as CookieConsent[]) : [];
  if (value) events.push(value);
  window.localStorage.setItem(EVENTS_KEY, JSON.stringify(events.slice(-50)));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(cb: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, cb);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, cb);
  };
}

function getServerSnapshot(): CookieConsent | null {
  return null;
}

export function useCookieConsent() {
  const consent = useSyncExternalStore(subscribe, readConsent, getServerSnapshot);

  const setConsent = useCallback(
    (next: Omit<CookieConsent, "timestamp" | "version" | "essential">) => {
      writeConsent({
        essential: true,
        ...next,
        timestamp: new Date().toISOString(),
        version: "1.0",
      });
    },
    [],
  );

  const acceptAll = useCallback(() => {
    setConsent({ analytics: true, ads: true, personalization: true });
  }, [setConsent]);

  const rejectAll = useCallback(() => {
    setConsent({ analytics: false, ads: false, personalization: false });
  }, [setConsent]);

  return { consent, setConsent, acceptAll, rejectAll };
}
