import type { ReputationLevel } from "@/types";

export const REPUTATION_THRESHOLDS: Record<ReputationLevel, number> = {
  NEWCOMER: 0,
  MEMBER: 15,
  CONTRIBUTOR: 50,
  TRUSTED: 150,
  EXPERT: 300,
  AUTHORITY: 500,
};

const ORDERED_LEVELS: ReputationLevel[] = [
  "AUTHORITY",
  "EXPERT",
  "TRUSTED",
  "CONTRIBUTOR",
  "MEMBER",
  "NEWCOMER",
];

export interface ReputationLevelMeta {
  label: string;
  /** Tailwind color family. */
  accent: string;
  description: string;
}

export const REPUTATION_META: Record<ReputationLevel, ReputationLevelMeta> = {
  NEWCOMER: {
    label: "Newcomer",
    accent: "zinc",
    description: "Just getting started.",
  },
  MEMBER: {
    label: "Member",
    accent: "sky",
    description: "Published, verified, and participating.",
  },
  CONTRIBUTOR: {
    label: "Contributor",
    accent: "emerald",
    description: "Consistently ships quality assets.",
  },
  TRUSTED: {
    label: "Trusted",
    accent: "violet",
    description: "Community-vetted creator.",
  },
  EXPERT: {
    label: "Expert",
    accent: "amber",
    description: "Top-tier craft and review feedback.",
  },
  AUTHORITY: {
    label: "Authority",
    accent: "rose",
    description: "Recognized leader in their niche.",
  },
};

/**
 * Returns the highest reputation level for the given point total.
 * Descends through the thresholds from AUTHORITY down to NEWCOMER.
 */
export function reputationLevel(points: number): ReputationLevel {
  for (const level of ORDERED_LEVELS) {
    if (points >= REPUTATION_THRESHOLDS[level]) return level;
  }
  return "NEWCOMER";
}
