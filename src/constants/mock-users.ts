import type { User } from "@/types";

// 20 deterministic users: 5 buyers, 5 builders, 5 sellers, 3 certified devs,
// 2 team-owning maintainers. IDs are `user-1` through `user-20`.

const BASE_DATE = "2025-09-01T12:00:00Z";

function buyer(
  n: number,
  name: string,
  username: string,
  country: string,
): User {
  return {
    id: `user-${n}`,
    name,
    username,
    email: `${username}@example.com`,
    avatar: null,
    role: "USER",
    reputation: 3 + n,
    level: "NEWCOMER",
    creatorMarks: [],
    joinedAt: BASE_DATE,
    isAdultConfirmed: true,
    countryOfResidence: country,
    preferredEnvironments: ["claude-code", "cursor"],
  };
}

function builder(
  n: number,
  name: string,
  username: string,
  country: string,
  published: number,
  installs: number,
): User {
  return {
    id: `user-${n}`,
    name,
    username,
    email: `${username}@example.com`,
    avatar: null,
    role: "USER",
    reputation: 20 + n * 4,
    level: "MEMBER",
    creatorMarks: ["VERIFIED_CREATOR"],
    joinedAt: BASE_DATE,
    isAdultConfirmed: true,
    countryOfResidence: country,
    preferredEnvironments: ["claude-code", "cursor", "windsurf"],
    builderStats: {
      publishedCount: published,
      verifiedInstallCount: installs,
      canSellPaid: false,
    },
  };
}

function seller(
  n: number,
  name: string,
  username: string,
  country: string,
  published: number,
  installs: number,
  earnings: number,
): User {
  return {
    id: `user-${n}`,
    name,
    username,
    email: `${username}@example.com`,
    avatar: null,
    role: "USER",
    reputation: 120 + n * 8,
    level: "TRUSTED",
    creatorMarks: ["VERIFIED_CREATOR", "TRADER"],
    joinedAt: BASE_DATE,
    isAdultConfirmed: true,
    countryOfResidence: country,
    preferredEnvironments: ["claude-code", "cursor", "windsurf", "cline"],
    builderStats: {
      publishedCount: published,
      verifiedInstallCount: installs,
      canSellPaid: true,
    },
    sellerStats: {
      traderVerified: true,
      paymentConnectStatus: "verified",
      totalEarnings: earnings,
    },
  };
}

function certifiedDev(
  n: number,
  name: string,
  username: string,
  country: string,
  reputation: number,
): User {
  return {
    id: `user-${n}`,
    name,
    username,
    email: `${username}@example.com`,
    avatar: null,
    role: "USER",
    reputation,
    level: reputation >= 300 ? "EXPERT" : "TRUSTED",
    creatorMarks: ["VERIFIED_CREATOR", "CERTIFIED_DEV"],
    joinedAt: BASE_DATE,
    isAdultConfirmed: true,
    countryOfResidence: country,
    preferredEnvironments: [
      "claude-code",
      "cursor",
      "windsurf",
      "cline",
      "codex",
      "gemini-cli",
    ],
    builderStats: {
      publishedCount: 4,
      verifiedInstallCount: 280,
      canSellPaid: true,
    },
  };
}

function maintainer(
  n: number,
  name: string,
  username: string,
  country: string,
  repos: string[],
  earnings: number,
): User {
  return {
    id: `user-${n}`,
    name,
    username,
    email: `${username}@example.com`,
    avatar: null,
    role: "USER",
    reputation: 420 + n * 12,
    level: "AUTHORITY",
    creatorMarks: ["VERIFIED_CREATOR", "MAINTAINER", "TEAM", "TOP_RATED"],
    joinedAt: BASE_DATE,
    isAdultConfirmed: true,
    countryOfResidence: country,
    preferredEnvironments: ["claude-code", "cursor", "windsurf"],
    builderStats: {
      publishedCount: 12,
      verifiedInstallCount: 2400,
      canSellPaid: true,
    },
    sellerStats: {
      traderVerified: true,
      paymentConnectStatus: "verified",
      totalEarnings: earnings,
    },
    maintainerRepos: repos,
  };
}

export const MOCK_USERS: User[] = [
  // --- 5 buyers ---
  buyer(1, "Alex Rivera", "alex-rivera", "US"),
  buyer(2, "Mina Tanaka", "mina-tanaka", "JP"),
  buyer(3, "Lukas Weber", "lukas-weber", "DE"),
  buyer(4, "Zehra Aydin", "zehra-aydin", "TR"),
  buyer(5, "Jordan Pierce", "jordan-pierce", "US"),

  // --- 5 builders (free items only, under 50 installs) ---
  builder(6, "Priya Menon", "priya-menon", "IN", 2, 18),
  builder(7, "Marc Beaulieu", "marc-beaulieu", "CA", 3, 32),
  builder(8, "Sara Kowalski", "sara-kowalski", "PL", 1, 6),
  builder(9, "Daniel Ohta", "daniel-ohta", "JP", 3, 41),
  builder(10, "Emeka Chukwu", "emeka-chukwu", "NG", 2, 14),

  // --- 5 sellers (canSellPaid, Stripe verified) ---
  seller(11, "Helena Costa", "helena-costa", "PT", 6, 612, 248_500),
  seller(12, "Ravi Prasad", "ravi-prasad", "IN", 4, 331, 92_400),
  seller(13, "Noa Bar-Lev", "noa-bar-lev", "IL", 8, 1240, 384_200),
  seller(14, "Ege Koc", "ege-koc", "TR", 3, 184, 52_800),
  seller(15, "Finn O'Connor", "finn-oconnor", "IE", 5, 498, 131_650),

  // --- 3 certified devs ---
  certifiedDev(16, "Yuki Tomoda", "yuki-tomoda", "JP", 312),
  certifiedDev(17, "Claire Dubois", "claire-dubois", "FR", 248),
  certifiedDev(18, "Samuel Adeyemi", "samuel-adeyemi", "GB", 486),

  // --- 2 team-owning maintainers ---
  maintainer(
    19,
    "Anthropic Skills Team",
    "anthropic-skills",
    "US",
    ["anthropics/skills", "anthropics/claude-cookbooks"],
    1_420_000,
  ),
  maintainer(
    20,
    "Windsurf Collective",
    "windsurf-collective",
    "US",
    ["Codeium/windsurf-rules"],
    742_000,
  ),
];

export const MOCK_USERS_BY_ID: Record<string, User> = Object.fromEntries(
  MOCK_USERS.map((u) => [u.id, u]),
);

export const MOCK_USERS_BY_USERNAME: Record<string, User> = Object.fromEntries(
  MOCK_USERS.map((u) => [u.username, u]),
);
