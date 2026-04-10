---
name: humane-design-engine
description: >
  A principled creative design system that produces genuinely original, human-feeling digital design.
  Use this skill whenever the user asks to create, design, build, or style ANY digital visual work —
  websites, landing pages, dashboards, apps, components, illustrations, icons, posters, animations,
  data visualizations, or any UI/UX work. Also triggers on words like "make it beautiful", "redesign",
  "style this", "create a UI", "build a page", "design something". This skill forces Claude through
  a structured creative process: understanding intent, developing unique visual concepts, reasoning
  from deep design principles (Gestalt, cognitive psychology, color theory, typography, motion),
  creating with native tools, visually evaluating via live browser screenshots, running internal
  design critiques, and iterating. It covers web, mobile, SVG, animation, and all digital design.
  ALWAYS use this skill for any design task, even simple ones — it ensures every output is intentional,
  original, and grounded in real design thinking rather than generic AI patterns.
---

# Humane Design Engine

A structured creative process for producing original, principled digital design. Follow every phase in order. Do not skip phases.

## Reference Files

Deep knowledge lives in these files — read them as directed by each phase:

| Reference | When to Read |
|---|---|
| `references/perception-principles.md` | Phase 3 — layout, hierarchy, grouping |
| `references/color-and-typography.md` | Phase 3 — color choices, font pairing |
| `references/motion-and-animation.md` | Phase 3 — animation, transitions, scroll |
| `references/creative-process.md` | Phase 2 + Phase 5 — divergent thinking, critic personas |
| `references/anti-patterns.md` | Phase 2 + Phase 3 — avoid generic AI output |
| `references/design-evaluation.md` | Phase 5 — 10-dimension scoring rubric |
| `references/business-architecture.md` | Phase 3 — page sections, conversion flows |

## Scripts

| Script | Purpose |
|---|---|
| `scripts/setup-environment.sh` | Check/install Node.js, Puppeteer, Chrome |
| `scripts/preview-and-screenshot.js` | Multi-viewport screenshots (1440, 768, 375) |
| `scripts/analyze-design.js` | Programmatic design analysis (fonts, colors, targets) |

---

## Environment Setup

Run once on first use. Check for `~/.humane-design-engine/node_modules/puppeteer` to determine if already configured.

```
bash scripts/setup-environment.sh
```

**If Puppeteer fails to install:** Continue without visual evaluation. Note the limitation in your output and offer to help the user install manually. The design process still works — you just skip Phase 4 screenshots.

---

## Phase 1: Intent & Context Discovery

**Do not write any code yet.** Answer these five questions explicitly before proceeding:

1. **Who** is the audience? What emotional state are they in when they arrive?
2. **What** is the core human need this design serves? (Not features — the underlying need.)
3. **Where** will this be experienced? Desktop, mobile, both? What physical/mental context?
4. **Why** should someone care about this interface? What is at stake for them?
5. **How** should this make someone feel? Name a specific emotion — not "good" or "clean."

Write the answers out. They become the brief that every subsequent decision is tested against.

If the user's request is vague, ask clarifying questions before proceeding. A weak brief produces a weak design.

---

## Phase 2: Concept Development

**This is the most important phase.** Spend more time here than on code execution.

**READ:** `references/creative-process.md` for divergent thinking techniques.
**READ:** `references/anti-patterns.md` to learn what generic AI output looks like and avoid it.

### What a concept is

A concept is NOT a style label ("modern", "minimal", "dark mode"). It is a **specific visual metaphor or spatial philosophy** that guides every decision. Examples:

> "This dashboard breathes like a library at dusk — information is present but unhurried, warm amber tones suggest accumulated knowledge, typography is set in a slightly condensed serif that feels like marginalia in a well-loved book."

> "This landing page moves like water finding its path — content flows around obstacles, nothing is forced into rigid grids, the color palette shifts like light through a stream from deep teal to pale gold."

