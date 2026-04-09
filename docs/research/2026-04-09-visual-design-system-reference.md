# Visual Design System Reference — RuleSell Marketplace

**Date:** 2026-04-09
**Purpose:** Single source of truth for every visual decision in the RuleSell project.
**Method:** Product-by-product audit of 10 developer tool UIs, synthesized into concrete tokens.

---

## 1. Executive Summary

RuleSell targets the visual language of Linear and Vercel: near-black backgrounds, a restrained single-accent palette, Geist typography, razor-thin borders at low opacity, and motion that is fast and functional rather than decorative. The interface should feel like a refined developer tool — not a consumer marketplace. Every surface should be quiet enough that the content (product cards, install commands, code previews) does the talking. Category colors exist only as small pills or dots, never as card backgrounds. The install command is the hero element on every detail page — monospace, dark inset panel, copy button, above the fold. Density sits between Vercel (airy) and npm (dense) — enough whitespace to breathe, enough information to decide without clicking through.

---

## 2. Product-by-Product Visual Audit

### 2.1 Linear — The Gold Standard

**Background:** Near-black base. Uses LCH color space for theme generation rather than HSL, producing perceptually uniform surfaces. Dark mode base is approximately `#0e0e11` (inferred from LCH calculations), with surface levels rising in ~6-8% lightness increments.

**Text hierarchy:** Four levels — primary (near-white, ~`#ededef`), secondary (~`#a0a0a5`), tertiary (~`#6e6e73`), quaternary (~`#4e4e52`). The quaternary level is rarely seen elsewhere and provides extreme subtlety for timestamps and metadata.

**Typography:** Inter Display for headings (adds optical refinement at large sizes), Inter for body. Font weights: light, normal, medium, semibold — never bold. Text sizes range from micro (~10px) through 9 title levels. Letter spacing is tight on headings (-0.02em to -0.04em), normal on body.

**Borders:** Barely visible. Soft separators at roughly `rgba(255,255,255,0.06)`. "Structure should be felt, not seen" — their stated principle. Rounded corners on separators, softened contrast. Recent refresh reduced visible separators further.

**Accent:** Historically blue-purple gradient sphere. 2025 refresh moved to near-monochrome — black/white with minimal color. Status colors (red, green, amber) only where semantically required.

**Animation:** Step-based micro-animations on grid patterns (3200ms cycles). Sidebar hover transitions are instant (<100ms). Page transitions are imperceptible — content swaps, no slide/fade. The philosophy: animation serves function, never decoration.

**Key takeaway for RuleSell:** The four-level text hierarchy and near-invisible borders. Our current three-level hierarchy (`--fg`, `--fg-muted`, `--fg-subtle`) is close but should add a fourth level for the least important metadata.

### 2.2 Vercel Dashboard

**Background:** Pure black `#000000` base (aggressive choice). Surface: `#0a0a0a` (gray-950). Cards and elevated surfaces: `#111111` to `#171717`.

**Gray scale (light mode values, inverted for dark):**
- gray-100: `#f7f7f7` / gray-900: `#171717`
- gray-200: `#e5e5e5` / gray-800: `#262626`
- gray-300: `#d4d4d4` / gray-700: `#404040`
- gray-400: `#a3a3a3` / gray-600: `#525252`
- gray-500: `#737373`

**Text:** Primary `#ededed` (not pure white — reduces glare). Secondary `#a1a1a1`. Muted `#666666`.

**Typography:** Geist Sans (custom, 2023). Geist Mono for code. Size scale: xs 12px, sm 14px, base 16px, lg 18px, xl 24px, 2xl 32px, 3xl 48px, display 64px. Line height: tight 1.15, base 1.5, relaxed 1.625. Letter spacing: tight -0.04em, normal -0.01em.

**Borders:** `1px solid rgba(255,255,255,0.08)` default, `rgba(255,255,255,0.15)` strong. No shadows on marketing. Minimal shadows on dashboard.

**Border radius:** none 0, sm 4px, md 6px, lg 8px, full 9999px.

**Spacing:** 4px base unit. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Section padding on marketing: 96-128px vertical.

**Accent:** Blue `#0070f3` — used sparingly (links, primary buttons, active states only). Error `#ee0000`. Warning `#f5a623`.

**Design philosophy exclusions:** No gradients on UI. No shadows on marketing. No illustrations. Minimal accent usage.

