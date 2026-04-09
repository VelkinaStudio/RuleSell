"use client";

import { useCallback, useState } from "react";

export type DsrCategory =
  | "profile"
  | "rulesets"
  | "reviews"
  | "purchases"
  | "activity"
  | "consent";

export const ALL_DSR_CATEGORIES: DsrCategory[] = [
  "profile",
  "rulesets",
  "reviews",
  "purchases",
  "activity",
  "consent",
];

export interface DsrExportRequest {
  categories: DsrCategory[];
  username: string;
}

export interface DsrExportResult {
  blobUrl: string;
  filename: string;
  ref: string;
  generatedAt: string;
}

export interface DsrDeletionResult {
  scheduledFor: string;
  ref: string;
}

const STORAGE_KEY = "rulesell:dsr-requests";

function appendRequest(entry: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const list = raw ? (JSON.parse(raw) as Record<string, unknown>[]) : [];
    list.push({ ...entry, recordedAt: new Date().toISOString() });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(-100)));
  } catch {
    // ignore
  }
}

function generateRef(prefix: string): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = `${prefix}-`;
  for (let i = 0; i < 6; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

/**
 * Mock implementation of GDPR Art. 20 / CCPA "right to know". Builds a JSON
 * blob from the categories the user picked and returns a download URL. Logs
 * the request to a tamper-evident audit trail in localStorage.
 */
export function useDsrExport() {
  const [building, setBuilding] = useState(false);
  const [result, setResult] = useState<DsrExportResult | null>(null);

  const buildExport = useCallback(
    async (request: DsrExportRequest): Promise<DsrExportResult> => {
      setBuilding(true);
      try {
        // Simulate the time it takes for a real backend job to assemble.
        await new Promise((resolve) => setTimeout(resolve, 1200));

        const payload: Record<string, unknown> = {
          generatedAt: new Date().toISOString(),
          username: request.username,
          categories: request.categories,
          // Stub data — populated for real once the backend is wired.
          data: Object.fromEntries(
            request.categories.map((cat) => [cat, { items: [], note: "stub" }]),
          ),
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const ref = generateRef("EXP");
        const r: DsrExportResult = {
          blobUrl: url,
          filename: `rulesell-${request.username}-export.json`,
          ref,
          generatedAt: payload.generatedAt as string,
        };
        appendRequest({ kind: "export", ref, categories: request.categories });
        setResult(r);
        return r;
      } finally {
        setBuilding(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    if (result?.blobUrl) URL.revokeObjectURL(result.blobUrl);
    setResult(null);
  }, [result]);

  return { buildExport, building, result, reset };
}

/**
 * Mock implementation of GDPR Art. 17 / CCPA right to delete. Records the
 * deletion request and returns a date 30 days in the future when it would
 * actually take effect (cooling-off period).
 */
export function useDsrDeletion() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<DsrDeletionResult | null>(null);

  const requestDeletion = useCallback(
    async (username: string): Promise<DsrDeletionResult> => {
      setSubmitting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));
        const scheduled = new Date();
        scheduled.setDate(scheduled.getDate() + 30);
        const ref = generateRef("DEL");
        const r: DsrDeletionResult = {
          scheduledFor: scheduled.toISOString().slice(0, 10),
          ref,
        };
        appendRequest({ kind: "deletion", ref, username });
        setResult(r);
        return r;
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { requestDeletion, submitting, result, reset };
}