> "This mobile app feels like a tool made by a craftsperson — visible joints and seams, honest materials, everything has tactile weight and deliberate edges."

### Concept quality test

Your concept must be:

- **Specific** — Could only describe THIS design, not any design
- **Emotionally grounded** — Connects to Phase 1's target emotion
- **Guiding** — Resolves ambiguous design decisions ("would this choice fit a library at dusk?")
- **Original** — Not a copy of a known brand's aesthetic

Write the concept out in 2-4 sentences. If it reads like a template, start over.

### Process

1. Generate 3 distinct concepts (use divergent thinking from `references/creative-process.md`)
2. Test each against the anti-patterns in `references/anti-patterns.md`
3. Select the strongest concept and refine it
4. State the concept clearly before moving to Phase 3

---

## Phase 3: Principled Design Execution

With the concept established, create the design. Every decision must trace back to the concept or a design principle.

### Required reading

**Always read:** `references/anti-patterns.md`

**Read based on task:**

| Task involves | Read |
|---|---|
| Layout, hierarchy, grouping | `references/perception-principles.md` |
| Color choices, font pairing | `references/color-and-typography.md` |
| Animation, transitions, scroll | `references/motion-and-animation.md` |
| Full pages or applications | `references/business-architecture.md` |

### Execution rules

These are summaries. The reference files contain the full reasoning.

**Typography first.** Choose fonts that serve the concept. Never default to Inter/Roboto/Arial without justification. Pair a display font with a body font. Establish a type scale with clear hierarchy (minimum 1.5:1 ratio between heading levels).

**Color from meaning.** Derive colors from the concept, not trending palettes. Build a 5-7 color palette with defined roles (primary, secondary, accent, surface, text, muted, border). Check WCAG AA contrast: 4.5:1 for body text, 3:1 for large text.

**Layout from intent.** Use Gestalt proximity and similarity for grouping. Apply Hick's Law — reduce visible choices at each decision point. Apply Fitts's Law — important targets should be large and reachable. Do not default to 12-column grids without reason.

**Spacing from rhythm.** Use a consistent spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px. Generous whitespace improves comprehension and perceived quality.

**Animation from communication.** Every motion must have a communicative purpose.
- Entrance: ease-out, 200-400ms
- Exit: ease-in, 150-300ms
- State change: ease-in-out, 200-400ms
- Never animate just for decoration

**Pages as conversion architecture.** Before designing any page, read `references/business-architecture.md` to understand which sections are needed and what business job each performs. Every section has a measurable purpose — do not design pages as collections of visual elements.

### During execution

As you write code, periodically check:
- Does this decision serve the concept?
- Would the anti-patterns list flag this as generic?
- Is there a design principle supporting this choice, or am I guessing?

---

## Phase 4: Live Preview & Visual Evaluation

After writing the design as code:

1. **Save** the HTML/CSS/JS file to disk
2. **Run screenshots:**
   ```
   node scripts/preview-and-screenshot.js <file-path>
   ```
   This captures screenshots at desktop (1440px), tablet (768px), and mobile (375px).
3. **View** each screenshot using image viewing capability
4. **Evaluate** what it actually looks like — not what the code says it should look like

### If the file is React/JSX

Wrap it in a minimal HTML shell with React CDN scripts before screenshotting. The preview script expects a standalone HTML file it can open in a browser.

### If Puppeteer is unavailable

Note that visual evaluation was skipped. Offer to help install it. Proceed to Phase 5 using code-based reasoning only (less reliable but still valuable).

### Optional: programmatic analysis

```
node scripts/analyze-design.js <file-path>
```

Checks font variety, heading hierarchy, touch target sizes, and color count. Useful as a supplement to visual evaluation, not a replacement.

---

## Phase 5: The Braintrust Critique

After seeing the screenshot (or after completing code if screenshots unavailable), run an internal multi-perspective critique.

**READ:** `references/creative-process.md` for the three critic personas.
**READ:** `references/design-evaluation.md` for the 10-dimension scoring rubric.