**Key takeaway for RuleSell:** The spacing scale (4px base, powers of 2 thereafter) and the aggressive restraint on accent color. One blue, used only where it means "action." Everything else is gray.

### 2.3 Raycast Extension Store

**Background:** Deep dark, approximately `#1a1a1c` to `#1c1c1e` (macOS-native dark).

**Cards:** Extension cards in a responsive grid. Each card: 64x64px icon, title, short description, developer avatar (48px), developer name, download count, install button. Cards have subtle rounded corners (~12px), minimal border, hover lifts with soft shadow.

**Category treatment:** Extensions have individual tint/accent colors (brand colors like `#00b3ff`, `#fff700`, `#d85a9b`) applied to the icon background or as small accents — never as full card backgrounds.

**Search:** Prominent search bar with `Cmd+K` shortcut indicator. Filter pills for "All / Recent / Popular" with active/inactive states. Platform filters (macOS, Windows) with icons.

**Typography:** System San Francisco font (native macOS). Clean hierarchy — title bold, description regular weight, metadata small and muted.

**Key takeaway for RuleSell:** The icon-with-tint-color treatment. Extension icons get their own brand color as a subtle background, making each card unique without breaking the overall dark aesthetic. This is better than category-colored borders.

### 2.4 GitHub Dark Mode

**Background hierarchy:**
- Base: `#0d1117` (blue-black, not neutral)
- Surface: `#161b22` (cards, panels)
- Raised: `#21262d` (dropdowns, popovers)
- Border: `#30363d`

**Text hierarchy:**
- Primary: `#c9d1d9` (deliberately not white — softer)
- Secondary: `#8b949e`
- Link: `#58a6ff`

**Border:** `#30363d` — visible, functional, not decorative. GitHub uses borders more aggressively than Linear/Vercel because information density is higher.

**Accent:** Blue `#58a6ff` for links, green `#3fb950` for additions, red `#f85149` for deletions. Semantic colors used extensively for diffs, status badges, labels.

**Key takeaway for RuleSell:** GitHub's blue-black tint (`#0d1117`) is warmer and less harsh than pure black. Our `#09090b` is close to Vercel's pure-black approach. Consider whether to stay neutral or add the slightest warm tint.

### 2.5 Warp Terminal

**Background:** Default dark theme ~`#002b36` (Solarized-influenced). Custom themes use accent color + background + foreground + 16 ANSI colors. The design adds white overlay for dark theme surface separation, maintaining text-color alignment.

**Accent integration:** Single accent color drives the entire UI chrome — selections, cursor, buttons all derive from one hue. This is the strongest single-accent implementation of any reference product.

**Key takeaway for RuleSell:** The single-accent philosophy. Warp proves you can theme an entire complex UI with one accent color and achieve coherence. Our amber-gold `#ffd166` should follow this pattern.

### 2.6 npm (npmjs.com)

**Layout:** Light mode default (red `#cb3837` brand). Package page uses two-column layout: readme/content on left (~70%), metadata sidebar on right (~30%).

**Install command treatment:** The install command (`npm i <package>`) appears at the top of the right sidebar in a dark inset box with monospace font and a copy button. It is always visible without scrolling on the detail page. The command uses white text on dark background even in light mode — making it the most visually prominent element.

**Card design (search results):** Compact list view, not cards. Each result shows: package name (linked, bold), version, description (one line, truncated), publish date, weekly downloads, keywords as small tags. Very dense — optimized for scanning many results quickly.

**Key takeaway for RuleSell:** The install command is in a persistent, prominent position with a dark inset treatment. npm puts it in the sidebar — always visible. For RuleSell, the install command should be above the fold on the detail page, in a visually distinct container.

### 2.7 mcpmarket.com (Direct Competitor)

**Observed features:** Light and dark mode support. Responsive layout. Server cards with icon, title, description, category. Categories page at `/categories/`. Individual server detail pages at `/server/<slug>`.

**Install command:** Uses `claude mcp add <name> -- npx -y @package/server` syntax. Displayed on detail pages with copy functionality.

**Content organization:** Servers organized by category (Design Tools, etc.). Navigation across categories. Pagination on category pages.

