"use client";

import { useCallback, useState } from "react";

export type ReportTargetType =
  | "ruleset"
  | "review"
  | "user"
  | "team"
  | "comment"
  | "copyright";

export type ReportCategory =
  | "illegal"
  | "ip"
  | "malware"
  | "hate"
  | "sexual"
  | "harassment"
  | "privacy"
  | "fraud"
  | "other";

export interface ReportSubmission {
  targetType: ReportTargetType;
  targetId: string;
  category: ReportCategory;
  description: string;
  email?: string;
}

export interface ReportResult {
  ref: string;
  receivedAt: string;
}

const STORAGE_KEY = "rulesell:moderation-notices";

interface StoredNotice extends ReportSubmission, ReportResult {}

function generateRef(): string {
  // Simple human-readable ref e.g. "RPT-7K3F2A". 6 base32-ish chars.
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "RPT-";
  for (let i = 0; i < 6; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

function appendNotice(notice: StoredNotice) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const list = raw ? (JSON.parse(raw) as StoredNotice[]) : [];
    list.push(notice);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(-100)));
  } catch {
    // ignore — storage is optional
  }
}

/**
 * Mock POST /api/moderation/notices. Resolves after a small delay so the
 * UI shows a "submitting" state. Persists to localStorage so the
 * transparency page can read counters in v2.
 */
export function useReport() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ReportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (data: ReportSubmission): Promise<ReportResult | null> => {
    setSubmitting(true);
    setError(null);
    try {
      // Simulate network delay (DSA Art. 16 — confirm receipt without undue delay)
      await new Promise((resolve) => setTimeout(resolve, 600));
      const ref = generateRef();
      const receivedAt = new Date().toISOString();
      const notice: StoredNotice = { ...data, ref, receivedAt };
      appendNotice(notice);
      const r = { ref, receivedAt };
      setResult(r);
      return r;
    } catch (e) {
      setError(e instanceof Error ? e.message : "unknown");
      return null;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { submit, submitting, result, error, reset };
}
