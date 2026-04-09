# RuleSell — Research Synthesis

**Date:** 2026-04-08
**Status:** Final — closes out the research wave
**Inputs:** 6 research files in `docs/research/2026-04-08-*.md` (~1900 lines total)

This document reconciles the 6 research streams into a single set of design-ready answers.
The brainstorming flow resumes from here with concrete direction instead of open questions.

---

## 1. The market problem, reframed

**The dev-tool AI asset space is structurally unmonetized.** Every major marketplace (mcpmarket 10K+ servers, mcp.so 19K, glama 21K, skills.sh 91K, cursor.directory 63K community, smithery 3K, claudemarketplaces 2.4K skills + 770 MCP + 2.5K marketplaces) is **free-only on both sides**. Creators earn nothing. The only paid surface that works in 2026 is **n8n workflows on third-party marketplaces** ($19 typical price, one creator at $3.2K/mo passively) and **PromptBase** — which is itself struggling with supply > demand imbalance.

The category is waiting for a real marketplace. We are not chasing incumbents; we are filling a gap they all declined to fill.

**However** — scale has become an anti-feature. A 91K skill directory is worse than a 500 skill directory because discovery collapses and agent performance degrades (~3× latency on skill discovery once too many exist). Quote from direct research: *"A curated 500 is worth more than everything under the sun."*

## 2. The three winnable gaps

From the competitor teardown, triangulated with user-demand quotes:

1. **Real creator payouts with a ≥75% split.** JetBrains sets the bar. Nobody in our adjacent space does this. This is the supply-side wedge.
2. **Per-environment variant packaging.** Smithery proved the tab-pattern works for MCP servers specifically. Nobody has generalized it to rules, skills, and workflows. cursor.directory, awesome-cursorrules, claudemarketplaces — all treat an item as a single artifact with no cross-client metadata. This is the user-experience wedge.
3. **Verified install + measured quality scoring.** Top-starred MCPs are "consistently the worst performers on token efficiency — star count is a negative quality signal" (HN). **100% of surveyed MCPs have at least one quality issue.** Token costs vary **440×** between equivalent servers. Nobody measures this. This is the trust wedge, and it's the most load-bearing one post-postmark-mcp incident (Sept 2025, first confirmed malicious MCP on npm, 1,500 installs/week, silently BCC'd every agent email).

**Our product thesis:** a curated, verified, measurable marketplace where creators actually get paid, built for multi-environment variant packaging from day one.

## 3. Actor model — finalized

Built on the existing RuleSell scaffold (which was roughly right) and hardened with compliance requirements.

| Role | Capabilities | Gating |
|---|---|---|
| **Visitor** | Browse, search, copy install commands, install free items (no auth) | — |
| **User** | + save, follow, vote, comment on owned items, purchase | Email verify + 18+ |
| **Pro** | + private collections, install history, early access, advanced filters | $8/mo (deferred to after traction) |
| **Builder** | + publish FREE items only (skip KYC entirely) | User with verified email |
| **Seller (Trader)** | + publish PAID items, receive payouts | Builder + Stripe Connect Express + DSA Art. 30 trader verification |
| **Certified Dev** | + write verified-install reviews, earn reviewer cut on badged items | 200+ rep, OR peer-vouched by 3 Certified Devs, OR staff-approved |
| **Team** | Multi-seat org, shared publishing, shared earnings split, team profile | Any Seller creates an org |
| **Verified Team** | + Certified Dev privileges at team level, team badge | Staff review |
| **Maintainer** | Original author of a linked open-source repo — can claim the listing, add paid extensions, set fork policy | Verified GitHub ownership (OAuth + repo check) |
| **Admin** | Everything | Platform staff |

**Key choices locked in:**
- Builder-vs-Seller split is non-negotiable — it lets free OSS publishers skip KYC, which is critical for supply.
- Maintainer role is new and load-bearing — it lets original authors claim their listings and monetize extensions without forking.
- Certified Dev is not a badge, it's a role with earning power (2-3% of badged item sales). This is the reviewer incentive that makes reviews trustworthy.
- DSA Art. 30 KYC is forced on Sellers only. Builders stay frictionless.

## 4. Trust system — separate item badges and creator marks