**Key takeaway for RuleSell:** mcpmarket is content-rich but design-generic. They do not have a distinctive visual identity. RuleSell can differentiate by having a more refined, Linear-quality dark interface. The bar is low.

### 2.8 Stripe Dashboard

**Design tokens approach:** Uses semantic design tokens with an extensible theming architecture. Dark mode added later with careful attention to accessibility. Tokens enable "darker mode" overlays for embedded developer contexts.

**Card/table treatment:** Clean tables with minimal row separators. Cards with subtle borders, no shadows. Data-dense but organized through whitespace and typography hierarchy rather than visual containers.

**Key takeaway for RuleSell:** Stripe's approach to data density — use typography and spacing to create hierarchy, not colored containers or heavy borders.

### 2.9 skills.sh (Vercel Skills Marketplace)

**Layout:** Two-column on desktop (sidebar + content). Dark mode enforced.

**Install command hero:** `npx skills add <owner/repo>` displayed prominently in a code-style container. Monospace font, dark background. Labeled "Try it now." This is the single most prominent UI element.

**Content:** Leaderboard table format rather than card grid. Each skill: rank, name, repository source, install count. Sortable/filterable.

**Colors:** Uses Geist design system tokens (`--ds-gray-500`, `--ds-gray-600`). Background and text follow Vercel's system.

**Key takeaway for RuleSell:** skills.sh puts the install command above everything else. The leaderboard format works for a small catalog; RuleSell's larger catalog needs cards, but the install command prominence is the right instinct.

### 2.10 Tailwind UI (Component Reference)

**Dark mode patterns:** Background `#111827` (gray-900), surface `#1f2937` (gray-800), border `#374151` (gray-700). Text primary `#f9fafb`, secondary `#9ca3af`, muted `#6b7280`.

**Card patterns:** Rounded-lg (8px), border `border-gray-700`, padding 24px, hover with ring or border-color change. No shadow elevation in dark mode — borders do the work.

**Key takeaway for RuleSell:** Tailwind's dark gray scale is warmer than Vercel's neutral scale. Our current tokens are closer to Vercel (zinc-based neutrals), which is the right choice for a dev tool.

---

## 3. Color System Reference

### 3.1 Background Hierarchy

Successful dark UIs use 3-4 background levels. More than 4 creates confusion.

| Level | Purpose | Reference values | RuleSell current | Recommendation |
|-------|---------|-----------------|------------------|----------------|
| Base | Page background | Vercel `#000`, GitHub `#0d1117`, Linear ~`#0e0e11` | `#09090b` | Keep. Zinc-black, not pure black. |
| Surface | Cards, panels | Vercel `#111`, GitHub `#161b22` | `#18181b` | Keep. Good lift from base. |
| Raised | Dropdowns, hovers | Vercel `#171717`, GitHub `#21262d` | `#27272a` | Keep. |
| Elevated | Active states, modals | GitHub `#30363d` | `#3f3f46` | Keep. Used sparingly. |

**Verdict:** Current RuleSell background tokens are well-calibrated. They sit between Vercel (neutral) and GitHub (blue-tinted), using Tailwind's zinc scale. No changes needed.

### 3.2 Text Hierarchy

| Level | Purpose | Reference | RuleSell current | Recommendation |
|-------|---------|-----------|------------------|----------------|
| Primary | Headings, emphasis | Vercel `#ededed`, Linear ~`#ededef` | `#fafafa` | Slightly bright. Consider `#ededef` to reduce glare. |
| Secondary | Body text | Vercel `#a1a1a1`, GitHub `#8b949e` | `#a1a1aa` | Good. |
| Tertiary | Metadata, timestamps | Linear ~`#6e6e73` | `#8b8b94` | Good for AA compliance. |
| Quaternary | Least important | Linear ~`#4e4e52` | — (missing) | **Add `--fg-dim: #52525b`** for decorative text, line numbers. |

### 3.3 Border Treatment

The 2025-2026 trend is toward near-invisible borders using low-opacity white overlays rather than solid gray values.

| Style | Reference | RuleSell current | Recommendation |
|-------|-----------|------------------|----------------|
| Default | Vercel `rgba(255,255,255,0.08)` | `#1a1a1e` | **Switch to `rgba(255,255,255,0.07)`** for consistency with the overlay approach. Solid hex borders look heavier. |
| Strong | Vercel `rgba(255,255,255,0.15)` | `#27272a` | **Switch to `rgba(255,255,255,0.13)`**. |

