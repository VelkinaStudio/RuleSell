import type { CreatorMark, ItemBadge } from "@/types";

export interface BadgeMeta {
  label: string;
  tooltip: string;
  icon: string;
  /** Tailwind color family. */
  accent: string;
}

export const ITEM_BADGE_META: Record<ItemBadge, BadgeMeta> = {
  VERIFIED: {
    label: "Verified",
    tooltip: "Staff reviewed, malware scanned, and install tested.",
    icon: "ShieldCheck",
    accent: "emerald",
  },
  MAINTAINER_VERIFIED: {
    label: "Maintainer Verified",
    tooltip: "Claimed by the original open-source author via GitHub.",
    icon: "BadgeCheck",
    accent: "sky",
  },
  EDITORS_PICK: {
    label: "Editor's Pick",
    tooltip: "Hand-picked by the RuleSell editorial team.",
    icon: "Star",
    accent: "amber",
  },
  QUALITY_A: {
    label: "Quality A",
    tooltip: "Top-tier measured quality: 85-100.",
    icon: "Medal",
    accent: "emerald",
  },
  QUALITY_B: {
    label: "Quality B",
    tooltip: "Strong measured quality: 70-84.",
    icon: "Medal",
    accent: "sky",
  },
  QUALITY_C: {
    label: "Quality C",
    tooltip: "Acceptable measured quality: 50-69.",
    icon: "Medal",
    accent: "zinc",
  },
  POPULAR: {
    label: "Popular",
    tooltip: "500+ verified installs in the last 30 days.",
    icon: "Flame",
    accent: "orange",
  },
  UPDATED: {
    label: "Updated",
    tooltip: "Updated within the last 90 days.",
    icon: "RefreshCw",
    accent: "cyan",
  },
  NEW: {
    label: "New",
    tooltip: "Published within the last 14 days.",
    icon: "Sparkles",
    accent: "pink",
  },
  OFFICIAL: {
    label: "Official",
    tooltip: "First-party RuleSell item.",
    icon: "ShieldHalf",
    accent: "violet",
  },
  FEATURED: {
    label: "Featured",
    tooltip: "Paid placement — clearly labeled as sponsored.",
    icon: "Zap",
    accent: "amber",
  },
  LICENSE: {
    label: "License",
    tooltip: "SPDX license badge.",
    icon: "FileText",
    accent: "zinc",
  },
};

export const CREATOR_MARK_META: Record<CreatorMark, BadgeMeta> = {
  VERIFIED_CREATOR: {
    label: "Verified Creator",
    tooltip: "Email, domain, and 2FA verified.",
    icon: "BadgeCheck",
    accent: "sky",
  },
  TRADER: {
    label: "Trader",
    tooltip: "DSA Art. 30 trader KYC complete — eligible for paid sales.",
    icon: "Briefcase",
    accent: "amber",
  },
  CERTIFIED_DEV: {
    label: "Certified Dev",
    tooltip: "Trusted reviewer — earns a cut on badged items.",
    icon: "Award",
    accent: "emerald",
  },
  PRO: {
    label: "Pro",
    tooltip: "Active Pro subscription.",
    icon: "Crown",
    accent: "amber",
  },
  TEAM: {
    label: "Team",
    tooltip: "Member of a verified team.",
    icon: "Users",
    accent: "violet",
  },
  MAINTAINER: {
    label: "Maintainer",
    tooltip: "Owner of a claimed GitHub project.",
    icon: "Wrench",
    accent: "cyan",
  },
  TOP_RATED: {
    label: "Top Rated",
    tooltip: "4.5+ average rating across 20+ items.",
    icon: "TrendingUp",
    accent: "rose",
  },
};
