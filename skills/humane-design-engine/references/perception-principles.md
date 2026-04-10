# Perception Principles Reference

Research-backed principles Claude draws from during design work. Each entry includes attribution, the core finding, and direct UI application. Read for decisions about layout, hierarchy, grouping, and attention.

---

## Gestalt Principles

Originated by Max Wertheimer, Kurt Koffka, and Wolfgang Köhler in the 1920s. The central claim: the brain perceives organized wholes, not isolated parts. Understanding how it groups and separates elements lets you design with the grain of human perception rather than against it.

### Proximity

**The principle:** Elements close together are perceived as belonging to the same group. Spatial distance is the strongest grouping cue the brain uses.

**UI application:**
- The gap between a label and its input must be smaller than the gap between that label-input pair and the next field. If the spacing is equal, the brain cannot parse the grouping.
- Group related controls inside a tighter bounding box of whitespace, then use larger margins to separate groups from each other. The ratio matters — the inter-group gap should be at least 2x the intra-group gap, often more.
- In form design: error messages must sit immediately below (or beside) the field they describe. If an error is equidistant from two fields, users won't know which field failed.
- In card layouts: action buttons (Edit, Delete) must sit closer to the card content than to adjacent cards.

**Failure mode:** When everything has the same spacing, nothing groups. The layout looks like a grid of equal parts with no hierarchy.

---

### Similarity

**The principle:** Elements that share visual characteristics — color, shape, size, texture, weight — are perceived as having the same function or belonging to the same category.

**UI application:**
- All primary interactive elements (buttons, links, clickable cards) should share a distinct visual trait that non-interactive elements do not have. Blue underlined text, filled buttons with rounded corners, cards with a subtle hover state — pick one system and apply it consistently.
- Navigation items should look like siblings. If one nav item is bold and another is regular weight, the user infers they are different kinds of items.
- Break similarity deliberately to signal a difference: a destructive action (Delete) should break the similarity pattern of the other actions (Save, Cancel) through color, weight, or placement. The Von Restorff Effect — see Focal Point below.
- Secondary information (metadata, timestamps, captions) should share a visual pattern: smaller, lighter, less saturated. Consistency here is what makes the hierarchy legible.

**Failure mode:** Inconsistent interactive patterns — some links are blue, some are underlined, some are buttons — force users to probe elements to discover interactivity.

---

### Figure-Ground

**The principle:** The brain automatically separates a focal object (figure) from its context (ground). This is preattentive — it happens before conscious thought.

**UI application:**
- Content must separate clearly from chrome (navigation, borders, UI structure). If a paragraph of body text has the same visual weight as the sidebar, the brain cannot identify which is "the thing I came to read."
- Use contrast, elevation (shadow), or color shift to create layers. Material Design's elevation system is a direct application of this principle.
- Modals and drawers must clearly separate from the background page. A dark overlay on the page creates a figure-ground relationship where the modal is unmistakably the active layer.
- Toast notifications should appear at a higher layer than the page content — they are figures that temporarily overlay the ground.
- Deliberate figure-ground play: the FedEx logo's hidden arrow sits in the negative space between the E and x. Subtle figure-ground reversals can create memorable, distinctive visual identities.

**Failure mode:** Low-contrast backgrounds, cards that barely differ from their container, or borders that don't create enough separation — the brain has to work to identify what to focus on.

---

### Closure

**The principle:** The brain completes incomplete shapes. A shape with a gap is perceived as closed. This means implied boundaries work without explicit lines.

**UI application:**
- You do not need to draw every border. Alignment, whitespace, and color can create implied containers. A group of items with consistent left alignment and adequate space above and below reads as a section without needing a box drawn around it.
- Card designs don't need all four borders — a left accent border plus whitespace creates strong closure.
- The hamburger menu icon (three horizontal lines) works because of closure — the brain reads it as a contained shape representing a menu, despite being just three lines.
- Progress indicators use closure: a circle that is 80% filled reads as "almost complete" because the brain completes the circle and reads the gap.
- Navigation underlines on active states use closure to imply a container.

