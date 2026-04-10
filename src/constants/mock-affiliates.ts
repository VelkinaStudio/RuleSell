import type {
  AffiliateLink,
  AffiliateClick,
  AffiliateConversion,
  AffiliatePayout,
  AffiliateTier,
} from "@/types";

// -----------------------------------------------------------------------------
// Commission tiers
// -----------------------------------------------------------------------------

export const AFFILIATE_TIERS: AffiliateTier[] = [
  { name: "Starter", rate: 0.10, threshold: 0 },
  { name: "Growth", rate: 0.15, threshold: 500 },
  { name: "Partner", rate: 0.20, threshold: 2000 },
];

// -----------------------------------------------------------------------------
// Reference date — all mock data is anchored to this so it stays deterministic
// -----------------------------------------------------------------------------

const NOW = new Date("2026-04-08T12:00:00Z");

// -----------------------------------------------------------------------------
// Rulesets referenced by affiliate links
// -----------------------------------------------------------------------------

const RULESETS = [
  { id: "rs-001", title: "Cursor Rules Pro", slug: "cursor-rules-pro" },
  { id: "rs-002", title: "Claude Code System Prompt", slug: "claude-code-system-prompt" },
  { id: "rs-003", title: "N8N Automation Workflows", slug: "n8n-automation-workflows" },
  { id: "rs-004", title: "Windsurf Config Pack", slug: "windsurf-config-pack" },
  { id: "rs-005", title: "Obsidian AI Templates", slug: "obsidian-ai-templates" },
  { id: "rs-006", title: "ChatGPT Mega Prompt", slug: "chatgpt-mega-prompt" },
  { id: "rs-007", title: "Gemini CLI Setup", slug: "gemini-cli-setup" },
  { id: "rs-008", title: "Copilot Custom Rules", slug: "copilot-custom-rules" },
  { id: "rs-009", title: "Aider Pair Config", slug: "aider-pair-config" },
  { id: "rs-010", title: "Cline Agent Pack", slug: "cline-agent-pack" },
  { id: "rs-011", title: "Continue Dev Rules", slug: "continue-dev-rules" },
];

// -----------------------------------------------------------------------------
// 12 Affiliate links
// -----------------------------------------------------------------------------

export const MOCK_AFFILIATE_LINKS: AffiliateLink[] = [
  {
    id: "afl-001",
    userId: "usr-mock-001",
    rulesetId: null,
    code: "REF-GENERAL",
    url: "https://rulesell.dev/?ref=REF-GENERAL",
    clicks: 842,
    conversions: 28,
    earnings: 14200,
    createdAt: "2025-10-15T09:00:00Z",
  },
  ...RULESETS.slice(0, 11).map((rs, i) => ({
    id: `afl-${String(i + 2).padStart(3, "0")}`,
    userId: "usr-mock-001",
    rulesetId: rs.id,
    rulesetTitle: rs.title,
    rulesetSlug: rs.slug,
    code: `REF-${rs.slug.toUpperCase().replace(/-/g, "").slice(0, 8)}`,
    url: `https://rulesell.dev/r/${rs.slug}?ref=REF-${rs.slug.toUpperCase().replace(/-/g, "").slice(0, 8)}`,
    clicks: Math.floor(120 + Math.sin(i * 1.7) * 80 + i * 30),
    conversions: Math.floor(4 + Math.sin(i * 2.3) * 3 + i * 1.2),
    earnings: Math.floor(1800 + Math.sin(i * 1.3) * 1200 + i * 600),
    createdAt: new Date(NOW.getTime() - (90 - i * 7) * 86400000).toISOString(),
  })),
];

// -----------------------------------------------------------------------------
// Generate 300+ AffiliateClick records over 90 days
// -----------------------------------------------------------------------------

