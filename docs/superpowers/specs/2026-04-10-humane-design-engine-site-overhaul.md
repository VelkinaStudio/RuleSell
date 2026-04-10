# RuleSell Frontend Overhaul -- Humane Design Engine Site-Wide Specification

**Date:** 2026-04-10
**Status:** Approved for implementation
**Supersedes:** None (additive to `2026-04-08-rulesell-rebuild-design.md`)
**Skill:** humane-design-engine

---

## 0. Purpose

Redesign every user-facing surface of the RuleSell marketplace frontend to establish a distinctive, portfolio-grade visual identity. This spec covers 48 pages across 5 surface batches. It grants full creative license on pages, components, styles, and tokens while leaving the backend completely untouched.

---

## 1. Scope and Constraints

### 1.1 In Scope

- All user-facing pages (marketing, discovery, product, dashboard, legal).
- New and modified UI components.
- Typography system (new display font, modular scale, semantic size tokens).
- Color system evolution (secondary color, promoted category colors, quality score color coding).
- Motion language (scroll-reveal, stagger, hover, transitions).
- Spatial philosophy (full-bleed sections, max-width discipline, surface hierarchy).
- New i18n keys in both `messages/en.json` and `messages/tr.json`.

### 1.2 Out of Scope -- Files Not Changed

These files and directories must remain untouched:

- `src/app/api/*` -- all API routes.
- `prisma/*` -- schema and migrations.
- `src/lib/auth.ts` -- NextAuth configuration.
- `src/lib/rate-limit.ts` -- rate limiting logic.
- `src/lib/api-client.ts` -- API client.
- `src/hooks/*` -- hook logic and return types. Internal implementation may change, but the return shape of every hook must remain identical.
- `src/stores/cart-store.ts` -- Zustand cart state.
- `src/generated/*` -- Prisma generated types.

### 1.3 Route Structure

No routes are added, removed, or renamed. All existing routes keep their current path structure.

### 1.4 Theme

Dark theme remains the default. No light theme is introduced.

---

## 2. Execution Order

Implementation proceeds in strict batch order. Each batch is self-contained and produces a working state before the next begins.

| Batch | Surface | Page Count | Priority |
|---|---|---|---|
| A | Marketing | 8 | First |
| B | Discovery + Product | 11 | Second |
| C | Dashboard | 14 | Third |
| D | Legal + Foundation | 15 | Fourth |

Rationale: Marketing pages are the highest-impact, lowest-dependency surfaces. Discovery and product pages share component changes (RulesetCard, FilterSidebar). Dashboard surfaces are internal and can absorb component changes from earlier batches. Legal and foundation cleanup run last as a polish pass.

---

## 3. Brand Thread -- Shared DNA Across All Batches

### 3.1 Typography

#### 3.1.1 Current Problem

Geist is used for all text. It ships as the default font in every Next.js template. The result is zero typographic personality -- RuleSell looks like every other Vercel-deployed project.

#### 3.1.2 Font Assignments

| Role | Font | Usage |
|---|---|---|
| Display / Headlines | Space Grotesk | h1, h2, hero headlines, section titles on marketing surfaces. Dashboard headings at smaller sizes. |
| Body | Geist (unchanged) | Paragraph text, descriptions, UI labels, form fields. |
| Monospace | Geist Mono (unchanged) | Code blocks, prices, quality scores, tabular data. |

#### 3.1.3 Modular Scale

Type sizes follow a 1.333 ratio (perfect fourth). All ad-hoc Tailwind text sizing (`text-sm`, `text-2xl` without consistent ratios) is replaced by semantic size tokens.

| Token | Size | Usage |
|---|---|---|
| `--text-display` | 48-72px (responsive) | Hero headlines, homepage title |
| `--text-h1` | 36px | Page titles, major section headers |
| `--text-h2` | 27px | Section subheaders |
| `--text-h3` | 20px | Card titles, subsection headers |
| `--text-body` | 16px | Default body text |
| `--text-small` | 14px | Secondary text, metadata |
| `--text-caption` | 12px | Labels, badges, timestamps |
| `--text-micro` | 11px | Legal fine print, footnotes |

#### 3.1.4 Font Loading

- Add `@font-face` declarations for Space Grotesk with `font-display: swap`.
- Subset to Latin character set only.
- Preload weights 400, 600, and 700.
- Fallback stack: `system-ui, sans-serif`.
- Implementation: either Google Fonts CDN link in the root layout `<head>`, or self-hosted files in `public/fonts/`. Self-hosting is preferred for performance and privacy.
- Define CSS variable `--font-display` and corresponding Tailwind utility class `font-display`.

### 3.2 Color Evolution

#### 3.2.1 Foundation

The dark base (`#09090b`) remains unchanged.

#### 3.2.2 Brand Gold Enhancement

Brand gold (`#ffd166`) receives bolder usage on marketing surfaces: hero backgrounds, section accent lines, CTA button fills. On product and dashboard surfaces, gold usage stays restrained.

#### 3.2.3 Secondary Color -- Steel Blue

A cool secondary color is introduced for temperature contrast against the warm gold.

| Token | Value | Usage |
|---|---|---|
| `--color-secondary-muted` | `#64748b` | Secondary text, subdued labels |
| `--color-secondary` | `#94a3b8` | Informational callouts, subtle section backgrounds |
| `--color-secondary-bright` | `#cbd5e1` | Hover states, active secondary elements |

#### 3.2.4 Category Colors -- Promoted