**Failure mode:** Over-boxing everything — adding borders to every component when whitespace and alignment would create cleaner grouping with less visual noise.

---

### Continuity

**The principle:** The eye follows paths, lines, and curves. Elements along a common path are perceived as related. The eye prefers continuous movement over sharp direction changes.

**UI application:**
- Alignment creates continuity. Elements on the same left edge, baseline, or vertical axis feel connected even with space between them. This is why grid systems work — shared alignment creates invisible lines the eye follows.
- A column of feature descriptions aligned to a column of icons reads as pairs because the eye connects elements along the vertical axis.
- Break continuity deliberately to signal section changes: a rule, increased vertical space, a color shift, or a change in grid column width all break the eye's path and signal "you are now in a different area."
- In horizontal scrolling carousels, a card partially visible at the edge creates continuity cues — the eye reads the implied continuation and understands it can scroll.
- Animation uses continuity: a drawer that slides in from the right continues the eye's trajectory, while a fade-in makes the source ambiguous.

**Failure mode:** Misaligned elements — buttons that aren't flush with the text above them, icons that don't share a baseline with their labels — create subtle disruption the eye registers as disorder.

---

### Common Fate

**The principle:** Elements that move together are perceived as belonging to the same group, regardless of spatial position or visual similarity.

**UI application:**
- Animate related elements together. If a card expands, its internal content should move with it in a unified motion. If the children animate separately, the perception of unity breaks.
- Accordion panels: the label and content should animate as one unit. The icon rotation, the height expansion, and any reveal of content should feel like a single coordinated action.
- Hover states on groups: when a card is hovered, all its sub-elements (image, title, meta, CTA) should respond as one — a unified lift, a coordinated color shift — rather than individual elements reacting at different times.
- In filtered lists, when items are removed by a filter, the remaining items should move together in a coordinated reflow, not each independently.
- Loading states: skeleton loaders that pulse in sync across a group reinforce the grouping.

**Failure mode:** Staggered animations that make grouped items appear to move independently suggest the items are separate, even if they share a visual style.

---

### Focal Point (Von Restorff Effect)

**The principle:** What is visually different from its context is immediately noticed. The brain's attention system flags novelty — an element that breaks the pattern stands out before the user consciously scans the screen.

Described by Hedwig von Restorff in 1933. Also called the isolation effect.

**UI application:**
- The primary CTA should be the most visually distinct element on the page. One red button among gray buttons is noticed immediately. One filled button among ghost buttons is noticed immediately.
- Use this effect deliberately and sparingly. If everything is distinct, nothing stands out. The effect requires contrast within context — a large red button is only salient when the surrounding elements are smaller and neutral.
- Pricing pages: highlight the recommended plan with a different background, border, or badge. The brain identifies it first.
- Notification badges use the Von Restorff effect — a colored dot on an icon breaks the visual pattern of the icon itself.
- Status indicators: a single error state (red row) in a table of neutral rows is seen before the user reads anything.

**Failure mode:** Feature envy — making too many things "prominent" by giving them all bold, color, or badges. Each attempt to stand out competes with the others, and nothing succeeds.

---

## Cognitive Load Theory

Developed by John Sweller in 1988. Working memory is limited in both capacity and duration. Exceeding it causes errors, frustration, and abandonment. Designing to reduce unnecessary cognitive load is not simplification — it is respecting the constraints of human cognition.

Working memory holds approximately **4±1 chunks** of information simultaneously (Nelson Cowan's 2001 revision of Miller's 7±2 — see below). Each chunk can be a simple element or a learned pattern (experts chunk more efficiently).

---

### Hick's Law

**Attribution:** William Hick (1952) and Ray Hyman (1953). Decision time increases logarithmically with the number of choices.

**The finding:** T = b × log₂(n + 1), where T is response time, n is the number of equally probable alternatives, and b is an empirically derived constant. More choices = more time, but the relationship is logarithmic — doubling choices doesn't double decision time, but it does increase it meaningfully.