function generateClicks(): AffiliateClick[] {
  const clicks: AffiliateClick[] = [];
  const referrers = [
    "https://twitter.com/devtools",
    "https://youtube.com/watch?v=xyz",
    "https://reddit.com/r/programming",
    "https://dev.to/article",
    null,
    "https://newsletter.example.com",
    "https://discord.gg/devs",
    null,
  ];
  const countries = ["US", "DE", "TR", "GB", "FR", "CA", "AU", "JP", "BR", "IN"];
  let id = 1;

  for (let day = 89; day >= 0; day--) {
    // Simulate daily clicks varying from 2 to 8, with a slight upward trend
    const baseCount = 3 + Math.floor(Math.sin(day * 0.3) * 2) + Math.floor((90 - day) / 30);
    const count = Math.max(1, baseCount);
    for (let c = 0; c < count; c++) {
      const linkIndex = (day + c) % MOCK_AFFILIATE_LINKS.length;
      const converted = Math.random() < 0.12; // ~12% conversion
      clicks.push({
        id: `afc-${String(id++).padStart(4, "0")}`,
        linkId: MOCK_AFFILIATE_LINKS[linkIndex].id,
        referrer: referrers[(day + c) % referrers.length],
        country: countries[(day * 3 + c) % countries.length],
        createdAt: new Date(
          NOW.getTime() - day * 86400000 + c * 3600000 + Math.floor(Math.random() * 3600000),
        ).toISOString(),
        converted,
      });
    }
  }
  return clicks;
}

export const MOCK_AFFILIATE_CLICKS: AffiliateClick[] = generateClicks();

// -----------------------------------------------------------------------------
// 40 AffiliateConversion records
// -----------------------------------------------------------------------------

const BUYER_NAMES = [
  "alex_dev", "sarah_ml", "code_ninja", "devops_dan", "react_queen",
  "python_pete", "rust_rita", "go_guru", "swift_sam", "kotlin_kate",
  "node_nat", "vue_vic", "angular_anna", "docker_dave", "k8s_kyle",
  "ml_maria", "data_diana", "ai_ali", "web3_will", "cloud_carl",
];

function generateConversions(): AffiliateConversion[] {
  const conversions: AffiliateConversion[] = [];
  const statuses: Array<AffiliateConversion["status"]> = [];

  // 10 pending, 20 confirmed, 10 paid
  for (let i = 0; i < 10; i++) statuses.push("pending");
  for (let i = 0; i < 20; i++) statuses.push("confirmed");
  for (let i = 0; i < 10; i++) statuses.push("paid");

  for (let i = 0; i < 40; i++) {
    const status = statuses[i];
    const daysAgo = Math.floor(i * 2.2) + 1;
    const createdAt = new Date(NOW.getTime() - daysAgo * 86400000).toISOString();
    const rs = RULESETS[i % RULESETS.length];
    const linkId = MOCK_AFFILIATE_LINKS[(i + 1) % MOCK_AFFILIATE_LINKS.length].id;
    const saleAmount = 900 + (i % 5) * 400; // $9 to $25 in cents
    const tierRate = i < 10 ? 0.10 : i < 20 ? 0.15 : 0.10;
    const commission = Math.round(saleAmount * tierRate);

    conversions.push({
      id: `aconv-${String(i + 1).padStart(3, "0")}`,
      linkId,
      purchaseId: `pur-${String(i + 1).padStart(4, "0")}`,
      rulesetTitle: rs.title,
      rulesetSlug: rs.slug,
      buyerUsername: BUYER_NAMES[i % BUYER_NAMES.length],
      saleAmount,
      commission,
      status,
      createdAt,
      confirmedAt:
        status === "confirmed" || status === "paid"
          ? new Date(NOW.getTime() - (daysAgo - 7) * 86400000).toISOString()
          : null,
      paidAt:
        status === "paid"
          ? new Date(NOW.getTime() - (daysAgo - 14) * 86400000).toISOString()
          : null,
    });
  }
  return conversions;
}

export const MOCK_AFFILIATE_CONVERSIONS: AffiliateConversion[] = generateConversions();

// -----------------------------------------------------------------------------
// 5 AffiliatePayout records
// -----------------------------------------------------------------------------