**Item badges** (shown on cards and detail pages):
- `Verified` — staff-reviewed, malware-scanned, install-tested. Required for paid items.
- `Maintainer Verified` — claimed by the original OSS author.
- `Editor's Pick` — monthly curated by staff.
- `Quality A/B/C` — measured token efficiency, schema cleanliness, install success rate (from the glama.ai pattern, but enforced). Default marketplace sort is by Quality score, not by downloads.
- `Popular` — ≥500 verified installs in 30d.
- `Updated` — green dot if updated <90d.
- `New` — <14d.
- `Official` — first-party RuleSell-made.
- `Featured` — paid placement, clearly labeled.
- **License badge** — SPDX identifier (MIT, Apache-2.0, GPL-3.0, CC-BY-NC, Commercial, etc.) with commercial/non-commercial color coding.

**Creator marks** (on avatars and profiles, visually distinct from item badges):
- `Verified Creator` — email + domain + 2FA.
- `Trader` — DSA Art. 30 compliant, required to sell paid.
- `Certified Dev` — ring around avatar.
- `Pro` — different ring.
- `Team` — team badge.
- `Maintainer` — linked to at least one verified OSS project.
- `Top Rated` — 4.5+ across 20+ items.
- Reputation level: Newcomer → Member → Contributor → Trusted → Expert → Authority.

**Quality score (new, research-backed):** default marketplace sort. Measured properties:
- Token efficiency (actual measured for MCP servers; self-declared for others)
- Install success rate (from CLI telemetry)
- Schema cleanliness / JSON validation
- Time since last update
- Verified-install review average (weighted by reviewer reputation)
- Security scan pass (VirusTotal + Semgrep + sandbox dry-run)

The Quality score is the single most important differentiator in our research. It's what no competitor has.

## 5. Data model — finalized with research-backed shape

The user's required schema (`Ruleset`, `Platform`, `Type`, `currentUserAccess`) is our contract. We extend it minimally to support the research-backed requirements.

```ts
type Platform = 'CURSOR' | 'VSCODE' | 'OBSIDIAN' | 'N8N' | 'MAKE'
              | 'CLAUDE' | 'CHATGPT' | 'GEMINI' | 'CUSTOM';

type Type = 'RULESET' | 'PROMPT' | 'WORKFLOW' | 'AGENT' | 'BUNDLE' | 'DATASET';

// NEW — we extend the contract where the research requires it
type Category =
  | 'RULES' | 'MCP_SERVER' | 'SKILL' | 'AGENT_TEAM' | 'WORKFLOW'
  | 'PROMPT' | 'CLI' | 'DATASET' | 'BUNDLE';

type Environment =
  | 'claude-code' | 'claude-desktop' | 'cursor' | 'windsurf' | 'cline'
  | 'continue' | 'zed' | 'codex' | 'chatgpt' | 'gemini-cli' | 'aider'
  | 'copilot' | 'n8n' | 'make' | 'obsidian' | 'custom';

type VariantKind =
  | 'mcp_json' | 'claude_skill' | 'cursor_rule' | 'system_prompt'
  | 'n8n_workflow' | 'make_blueprint' | 'crewai_agent' | 'langgraph_agent'
  | 'bash_install' | 'npm_install' | 'docker_compose' | 'raw_file';

type InstallMethod = 'copy' | 'download' | 'command' | 'json_snippet';

interface Variant {
  id: string;
  environments: Environment[];      // array — one variant can cover multiple clients
  kind: VariantKind;
  label: string;                     // "Claude Code · Cursor · Windsurf"
  version: string;                   // independent semver per variant
  install: {
    method: InstallMethod;
    content: string;                 // the code/config blob
    targetPath?: string;             // "~/.cursor/mcp.json" — renders as paste target
    language?: string;               // highlight hint
  };
  instructions?: string;             // markdown
  requirements?: { key: string; constraint: string }[];
  isPrimary?: boolean;
  qualityScore?: number;             // 0-100, measured per-variant
}

interface Ruleset {
  id: string;
  slug: string;
  title: string;
  description: string;
  previewContent: string;            // 3-5 lines for the card
  platform: Platform;                 // the contract's field — primary platform
  type: Type;                         // the contract's field
  primaryCategory: Category;          // NEW — drives URLs/breadcrumbs
  secondaryCategories: Category[];    // NEW — max 2, drives cross-shelf
  tags: string[];
  variants: Variant[];                // NEW — multi-environment support
  defaultVariantId: string;           // NEW
  version: string;                    // product-level semver
  price: number;                      // cents
  currency: string;                   // ISO-4217
  license: string;                    // SPDX identifier
  downloadCount: number;
  purchaseCount: number;
  viewCount: number;
  avgRating: number;
  ratingCount: number;
  qualityScore: number;               // NEW — 0-100, the default sort key
  qualityBreakdown: {                 // NEW — transparent signals
    tokenEfficiency: number | null;   // null if not measurable for this type
    installSuccess: number | null;
    schemaClean: number | null;
    freshness: number;                // by last updated
    reviewScore: number;               // weighted by reviewer rep
    securityPass: boolean;
  };
  badges: Badge[];                    // NEW — see trust system
  status: 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'UNPUBLISHED' | 'REMOVED';
  createdAt: string;
  updatedAt: string;
  author: {
    username: string;
    avatar: string | null;
    reputation: number;
    creatorMarks: CreatorMark[];      // NEW
  };
  team?: {                             // NEW — multi-seat publisher
    slug: string;
    name: string;
    avatar: string | null;
    verified: boolean;
  };
  maintainerClaim?: {                  // NEW — OSS maintainer link
    githubRepo: string;                // "anthropics/skills"
    claimedAt: string;
    verified: boolean;
  };
  currentUserVoted: boolean;
  currentUserSaved: boolean;
  currentUserAccess: 'PUBLIC' | 'FREE_DOWNLOAD' | 'PURCHASED'
                   | 'SUBSCRIPTION_ACTIVE' | 'SUBSCRIPTION_EXPIRED'
                   | 'REFUNDED' | 'AUTHOR';
}
```

