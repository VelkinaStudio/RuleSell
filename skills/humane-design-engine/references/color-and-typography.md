# Color and Typography Reference

Research-backed guidance Claude draws from during design work. Covers color psychology, harmony systems, functional color roles, accessibility requirements, and typography fundamentals. Read for decisions about palette, type scale, hierarchy, and readability.

---

## Color

### Color Psychology — What the Research Actually Says

**Lauren Labrecque's brand personality research** (Journal of the Academy of Marketing Science, 2012) is among the most cited empirical work on color and brand perception. Key findings:

- **Red** activates arousal, urgency, and excitement. Increases perceived energy. Used effectively for clearance pricing, food brands (appetite stimulation), and call-to-action buttons where urgency is appropriate. Overuse makes interfaces feel aggressive.
- **Blue** conveys trust, competence, and reliability. The dominant color of financial institutions, healthcare, and enterprise software for documented reasons, not convention. Tends toward coolness and professional distance.
- **Green** signals safety, permission, and natural qualities. Strong association with "go," "approved," and "healthy." In UI, reliably associated with success states.
- **Yellow/Amber** signals caution — nearly universal in warning states. Also associated with warmth and optimism in branding contexts.
- **Black/Dark neutrals** convey sophistication, premium, and authority. Used extensively by luxury brands to signal premium positioning.
- **White/Light neutrals** signal cleanliness, simplicity, and transparency.

**Critical caveat from Labrecque's own research:** These are tendencies, not deterministic effects. Context overrides the color's intrinsic associations. A red button in a high-urgency checkout context works differently than red in a calm reading interface. The surrounding context, typography, and product personality modulate every color's psychological effect.

---

### Cultural Color Associations

Designers working on international products (or i18n-targeted products) must account for these variations:

| Color | Western (US/EU) | China/East Asia | Middle East | India |
|-------|-----------------|-----------------|-------------|-------|
| White | Purity, innocence | Mourning, death | Purity | Purity |
| Red | Danger, urgency, passion | Luck, prosperity, celebration | Caution | Purity, celebration |
| Green | Safety, nature, go | Growth, clean | Islam, sacred | Fertility, auspicious |
| Blue | Trust, corporate | Immortality | Safety, protection | Devotion |
| Yellow | Caution, warmth | Imperial, sacred | Happiness | Sacred, auspicious |
| Black | Elegance, authority | Evil, bad luck | Death (in some contexts) | Evil |

**Practical implication:** Semantic colors (success/error/warning/info) are broadly consistent in digital interfaces globally because they have been standardized through software conventions since the early internet. But branding colors, hero imagery, and celebration states should be evaluated for the target locale. A red "Congratulations" banner works in China; it reads as an error or alert in Western contexts.

---

### Color Harmony Systems

Choose a harmony based on the emotional intent of the design. These are not arbitrary aesthetic preferences — each system creates a measurably different perceptual effect.

**Complementary** (colors opposite on the color wheel, e.g., blue + orange):
- High contrast, energetic, attention-commanding
- Use for strong CTA contrast, hero section emphasis, or notification badges against brand color
- Risk: visual vibration when used in large patches side by side at full saturation. Desaturate or shade one of the pair
- Examples: GitHub's dark background with orange/amber accent; NY Knicks orange on blue

**Analogous** (colors adjacent on the wheel, e.g., blue + blue-green + teal):
- Harmonious, calm, cohesive
- Natural-feeling transitions between tones
- Risk: can feel monotonous without a contrast accent
- Use for: calm product surfaces, documentation, reading environments
- Apply a single complementary or near-complementary accent to add life without breaking the harmony

**Triadic** (three colors equidistant on the wheel, e.g., red + blue + yellow):
- Vibrant and balanced, maintains full chroma
- Harder to control without looking chaotic
- Use one dominant, one secondary (at lower saturation/value), one as accent only
- Effective for playful, energetic, or creative brand identities

