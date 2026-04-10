import type {
  AdminReport,
  AdminScanResult,
  AdminStats,
  FeatureFlag,
  RevenueDataPoint,
  User,
} from "@/types";

// ─── Platform stats ─────────────────────────────────────────────────────────

export const ADMIN_STATS: AdminStats = {
  totalUsers: 1247,
  totalRulesets: 342,
  totalRevenue: 28450,
  activeCreators: 89,
  pendingReviews: 15,
  openReports: 8,
  monthlyGrowth: { users: 12.3, rulesets: 8.7, revenue: 23.1 },
};

// ─── 50 users (mixed roles) ─────────────────────────────────────────────────

const BASE = "2025-09-01T12:00:00Z";

function u(
  n: number,
  name: string,
  username: string,
  role: User["role"],
  country: string,
  reputation: number,
  sellerSuspended = false,
): User {
  const isSeller = reputation > 100;
  return {
    id: `admin-user-${n}`,
    name,
    username,
    email: `${username}@example.com`,
    avatar: null,
    role,
    reputation,
    level: reputation >= 300 ? "EXPERT" : reputation >= 100 ? "TRUSTED" : reputation >= 30 ? "MEMBER" : "NEWCOMER",
    creatorMarks: isSeller ? ["VERIFIED_CREATOR", "TRADER"] : [],
    joinedAt: new Date(new Date(BASE).getTime() + n * 86400000 * 3).toISOString(),
    isAdultConfirmed: true,
    countryOfResidence: country,
    preferredEnvironments: ["claude-code", "cursor"],
    ...(isSeller
      ? {
          builderStats: { publishedCount: 2 + (n % 5), verifiedInstallCount: 40 + n * 8, canSellPaid: true },
          sellerStats: {
            traderVerified: !sellerSuspended,
            paymentConnectStatus: sellerSuspended ? "none" as const : "verified" as const,
            totalEarnings: 1200 + n * 340,
          },
        }
      : { builderStats: { publishedCount: n % 3, verifiedInstallCount: n * 2, canSellPaid: false } }),
  };
}