**Rationale for each extension (all research-backed):**
- `variants[]` with per-variant `environments[]` — Smithery pattern, competitor gap 2.
- `primaryCategory` + `secondaryCategories` — HuggingFace pipeline_tag pattern, resolves "MCP that's also a CLI" without breaking URLs.
- `qualityScore` + `qualityBreakdown` — competitor gap 3, our default sort.
- `license` as SPDX identifier — compliance requirement (OSS license display + incompatibility warnings).
- `badges` + `author.creatorMarks` — split trust system (trust/economics research).
- `maintainerClaim` — maintainer role role, supply-side wedge.
- `team` — multi-seat publisher, multi-creator payout splits.

## 6. Pricing and revenue share

| Decision | Value | Source |
|---|---|---|
| Platform take on paid items | **15% flat** | JetBrains / Figma / Shopify convergence; "serious marketplace" signal |
| Early creator discount | **10% for first 6 months** | Land-grab |
| Refund window | **14 days, no questions if not installed** | Unreal / Unity pattern |
| Chargeback hit to seller | Revenue - $5 admin fee | Industry standard |
| Minimum payout | **$50, monthly, 30-day hold** | JetBrains pattern |
| Typical item price | **$5-29** single, **$29-99** packs | PromptBase + n8n benchmarks |
| Subscription items | **$3-9/mo** for continuously updated packs | Strongest paid format |
| Team pricing | **3× single for 10 seats**, 6× unlimited | Industry standard |
| No sub-$5 items | Destroys signal, inflates refunds | Trust/economics research |

**Free vs paid coexistence rules:**
- Default sort is Quality Score, NOT price. Free and paid compete on quality.
- Filter tab for "Free" / "Paid" exists but is never default.
- Visual differentiation (price chip) without ranking boost or demotion.
- Separate homepage carousels: "Top Quality," "Top Paid," "Top Free," "New This Week" — side by side.
- First-party free baseline items ship on launch (Shopify theme pattern).
- Popular OSS projects mirrored with Maintainer-claimed badge.
- Paid items MUST be bundles with integration work, NOT single files. The quality gate enforces this.

## 7. Merchant of Record and payments

**Recommendation: Paddle or Lemon Squeezy as buyer-side MoR + Stripe Connect Express for creator payouts.** Split model.

Rationale: a global marketplace MUST handle EU VAT OSS, UK VAT (£0 threshold), US state sales tax in 30+ states, Canada GST, Australia GST, Japan JCT, Singapore GST, Brazil ICMS, India OIDAR. Building this ourselves is multi-month work. Paddle/LS charges ~5% + 50¢ and does it all. For creators we still need multi-party payouts, which only Stripe Connect does well at this stage.

**Fallback if Paddle/LS can't do multi-creator splits cleanly:** evaluate **Polar.sh** — open source MoR purpose-built for dev tool marketplaces with creator payouts.

## 8. Compliance must-haves — baked into data model and UI from day 1

From the compliance research (covers 14 regulatory domains):

