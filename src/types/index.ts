// RuleSell — Reconciled type system
// Merges: frontend UI types + backend API response types
// Enums align with prisma/schema.prisma; UI-only extensions are additive.

// -----------------------------------------------------------------------------
// Core enums (aligned with Prisma schema)
// -----------------------------------------------------------------------------

export type Platform =
  | "CURSOR"
  | "VSCODE"
  | "OBSIDIAN"
  | "N8N"
  | "MAKE"
  | "CLAUDE"
  | "CHATGPT"
  | "GEMINI"
  | "OTHER";

export type Type =
  | "RULESET"
  | "PROMPT"
  | "WORKFLOW"
  | "AGENT"
  | "BUNDLE"
  | "DATASET";

export type Role = "USER" | "PRO" | "ADMIN";

export type Status = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "FLAGGED";

export type AccessLevel =
  | "PUBLIC"
  | "FREE_DOWNLOAD"
  | "PURCHASED"
  | "SUBSCRIPTION_ACTIVE"
  | "SUBSCRIPTION_EXPIRED"
  | "REFUNDED"
  | "AUTHOR";

// -----------------------------------------------------------------------------
// Additive UI enums (not in Prisma — used by frontend only)
// -----------------------------------------------------------------------------

export type Category =
  | "RULES"
  | "MCP_SERVER"
  | "SKILL"
  | "AGENT_TEAM"
  | "WORKFLOW"
  | "PROMPT"
  | "CLI"
  | "DATASET"
  | "BUNDLE";

export type Environment =
  | "claude-code"
  | "claude-desktop"
  | "cursor"
  | "windsurf"
  | "cline"
  | "continue"
  | "zed"
  | "codex"
  | "chatgpt"
  | "gemini-cli"
  | "aider"
  | "copilot"
  | "n8n"
  | "make"
  | "obsidian"
  | "custom";

export type VariantKind =
  | "mcp_json"
  | "claude_skill"
  | "cursor_rule"
  | "system_prompt"
  | "n8n_workflow"
  | "make_blueprint"
  | "crewai_agent"
  | "langgraph_agent"
  | "bash_install"
  | "npm_install"
  | "docker_compose"
  | "raw_file";

export type InstallMethod = "copy" | "download" | "command" | "json_snippet";

// -----------------------------------------------------------------------------
// Trust system (reputation, creator marks, item badges)
// -----------------------------------------------------------------------------

export type ReputationLevel =
  | "NEWCOMER"
  | "MEMBER"
  | "CONTRIBUTOR"
  | "TRUSTED"
  | "EXPERT"
  | "AUTHORITY";

export type CreatorMark =
  | "VERIFIED_CREATOR"
  | "TRADER"
  | "CERTIFIED_DEV"
  | "PRO"
  | "TEAM"
  | "MAINTAINER"
  | "TOP_RATED";

export type ItemBadge =
  | "VERIFIED"
  | "MAINTAINER_VERIFIED"
  | "EDITORS_PICK"
  | "QUALITY_A"
  | "QUALITY_B"
  | "QUALITY_C"
  | "POPULAR"
  | "UPDATED"
  | "NEW"
  | "OFFICIAL"
  | "FEATURED"
  | "LICENSE";

// -----------------------------------------------------------------------------
// Variant
// -----------------------------------------------------------------------------

export interface VariantRequirement {
  key: string;
  constraint: string;
}

export interface VariantInstall {
  method: InstallMethod;
  content: string;
  targetPath?: string;
  language?: string;
}

export interface Variant {
  id: string;
  environments: Environment[];
  kind: VariantKind;
  label: string;
  version: string;
  install: VariantInstall;
  instructions?: string;
  requirements?: VariantRequirement[];
  isPrimary?: boolean;
  qualityScore?: number;
  lastTestedAt?: string;
}

// -----------------------------------------------------------------------------
// Ruleset (primary entity)
// -----------------------------------------------------------------------------

export interface RulesetAuthor {
  username: string;
  avatar: string | null;
  reputation: number;
  creatorMarks: CreatorMark[];
  level: ReputationLevel;
}

export interface RulesetTeam {
  slug: string;
  name: string;
  avatar: string | null;
  verified: boolean;
}

export interface MaintainerClaim {
  githubRepo: string;
  claimedAt: string;
  verified: boolean;
}

export interface QualityBreakdown {
  tokenEfficiency: number | null;
  installSuccess: number | null;
  schemaClean: number | null;
  freshness: number;
  reviewScore: number;
  securityPass: boolean;
}

export interface ScanResults {
  virusTotalPass: boolean;
  semgrepPass: boolean;
  sandboxPass: boolean;
  scannedAt: string;
}