### Three critics, specific observations

Each critic identifies 2-3 **specific, measurable** issues with **concrete fixes**. Not vague praise or generic suggestions.

**The Perceiver** (Gestalt / Cognitive Science)
Evaluates: visual hierarchy, grouping clarity, figure-ground separation, cognitive load, reading flow, information architecture.

**The Emotionalist** (Don Norman / Emotional Design)
Evaluates: does it evoke the intended emotion? Does it have genuine personality or feel generic? Is there an element of surprise or delight? Would a human designer be proud of this?

**The Craftsperson** (Dieter Rams / Technical Excellence)
Evaluates: is everything necessary? Typography settings (tracking, leading, measure). Color accessibility. Spacing rhythm consistency. Responsive behavior. Motion purpose.

### Critique format

Be specific and actionable:

```
PERCEIVER: The hero headline (48px) and subheading (36px) have only a 12px
difference — insufficient hierarchy. Increase ratio to 1.5:1+ (e.g., 56px / 24px).

EMOTIONALIST: Three shades of blue feels institutional. The concept was "cafe
where you linger" — swap to warm neutrals with terracotta or saffron accent.

CRAFTSPERSON: Card grid uses 24px gap but 16px internal padding. Internal
padding should equal or exceed external gap to strengthen card containers.
```

### Score

Apply the 10-dimension rubric from `references/design-evaluation.md`. Each dimension scores 1-5. **Target: 3.5+ average to pass.** If below 3.5, Phase 6 revisions are mandatory.

---

## Phase 6: Revision

Make **targeted improvements** based on the critique. This is surgical, not a rewrite.

1. Address each specific issue raised by the three critics
2. Re-check against the concept — revisions must still serve the original vision
3. If screenshots are available, capture new screenshots after revision
4. Run a brief second evaluation — confirm improvements landed and no regressions

If the score was already above 3.5, this phase can be light. If below 3.5, iterate until it passes.

---

## Phase 7: Present with Intent

When delivering the final design, include a brief explanation (3-5 sentences):

1. **The concept** — what it is and why it was chosen for this audience/context
2. **Key decisions** — 2-3 design choices and the principles behind them
3. **Critique response** — what the internal review caught and how it was fixed
4. **Limitations** — any known issues or areas for future refinement

The design speaks for itself. Keep this concise — it is context, not a sales pitch.

---

## Quick Reference: Phase Checklist

Use this to verify you have not skipped a phase:

- [ ] **Phase 1** — Five intent questions answered explicitly
- [ ] **Phase 2** — Unique visual concept written out (not a style label)
- [ ] **Phase 2** — Anti-patterns file read and checked against concept
- [ ] **Phase 3** — Relevant reference files read before execution
- [ ] **Phase 3** — Every design decision traces to concept or principle
- [ ] **Phase 4** — Screenshots captured and viewed (or noted as unavailable)
- [ ] **Phase 5** — Three critic perspectives with specific issues
- [ ] **Phase 5** — 10-dimension score calculated, 3.5+ to pass
- [ ] **Phase 6** — Targeted revisions made based on critique
- [ ] **Phase 7** — Brief presentation with concept, decisions, critique response

---

## When to Read What — Decision Tree

```
Starting a design task?
├── Always: references/anti-patterns.md
├── Is it a full page or app?
│   ├── Yes: references/business-architecture.md
│   └── No: skip
├── Does it involve layout or information hierarchy?
│   ├── Yes: references/perception-principles.md
│   └── No: skip
├── Does it involve color or typography choices?
│   ├── Yes: references/color-and-typography.md
│   └── No: skip
├── Does it involve animation or interaction?
│   ├── Yes: references/motion-and-animation.md
│   └── No: skip
├── Developing concepts (Phase 2)?
│   └── Yes: references/creative-process.md
└── Running critique (Phase 5)?
    └── Yes: references/creative-process.md + references/design-evaluation.md
```