Category colors move from subtle tints to first-class wayfinding signals. These are already defined; they now appear on card accents, active filter states, and browse navigation.

| Category | Color |
|---|---|
| Rules | `#3b82f6` |
| MCP Servers | `#10b981` |
| Skills | `#f59e0b` |
| Agents | `#8b5cf6` |
| Workflows | `#f97316` |
| Prompts | `#ec4899` |
| CLIs | `#06b6d4` |
| Datasets | `#14b8a6` |
| Bundles | `#f43f5e` |

#### 3.2.5 Surface Hierarchy

Increase contrast between surface layers:

| Token | Current | New |
|---|---|---|
| `--bg-base` | `#09090b` | `#09090b` (unchanged) |
| `--bg-surface` | `#18181b` | `#141416` |
| `--bg-raised` | `#27272a` | `#1e1e22` |

#### 3.2.6 Quality Score Color Coding

Quality scores are color-coded by grade across all surfaces (browse cards, detail pages, leaderboard):

| Grade | Range | Color | Token |
|---|---|---|---|
| A | 85-100 | Emerald | `#10b981` |
| B | 70-84 | Amber | `#f59e0b` |
| C | 50-69 | Rose | `#f43f5e` |

### 3.3 Motion Language

#### 3.3.1 Marketing Surfaces

- Scroll-reveal on every section using the existing `ScrollReveal` component.
- Staggered card entrances using the existing `Stagger` component.
- Hero sections receive choreographed entrance animations (custom per page).
- Subtle parallax on key visuals: 10-15% speed difference via CSS `transform: translateY()` on scroll. No heavy JS parallax libraries.

#### 3.3.2 Product Surfaces

- Card hover lifts using the existing `cardHover` Framer Motion variant. Applied consistently to all cards.
- Filter transitions: smooth `height` and `opacity` animation for collapsible sidebar sections.
- Tab content crossfades using `AnimatePresence` (pattern already established in `InstallBlock`).

#### 3.3.3 Dashboard Surfaces

- Stats card entrance animation (already exists, keep as-is).
- Chart animations (already exist, keep as-is).
- No scroll-reveal in dashboard. Dashboard is a workspace, not a showcase.

#### 3.3.4 Shared Motion Variants

Existing variants to reuse: `fadeInUp`, `fadeIn`, `cardHover`, `pressBounce`, `staggerContainer`.

New variants to create:

| Variant | Behavior | Usage |
|---|---|---|
| `heroEntrance` | Choreographed multi-element fade-up with staggered delays | Hero sections on marketing pages |
| `sectionReveal` | Staggered children fade-up on scroll into viewport | Marketing page sections |

#### 3.3.5 Accessibility

All motion respects `prefers-reduced-motion`. The existing `useReducedMotion()` hook pattern continues for all new animations.

### 3.4 Spatial Philosophy

#### 3.4.1 Marketing Surfaces

- Full-bleed section backgrounds.
- Alternating max-widths: `max-w-4xl` for text-focused sections, `max-w-7xl` for feature grids and card layouts.
- Asymmetric layouts where they serve the content.
- Sections separated by background color shifts (using `--bg-base`, `--bg-surface`, `--bg-raised` alternation), not just vertical spacing.

#### 3.4.2 Product Surfaces

- Consistent `max-w-7xl` across all product pages.
- Density is a feature. Maximize information per viewport.
- Hierarchy established through typography scale and color, not layout variation.

#### 3.4.3 Dashboard Surfaces

- `max-w-7xl` with sidebar.
- Grid-based layouts.
- No full-bleed sections.
- Consistent `gap-6` spacing between grid items.

---

## 4. Batch A: Marketing Surfaces (8 Pages)

### 4.1 Homepage -- Complete Redesign

**Route:** `/[locale]/` via `src/app/[locale]/(public)/page.tsx`

**Current state:** Hero (title + subtitle + search + tool picker), 3 shelves, collections grid. No conversion architecture, no trust signals, no explanation of how the marketplace works.

**New structure:** 9 sections arranged as a conversion funnel.

#### Section 1: Hero

- **Layout:** Full viewport height (`min-h-[80vh]`).
- **Headline:** Space Grotesk display size. Benefit-driven copy (what the visitor gains), not feature-driven (what the platform does). Example direction: "Ship better AI, faster" rather than "The AI asset marketplace."
- **Subtitle:** One sentence explaining the mechanism. Example direction: "Quality-scored rules, MCPs, and tools -- verified, installable in one command."
- **Search:** Existing `HeroSearch` component, visually scaled up. Taller input field (h-14 minimum), larger text (text-lg), prominent focus ring in brand gold.
- **Tool picker:** Existing `ToolPicker` component below search, unchanged functionally.
- **Background:** Animated CSS gradient using brand gold and steel blue. Slow-moving (20s+ animation cycle). Implemented via CSS `@keyframes` on a pseudo-element or background layer. No JS animation libraries for this effect.
- **Entrance animation:** Headline fades up (0ms delay), subtitle fades up (150ms delay), search slides up (300ms delay), tool picker staggers in (450ms+ delay). Uses the new `heroEntrance` variant.
- **i18n:** New keys for headline and subtitle in both locales.

#### Section 2: Social Proof Bar

- **Layout:** Horizontal strip, centered, muted background.
- **Content:** 3-4 key metrics.
  - Total asset count (e.g., "2,400+ assets").
  - Total installs (e.g., "180K+ installs").
  - Verified creator count (e.g., "850+ creators").
  - Average quality score (e.g., "82 avg quality score").