**Split-complementary** (base color + the two colors adjacent to its complement, e.g., blue + orange-red + orange-yellow):
- Retains complementary contrast but with less visual tension than pure complementary
- More versatile than pure complementary for multi-surface design systems
- Strong recommendation for product UIs that need energy without aggression

**Practical note:** Most successful UI color systems are not pure textbook harmony systems. They use a 60/30/10 distribution principle: 60% dominant neutral or brand color, 30% secondary supporting color, 10% accent for emphasis. Apply harmony principles to choose which hues, then apply 60/30/10 to determine how much of each.

---

### Functional Color Roles in UI

Every serious design system assigns colors to functional roles, not just aesthetic ones. These roles should be explicit in the design token layer.

**Primary:** The brand color. Used for the most important interactive elements — primary buttons, active states, key links. Should appear on the most action-worthy elements.

**Secondary:** Supporting interactive color. Secondary buttons, less prominent links, hover states, selection highlights.

**Accent:** Used sparingly for highlights, badges, or special-status indicators that need to stand out from both primary and secondary usage.

**Semantic roles** — these are near-universal in digital interfaces and should not be violated without a very strong reason:
- **Success / Positive:** Green family. Confirmation messages, completed steps, valid input states.
- **Warning / Caution:** Amber/yellow family. Non-critical issues, advisory notices, rate-limit warnings.
- **Error / Destructive:** Red family. Validation failures, destructive action confirmations, critical failures.
- **Info / Neutral notice:** Blue family. Informational banners, help text callouts, non-critical notifications.