**Before any public user sees the product (LAUNCH GATES):**
1. **Cookie consent banner** — equal-weight Accept/Reject/Customize, logged to `consent_events` table, auditable.
2. **Privacy policy + ToS + Cookie policy + Acceptable Use + DMCA + Creator Agreement** — drafted, published, linked in footer.
3. **18+ age gate** on signup. `users.date_of_birth` required. Sidesteps COPPA and GDPR-K.
4. **"Report" button** on every listing, review, profile — opens DSA Art. 16 notice-and-action flow.
5. **"Your Privacy Choices"** footer link + working DSR export and deletion.
6. **DMCA agent registered** with US Copyright Office ($6).
7. **EU legal representative** appointed (non-EU hosted, required by DSA Art. 13, ~€1-3K/yr).
8. **Accessibility statement** page + full WCAG 2.2 AA compliance (contrast, focus, keyboard, alt text, labels).
9. **Trader vs Consumer account toggle** at seller onboarding — Sellers must complete DSA Art. 30 KYC (legal name, address, bank, reg number).
10. **Geo-block at signup** for comprehensively sanctioned countries (Cuba, Iran, North Korea, Syria, Crimea/DNR/LNR, Belarus sector-restricted).
11. **License declaration required** for every listing (SPDX identifier). Incompatibility warnings on purchase (CC-BY-NC can't be sold paid; AGPL triggers network-use disclosure).
12. **Safety disclaimer** on every product page: "Executes locally — review before running."

**Within 90 days of launch:**
- Public `/transparency` page with monthly active EU recipients counter (DSA Art. 24(2)).
- First annual transparency report (DSA Art. 15).
- Content scanning pipeline: VirusTotal, Semgrep rules, sandbox dry-run.
- Internal complaint-handling system (DSA Art. 20).
- Out-of-court dispute resolution referral (DSA Art. 21).
- CCPA "Do Not Sell or Share" opt-out + Global Privacy Control header honor.

**Deferred to 1K users:**
- Virtual DPO (not required unless scale triggers).
- Trusted flagger integration (DSA Art. 22).
- ADMT risk assessments (CPRA 2027).

**Data model additions this forces:**
- `consent_events(user_id, purpose, granted_at, withdrawn_at, banner_version, ip, ua)`
- `moderation_notices(reporter_id, target_id, category, status, sla_at)`
- `moderation_decisions(target_id, decision, reasoned_statement, automated, submitted_at)`
- `appeals(notice_id, user_id, submitted_at, resolved_at)`
- `trader_kyc(user_id, legal_name, address, bank, reg_number, verified_at)`
- `dsr_requests(user_id, kind, status, due_at)` (access, delete, export, correct)
- `users.date_of_birth` (at least year) and `users.is_adult_confirmed`
- `listings.license` (SPDX enum), `listings.license_warnings`
- `listings.scan_results` (virus, semgrep, sandbox)
- `eu_mau_counter` rolling

## 9. Hosting strategy

**Hybrid: host metadata + previews + signed checksums ourselves; mirror content from GitHub with attribution for free items; host paid items ourselves with mandatory scanning.**

Rationale: pure linking (DMCA §512(d) information location tool) has the narrowest safe harbor but breaks UX. Full hosting (DSA Art. 6 hosting service) exposes us to malware delivery claims. The hybrid keeps free/OSS items linked to source (clean liability), paid items hosted with scanning (revenue justifies the liability, scanning reduces it).

Mandatory pipeline for any hosted file:
1. VirusTotal scan
2. Semgrep rules for known bad patterns
3. Sandboxed execution preview (Vercel Sandbox / Firecracker)
4. Signed checksums + immutable version history
5. Publisher identity verified (email + domain + 2FA + Trader KYC for paid)

## 10. Onboarding and landing — finalized

mcpmarket.com has **zero onboarding** and that's correct for a directory. The ask reframes: **copy mcpmarket's instant browseability, add a lightweight tool picker as the one question.**

**Landing page structure:**
1. **Hero** — name the pain ("Stop grabbing random rules from GitHub gists"), large search, counter ("2,847 verified assets · curated daily").
2. **Tool picker strip** — horizontal pills: Claude Code · Cursor · Windsurf · Cline · Zed · Codex · Continue · Copilot · n8n · Make. Multi-select. "Skip — show everything" also shown. Stored in localStorage, no signup.
3. **Marketplace grid** — re-renders in place when picker toggles. Does NOT navigate to a new page.
4. **Category chips** — secondary filter, always visible (RULES · MCP · SKILL · AGENT_TEAM · WORKFLOW · PROMPT · CLI · DATASET · BUNDLE).
5. **Curated collections** — "Top 10 for Claude Code," "Verified this week," "Enterprise-ready," "Frontend essentials," "Security audited."
6. **Trust proof** — install counts, quality scores, verified creator avatars. Numbers that actually mean something.
7. **How it works** — 3 steps: pick → install → ship.
8. **FAQ + Footer.**

**Onboarding funnel:**
- **One question.** Tool picker on landing. No modal. No signup gate. Multi-select pills, localStorage persistence.
- **Optional second question** (only if 2+ tools picked): "What are you building?" chips (Web / API / Mobile / Data / DevOps / Research). Gates a "daily top picks" section only, not the whole marketplace.
- **URL param auto-detect** (`?from=claude-code` pre-selects) — ship regardless, additive.
- **Fallback for skippers:** mcpmarket-style homepage, identical data, zero personalization. Sticky banner: "Show me what I use →" reopens the picker.
- **Signup gate** ONLY at: publishing, reviewing, private collections, billing. All post-value.

**Under 15 seconds from landing to seeing an installable asset.** That's the benchmark.

## 11. Category taxonomy — hybrid of three proven systems

Primary categories (drives URLs):
1. **RULES** — cursor rules, windsurf rules, continue rules, etc. Mirror the awesome-cursorrules 11-sub-taxonomy (frontend / backend / mobile / CSS / state / DB / testing / deploy / build / language / other).
2. **MCP_SERVER** — adopt glama.ai's faceted model (environment: remote/local/hybrid; capability: tools/resources/prompts; language: py/ts/js).
3. **SKILL** — claude skills, codex skills. Adopt Anthropic SKILL.md spec as the canonical format.
4. **AGENT_TEAM** — crewai, autogen, langgraph, agent frameworks.
5. **WORKFLOW** — n8n templates, make blueprints, zapier.
6. **PROMPT** — system prompts, task prompts. PromptBase model per AI-model-axis.
7. **CLI** — rulesell-installable CLIs, standalone utilities.
8. **DATASET** — eval datasets, fine-tuning data.
9. **BUNDLE** — curated multi-item packages. The premium paid format.

Every item has **one primary + up to 2 secondary + free tags**.

## 12. What we port from the existing RuleSell codebase

The existing codebase had research-backed decisions baked in that we should keep:

- `@/i18n/navigation` + next-intl — keep i18n scaffold for EN at minimum, we'll add TR/DE/ES/JA later.
- `shadcn/ui` primitives and Tailwind v4 — keep the design system foundation.
- `framer-motion` — keep for the "creative minimalist cute animations" requirement.
- Certified Dev mechanics — preserved but repositioned as "reviewer role" rather than "certification tier."
- Fork system — kept for Maintainer role (permission-based forking with revenue share).
- MCP endpoint `/api/mcp` — keep so AI agents can discover items (we're agent-native).
- `llms.txt` + `/r/*.json` registry — keep.
- 35 enriched real GitHub repos as mock data — port to new schema.

What we delete or replace:
- `src/types/index.ts` (old Product shape) → replaced by Ruleset shape above.
- `src/components/marketplace/product-card.tsx` → replaced by new RulesetCard.
- All page files under `src/app/[locale]/marketplace`, `dashboard`, `profile`, etc. → rebuilt per new IA.
- `src/constants/mock-data.ts` → replaced with new mock seeded per new schema.

## 13. Open questions for the brainstorm (Q2-Q6)

With research done, the remaining questions for Nalba become crisp:

**Q2 — Actor model alignment.** Keep Maintainer + Builder-vs-Seller split + Pro tier deferred? (My strong rec: yes to all three.)

**Q3 — Paid model and revenue share.** 15% flat, 10% for first 6 months as a land-grab? MoR via Paddle/LS or Polar.sh?

**Q4 — Scope at launch.** Spec is comprehensive; not everything can ship in v1. Which of these is v1 vs v2?
- Quality score system (measurable for MCP, harder for rules/prompts)
- Content scanning pipeline (launch gate or 90-day?)
- Team accounts
- Maintainer claim flow
- Subscription items
- Pro tier UI
- MCP endpoint + agent-native registry

**Q5 — Compliance scope.** Confirm 18+ age gate, EU legal rep, DMCA agent, DSA scope all in from day 1.

**Q6 — What to delete first.** Confirm we can blow away the existing `src/components/marketplace/`, old types, old dashboard, old mock data — per Option A from earlier.

---

## Sources

All in `docs/research/2026-04-08-*.md`:
- `competitor-teardown.md` — 531 lines, 19 marketplace deep teardown
- `global-compliance-landscape.md` — 323 lines, 14 regulatory domains
- `multi-environment-versioning.md` — 315 lines, data model + JSON schemas
- `onboarding-funnel-patterns.md` — 267 lines, 15 reference flows + recommendations
- `user-demand-signals.md` — 261 lines, direct quotes from HN/Reddit/forums
- `trust-and-creator-economics.md` — 236 lines, 11 marketplace economic benchmarks