export interface Ruleset {
  id: string;
  slug: string;
  title: string;
  description: string;
  previewContent: string;
  platform: Platform;
  type: Type;
  category: Category;
  tags: string[];
  price: number;
  currency: string;
  downloadCount: number;
  purchaseCount: number;
  viewCount: number;
  avgRating: number;
  ratingCount: number;
  status: Status;
  createdAt: string;
  updatedAt: string;
  author: RulesetAuthor;
  currentUserVoted: boolean;
  currentUserSaved: boolean;
  currentUserAccess: AccessLevel;

  secondaryCategories: Category[];
  variants: Variant[];
  defaultVariantId: string;
  version: string;
  license: string;
  qualityScore: number;
  qualityBreakdown: QualityBreakdown;
  badges: ItemBadge[];
  team?: RulesetTeam;
  maintainerClaim?: MaintainerClaim;
  scanResults?: ScanResults;
}

// -----------------------------------------------------------------------------
// User
// -----------------------------------------------------------------------------

export interface BuilderStats {
  publishedCount: number;
  verifiedInstallCount: number;
  canSellPaid: boolean;
}

export interface SellerStats {
  traderVerified: boolean;
  paymentConnectStatus: "none" | "pending" | "verified";
  totalEarnings: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string | null;
  role: Role;
  reputation: number;
  level: ReputationLevel;
  creatorMarks: CreatorMark[];
  joinedAt: string;
  isAdultConfirmed: boolean;
  countryOfResidence: string;
  preferredEnvironments: Environment[];
  builderStats?: BuilderStats;
  sellerStats?: SellerStats;
  maintainerRepos?: string[];
}

// -----------------------------------------------------------------------------
// Review
// -----------------------------------------------------------------------------

export interface Review {
  id: string;
  rulesetId: string;
  author: RulesetAuthor;
  rating: number;
  title: string;
  body: string;
  verifiedInstall: boolean;
  environmentTested: Environment;
  helpfulCount: number;
  currentUserMarkedHelpful: boolean;
  createdAt: string;
  updatedAt: string;
  /** Present when fetched from /api/reviews/mine */
  ruleset?: {
    id: string;
    slug: string;
    title: string;
  };
}

// -----------------------------------------------------------------------------
// Team + Collection
// -----------------------------------------------------------------------------

export interface TeamMember {
  username: string;
  role: "owner" | "admin" | "member";
}

export interface Team {
  slug: string;
  name: string;
  description: string;
  avatar: string | null;
  verified: boolean;
  memberCount: number;
  members: TeamMember[];
  rulesetCount: number;
  totalEarnings: number;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  description: string;
  curatedBy: string;
  rulesetIds: string[];
  coverAsset?: string;
  itemCount: number;
  followerCount: number;
}

// -----------------------------------------------------------------------------
// Community — Discussions, Showcases, Notifications, Activity Feed
// -----------------------------------------------------------------------------

export type DiscussionCategory =
  | "qa"
  | "tips"
  | "bugs"
  | "feature_request"
  | "showcase";

export interface DiscussionReply {
  id: string;
  author: RulesetAuthor;
  body: string;
  reactions: number;
  isAnswer: boolean;
  createdAt: string;
}

export interface Discussion {
  id: string;
  rulesetId: string;
  title: string;
  category: DiscussionCategory;
  author: RulesetAuthor;
  body: string;
  replyCount: number;
  reactionCount: number;
  isPinned: boolean;
  createdAt: string;
  replies: DiscussionReply[];
}

export interface Showcase {
  id: string;
  title: string;
  description: string;
  author: RulesetAuthor;
  rulesetIds: string[];
  reactionCount: number;
  createdAt: string;
}

export type NotificationKind =
  | "reply"
  | "publish"
  | "milestone"
  | "update"
  | "follow";

export interface Notification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  href: string;
  read: boolean;
  createdAt: string;
}

export type ActivityKind =
  | "new_item"
  | "discussion_reply"
  | "item_update"
  | "trending"
  | "showcase";

export interface ActivityFeedItem {
  id: string;
  kind: ActivityKind;
  title: string;
  body: string;
  href: string;
  createdAt: string;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  description: string;
}

// -----------------------------------------------------------------------------
// Pagination and API response shapes (used by both frontend hooks and API routes)
// -----------------------------------------------------------------------------

export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextCursor?: string;
  prevCursor?: string;
}

export interface Page<T> {
  data: T[];
  pagination: Pagination;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// Backward-compat aliases for API routes that use the old names
export type PaginationMeta = Pagination;
export type ApiListResponse<T> = Page<T>;
export interface ApiSuccessResponse<T> {
  data: T;
}
export type ApiErrorResponse = ApiError;
export type ApiErrorDetail = ApiError["error"];
export type RulesetCardData = Ruleset;

// ─── Community: Polls ───
export interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  totalVotes: number;
  author: { username: string; avatarUrl: string | null };
  createdAt: string;
  endsAt: string | null;
  isActive: boolean;
  category?: string;
}