### 3.4 Accent Color Strategy

**How many accents?** One primary accent + semantic status colors. That's it.

- Linear 2025: near-monochrome, almost no accent
- Vercel: one blue (`#0070f3`) for actions only
- Warp: one accent drives entire chrome
- GitHub: one blue (`#58a6ff`) for links + semantic status colors

**RuleSell current:** Amber-gold `#ffd166` as brand accent. This is distinctive — warm gold is rare in dev tools (most use blue or green). Keep it.

**Category colors:** Currently 9 category colors. This is the highest risk of looking like a rainbow. Rules:
1. Category colors appear ONLY as small pills/dots (max 8x8px circle or text badge)
2. Never as card backgrounds, borders, or large surfaces
3. On the detail page, the category color appears once in the breadcrumb pill
4. Desaturate category colors to ~70% when used as backgrounds; use full saturation only for text on dark backgrounds

### 3.5 Concrete Color Tokens

```css
:root {
  /* Backgrounds */
  --bg:          #09090b;
  --bg-surface:  #18181b;
  --bg-raised:   #27272a;
  --bg-elevated: #3f3f46;

  /* Text */
  --fg:          #ededef;  /* was #fafafa — softer */
  --fg-muted:    #a1a1aa;
  --fg-subtle:   #8b8b94;
  --fg-dim:      #52525b;  /* NEW — quaternary */

  /* Borders (overlay approach) */
  --border-soft:   rgba(255, 255, 255, 0.07);
  --border-strong: rgba(255, 255, 255, 0.13);

  /* Brand */
  --brand:      #ffd166;
  --brand-soft: #ffd166/20%;  /* 20% opacity for backgrounds */
  --brand-fg:   #18181b;

  /* Status (unchanged, well-calibrated) */
  --success: #22c55e;
  --warning: #f59e0b;
  --danger:  #ef4444;
  --info:    #3b82f6;
}
```

---

## 4. Typography Reference

### 4.1 Font Stack

| Product | Sans | Mono |
|---------|------|------|
| Vercel | Geist | Geist Mono |
| Linear | Inter Display (headings), Inter (body) | — |
| GitHub | -apple-system, Segoe UI, Noto Sans | SFMono-Regular, Consolas, Liberation Mono |
| npm | Fira Mono, Consolas | Same |

**RuleSell current:** Geist + Geist Mono. This is correct. Geist is the developer-tool font of 2025-2026.

### 4.2 Type Scale

Reference from Vercel's scale, adapted for marketplace context:

| Token | Size | Use |
|-------|------|-----|
| `--text-xs` | 12px | Badges, timestamps, download counts |
| `--text-sm` | 14px | Card descriptions, metadata, sidebar labels |
| `--text-base` | 16px | Body text, card titles |
| `--text-lg` | 18px | Section headers, product title on detail page |
| `--text-xl` | 24px | Page titles (Marketplace, Collections) |
| `--text-2xl` | 32px | Hero heading on landing page |
| `--text-3xl` | 48px | Marketing display text |

### 4.3 Font Weight Distribution

| Weight | Use | Frequency |
|--------|-----|-----------|
| 400 (regular) | Body, descriptions | ~60% of all text |
| 500 (medium) | Card titles, nav items, labels | ~30% |
| 600 (semibold) | Page titles, CTA buttons | ~8% |
| 700 (bold) | Almost never | <2% — hero headings only |

**Rule:** If more than 10% of visible text is bold/semibold, the hierarchy is broken. Bold loses its power when overused.

### 4.4 Letter Spacing

| Context | Value |
|---------|-------|
| Display headings (32px+) | -0.04em |
| Page titles (24px) | -0.02em |
| Body text (14-16px) | -0.01em (Geist default) |
| Small text (12px) | 0 (no tracking adjustment) |
| Monospace | 0 (never adjust monospace tracking) |

### 4.5 Line Height

| Context | Value |
|---------|-------|
| Headings | 1.15 - 1.2 |
| Body text | 1.5 |
| Card descriptions (compact) | 1.4 |
| Small/metadata text | 1.3 |

### 4.6 Monospace Usage

**Use monospace for:**
- Install commands (`npx rulesell add ...`)
- Version numbers (`v2.1.0`)
- Code previews / snippets
- File paths
- CLI output