**UI application:**
- Reduce the number of visible choices at any decision point. Netflix uses genre categories rather than presenting every title on one screen — each categorical filter reduces the decision set before the user commits to browsing.
- Progressive disclosure: present the most common 3-5 actions immediately. Put advanced options behind "More" or a settings panel. The user who needs the advanced option will find it; the user who doesn't need it is not slowed down.
- Navigation with more than 7 items needs grouping or prioritization. Dropdown menus can carry more items, but the primary nav bar should be ruthlessly selective.
- Checkout flows: showing all shipping options, payment types, and upsells at once increases decision time and abandonment. Stage the decisions.
- Search over browse: when the option space is very large, a search box is often faster than browsing categories — it bypasses Hick's Law by letting the user specify directly.

**Failure mode:** Dashboard designs that show every possible metric, filter, and action on the initial view. The user's first task becomes "find the thing I actually need."

---

### Fitts's Law

**Attribution:** Paul Fitts, 1954. The time to move a pointing device to a target is a function of the target's distance and size.

**The finding:** MT = a + b × log₂(2D/W), where MT is movement time, D is distance, and W is target width. Targets that are large and close are fast to reach. Targets that are small and distant are slow and error-prone.

**UI application:**
- Primary actions should be large. A minimum tap target of 44×44pt (Apple HIG) or 48×48dp (Material Design) prevents mis-taps. Error-prone small targets increase frustration and perceived unreliability.
- On mobile, the most important actions belong at the bottom of the screen — the natural resting position of the thumb on a held phone. iOS moved the back gesture to the left edge (close to the thumb) and put primary actions in the bottom bar for exactly this reason.
- On desktop, the screen edges are "infinitely large" targets because the cursor stops at the edge. The macOS Dock and Windows taskbar exploit this — you overshoot toward the edge and land on the target.
- Destructive actions (Delete, Remove, Disconnect) should be smaller and positioned away from the primary action flow. The physical cost of reaching them reduces accidental triggering.
- Hoverable dropdown menus: the pointer must be able to move diagonally from the trigger to the submenu without the menu closing. Amazon's mega-menus use this — there is a triangular hover zone between the trigger and the sub-panel.

**Failure mode:** Icon-only buttons with no hit area padding, link text that is single words (tiny targets), or mobile actions placed in the top corners (thumb stretch zone).

---

### Miller's Law

**Attribution:** George Miller, 1956, "The Magical Number Seven, Plus or Minus Two."

**The finding:** Human short-term memory can hold approximately 7±2 items. Miller himself was reporting on information theory experiments, not making a design prescription — but the finding was widely applied to UI. The more useful modern number is Cowan's 4±1 for working memory chunks.

**UI application:**
- Navigation menus with more than 7 items at a single level need grouping. Group into categories of 3-7 related items.
- Phone numbers are written as chunks (555-867-5309) because the brain processes chunks, not individual digits. Apply the same principle to any numeric display: account numbers, order IDs, license keys.
- Steppers and progress indicators: break multi-step processes into 4-7 named steps. If a process has 12 steps, group them into phases of 3-4.
- On-boarding checklists: 5-7 items is a reasonable single-session goal. More than that, split into phases or milestones.
- Pricing tiers: 3-4 tiers is the usable maximum. Beyond 4, comparison difficulty spikes sharply and conversion drops.

**Important caveat:** Miller's Law is not a hard cap. The constraint is on simultaneously held information, not on total information available on screen. A list of 20 items is fine as long as the user is scanning, not memorizing. The constraint applies to decisions that require holding multiple options in working memory at once.

---

## Eye-Tracking Research

Research from Nielsen Norman Group, the Poynter Institute's EyeTrack studies, and academic labs. These are statistical tendencies across populations, not deterministic rules. Context, content type, and user intent all modulate behavior.

---

### F-Pattern

**Source:** Nielsen and Pernice, "Eyetracking Web Usability" (2010). Observed in text-heavy pages — news sites, product listing pages, search results.

**The finding:** Users make two horizontal sweeps across the top of the content area (reading the first few words of multiple lines), then a vertical sweep down the left edge, forming an F. Information in the bottom-right of a content block receives very little attention.