**Neutral:** The backbone of most UIs — backgrounds, surface layers, borders, text hierarchy. Neutrals should be a complete scale (50 through 900 in most systems) and slightly warm or cool, matching the overall brand temperature. Pure gray (#808080) reads as sterile and flat.

**Surface layers:** In dark-mode or layered interfaces, define at minimum three surface elevations: base background, raised surface (card), and elevated surface (modal, dropdown). Each level should differ by 5-10% lightness in dark mode, with optional box-shadow at higher elevations.

---

### Accessibility Requirements

These are not guidelines — they are legal requirements under WCAG 2.1 for products in jurisdictions with accessibility law (ADA in the US, EN 301 549 in the EU, AODA in Canada).

**WCAG 2.1 AA (minimum required standard):**
- Normal text (below 18pt / below 14pt bold): minimum **4.5:1** contrast ratio against background
- Large text (18pt+ / 14pt+ bold): minimum **3:1** contrast ratio
- UI components and graphical objects (icons, input borders, chart elements): minimum **3:1** against adjacent colors
- Focus indicators: must be visible; WCAG 2.2 adds specific size and contrast requirements for focus rings

**WCAG 2.1 AAA (enhanced standard):**
- Normal text: **7:1** contrast ratio
- Large text: **4.5:1** contrast ratio

**Practical targets for common design decisions:**
- Body text on white background: aim for 7:1+ (black or near-black text). #333333 on white = 12.6:1. #767676 on white = exactly 4.5:1 — this is the edge, not the target.
- Placeholder text: frequently fails AA. Placeholder text at opacity 0.5 on a white input often falls below 4.5:1. Use a minimum of #767676 on white backgrounds.
- White text on color backgrounds: pure white (#FFFFFF) needs a background darker than approximately #777777 for 4.5:1. Brand colors often fail — always check.
- Dark mode: light text on dark backgrounds follows the same ratios but is harder to calibrate. Dark backgrounds are perceived as lower contrast than light backgrounds at the same numeric ratio — leave extra margin.

**Never use color alone to convey information.** Always pair color with at least one other cue:
- Shape or icon (a red circle with an X, not just a red dot)
- Text label (the error message, not just the red border on the field)
- Pattern or position (an error row that is both red AND has an icon AND has a message)

This is required for colorblind users (8% of males have red-green color deficiency) and benefits all users in low-light, glare, or high-ambient-light conditions.

---

## Typography

### Readability Fundamentals

**Optimal line length:** 45-75 characters per line for body text. This is the consensus from Robert Bringhurst's "The Elements of Typographic Style" (the authoritative reference on the subject) and corroborated by eye-tracking research.

- Below 45 characters: lines are too short. The eye makes excessive return sweeps and reading becomes choppy. The brain processes fewer words before a line break interrupts the flow.
- Above 75 characters: lines are too long. The eye struggles to locate the beginning of the next line accurately when returning from the right edge. Reading speed drops and comprehension falls.
- For UI: at 16px body text, 45-75 characters corresponds to roughly 400-680px column width depending on the typeface. Use `max-width: 65ch` as a CSS utility to cap body text columns.

**Recommended column widths by use case:**
- Long-form reading (articles, docs): 600-720px / 65-75ch
- Product descriptions: 480-600px / 55-65ch
- Sidebars and secondary content: 320-400px / 40-50ch
- Ultra-wide columns above 800px are almost always wrong for text

---

### Font Size Standards

**16px is the minimum for body text on screens.** This is the default browser font size for a reason — decades of browser UI research converged on it. Interfaces that use 14px body text create strain for users over 40 and are increasingly problematic on high-DPI screens where the physical pixel count is high but the effective reading size is still 14px.

**Research backing:** Kevin Larson (Microsoft Advanced Reading Technologies) conducted controlled studies showing that well-typeset text — at appropriate size with good spacing — produces measurable cognitive benefits including improved mood, greater concentration, and better task performance versus poorly-typeset text at the same information level. The effect is not just aesthetic.

**Size targets by context:**
- Body text, default reading: 16px minimum, 17-18px preferred for reading-heavy interfaces
- Body text for older audiences: 18-20px
- Captions, metadata, labels: 12-14px (use sparingly; below 12px is almost always inaccessible)
- Secondary UI text (timestamps, supplementary info): 13-14px
- Mobile body text: same as desktop — 16px minimum. Resist the temptation to shrink.

---

### Line Height (Leading)

**Body text:** 1.4-1.6x the font size. At 16px body, this is 22-26px line height. The sweet spot for most Latin-script text is 1.5 (24px at 16px font size).

**Headlines:** 1.1-1.3x. Tight leading on large type looks intentional and controlled. Loose leading on headlines looks accidental.

**Small text (12-14px):** 1.6-1.8x. Small text needs more breathing room to remain legible between lines.

**Wide columns:** Increase line height as column width increases. A 750px column needs tighter line height than the math suggests would feel comfortable — use visual testing over formulas for wide reading columns.

**CSS implementation note:** Always use unitless line-height values (e.g., `line-height: 1.5`) rather than fixed pixel values (e.g., `line-height: 24px`). Unitless values scale correctly when the user or browser changes the base font size.

---

### Typographic Hierarchy

Establish at minimum four levels. Without a clear hierarchy, users cannot scan and the design looks flat.

| Level | Name | Size Range | Usage |
|-------|------|------------|-------|
| 1 | Display / Hero | 40-72px | Page titles, hero headlines, marketing statements |
| 2 | Heading | 24-36px | Section headers, card titles, feature names |
| 3 | Body | 16-20px | All reading text, descriptions, instructions |
| 4 | Caption / Small | 12-14px | Timestamps, metadata, labels, footnotes |

**Between levels, the ratio should be consistent.** This is the modular scale principle — choose a ratio and apply it throughout:

- 1.2 (minor third): tight, compact hierarchies; appropriate for data-dense UIs
- 1.25 (major third): the most common ratio for product UIs; balanced
- 1.333 (perfect fourth): clear distinction between levels; good for reading-focused products
- 1.5 (perfect fifth): dramatic hierarchy; appropriate for marketing surfaces with few type levels
- 1.618 (golden ratio): very dramatic; use only with 3-4 levels or the scale becomes impractical

**Type tools:** Use tools like type-scale.com to generate a complete scale, then round to the nearest sensible pixel value. Don't apply fractional pixel values like 18.75px — round to 19px.

---

### Font Pairing

**The core rule:** Pair fonts with contrasting personalities but compatible proportions. Fonts from the same era or drawn by the same designer tend to have compatible proportions even when stylistically different.

**Effective pairing patterns:**
- Serif display + sans-serif body (classic, authoritative; used extensively in editorial design)
- Sans-serif display + serif body (modern with warmth; less common, distinctive)
- Geometric sans display + humanist sans body (clean hierarchy within sans-serif; works for tech/product brands)
- Single typeface with weight/style contrast (strong bold + regular; appropriate when a single family has enough range)

**What to look for in compatibility:**
- Similar x-height proportion (the height of lowercase letters relative to cap height). Mismatched x-heights make type look accidental.
- Compatible stroke contrast (both optical/humanist, or both geometric/monolinear)
- Era alignment: an Art Deco typeface with a contemporary geometric sans will clash; an Art Deco typeface with a transitional oldstyle serif will sit comfortably together

**Font selection guidance:**
- Choose fonts that have sufficient weight range (at minimum Regular and Bold; ideally 3-4 weights)
- Avoid fonts that look distinctive only at display sizes but fall apart at body sizes
- Google Fonts is acceptable but be selective. The top-10 most-used Google Fonts (Roboto, Open Sans, Lato, Montserrat, Raleway in the same combinations) appear on hundreds of thousands of sites. If the design goal is distinctiveness, look further in the library or use licensed type.

---

### Font Loading Performance

Performance affects perceived quality and is a real cost in markets with variable connectivity.

**font-display: swap** — always specify this. Without it, text is invisible until the web font loads (FOIT: Flash of Invisible Text). `swap` shows system fallback text immediately and swaps to the web font when loaded. Acceptable for most uses.

**Fallback stack:** Always specify generic fallback fonts that are visually similar to the web font. A mismatch between the fallback and the loaded font causes layout shift (CLS — Cumulative Layout Shift), a Core Web Vitals metric. Tools like Font Style Matcher can help align fallback metrics.

Example:
```css
font-family: 'Inter', 'Helvetica Neue', Arial, system-ui, sans-serif;
```

**Subsetting:** For Latin-only interfaces, use the `unicode-range` subsetting available from Google Fonts or subset manually using tools like pyftsubset. A full variable font can be 400KB+; a subset for Latin + Latin Extended is typically 40-80KB.

**Variable fonts:** If a typeface has a variable font version, prefer it when you need multiple weights. One variable font file can replace 4-6 individual weight files with a smaller total footprint.

**WOFF2 format:** Always prefer WOFF2 over WOFF, TTF, or EOT. WOFF2 is Brotli-compressed and universally supported in modern browsers. No need to serve other formats unless supporting IE11 (not recommended in 2024+).

**Self-hosting vs. Google Fonts:** Self-hosting eliminates the DNS lookup to fonts.gstatic.com and gives full control over caching headers. For performance-critical products, self-host. For most cases, Google Fonts with `&display=swap` is acceptable and the CDN performance is strong globally.

---

### Type in Dark Interfaces

Dark-mode typography requires calibration beyond inverting colors:

- **Avoid pure white (#FFFFFF) on dark backgrounds for body text.** Pure white at maximum contrast creates glare and can cause halo effects on OLED screens. Use slightly off-white: #E8E8E8 to #F5F5F5 range, or a white that carries a very slight warm or cool tint matching the overall palette temperature.
- **Reduce weight in dark mode for thin strokes.** Some typefaces with delicate strokes at light weight on white backgrounds appear to "bloom" on dark backgrounds — they read as slightly heavier. If the same font weight looks heavy in dark mode, drop one weight level (Medium to Regular, Regular to Light) in the dark theme.
- **Line height may need increase in dark mode.** Some users report slightly reduced readability on dark backgrounds at the same line height as light mode. A conservative 5-10% increase in line height for long-form dark-mode reading surfaces is well-tolerated.
- **Do not use maximum contrast for all text.** In dark mode, reserve the highest contrast for headings and primary content. Secondary content (meta, captions) should use a visibly lower-contrast color — but one that still meets 4.5:1 against the background. Use a neutral scale to create the same hierarchy as light mode through contrast variation.