**Do NOT use monospace for:**
- Prices or download counts (use tabular-nums instead: `font-variant-numeric: tabular-nums`)
- Ratings
- Category names
- Navigation items

---

## 5. Card Design Reference

### 5.1 Cross-Product Card Comparison

| Product | Info shown | Layout | Border | Hover | Size (approx) |
|---------|-----------|--------|--------|-------|---------------|
| npm | Name, version, description, date, downloads, keywords | Horizontal list row | Bottom border only | Background highlight | Full-width row |
| VS Code | Icon, name, description, publisher, installs, rating | Horizontal with icon left | Subtle border | Highlight + install button | ~400x90px |
| Raycast | Icon (64px), name, description, author, downloads | Vertical card, icon on top | Rounded 12px, subtle | Lift + shadow | ~280x200px |
| HuggingFace | Model name, pipeline tag, downloads, likes | Horizontal list with tag | Bottom border | Background tint | Full-width row |
| GitHub Marketplace | Icon, name, description, category, stars | Vertical card | 1px border | Border color change | ~320x180px |
| Figma Community | Preview image, title, author, likes, views | Vertical with image | Rounded 8px | Scale 1.02 + shadow | ~300x280px |
| skills.sh | Rank, name, repo, install count | Table row | Row separator | Row highlight | Full-width row |

### 5.2 Optimal Card Design for RuleSell

Based on synthesis, the optimal developer asset marketplace card:

```
┌──────────────────────────────────────┐
│  [Icon 40px]  Title (medium weight)  │  ← Row 1: identity
│               @author · ★ 4.8        │
│                                      │
│  One-line description that           │  ← Row 2: purpose  
│  explains what this does...          │
│                                      │
│  ● MCP Server   ↓ 2.4k   v1.2.0    │  ← Row 3: metadata
└──────────────────────────────────────┘
```

**Specifications:**

- **Dimensions:** `min-width: 280px`, responsive with `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))`
- **Padding:** 20px (using `--space-5: 20px` or closest to `5 * 4px`)
- **Border:** `1px solid var(--border-soft)` — near-invisible
- **Border radius:** 8px (`--radius-lg`)
- **Hover:** Border brightens to `var(--border-strong)`, transition 150ms. Subtle translateY(-1px). No shadow — shadows look wrong on near-black backgrounds.
- **Icon:** 40px square, 8px border radius. If product has a custom icon, use it. If not, use a category-colored glyph on `--bg-raised` background.
- **Title:** 16px, medium weight (500). Single line, truncated.
- **Author:** 12px, `--fg-subtle`. Preceded by `@`.
- **Rating:** 12px, `--fg-subtle`. Star icon + number, not full star display.
- **Description:** 14px, `--fg-muted`. Two lines max, truncated with ellipsis.
- **Category pill:** 12px, monospace or small-caps. Category color as text color on `rgba(cat-color, 0.1)` background. Rounded-full.
- **Download count:** 12px, `--fg-subtle`. Use `tabular-nums`. Abbreviate (2.4k, 12k).
- **Version:** 12px, monospace, `--fg-dim`.

**What NOT to include on the card:**
- Price (show on detail page)
- Full star rating visualization (just the number)
- Install button (the card IS the link to details)
- Long descriptions
- Multiple badges

### 5.3 Card Grid

- **Gap:** 16px (`--space-4`) — tight enough for scanning, enough to separate
- **Columns:** 3 on desktop (>1200px), 2 on tablet (768-1200px), 1 on mobile
- **Max cards visible above fold:** 6-9 (2-3 rows of 3)

---

## 6. Spacing and Density Reference

### 6.1 Density Positioning

```
Dense ◄────────────────────────────────► Airy
npm   GitHub  [RuleSell]  Vercel  Figma
```

RuleSell should sit between GitHub and Vercel. Enough density to show 6-9 cards above the fold. Enough whitespace that each card breathes.

### 6.2 Spacing Scale

Based on Vercel's 4px-base system:

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Inline icon gaps, tight padding |
| `--space-2` | 8px | Small gaps, button padding-x, badge padding |
| `--space-3` | 12px | Card internal element gaps |
| `--space-4` | 16px | Card grid gap, section sub-gaps |
| `--space-5` | 20px | Card padding |
| `--space-6` | 24px | Section internal padding |
| `--space-8` | 32px | Between content sections on a page |
| `--space-10` | 40px | Between major page sections |
| `--space-12` | 48px | Page top/bottom padding |
| `--space-16` | 64px | Hero section vertical padding |