- **Typography:** Numbers in Geist Mono. Labels in body text, muted color.
- **Visual treatment:** Quiet and reassuring, not shouty. Thin top/bottom borders or subtle background shift.
- **Data source:** Hardcoded realistic numbers or computed from mock data aggregates.
- **New component:** `SocialProofBar`.
- **i18n:** New keys for each metric label.

#### Section 3: How It Works

- **Layout:** Three-step horizontal flow on desktop (`flex-row`, `gap-8`), stacked on mobile.
- **Steps:**
  1. **Browse and Search** -- Search icon (Lucide `Search`) -- "Find rules, MCPs, skills, and more for your environment."
  2. **Check Quality Scores** -- ShieldCheck icon (Lucide `ShieldCheck`) -- "Every asset is measured on token efficiency, security, and reliability."
  3. **Install with One Command** -- Terminal icon (Lucide `Terminal`) -- "Copy the install command. Works with Cursor, Windsurf, Claude, and more."
- **Visual emphasis:** Step 2 (quality) rendered slightly larger with brand gold accent to highlight the key differentiator.
- **Animation:** Stagger reveal on scroll (existing `Stagger` component).
- **New component:** `HowItWorks`.
- **i18n:** New keys for each step title and description.

#### Section 4: Quality Differentiation

- **Layout:** Full-bleed section with `--bg-surface` background.
- **Headline:** Space Grotesk, h1 size. "Quality is measured, not voted."
- **Content:** 5 quality metrics displayed as a visual grid (3-column on desktop, single column on mobile):
  1. **Token efficiency** -- Gauge icon -- "Measures actual token consumption, not self-reported estimates."
  2. **Install success rate** -- CheckCircle icon -- "Tracked across real CLI installations."
  3. **Schema cleanliness** -- FileCheck icon -- "JSON and YAML validation against published standards."
  4. **Freshness** -- Clock icon -- "Penalizes stale assets. Rewards active maintenance."
  5. **Security scan** -- Shield icon -- "VirusTotal, Semgrep, and sandboxed execution."
- **Example card:** A mock quality score card showing what a real score looks like -- item name, overall score (e.g., 87/A), per-metric mini bars. Uses the quality score color coding from section 3.2.6.
- **New component:** `QualityShowcase`.
- **i18n:** New keys for section title, each metric name, and each metric description.

#### Section 5: Curated Shelves (Enhanced Existing)

- **Existing component:** `Shelf`. Modified, not replaced.
- **Changes:**
  - **Editors' Picks shelf:** First item renders as a hero-sized featured card (wider, taller, shows description excerpt, creator info, quality score badge). Remaining items render as standard grid cards. This requires a new component variant: `FeaturedRulesetCard`.
  - **New This Week shelf:** Standard card grid, no changes to layout.
  - **Top for [Environment] shelf:** Standard card grid with tool picker context.
- **Shelf titles:** Rendered in Space Grotesk at h2 size.
- **Card animation:** Scroll-reveal stagger on shelf entrance.

#### Section 6: Creator Economics

- **Layout:** Split layout. Text on the left, visual on the right. `flex-row` on desktop, stacked on mobile.
- **Headline:** Space Grotesk, h1 size. "Creators keep 85%."
- **Body:** 3-4 lines explaining the business model. Emphasize: no other AI asset marketplace pays creators. 85/15 split. Payouts via Stripe Connect.
- **CTA:** Button linking to `/dashboard/settings/seller`. Text: "Start selling."
- **Visual (right side):** A simplified earnings breakdown graphic or illustration. Can be a styled div showing a $19 sale split: $16.15 to creator, $2.85 to platform. Uses Geist Mono for numbers.
- **New component:** `CreatorEconomics`.
- **i18n:** New keys for headline, body text, CTA label, and visual labels.

#### Section 7: Trust Strip

- **Layout:** 3 trust signals in a horizontal flex row. Stacks on mobile.
- **Background:** `--bg-surface`. Muted, institutional design.
- **Signals:**
  1. **VirusTotal Scanning** -- Shield icon -- "Every upload scanned against 70+ antivirus engines."
  2. **Semgrep Analysis** -- Code icon -- "Static analysis catches security anti-patterns before publishing."
  3. **Verified-Install Reviews** -- Star icon -- "Only users who installed an asset via CLI can leave reviews."
- **Footer link:** "Learn more about our trust model" linking to `/trust`.
- **New component:** `TrustStrip`.
- **i18n:** New keys for each signal title, description, and the footer link text.

#### Section 8: Community Activity Preview

- **Layout:** Compact list of 3-5 recent activity items.
- **Content:** Draws from the same mock data source as the Explore page feed. Each item shows: user avatar placeholder, action description, timestamp.
- **CTA:** "Join the community" button linking to `/explore`.
- **New component:** `CommunityPreview`.
- **i18n:** New keys for section title and CTA label.

#### Section 9: Final CTA

- **Purpose:** Address the educated visitor who has scrolled through the full page. Different angle from the hero.
- **Headline:** Space Grotesk. Example direction: "Ready to upgrade your workflow?"
- **CTA:** Prominent "Browse marketplace" button linking to `/browse`.
- **Background:** Subtle gradient treatment using brand gold at low opacity.
- **New component:** `FinalCTA` (or inline in homepage).
- **i18n:** New keys for headline and CTA label.

### 4.2 About Page -- From Text Dump to Story