export const MOCK_AFFILIATE_PAYOUTS: AffiliatePayout[] = [
  {
    id: "apay-001",
    amount: 28400,
    conversions: 8,
    period: "2025-11",
    status: "paid",
    paidAt: "2025-12-01T10:00:00Z",
  },
  {
    id: "apay-002",
    amount: 31200,
    conversions: 10,
    period: "2025-12",
    status: "paid",
    paidAt: "2026-01-01T10:00:00Z",
  },
  {
    id: "apay-003",
    amount: 42100,
    conversions: 14,
    period: "2026-01",
    status: "paid",
    paidAt: "2026-02-01T10:00:00Z",
  },
  {
    id: "apay-004",
    amount: 38600,
    conversions: 12,
    period: "2026-02",
    status: "processing",
    paidAt: null,
  },
  {
    id: "apay-005",
    amount: 45200,
    conversions: 15,
    period: "2026-03",
    status: "pending",
    paidAt: null,
  },
];

// -----------------------------------------------------------------------------
// Monthly summaries (last 6 months)
// -----------------------------------------------------------------------------

export interface MonthlySummary {
  month: string; // "2025-11" format
  label: string; // "Nov 2025"
  clicks: number;
  conversions: number;
  earnings: number;
}

export const MOCK_MONTHLY_SUMMARIES: MonthlySummary[] = [
  { month: "2025-11", label: "Nov 2025", clicks: 320, conversions: 8, earnings: 28400 },
  { month: "2025-12", label: "Dec 2025", clicks: 410, conversions: 10, earnings: 31200 },
  { month: "2026-01", label: "Jan 2026", clicks: 520, conversions: 14, earnings: 42100 },
  { month: "2026-02", label: "Feb 2026", clicks: 480, conversions: 12, earnings: 38600 },
  { month: "2026-03", label: "Mar 2026", clicks: 580, conversions: 15, earnings: 45200 },
  { month: "2026-04", label: "Apr 2026", clicks: 190, conversions: 5, earnings: 12800 },
];

// -----------------------------------------------------------------------------
// Per-asset performance (top 8)
// -----------------------------------------------------------------------------

export interface AssetPerformance {
  rulesetId: string;
  rulesetTitle: string;
  rulesetSlug: string;
  clicks: number;
  conversions: number;
  earnings: number;
  conversionRate: number;
}

export const MOCK_ASSET_PERFORMANCE: AssetPerformance[] = [
  { rulesetId: "rs-001", rulesetTitle: "Cursor Rules Pro", rulesetSlug: "cursor-rules-pro", clicks: 312, conversions: 12, earnings: 4800, conversionRate: 3.85 },
  { rulesetId: "rs-002", rulesetTitle: "Claude Code System Prompt", rulesetSlug: "claude-code-system-prompt", clicks: 280, conversions: 8, earnings: 3200, conversionRate: 2.86 },
  { rulesetId: "rs-003", rulesetTitle: "N8N Automation Workflows", rulesetSlug: "n8n-automation-workflows", clicks: 195, conversions: 5, earnings: 1500, conversionRate: 2.56 },
  { rulesetId: "rs-004", rulesetTitle: "Windsurf Config Pack", rulesetSlug: "windsurf-config-pack", clicks: 178, conversions: 6, earnings: 2400, conversionRate: 3.37 },
  { rulesetId: "rs-005", rulesetTitle: "Obsidian AI Templates", rulesetSlug: "obsidian-ai-templates", clicks: 165, conversions: 4, earnings: 1200, conversionRate: 2.42 },
  { rulesetId: "rs-006", rulesetTitle: "ChatGPT Mega Prompt", rulesetSlug: "chatgpt-mega-prompt", clicks: 142, conversions: 5, earnings: 1900, conversionRate: 3.52 },
  { rulesetId: "rs-007", rulesetTitle: "Gemini CLI Setup", rulesetSlug: "gemini-cli-setup", clicks: 130, conversions: 3, earnings: 900, conversionRate: 2.31 },
  { rulesetId: "rs-008", rulesetTitle: "Copilot Custom Rules", rulesetSlug: "copilot-custom-rules", clicks: 118, conversions: 4, earnings: 1600, conversionRate: 3.39 },
];

// -----------------------------------------------------------------------------
// Available rulesets for link generation dropdown
// -----------------------------------------------------------------------------

export const AVAILABLE_RULESETS_FOR_LINKING = RULESETS.map((rs) => ({
  id: rs.id,
  title: rs.title,
  slug: rs.slug,
}));