### 6.3 Page Layout

- **Max width:** 1200px for content area. Not wider — wider makes card grids look sparse.
- **Sidebar:** 240px fixed on desktop, collapsible on tablet, hidden on mobile.
- **Page horizontal padding:** 24px on desktop, 16px on mobile.
- **Navigation height:** 56px (compact, aligned with Vercel/Linear).

---

## 7. Motion Reference

### 7.1 Duration Scale

| Token | Value | Use |
|-------|-------|-----|
| `--duration-instant` | 0ms | Cursor changes, focus rings |
| `--duration-fast` | 100ms | Button active state, toggle |
| `--duration-base` | 150ms | Hover states, card hover, tooltip appear |
| `--duration-moderate` | 240ms | Dropdown open, sidebar expand |
| `--duration-slow` | 400ms | Page transitions, modal enter/exit |

**Current RuleSell tokens:** `--duration-fast: 150ms`, `--duration-base: 240ms`, `--duration-slow: 400ms`. The fast value should drop to 100ms for hover states. 150ms feels slightly laggy on hover.

### 7.2 Easing

| Token | Value | Use |
|-------|-------|-----|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Most transitions (enter) |
| `--ease-in` | `cubic-bezier(0.7, 0, 0.84, 0)` | Exit animations |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful micro-interactions (badge appear, toast) |

### 7.3 What to Animate

**Yes:**
- Card hover (border color + translateY, 150ms)
- Button hover (background lightens, 100ms)
- Tooltip/dropdown appear (opacity + translateY 4px, 150ms)
- Page route transition (content opacity, 200ms)
- Skeleton shimmer (infinite, subtle pulse)
- Copy button icon swap (check icon, 150ms)
- Search focus (border glow, 200ms)

**No:**
- Scroll-triggered animations on marketplace pages (users are scanning, not watching a show)
- Card entrance stagger (slows perceived load time)
- Parallax effects
- Background gradient animations
- Any animation longer than 400ms

### 7.4 Loading States

**Skeleton screens** are the 2025-2026 standard. Not spinners, not progressive render.

Card skeleton: rounded rectangle matching card dimensions, with inner rectangles for icon, title, description, metadata. Background `var(--bg-raised)` with a shimmer gradient `var(--bg-surface)` → `var(--bg-raised)` → `var(--bg-surface)`, 1.5s infinite.

---

## 8. Install Command Treatment

### 8.1 Cross-Product Comparison

| Product | Command location | Styling | Copy button |
|---------|-----------------|---------|-------------|
| npm | Right sidebar, top | Dark inset, monospace, always visible | Yes, icon |
| skills.sh | Hero area | Code container, monospace, prominent | Implied |
| VS Code | "Install" button (no command shown) | Blue button | N/A |
| Raycast | "Install" button | Purple button | N/A |
| Homebrew | Homepage hero | Terminal-style block | Yes |
| mcpmarket | Detail page body | Code block with copy | Yes |

### 8.2 RuleSell Install Command Design

The install command is the **single most important conversion element** on a detail page. It must be:
1. Above the fold
2. Visually distinct from all other elements
3. Effortless to copy

**Specification:**

```
┌─ Install ──────────────────────────────────────┐
│                                                 │
│  $ npx rulesell add @author/package-name   [⎘] │
│                                                 │
└─────────────────────────────────────────────────┘
```

- **Container:** Full-width within the detail page header area. Background `var(--bg)` (darkest level — inset effect). Border `var(--border-strong)`. Border-radius `var(--radius-md)` (6px).
- **Font:** Geist Mono, 14px, `var(--fg)`.
- **Prompt character:** `$` in `var(--fg-dim)` — indicates this is a terminal command.
- **Copy button:** Right-aligned, icon-only (clipboard icon). On click: icon morphs to checkmark (150ms), reverts after 2 seconds. Button uses `var(--fg-subtle)` default, `var(--fg)` on hover.
- **Padding:** 16px horizontal, 14px vertical.
- **Position:** Directly below the product title/author on the detail page. Above the description, above the tabs.
- **Alternative formats:** If the product supports multiple install methods (CLI, JSON config, manual), show tabs above the command: `CLI | JSON | Manual`. Only CLI shown by default.