**UI application:**
- Lead with the most important content. The first two lines of any text block get disproportionate attention. Product descriptions should open with the key benefit, not context or backstory.
- Left-edge placement: category labels, key differentiators, and action prompts belong on the left. The eye sweeps that vertical left rail even as the horizontal attention fades.
- Don't bury the critical information at paragraph three. If you can't lead with it, use visual hierarchy (bold, callout, icon) to break the F-pattern scan.
- Long-form documentation: use section headers aggressively so the F-pattern sweep picks up navigation cues. Dense walls of text are only read by motivated users.

**Limitation:** The F-pattern applies to content-heavy pages where users are scanning, not to landing pages, dashboards, or product surfaces with strong visual hierarchy. If the design uses clear visual structure, users scan toward the highest-contrast elements regardless of position.

---

### Z-Pattern

**The finding:** On pages with minimal text and strong visual layout (landing pages, hero sections), the eye follows a Z — top-left to top-right (scanning the top edge), diagonal down to bottom-left, then across to bottom-right.

**UI application:**
- Logo belongs top-left (trust and orientation). Primary navigation belongs top-right (within the top horizontal sweep).
- CTA placement at top-right or bottom-right aligns with the Z endpoint — the eye arrives there after the diagonal sweep.
- Hero sections: headline at top-left or top-center, subhead below it, CTA at the bottom of the Z arc.
- Split-screen layouts (image left, text right) exploit the Z: the image anchors the left rail, the diagonal carries the eye to the headline on the right, and the CTA sits below it.

**Limitation:** Z-pattern is most predictable for above-the-fold, low-density surfaces. Scroll behavior and content density modulate it significantly.

---

### Visual Weight

**The principle:** Larger, darker, more saturated, higher-contrast, and more complex elements attract attention before smaller, lighter, less saturated ones. This is preattentive processing — it happens in under 200ms, before conscious scanning begins.

**UI application:**
- The most important element on the page should have the most visual weight. If the primary CTA is the same visual weight as the navigation links, the hierarchy is unresolved.
- Use visual weight deliberately as a hierarchy tool: display heading > section heading > body > caption is a weight gradient, not just a size gradient.
- Images have enormous visual weight. A large full-bleed image will attract attention before any headline, regardless of typography. In hero designs, the image and headline hierarchy must be considered together.
- White text on dark backgrounds can have high contrast but lower perceived weight than dark text on white backgrounds because the brain reads the white as "space" by default. Test this carefully in context.

---

## Whitespace

**Research base:** Chaparro et al., "Examining the Effect of Body Text Size and Line Spacing on Reading Performance of Adults" (Wichita State University Human Factors lab); and replicated findings in studies of web reading comprehension.

**The finding:** Increased margins and leading (line spacing) improve reading comprehension, reduce error rates, and improve aesthetic ratings of a design. The cognitive benefit is real, not merely aesthetic preference.

**Key applications:**

**Whitespace as grouping:** The gap between elements communicates relationship. Equal spacing suggests equal relationship. Unequal spacing creates hierarchy. Designing spacing is as important as designing elements.

**Whitespace as signal of value:** Luxury brands use abundant whitespace to signal that what is present deserves attention. Product pages for premium goods don't tile 20 items — they show fewer items with more breathing room. The whitespace itself is part of the value signal.

**Dense content needs MORE whitespace, not less:** The instinct to compress is wrong. When information density is high (data tables, dashboards, code), increased whitespace reduces the cognitive load that the density has already imposed. Cutting whitespace in dense UIs reliably increases error rates.

**Practical targets:**
- Between form sections: at least 2x the intra-section spacing
- Between paragraphs: 0.75-1x the font size (em)
- Left/right margin on content: minimum 16px on mobile, 24-48px on tablet, use max-width + auto margins on desktop to prevent ultra-wide line lengths
- Card padding: 16-24px on mobile, 24-32px on desktop

**Failure mode:** Treating whitespace as "unused space" and filling it with secondary content, cross-links, or decorative elements. Every addition to a layout is a claim on the user's attention budget.