export interface PollOption {
  id: string;
  text: string;
  voteCount: number;
}

// ─── Community: Q&A ───
export interface QAQuestion {
  id: string;
  title: string;
  body: string;
  author: { username: string; avatarUrl: string | null; reputation: number };
  tags: string[];
  voteCount: number;
  answerCount: number;
  viewCount: number;
  acceptedAnswerId: string | null;
  createdAt: string;
}

export interface QAAnswer {
  id: string;
  questionId: string;
  body: string;
  author: { username: string; avatarUrl: string | null; reputation: number };
  voteCount: number;
  isAccepted: boolean;
  createdAt: string;
}

// ─── Community: Feature Requests ───
export type FeatureRequestStatus = "open" | "claimed" | "completed" | "declined";

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  author: { username: string; avatarUrl: string | null };
  voteCount: number;
  status: FeatureRequestStatus;
  claimedBy: string | null;
  linkedRulesetSlug: string | null;
  tags: string[];
  commentCount: number;
  createdAt: string;
}

// ─── Affiliate System ───
export interface AffiliateLink {
  id: string;
  userId: string;
  rulesetId: string | null; // null = general referral link
  rulesetTitle?: string;
  rulesetSlug?: string;
  code: string; // unique referral code
  url: string; // full URL with ?ref= param
  clicks: number;
  conversions: number;
  earnings: number;
  createdAt: string;
}

export interface AffiliateClick {
  id: string;
  linkId: string;
  referrer: string | null;
  country: string;
  createdAt: string;
  converted: boolean;
}

export interface AffiliateConversion {
  id: string;
  linkId: string;
  purchaseId: string;
  rulesetTitle: string;
  rulesetSlug: string;
  buyerUsername: string;
  saleAmount: number;
  commission: number;
  status: "pending" | "confirmed" | "paid";
  createdAt: string;
  confirmedAt: string | null;
  paidAt: string | null;
}

export interface AffiliatePayout {
  id: string;
  amount: number;
  conversions: number;
  period: string; // "2026-03" format
  status: "pending" | "processing" | "paid";
  paidAt: string | null;
}

export interface AffiliateTier {
  name: string;
  rate: number;
  threshold: number; // total earnings to reach this tier
}

export interface AffiliateStats {
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  thisMonthEarnings: number;
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  currentTier: AffiliateTier;
  nextTier: AffiliateTier | null;
  earningsToNextTier: number;
}

// ─── GitHub Integration ───────────────────────────────────────────────────────

export interface GitHubRepo {
  id: string;
  owner: string;
  name: string;
  fullName: string;
  description: string;
  starCount: number;
  language: string | null;
  license: string | null;
  lastCommitAt: string;
  defaultBranch: string;
  isPrivate: boolean;
  org?: { name: string; verified: boolean; avatarUrl: string };
}

export interface GitHubTreeEntry {
  path: string;
  type: "file" | "dir";
  size: number;
}

export interface GitHubSyncStatus {
  rulesetId: string;
  repoFullName: string;
  lastSyncAt: string;
  status: "synced" | "outdated" | "error";
  pendingChanges: number;
}

// ─── Admin Dashboard ───
export interface AdminStats {
  totalUsers: number;
  totalRulesets: number;
  totalRevenue: number;
  activeCreators: number;
  pendingReviews: number;
  openReports: number;
  monthlyGrowth: { users: number; rulesets: number; revenue: number };
}

export interface AdminReport {
  id: string;
  type: "spam" | "copyright" | "malicious" | "inappropriate" | "other";
  targetType: "ruleset" | "user" | "review" | "discussion";
  targetId: string;
  targetTitle: string;
  reporterUsername: string;
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  moderatorNote: string | null;
  createdAt: string;
  resolvedAt: string | null;
}

export interface AdminScanResult {
  rulesetId: string;
  rulesetTitle: string;
  rulesetSlug: string;
  virusTotal: "pass" | "fail" | "pending";
  semgrep: "pass" | "fail" | "warning" | "pending";
  sandbox: "pass" | "fail" | "pending";
  scannedAt: string;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  updatedAt: string;
}

export interface RevenueDataPoint {
  month: string;
  platformRevenue: number;
  sellerPayouts: number;
  refunds: number;
}

export interface ModerationAction {
  id: string;
  action: "approve" | "reject" | "flag" | "remove";
  targetType: "ruleset" | "user" | "review";
  targetId: string;
  reason: string;
  moderatorUsername: string;
  createdAt: string;
}