### 8.3 Secondary Command Treatment (Card / Search Result)

On cards or search results, the install command is NOT shown. The card links to the detail page where the command lives. This keeps cards clean and scannable.

Exception: on a "featured" or "hero" product card at the top of the marketplace, a mini install command can appear as a single line below the description.

---

## 9. Concrete Recommendations for RuleSell

### 9.1 CSS Custom Properties (tokens.css updates)

```css
:root {
  /* ── Surfaces ── */
  --bg:          #09090b;
  --bg-surface:  #18181b;
  --bg-raised:   #27272a;
  --bg-elevated: #3f3f46;
  --bg-inset:    #050506;  /* NEW — for install command containers */

  /* ── Text ── */
  --fg:          #ededef;  /* CHANGED — was #fafafa, reduce glare */
  --fg-muted:    #a1a1aa;
  --fg-subtle:   #8b8b94;
  --fg-dim:      #52525b;  /* NEW — quaternary level */

  /* ── Borders ── */
  --border-soft:   rgba(255, 255, 255, 0.07);  /* CHANGED — overlay approach */
  --border-strong: rgba(255, 255, 255, 0.13);  /* CHANGED — overlay approach */
  --border-focus:  rgba(255, 209, 102, 0.5);   /* NEW — brand-tinted focus ring */

  /* ── Brand ── */
  --brand:         #ffd166;
  --brand-soft:    rgba(255, 209, 102, 0.15);  /* CHANGED — use alpha for layering */
  --brand-fg:      #18181b;

  /* ── Category accents (keep, but restrict usage) ── */
  --cat-rules:     #3b82f6;
  --cat-mcp:       #10b981;
  --cat-skill:     #f59e0b;
  --cat-agent:     #8b5cf6;
  --cat-workflow:   #f97316;
  --cat-prompt:    #ec4899;
  --cat-cli:       #06b6d4;
  --cat-dataset:   #14b8a6;
  --cat-bundle:    #f43f5e;

  /* ── Status ── */
  --success: #22c55e;
  --warning: #f59e0b;
  --danger:  #ef4444;
  --info:    #3b82f6;

  /* ── Radii ── */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* ── Shadows ── */
  --shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-md:  0 4px 12px rgba(0, 0, 0, 0.5);
  --shadow-lg:  0 12px 32px rgba(0, 0, 0, 0.55);
  --shadow-glow-brand: 0 0 0 1px rgba(255, 209, 102, 0.3),
                       0 0 20px rgba(255, 209, 102, 0.08);

  /* ── Motion ── */
  --duration-instant: 0ms;
  --duration-fast:    100ms;  /* CHANGED — was 150ms, too slow for hover */
  --duration-base:    150ms;  /* CHANGED — was 240ms, tightened */
  --duration-moderate: 240ms; /* NEW — for larger transitions */
  --duration-slow:    400ms;
  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in:     cubic-bezier(0.7, 0, 0.84, 0);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* ── Spacing ── */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
}
```

### 9.2 Tailwind Config Additions

Map the new tokens to Tailwind utilities in `globals.css` `@theme inline` block:

```css
@theme inline {
  /* Add these to existing @theme inline */
  --color-bg-inset: var(--bg-inset);
  --color-fg-dim: var(--fg-dim);
  --color-border-focus: var(--border-focus);
  --color-brand-soft: var(--brand-soft);

  /* Spacing scale */
  --spacing-1: var(--space-1);
  --spacing-2: var(--space-2);
  --spacing-3: var(--space-3);
  --spacing-4: var(--space-4);
  --spacing-5: var(--space-5);
  --spacing-6: var(--space-6);
  --spacing-8: var(--space-8);
  --spacing-10: var(--space-10);
  --spacing-12: var(--space-12);
  --spacing-16: var(--space-16);
}
```

### 9.3 Component Styling Guidelines

#### Product Card
```css
.product-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  transition: border-color var(--duration-base) var(--ease-out),
              transform var(--duration-base) var(--ease-out);
}
.product-card:hover {
  border-color: var(--border-strong);
  transform: translateY(-1px);
}
```