**Route:** `/[locale]/(public)/about/page.tsx`

**Current state:** `max-w-3xl` container with 6 plain text sections. Reads like a README, not a product page.

**Changes:**

- **Hero:** Space Grotesk display headline. One-sentence thesis for the platform.
- **Why it exists:** Problem/solution visual layout. Two columns on desktop: problem on left (pain points of current AI asset ecosystem), solution on right (what RuleSell does differently). Each point with an icon.
- **How we are different:** 4 feature cards in a 2x2 grid on desktop. Each card: icon + title + 2-line description. Not a bullet list.
- **Business model:** Visual breakdown with numbers prominently displayed in Geist Mono. Three tiers: Free (free forever), Commission (15% on sales), Pro ($8/month). Each tier as a styled card.
- **Team / Open source:** GitHub link with activity context. Brief paragraph.
- **Scroll-reveal:** Applied to each section.
- **Max-width:** Varies by section. Text sections: `max-w-3xl`. Feature grid: `max-w-5xl`.

### 4.3 Trust Page -- Credibility Design

**Route:** `/[locale]/(public)/trust/page.tsx`

**Current state:** Dense text with inline badge definitions and a reputation table.

**Changes:**

- **Hero:** Shield visual element with Space Grotesk headline. Establishes institutional tone.
- **Quality Score section:** Visual explainer showing the 5 metrics as animated progress bars or a radar chart. Each bar/axis labeled with metric name and weight.
- **Badge gallery:** Grouped by purpose:
  - Group 1: Item quality badges (Verified, Quality A/B/C, Editor's Pick, Official).
  - Group 2: Creator reputation badges (Verified Creator, Trader, Certified Dev, Top Rated).
  - Group 3: Security badges (Scanned, Sandboxed).
  - Each badge rendered with its actual icon and color treatment as it appears on marketplace cards.
- **Security scanning section:** Elevated, institutional design. Three-stage audit pipeline visual: Upload --> VirusTotal Scan --> Semgrep Analysis --> Sandbox Test --> Published. Horizontal flow with connecting lines.
- **Reputation levels:** Horizontal progression showing the journey from Newcomer to Authority. Each level shows: name, point threshold, and what it unlocks. Visual ladder or timeline format.
- **Review integrity:** Visual flow diagram: Install via CLI --> Use asset --> Write review. Explains why verified-install reviews are trustworthy.
- **Scroll-reveal:** Applied to each section.

### 4.4 Affiliates Page -- Opportunity Pitch

**Route:** `/[locale]/(public)/affiliates/page.tsx`

**Current state:** Text and tables. Reads like terms of service.

**Changes:**

- **Hero:** Reframed headline. Example direction: "Earn by recommending what you actually use."
- **How it works:** 4-step visual flow with icons and connecting lines/arrows (not a numbered text list):
  1. Sign up for the affiliate program.
  2. Get your unique referral link.
  3. Share with your audience.
  4. Earn commission on every sale.
- **Commission rates:** Visual comparison with real example numbers prominently displayed in Geist Mono.
- **Earnings example:** Visual breakdown diagram of a $19 item:
  - Creator: $14.54 (76.5%).
  - Platform: $2.85 (15%).
  - Affiliate: $1.62 (8.5%).
  - Displayed as a horizontal stacked bar or pie visualization.
- **Who it is for:** 3 persona cards:
  - Content creators (YouTube, blog).
  - Newsletter authors (tech newsletters).
  - Community leaders (Discord, Slack).
  - Each card: icon/illustration + title + 1-2 line description.
- **CTA:** "Get your referral link" button linking to `/dashboard/affiliates`.
- **Scroll-reveal:** Applied to each section.

### 4.5 CLI Page -- Developer Experience Story

**Route:** `/[locale]/(public)/cli/page.tsx`

**Current state:** 5 code blocks with minimal surrounding context.

**Changes:**

- **Hero:** Terminal visual element. Animated typing effect showing the install command (`npx rulesell install ...`). Typing speed: ~50ms per character, with a blinking cursor.
- **Feature sections:** Alternating layout. Odd sections: description left, code block right. Even sections: code block left, description right. This creates visual rhythm.
- **Environment detection:** Visual diagram showing the CLI detecting Cursor, Windsurf, Claude Code, VS Code, and other environments. Flowchart or branching visual.
- **Getting started:** 3-step visual flow: Install CLI --> Authenticate --> Install your first asset.
- **Code blocks:** Enhanced with surrounding context. Each block has: a title above (what the command does), the code itself, and expected output below (in a muted style).
- **Scroll-reveal:** Applied to each section.

### 4.6 Leaderboard Page -- Polish

**Route:** `/[locale]/(public)/leaderboard/page.tsx`

**Current state:** Filter chips + ranked list. Functional but visually flat.

**Changes:**

- **Top 3:** Podium or featured treatment. Three larger cards at the top of the page with more detail (creator info, quality score, install count, description excerpt) before the ranked table begins.
- **Quality score per row:** Small colored bar or badge (emerald/amber/rose) instead of a plain number.
- **Category filter chips:** Use the full category color palette (section 3.2.4) when chips are in active state.
- **Row hover:** Enhanced background shift and slightly expanded information on hover.
- **Row animation:** Stagger entrance when the list loads or when filters change.
- **Data flow:** Existing data fetching and filtering logic unchanged.

### 4.7 Explore Page -- Add Life

**Route:** `/[locale]/(public)/explore/page.tsx`

**Current state:** Tabs (Feed / Discussions / Showcases). Reasonable structure, sparse visuals.

**Changes:**

- **Feed tab:** Richer activity items. Each item includes: user avatar, activity type badge (published, updated, reviewed, etc.), item name, engagement counts (likes, comments), timestamp.
- **Trending sidebar:** Numbered items (1-10) with small quality score indicator badges next to each item name.
- **Showcases tab:** Cards get visual emphasis. Description area larger. Reaction buttons more prominent with counts.
- **Submit a Showcase CTA:** Rendered as enabled and styled (even if the action is a mock/placeholder). Not displayed as disabled.
- **Tab transitions:** Crossfade animation using `AnimatePresence` when switching between tabs.
- **Overall:** Higher visual density. More information per viewport.

### 4.8 Login Page -- Branded Minimal

**Route:** `/[locale]/(public)/login/page.tsx`

**Current state:** Standard OAuth + credentials form.

**Changes:**

- **Background:** Subtle gradient or geometric pattern using brand gold and dark base at very low opacity.
- **Logo:** Prominently displayed at top. The "R" + "uleSell" wordmark treatment, larger than current. Centered.
- **OAuth buttons:** Provider icons alongside text. GitHub Octocat SVG and Google "G" SVG. Buttons styled consistently with the design system.
- **Form styling:** Input focus state uses brand gold border (`border-[#ffd166]`). Consistent with design system input treatment.
- **Principle:** This is utility, not spectacle. Keep it simple, clean, and fast.

---

## 5. Batch B: Discovery Surfaces (7 Pages)

### 5.1 Browse Page -- Quality-First Marketplace

**Route:** `/[locale]/(public)/browse/page.tsx`

#### 5.1.1 RulesetCard Redesign

The marketplace card is the most repeated component. Changes apply everywhere the card appears.

- **Quality score:** Most visually prominent element on the card. Colored badge/pill at top-right corner. Uses quality score color coding (emerald A, amber B, rose C). Shows both the letter grade and numeric score (e.g., "A 87").
- **Category accent:** Thin left border or top stripe in the category color (section 3.2.4).
- **Stats row:** Rating, installs, and quality score get more visual weight. Geist Mono for numbers.
- **Card height:** Slightly taller than current to accommodate clearer visual zones: header (category + QS badge), body (title + description excerpt), footer (stats row).
- **Hover state:** Uses the existing `cardHover` variant consistently.

#### 5.1.2 FilterSidebar Enhancements

- **Category filters:** Each category filter uses its category color for the icon and the active/selected state background.
- **Collapsible sections:** Each filter group (category, environment, price, quality, sort) is a collapsible section with smooth `height` and `opacity` animation on toggle.
- **Active filter count:** Badge showing count of active filters next to the filter group header.
- **Clear all:** Always visible "Clear all filters" button when any filter is active.

#### 5.1.3 TabBar Enhancement

- Active tab underline thickness increased from current (approximately 0.5px) to 2px for stronger visual indicator.

#### 5.1.4 Empty State

- When no results match filters: a designed empty state component suggesting the visitor broaden filters or showing links to popular items and categories.

#### 5.1.5 Pagination Enhancement

- Add page number context: "Page 2 of 8" alongside prev/next navigation.

#### 5.1.6 Card Grid Animation

- Scroll-reveal stagger when cards first load or when filter changes trigger a new result set.

### 5.2 Search Page

**Route:** `/[locale]/(public)/search/page.tsx`

- **Search bar:** Functional size (not hero-sized). Positioned at the top of the page.
- **Results count:** Prominent display in Space Grotesk. Example: "42 results for 'cursor rules'".
- **Results grid:** Uses the redesigned `RulesetCard` from section 5.1.1.
- **No results state:** Helpful suggestions: related search terms, popular items, category quick links.
- **Quick filter chips:** Displayed above the grid when results span multiple categories, allowing one-click category filtering.

### 5.3 Category and Environment Routes

No changes. These routes remain as redirects to browse with pre-applied filters.

### 5.4 Collections Index

**Route:** `/[locale]/(public)/collections/page.tsx`

- **Hero section:** "Curated Collections" headline in Space Grotesk with a brief explanation of what collections are.
- **Featured collection:** Top collection rendered as a full-width hero card with description, item count, and curator info.
- **Remaining grid:** Existing `CollectionCard` gradient cards. These are already visually strong and require no redesign.
- **Animation:** Scroll-reveal stagger on the grid.

### 5.5 Collection Detail

**Route:** `/[locale]/(public)/collections/[slug]/page.tsx`

- **Hero:** Increased padding for breathing room. Gradient background treatment matching the collection's theme.
- **Curator info:** Avatar, display name, and bio snippet displayed below the collection title.
- **Items list:** Optional sequential numbering (1, 2, 3...) to suggest deliberate curation order.
- **Follow collection:** Button for subscribing to collection updates. Can be a mock/placeholder action.

---

## 6. Batch C: Product Surfaces (4 Pages)

### 6.1 Ruleset Detail Page

**Route:** `/[locale]/(public)/r/[slug]/page.tsx`

#### 6.1.1 Hero Zone

- **Category accent:** Category color applied as a top border or background tint at the top of the hero area.
- **Title:** Space Grotesk, h1 size.
- **Stars:** Rendered as filled visual star icons (not just a numeric rating).
- **Quality score:** Colored badge using the quality score color coding.
- **Install count:** Displayed with a trend indicator (up/down arrow or "trending" label if installs are high).

#### 6.1.2 Install Block

The existing install block is already well-designed. Enhancements:

- **Environment-aware CTA:** A "one-click install" button that adapts its label based on the detected or selected environment.
- **Visual prominence:** The install CTA is the single most prominent interactive element on the page. Larger than other buttons, brand gold background.

#### 6.1.3 Quality Breakdown Sidebar

- **Per-metric color coding:** Each metric bar uses an individual color. Token efficiency (blue), install success (green), schema cleanliness (purple), freshness (amber), security (emerald).
- **Security badge:** Styled like a CI pass/fail indicator. Green checkmark with "Passed" or red X with "Failed."

#### 6.1.4 Tab Content

- **About tab:** Better prose typography. Body text uses the new type scale with `max-w-[65ch]` line length for readability.
- **Reviews tab:** Rating distribution histogram at the top showing 5-star to 1-star breakdown as horizontal bars. Each review shows a verified-install badge prominently if applicable. New component: `RatingDistribution`.
- **Discussions tab:** Each thread shows user avatar, timestamp, and reply count.

#### 6.1.5 Related Grid

Uses the quality-first `RulesetCard` design from section 5.1.1.

### 6.2 User Profile

**Route:** `/[locale]/(public)/u/[username]/page.tsx`

- **Profile hero:** Reputation bar visual upgrade (progress bar showing points toward next level). Creator marks (Verified Creator, Trader, Certified Dev, etc.) displayed prominently as badge icons.
- **Stats:** Numbers rendered in Space Grotesk.
- **Published items:** Grouped by category if the user's items span multiple categories. Category headers with category colors.
- **Follow CTA:** More prominent styling. Brand gold outline or fill.

### 6.3 Team Profile

**Route:** `/[locale]/(public)/team/[slug]/page.tsx`

- Same enhancements as user profile (section 6.2).
- **Team member list:** Horizontal strip of member avatars with name tooltips and role labels (admin, member).
- **Team-level stats:** Aggregate stats (total items, total installs, average quality score) displayed alongside individual member stats.

### 6.4 Report Form

Minimal changes:

- Clean form styling consistent with the design system.
- Success confirmation state after submission.
- No visual redesign beyond consistency pass.

---

## 7. Batch D: Dashboard Surfaces (14 Pages)

### 7.1 Dashboard Layout and Sidebar

- **Sidebar icon contrast:** Inactive icons get slightly increased opacity/contrast for better scanability.
- **Avatar support:** Sidebar footer shows the user's avatar image (with initials fallback).
- **Mobile navigation:** Hamburger icon that opens a slide-out drawer containing the full sidebar navigation. Overlay behind drawer.
- **Breadcrumb:** Add a breadcrumb component for nested dashboard routes (e.g., Dashboard > Settings > Seller Verification).

### 7.2 Dashboard Overview

- **Stats card numbers:** Rendered in Space Grotesk.
- **Delta indicators:** Color-coded. Green for positive change, red for negative change. Arrow icon + percentage.
- **Activity feed:** Each item shows: user avatar, action type icon (purchase, review, follow, etc.), description, timestamp.
- **Empty state for new users:** Onboarding card with 3-4 suggested first actions (browse marketplace, save items, set up profile, publish first asset).

### 7.3 Rulesets Management

- **Status indicators:** Color-coded badges:
  - Published: green badge.
  - Draft: amber badge.
  - In review: blue badge.
- **Quality score column:** Visual treatment matching the quality score color coding.
- **Action buttons:** Icon-based (Lucide icons: `Pencil` for edit, `BarChart` for stats, `EyeOff` for unpublish) instead of text labels.
- **Empty state:** "Publish your first asset" with a CTA linking to the publish wizard.

### 7.4 Publish Wizard

- **Step indicator:** Completed steps show checkmarks. Current step is highlighted with brand gold. Future steps are dimmed.
- **Contextual help:** Inline hint text per step explaining what is expected and why.
- **Preview pane:** Before final submission, show a preview of how the listing will appear on the marketplace (using the `RulesetCard` and detail page layout).
- **Success confirmation:** After publishing, show a confirmation with: link to the published listing, sharing options, and suggested next steps.

### 7.5 List Views -- Unified Treatment

Applies to: Purchases, Saved, Following, Reviews.

- **Consistent empty states:** Each list view has a designed empty state with an encouraging CTA specific to that view:
  - Purchases: "Browse the marketplace to find your first asset."
  - Saved: "Save items while browsing to find them here later."
  - Following: "Follow creators and teams to stay updated."
  - Reviews: "Install and use assets, then share your experience."
- **Purchases:** Show install status (installed/not installed), purchase date, price paid.
- **Saved:** Show date saved, sorted recent-first.
- **Following:** Show activity status for each followed entity (e.g., "Published 2 items this week").
- **Reviews:** Enhanced star rendering (filled stars). Link back to the reviewed item.

### 7.6 Earnings

- **Hero number:** "Lifetime Revenue" displayed as a large Space Grotesk number at the top of the page.
- **Chart:** Add hover tooltips showing exact values. Time range selector with options: 7 days, 30 days, 90 days, all time.
- **Payout history:** Status badges for each payout:
  - Paid: green badge.
  - Pending: amber badge.
  - Processing: blue badge.
- **Non-verified state:** For sellers who have not completed verification, show an inline progress indicator showing remaining verification steps.

### 7.7 Affiliates Dashboard

- **Referral link:** Prominent display with a one-click copy button. Visual confirmation on copy (checkmark animation or "Copied!" text).
- **Stats:** Trend indicators (up/down arrows) on key metrics.
- **Top performing referrals:** Ranked list showing the affiliate's most successful referred items with click and conversion counts.

### 7.8 Settings Pages

#### Profile Settings

- Avatar upload with preview before saving.
- Bio field with character count indicator.

#### Billing Settings

- Feature comparison table: Free tier vs Pro tier. Side-by-side layout with checkmarks and crosses.
- Current plan highlighted.

#### Seller Settings

- Horizontal stepper for the 4-stage seller verification process.
- Field-level validation with inline error messages.
- Progress persists between sessions.

#### Privacy Settings

- GDPR controls displayed prominently:
  - Data export request.
  - Account deletion request.
  - Consent management.
- Clear, non-legalese descriptions for each control.

---

## 8. Batch D (continued): Legal Pages (8 Pages)

### 8.1 Shared Legal Page Treatment

Applies to all legal pages: Terms of Service, Privacy Policy, Cookie Policy, Acceptable Use, DMCA, Seller Agreement, Affiliate Agreement, Licenses.

- **LegalNav:** Current page highlighted in the legal page navigation. Progress indicator for long documents showing how far the reader has scrolled.
- **Article typography:** Wider line spacing (`leading-relaxed` or `leading-7`). Body text capped at `max-w-[65ch]` for optimal readability. Proper heading hierarchy using Space Grotesk for h1/h2 and Geist for body.
- **Table of contents:** Sticky sidebar ToC on pages longer than 3 sections (Terms of Service, Privacy Policy). Highlights current section as the reader scrolls.
- **Last updated date:** Displayed prominently below the page title.
- **Print stylesheet:** `@media print` styles that remove navigation, simplify backgrounds, and ensure readable output.
- **Design tone:** Professional, restrained, trustworthy. No marketing flair.

---

## 9. Foundation Cleanup

These tasks run as part of Batch D after all page work is complete.

### 9.1 Font Loading

- `@font-face` declarations for Space Grotesk added to global CSS.
- `font-display: swap` on all font faces.
- Latin subset only.
- Preload tags for weights 400, 600, 700 in root layout `<head>`.

### 9.2 Token Unification

Resolve the dual OKLCh + hex color system. Establish hex-based custom tokens as the semantic layer. shadcn/ui CSS variables reference these semantic tokens. One system, not two.

### 9.3 Motion Easing Alignment

Create a shared motion configuration that defines easing curves used by both CSS transitions and Framer Motion animations. Example: `--ease-out-expo` defined as a CSS variable and exported as a Framer Motion `transition` object.

### 9.4 Component Audit

After batches A-C, audit all modified components for:

- Consistent spacing (multiples of 4px).
- Consistent border radii.
- Consistent hover/focus patterns.
- No orphaned styles from the redesign.

### 9.5 Responsive Audit

Verify all pages render correctly at three breakpoints:

| Breakpoint | Width | Context |
|---|---|---|
| Mobile | 375px | iPhone SE / small Android |
| Tablet | 768px | iPad portrait |
| Desktop | 1440px | Standard laptop/monitor |

### 9.6 Accessibility Pass

- `prefers-reduced-motion` coverage on every new animation.
- WCAG AA contrast ratios on all text/background combinations, including the new steel blue secondary color and quality score color coding.
- Keyboard navigation: all interactive elements reachable via Tab, activated via Enter/Space.

### 9.7 Performance Check

New fonts and animations must not regress:

- First Contentful Paint (FCP): no regression beyond 50ms.
- Cumulative Layout Shift (CLS): no regression. Font `swap` and explicit size tokens prevent layout shift from font loading.

---

## 10. New Components

| Component | Location | Used In | Description |
|---|---|---|---|
| `SocialProofBar` | `src/components/marketing/` | Homepage | Horizontal metrics strip: total assets, installs, creators, avg quality score |
| `HowItWorks` | `src/components/marketing/` | Homepage | 3-step visual flow: browse, check quality, install |
| `QualityShowcase` | `src/components/marketing/` | Homepage | 5 quality metrics grid + example score card |
| `FeaturedRulesetCard` | `src/components/marketing/` | Homepage, Collections | Hero-sized card variant for featured items |
| `CreatorEconomics` | `src/components/marketing/` | Homepage | Split layout showing 85/15 creator business model |
| `TrustStrip` | `src/components/marketing/` | Homepage | 3 trust signals: VirusTotal, Semgrep, verified reviews |
| `CommunityPreview` | `src/components/marketing/` | Homepage | Recent activity items from explore data |
| `FinalCTA` | `src/components/marketing/` | Homepage | Bottom-of-page conversion section |
| `RatingDistribution` | `src/components/product/` | Detail page | Star rating histogram (5-star to 1-star breakdown) |

---

## 11. Modified Components

| Component | File(s) | Changes |
|---|---|---|
| `RulesetCard` | `src/components/ruleset-card.*` | Quality score as colored badge top-right, category color accent stripe, taller layout with clearer visual zones |
| `FilterSidebar` | `src/components/browse/filter-sidebar.*` | Category colors on filters, collapsible sections with animation, active filter count badge, clear-all button |
| `TabBar` | `src/components/ui/tab-bar.*` | Active underline thickness increased to 2px |
| `DetailHero` | `src/components/detail/*` | Category color accent, Space Grotesk title, visual star rating, colored quality score badge |
| `QualityBreakdown` | `src/components/detail/*` | Per-metric individual colors, CI-style security pass/fail badge |
| `ProfileHero` | `src/components/profile/*` | Reputation progress bar visual, creator marks as prominent badge icons |
| `Shelf` | `src/components/shelf.*` | First shelf uses `FeaturedRulesetCard` for lead item, Space Grotesk titles |
| `CollectionCard` | `src/components/collections/*` | Increased padding, curator info display |
| `StatsCard` | `src/components/dashboard/*` | Space Grotesk numbers, color-coded delta indicators |
| `DashboardSidebar` | `src/components/dashboard/*` | Increased icon contrast, avatar image support, mobile hamburger/drawer |
| `PublishWizard` | `src/components/dashboard/*` | Enhanced step indicator with checkmarks, preview pane, success confirmation |
| `LeaderboardRow` | `src/components/leaderboard/*` | Quality score color bar, enhanced hover state |

Note: `Header` and `Footer` are structurally unchanged.

---

## 12. i18n Impact

### 12.1 New Keys Required

New keys must be added to both `messages/en.json` and `messages/tr.json` for:

- **Homepage sections:** Social proof metric labels, how-it-works step titles and descriptions, quality showcase section title and metric names/descriptions, creator economics headline and body and CTA, trust strip signal titles and descriptions and footer link, community preview section title and CTA, final CTA headline and button label.
- **About page:** Restructured section headings and feature card content.
- **Trust page:** New section headings, badge descriptions, reputation level descriptions.
- **Affiliates page:** Restructured section headings, step descriptions, persona card content.
- **CLI page:** New section headings, getting-started step descriptions.
- **Quality score grades:** Labels for A, B, and C grades.
- **Dashboard empty states:** Encouraging CTA text for each dashboard list view (purchases, saved, following, reviews).
- **Dashboard onboarding:** New user onboarding card suggested actions.
- **Component labels:** Any new interactive labels introduced by new or modified components.

### 12.2 Existing Keys

Existing i18n keys are preserved where the underlying content has not changed. No keys are removed.

### 12.3 Validation

The `npm run qa:i18n` parity checker must pass after all changes. Both locale files must have identical key structures.

---

## 13. Acceptance Criteria

Each batch is considered complete when:

1. All pages listed in the batch render without errors at 375px, 768px, and 1440px.
2. New i18n keys are present in both `messages/en.json` and `messages/tr.json`.
3. `npm run qa:i18n` passes.
4. No TypeScript errors (`npm run typecheck` passes).
5. No lint errors (`npm run lint` passes).
6. All existing hook return types are unchanged (verified by TypeScript compilation).
7. All new animations respect `prefers-reduced-motion`.
8. WCAG AA contrast ratios are met on all new color combinations.
9. No files listed in section 1.2 (out of scope) have been modified.
10. Dark theme remains the default with no light theme toggle introduced.

---

## 14. Self-Review

### 14.1 Placeholder Scan

No TBD, TODO, or incomplete sections remain. All sections specify concrete requirements with measurable outcomes.

### 14.2 Internal Consistency Check

- Typography: Space Grotesk for display/headlines is consistently specified across all batches. Geist for body and Geist Mono for data are consistent.
- Colors: Quality score color coding (emerald A, amber B, rose C) is referenced identically in sections 3.2.6, 4.1 (Section 4), 4.6, 5.1.1, 6.1.1, 6.1.3, and 7.3.
- Category colors: The same 9-color palette is referenced in sections 3.2.4, 4.6, 5.1.1, 5.1.2, and 6.2.
- Motion: Marketing gets scroll-reveal, product gets hover/transitions, dashboard gets no scroll-reveal. This is consistent across all batch descriptions.
- Spatial: max-w-4xl/7xl alternation on marketing, consistent max-w-7xl on product/dashboard. Consistent across all batches.
- Surface hierarchy values (bg-surface #141416, bg-raised #1e1e22) are defined once in section 3.2.5 and referenced consistently.

### 14.3 Scope Decomposition

Each batch is broken into individual pages. Each page lists specific, discrete changes. Component changes are itemized in sections 10-11. This is decomposed sufficiently for implementation plan generation.

### 14.4 Ambiguity Check

The following items were identified as potentially ambiguous and are clarified here:

- **"Hero-sized featured card"** (section 4.1, Section 5): This means a card that spans 2 columns in the grid and is approximately 1.5x the height of a standard RulesetCard, showing additional detail (description excerpt, creator info, quality score badge). Not a separate layout -- it is a variant of the card component.
- **"Animated CSS gradient"** (section 4.1, Section 1): Pure CSS `@keyframes` animation on a `background` or `background-image` property. Hue-shift or position-shift of gradient stops over a 20-second cycle. No canvas or WebGL.
- **"Subtle parallax"** (section 3.3.1): CSS-only approach using `transform: translateY(calc(var(--scroll-y) * 0.1))` updated via a throttled scroll event listener. No parallax libraries.
- **"CI-style security badge"** (section 6.1.3): Visual treatment resembling a GitHub Actions status badge -- rounded rectangle, green background with checkmark for pass, red with X for fail.
- **"Persona cards"** (section 4.4): Styled cards (not interactive) showing a target audience segment. An icon or simple illustration, a persona label, and a 1-2 line description of how that persona would use the affiliate program.
- **"Typing effect"** (section 4.5): Character-by-character text reveal in a styled terminal block, implemented via a `useEffect` interval that increments a character index in component state. A blinking cursor character (`|`) at the end.