export const ADMIN_USERS: User[] = [
  // 3 ADMIN
  u(1, "System Admin", "sys-admin", "ADMIN", "US", 500),
  u(2, "Nalba Admin", "nalba-admin", "ADMIN", "TR", 480),
  u(3, "Baha Admin", "baha-admin", "ADMIN", "TR", 460),
  // 5 PRO
  u(4, "Elena Popescu", "elena-popescu", "PRO", "RO", 320),
  u(5, "Marcus Chen", "marcus-chen", "PRO", "US", 290),
  u(6, "Fatima Al-Rashid", "fatima-rashid", "PRO", "AE", 310),
  u(7, "Lars Eriksson", "lars-eriksson", "PRO", "SE", 275),
  u(8, "Chiara Rossi", "chiara-rossi", "PRO", "IT", 340),
  // 2 SUSPENDED sellers
  u(9, "Spam McSpamface", "spam-user-1", "USER", "XX", 120, true),
  u(10, "Bad Actor 42", "bad-actor-42", "USER", "XX", 140, true),
  // 40 regular USER
  ...Array.from({ length: 40 }, (_, i) => {
    const n = i + 11;
    const names = [
      "Aiko Yamada", "Ben Torres", "Celine Moreau", "Dmitri Volkov", "Eva Lindberg",
      "Felix Braun", "Gina Park", "Hugo Martinez", "Isla McLeod", "Jiro Nakamura",
      "Katja Novak", "Liam Walsh", "Mei-Lin Zhou", "Niko Papadopoulos", "Olga Ivanova",
      "Pablo Gutierrez", "Quinn Reilly", "Ravi Sharma", "Sofia Andersson", "Tarik Yilmaz",
      "Uma Krishnan", "Victor Dupont", "Wendy Chang", "Xavier Diaz", "Yuki Sato",
      "Zara Osman", "Andrei Popov", "Brigitte Keller", "Carlos Mendez", "Daria Kuznetsova",
      "Erik Johansson", "Freya Olsen", "Giovanni Bianchi", "Hana Kim", "Ivan Petrov",
      "Julia Schmidt", "Kenji Ito", "Linda Nguyen", "Mateo Garcia", "Nina Kowalski",
    ];
    const countries = ["US", "TR", "DE", "JP", "BR", "IN", "FR", "GB", "CA", "AU"];
    return u(
      n,
      names[i],
      names[i].toLowerCase().replace(/[\s']/g, "-"),
      "USER",
      countries[i % 10],
      5 + i * 6,
    );
  }),
];

// ─── 15 pending rulesets for moderation ──────────────────────────────────────

export interface PendingRuleset {
  id: string;
  slug: string;
  title: string;
  category: string;
  authorUsername: string;
  previewContent: string;
  submittedAt: string;
}

const MOD_TITLES = [
  "Advanced TypeScript Linter Rules",
  "Next.js 16 Server Component Patterns",
  "Cursor AI Code Review Workflow",
  "Claude Code Project Bootstrap",
  "React 19 Form Validation Agent",
  "Tailwind v4 Design System",
  "N8N Slack Notification Workflow",
  "Obsidian Knowledge Graph Builder",
  "Gemini CLI Research Pipeline",
  "MCP Server: PostgreSQL Explorer",
  "CrewAI Content Writer Team",
  "LangGraph RAG Agent",
  "Docker Compose Dev Stack",
  "VS Code Extension Scaffold",
  "Aider Pair Programming Config",
];

export const PENDING_RULESETS: PendingRuleset[] = MOD_TITLES.map((title, i) => ({
  id: `pending-${i + 1}`,
  slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  title,
  category: ["RULES", "SKILL", "WORKFLOW", "MCP_SERVER", "AGENT_TEAM", "PROMPT"][i % 6],
  authorUsername: ADMIN_USERS[4 + (i % 8)].username,
  previewContent: `# ${title}\n\nA high-quality ${["ruleset", "skill", "workflow", "MCP server", "agent team", "prompt"][i % 6]} that helps developers ${["write cleaner code", "ship faster", "automate testing", "explore databases", "generate content", "bootstrap projects"][i % 6]}.`,
  submittedAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
}));

// ─── 25 reports ──────────────────────────────────────────────────────────────

const REPORT_TYPES: AdminReport["type"][] = ["spam", "copyright", "malicious", "inappropriate", "other"];
const REPORT_STATUSES: AdminReport["status"][] = [
  // 12 pending, 8 resolved, 5 dismissed
  ...Array(12).fill("pending" as const),
  ...Array(8).fill("resolved" as const),
  ...Array(5).fill("dismissed" as const),
];

const REPORT_REASONS = [
  "Contains copied content from another creator without attribution.",
  "Spam: the description is SEO keyword stuffing with no real content.",
  "Includes obfuscated code that phones home to an unknown server.",
  "Inappropriate language in the ruleset description.",
  "The workflow downloads arbitrary binaries from untrusted sources.",
  "Claims to be official but is not affiliated with the project.",
  "Duplicate submission of an existing free ruleset, repackaged as paid.",
  "Review contains personal attacks against the author.",
  "The MCP server config includes hardcoded credentials.",
  "Agent team runs eval() on user input without sandboxing.",
];

export const ADMIN_REPORTS: AdminReport[] = Array.from({ length: 25 }, (_, i) => {
  const status = REPORT_STATUSES[i];
  return {
    id: `report-${i + 1}`,
    type: REPORT_TYPES[i % 5],
    targetType: (["ruleset", "user", "review", "discussion"] as const)[i % 4],
    targetId: `target-${i + 1}`,
    targetTitle: [
      "Malicious MCP Server", "Spam Ruleset v99", "Copied Workflow", "Offensive Review",
      "Untrusted Binary Agent", "Fake Official Skill", "Repackaged Free Item", "Toxic Comment",
      "Credential Leak Config", "Unsafe Eval Agent", "SEO Spam Prompt", "Plagiarized Dataset",
      "Phishing Workflow", "Hate Speech Discussion", "Obfuscated CLI Tool",
      "Unauthorized Fork", "Token Harvester", "Impersonation Profile", "Deceptive Bundle",
      "Scam Affiliate Link", "Broken Sandbox Agent", "Low-Quality Prompt", "Misleading Title",
      "Data Exfil Script", "Copyright Violation",
    ][i],
    reporterUsername: ADMIN_USERS[10 + (i % 15)].username,
    reason: REPORT_REASONS[i % 10],
    status,
    moderatorNote: status === "resolved" ? "Reviewed and action taken." : status === "dismissed" ? "False positive after investigation." : null,
    createdAt: new Date(Date.now() - (i + 1) * 86400000 * 1.2).toISOString(),
    resolvedAt: status !== "pending" ? new Date(Date.now() - i * 86400000 * 0.5).toISOString() : null,
  };
});

// ─── Revenue time series (12 months) ─────────────────────────────────────────

const MONTHS = [
  "2025-05", "2025-06", "2025-07", "2025-08", "2025-09", "2025-10",
  "2025-11", "2025-12", "2026-01", "2026-02", "2026-03", "2026-04",
];

export const REVENUE_DATA: RevenueDataPoint[] = MONTHS.map((month, i) => ({
  month,
  platformRevenue: 800 + i * 220 + Math.floor(Math.random() * 400),
  sellerPayouts: 2400 + i * 580 + Math.floor(Math.random() * 800),
  refunds: 80 + Math.floor(Math.random() * 120),
}));

// ─── 10 scan results ─────────────────────────────────────────────────────────

const SCAN_TITLES = [
  "Claude Code Bootstrap", "MCP PostgreSQL", "N8N Slack Flow", "CrewAI Writer",
  "LangGraph RAG", "Cursor Review", "Docker Dev Stack", "Aider Config",
  "Gemini Pipeline", "Obsidian KB Builder",
];

export const SCAN_RESULTS: AdminScanResult[] = SCAN_TITLES.map((title, i) => ({
  rulesetId: `scan-rs-${i + 1}`,
  rulesetTitle: title,
  rulesetSlug: title.toLowerCase().replace(/\s+/g, "-"),
  virusTotal: i === 3 ? "fail" : i === 7 ? "pending" : "pass",
  semgrep: i === 5 ? "warning" : i === 3 ? "fail" : i === 9 ? "pending" : "pass",
  sandbox: i === 3 ? "fail" : "pass",
  scannedAt: new Date(Date.now() - i * 86400000 * 2).toISOString(),
}));

// ─── 8 feature flags ─────────────────────────────────────────────────────────

export const FEATURE_FLAGS: FeatureFlag[] = [
  { id: "flag-1", name: "pro_tier", description: "Enable PRO subscription tier with premium features", enabled: true, updatedAt: "2026-03-15T10:00:00Z" },
  { id: "flag-2", name: "subscriptions", description: "Recurring subscription billing for rulesets", enabled: false, updatedAt: "2026-03-20T14:30:00Z" },
  { id: "flag-3", name: "ai_quality_scoring", description: "AI-powered quality scoring for submitted rulesets", enabled: true, updatedAt: "2026-04-01T09:00:00Z" },
  { id: "flag-4", name: "github_sync", description: "Two-way sync between GitHub repos and rulesets", enabled: true, updatedAt: "2026-04-05T11:00:00Z" },
  { id: "flag-5", name: "affiliate_program", description: "Affiliate referral program with commission tracking", enabled: true, updatedAt: "2026-03-28T16:00:00Z" },
  { id: "flag-6", name: "community_polls", description: "Community polls for feature prioritization", enabled: false, updatedAt: "2026-04-02T08:00:00Z" },
  { id: "flag-7", name: "admin_moderation_v2", description: "Enhanced moderation queue with AI-assisted review", enabled: false, updatedAt: "2026-04-08T12:00:00Z" },
  { id: "flag-8", name: "marketplace_search_v2", description: "Improved search with semantic matching and filters", enabled: true, updatedAt: "2026-04-06T15:00:00Z" },
];