#### Install Command Block
```css
.install-command {
  background: var(--bg-inset);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-md);
  padding: 14px var(--space-4);
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--fg);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.install-command .prompt {
  color: var(--fg-dim);
  margin-right: var(--space-2);
  user-select: none;
}
.install-command .copy-btn {
  color: var(--fg-subtle);
  transition: color var(--duration-fast) var(--ease-out);
}
.install-command .copy-btn:hover {
  color: var(--fg);
}
```

#### Category Pill
```css
.category-pill {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  /* Color set dynamically per category */
  /* e.g., color: var(--cat-mcp); background: rgba(16, 185, 129, 0.1); */
}
```

#### Search Bar
```css
.search-bar {
  background: var(--bg-surface);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  padding: 12px var(--space-4);
  font-size: 14px;
  color: var(--fg);
  transition: border-color var(--duration-base) var(--ease-out),
              box-shadow var(--duration-base) var(--ease-out);
}
.search-bar:focus {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(255, 209, 102, 0.08);
  outline: none;
}
```

#### Skeleton Loader
```css
.skeleton {
  background: var(--bg-raised);
  border-radius: var(--radius-md);
  position: relative;
  overflow: hidden;
}
.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.04) 50%,
    transparent 100%
  );
  animation: shimmer 1.5s ease-in-out infinite;
}
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### 9.4 Key Rules for Implementation

1. **One accent color.** Amber-gold `#ffd166` is the brand. Use it for: primary CTA buttons, focus rings, active nav indicators, featured badges. Nothing else gets color emphasis.

2. **Category colors are metadata, not decoration.** Small pills (2px 8px padding, rounded-full). Never card borders, backgrounds, or icons larger than 16px.

3. **No shadows in card grids.** Shadows are invisible on near-black backgrounds and add visual noise. Use border-color transitions for hover instead.

4. **Typography restraint.** 60% regular weight, 30% medium, 8% semibold, 2% bold. If a page feels heavy, reduce font weights before reducing font sizes.

5. **Monospace only for code.** Version numbers, install commands, file paths, code previews. Never for prices, counts, or navigation.

6. **The install command is the CTA.** On detail pages, it lives above the fold, directly below the product identity. It is the most visually distinct element on the page (darkest background, strongest border, monospace font).

7. **Hover duration: 100-150ms.** Never slower. Card hover at 150ms (it has a transform). Button hover at 100ms (just color change). Tooltip at 150ms.

8. **Loading = skeleton.** No spinners anywhere in the main UI. Skeleton shapes match the content they replace. Shimmer animation at 1.5s.

9. **Max page width: 1200px.** Centered. 24px horizontal padding. The marketplace is a tool, not a canvas — don't go wider.

10. **Border radius consistency.** Small elements (badges, pills): 4px or full. Cards: 8px. Modals/dialogs: 12px. Never mix 8px and 12px on elements at the same hierarchy level.

---

## Sources

- [Linear UI Redesign](https://linear.app/now/how-we-redesigned-the-linear-ui)
- [Linear Design Refresh](https://linear.app/now/behind-the-latest-design-refresh)
- [Vercel Geist Colors](https://vercel.com/geist/colors)
- [Vercel Design System Breakdown (SeedFlip)](https://seedflip.co/blog/vercel-design-system)
- [Rise of Linear Style Design (Medium)](https://medium.com/design-bootcamp/the-rise-of-linear-style-design-origins-trends-and-techniques-4fd96aab7646)
- [GitHub Dark Palette (Atmos)](https://atmos.style/palettes/github-dark)
- [Dark Mode Best Practices (LogRocket)](https://blog.logrocket.com/ux-design/dark-mode-ui-design-best-practices-and-examples/)
- [Dark Mode Color Palettes 2025 (Colorhero)](https://colorhero.io/blog/dark-mode-color-palettes-2025)
- [Dark Mode Web Design 2026 (NateBal)](https://natebal.com/best-practices-for-dark-mode/)
- [Warp Terminal Themes](https://docs.warp.dev/terminal/appearance/themes)
- [Micro-Interactions Best Practices](https://robertcelt95.medium.com/micro-interactions-that-dont-annoy-the-3-second-rule-for-ui-animation-9881300cd187)
- [mcpmarket.com](https://mcpmarket.com/)
- [skills.sh / Vercel Skills](https://github.com/vercel-labs/skills)
