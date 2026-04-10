# Humane Design Engine Skill — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a comprehensive Claude Code skill that transforms design work into a principled creative process — understanding intent, developing unique concepts, reasoning from design fundamentals, creating with code, visually evaluating via screenshots, running internal critiques, and iterating.

**Architecture:** 11 files total — 1 main SKILL.md (under 500 lines, orchestrates the workflow), 7 reference docs (deep knowledge), 3 scripts (environment setup, screenshot capture, programmatic analysis). The SKILL.md is the conductor; reference files are the orchestra; scripts enable the visual evaluation loop.

**Tech Stack:** Markdown (skill + references), Bash (setup script), Node.js + Puppeteer (preview/screenshot/analysis scripts)

---

## File Structure

```
skills/humane-design-engine/
├── SKILL.md                              # Main skill — workflow phases 1-7, under 500 lines
├── scripts/
│   ├── setup-environment.sh              # Dependency checker/installer
│   ├── preview-and-screenshot.js         # Puppeteer-based multi-viewport screenshots
│   └── analyze-design.js                # Programmatic design analysis (contrast, spacing, hierarchy)
├── references/
│   ├── perception-principles.md          # Gestalt, cognitive load, attention research
│   ├── color-and-typography.md           # Color psychology, type theory, accessibility
│   ├── motion-and-animation.md           # Disney principles, UI motion, easing psychology
│   ├── creative-process.md              # Braintrust critique, divergent thinking, originality
│   ├── anti-patterns.md                 # What makes design look "AI-generated" and how to avoid it
│   ├── design-evaluation.md             # Self-critique framework, evaluation rubric
│   └── business-architecture.md         # Page sections, conversion architecture, marketplace patterns
```

All paths relative to project root: `/mnt/hdd/Jobs/Website/Ruleset/`

---

### Task 1: Create directory structure and setup script

**Files:**
- Create: `skills/humane-design-engine/scripts/setup-environment.sh`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p skills/humane-design-engine/{scripts,references}
```

- [ ] **Step 2: Write setup-environment.sh**

Write the full bash script that:
- Checks for Node.js, npm, Chrome/Chromium
- Creates `~/.humane-design-engine/{previews,screenshots}` working directories
- Installs Puppeteer (with puppeteer-core fallback)
- Reports readiness status

Full script content is specified in the prompt spec (Section 5).

- [ ] **Step 3: Make executable and verify**

```bash
chmod +x skills/humane-design-engine/scripts/setup-environment.sh
head -5 skills/humane-design-engine/scripts/setup-environment.sh
# Expected: #!/bin/bash header
```

- [ ] **Step 4: Commit**

```bash
git add skills/humane-design-engine/scripts/setup-environment.sh
git commit -m "feat(skill): add humane-design-engine setup script"
```

---

### Task 2: Create preview-and-screenshot.js

**Files:**
- Create: `skills/humane-design-engine/scripts/preview-and-screenshot.js`

- [ ] **Step 1: Write the screenshot script**

Node.js script that:
- Takes an HTML file path and optional output directory as arguments
- Serves the HTML via a local HTTP server (random port 8787-9787)
- Launches Puppeteer headless browser
- Captures screenshots at 3 viewports: desktop (1440x900), tablet (768x1024), mobile (375x812)
- Waits 1500ms for fonts/animations to settle
- Outputs screenshot paths to stdout
- Handles missing Puppeteer gracefully

Full script content is specified in the prompt spec (Section 5).

- [ ] **Step 2: Verify syntax**

```bash
node --check skills/humane-design-engine/scripts/preview-and-screenshot.js
# Expected: no output (syntax valid)
```

- [ ] **Step 3: Commit**

```bash
git add skills/humane-design-engine/scripts/preview-and-screenshot.js
git commit -m "feat(skill): add design preview and screenshot script"
```

---

### Task 3: Create analyze-design.js

**Files:**
- Create: `skills/humane-design-engine/scripts/analyze-design.js`

- [ ] **Step 1: Write the analysis script**

Node.js script that:
- Takes an HTML file path as argument
- Serves and renders the page via Puppeteer
- Extracts via `page.evaluate()`: font families, font sizes, heading hierarchy, unique colors, interactive target sizes
- Checks WCAG minimum touch targets (44x44px)
- Checks heading hierarchy skips
- Checks typographic hierarchy (3-8 distinct sizes)
- Outputs structured analysis report

Full script content is specified in the prompt spec (Section 5).

- [ ] **Step 2: Verify syntax**

```bash
node --check skills/humane-design-engine/scripts/analyze-design.js
# Expected: no output (syntax valid)
```

- [ ] **Step 3: Commit**

```bash
git add skills/humane-design-engine/scripts/analyze-design.js
git commit -m "feat(skill): add programmatic design analysis script"
```

---

### Task 4: Create references/perception-principles.md

**Files:**
- Create: `skills/humane-design-engine/references/perception-principles.md`

- [ ] **Step 1: Write the reference document**

Covers with actionable, research-backed detail:
- **Gestalt Principles** (Wertheimer, Koffka, Kohler): Proximity, Similarity, Figure-Ground, Closure, Continuity, Common Fate, Focal Point — each with UI-specific application guidance
- **Cognitive Load Theory** (Sweller): Working memory limits, Hick's Law, Fitts's Law, Miller's Law — each with concrete UI implications
- **Eye-Tracking Research** (NNg): F-Pattern, Z-Pattern, visual weight — with placement guidance
- **Whitespace Research** (Chaparro et al.): Comprehension benefits, cognitive load reduction, perceived value

Not a textbook — actionable knowledge with specific numbers and UI examples.

- [ ] **Step 2: Commit**

```bash
git add skills/humane-design-engine/references/perception-principles.md
git commit -m "feat(skill): add perception principles reference"
```

---

### Task 5: Create references/color-and-typography.md

**Files:**
- Create: `skills/humane-design-engine/references/color-and-typography.md`

- [ ] **Step 1: Write the reference document**

Covers:
- **Color Psychology** (Labrecque research): Real associations, cultural variation, not myths
- **Color harmony systems**: Complementary, analogous, triadic, split-complementary — when to use each
- **Functional color roles**: Primary, secondary, accent, semantic, neutral — role definitions
- **Accessibility**: WCAG 2.1 AA/AAA contrast ratios, never color-alone information
- **Typography readability**: Line length (45-75 chars), body size (16px+), line height (1.4-1.6x)
- **Typographic hierarchy**: 4+ levels, modular scales, font pairing principles
- **Font loading**: `font-display: swap`, subsetting, fallbacks

- [ ] **Step 2: Commit**

```bash
git add skills/humane-design-engine/references/color-and-typography.md
git commit -m "feat(skill): add color and typography reference"
```

---

### Task 6: Create references/motion-and-animation.md

**Files:**
- Create: `skills/humane-design-engine/references/motion-and-animation.md`

- [ ] **Step 1: Write the reference document**

Covers:
- **Disney's 12 Principles applied to UI** (Thomas & Johnston, via Willenskomer): Squash & Stretch, Anticipation, Staging, Slow In/Slow Out, Follow Through, Secondary Action, Timing, Exaggeration, Appeal — each with UI translation
- **CSS Easing Curves**: ease-out, ease-in, ease-in-out, spring/overshoot, linear — emotional properties of each
- **Animation timing**: 100-200ms micro, 200-400ms state, 300-500ms page — personality implications
- **Staggering**: 30-80ms intervals, reading order, max 8-10 elements
- **Scroll animation**: Intersection Observer, animate once, subtle parallax (10-20%), `prefers-reduced-motion`

- [ ] **Step 2: Commit**

```bash
git add skills/humane-design-engine/references/motion-and-animation.md
git commit -m "feat(skill): add motion and animation reference"
```

---

### Task 7: Create references/creative-process.md

**Files:**
- Create: `skills/humane-design-engine/references/creative-process.md`

- [ ] **Step 1: Write the reference document**

Covers:
- **Braintrust Model** (Catmull, Pixar): Diagnose not prescribe, no authority, expertise + empathy, everything starts bad
- **Divergent Thinking**: Random constraint injection, analogy transfer, emotion-first, anti-reference — techniques for generating 3+ radically different concepts
- **Boden's Three Types of Creativity**: Exploratory, combinational, transformational — with UI design examples
- **The three critic personas**: The Perceiver (Gestalt/cognitive), The Emotionalist (Don Norman/emotional design), The Craftsperson (Rams/technical excellence) — detailed evaluation questions for each

- [ ] **Step 2: Commit**

```bash
git add skills/humane-design-engine/references/creative-process.md
git commit -m "feat(skill): add creative process reference"
```

---

### Task 8: Create references/anti-patterns.md

**Files:**
- Create: `skills/humane-design-engine/references/anti-patterns.md`

- [ ] **Step 1: Write the reference document**

Covers the 10 AI-design anti-patterns:
1. The Generic Hero (gradient + centered text + floating UI)
2. Meaningless Gradient Mesh
3. Glassmorphism Without Purpose
4. Symmetry Addiction
5. Cookie-Cutter Cards
6. Font Cowardice (Inter/Roboto defaults)
7. Color by Committee (desaturated blue/purple)
8. Decorative Illustration Syndrome
9. Over-Polished Uncanny Valley
10. Motion Without Meaning

Plus the Originality Test question.

- [ ] **Step 2: Commit**

```bash
git add skills/humane-design-engine/references/anti-patterns.md
git commit -m "feat(skill): add anti-patterns reference"
```

---

### Task 9: Create references/design-evaluation.md

**Files:**
- Create: `skills/humane-design-engine/references/design-evaluation.md`

- [ ] **Step 1: Write the reference document**

Structured evaluation rubric with 10 dimensions (1-5 scale each):
1. Concept Clarity
2. Visual Hierarchy
3. Typography
4. Color Purpose
5. Spatial Rhythm
6. Originality
7. Emotional Resonance
8. Technical Quality
9. Motion Purpose
10. Craft

Passing threshold: 3.5 average. Below → another revision cycle.

- [ ] **Step 2: Commit**

```bash
git add skills/humane-design-engine/references/design-evaluation.md
git commit -m "feat(skill): add design evaluation rubric"
```

---

### Task 10: Create references/business-architecture.md

**Files:**
- Create: `skills/humane-design-engine/references/business-architecture.md`

- [ ] **Step 1: Write the reference document**

Covers:
- **12 page sections** with business jobs: Hero, Social Proof, Problem Statement, Features/Benefits, How It Works, Differentiation, Testimonials, Pricing, Trust & Security, Community, CTA, Footer — each with conversion science, design principles, common mistakes
- **Page-specific architecture**: Marketplace Browse, Item Detail, Creator Dashboard, Landing/Homepage — with critical sections and design principles for each
- **Conversion flow design**: Visitor→Browser→Buyer flow, Creator→Seller flow
- **Responsive architecture**: Section-by-section responsive behavior
- **Performance requirements**: FCP <1.5s, CLS <0.1, font loading, image optimization
- **RuleSell-specific context**: What it is, 4 core differentiators, current pages, target audience, design personality, business model, prioritized pages needing work

- [ ] **Step 2: Commit**

```bash
git add skills/humane-design-engine/references/business-architecture.md
git commit -m "feat(skill): add business architecture reference"
```

---

### Task 11: Create SKILL.md — the main orchestrator

**Files:**
- Create: `skills/humane-design-engine/SKILL.md`

This is the most critical file. Must be under 500 lines. Contains:

- [ ] **Step 1: Write the SKILL.md**

Structure:
1. **Frontmatter**: name, description (comprehensive trigger words)
2. **Environment Setup**: Run setup script on first use, handle fallbacks
3. **Phase 1 — Intent & Context Discovery**: Who, What, Where, Why, How questions
4. **Phase 2 — Concept Development**: Unique visual concept requirement, references to creative-process.md and anti-patterns.md
5. **Phase 3 — Principled Design Execution**: Typography-first, color-from-meaning, layout-from-intent, spacing-from-rhythm, animation-from-communication — with references to relevant docs
6. **Phase 4 — Live Preview & Visual Evaluation**: Save → serve → screenshot → view workflow using scripts
7. **Phase 5 — Braintrust Critique**: Three personas (Perceiver, Emotionalist, Craftsperson), reference to design-evaluation.md
8. **Phase 6 — Revision**: Targeted improvements, optional second screenshot
9. **Phase 7 — Present with Intent**: Brief explanation of concept, decisions, critique, limitations
10. **Progressive disclosure rules**: Which references to always read vs. read-when-relevant
11. **Business architecture hook**: "Before designing any page, read business-architecture.md"

- [ ] **Step 2: Verify line count**

```bash
wc -l skills/humane-design-engine/SKILL.md
# Expected: under 500 lines
```

- [ ] **Step 3: Commit**

```bash
git add skills/humane-design-engine/SKILL.md
git commit -m "feat(skill): add humane-design-engine main skill file"
```

---

### Task 12: Register skill in CLAUDE.md and final verification

**Files:**
- Modify: `CLAUDE.md` (add skill entry to Project Skills section)

- [ ] **Step 1: Add skill to CLAUDE.md Project Skills**

Add to the `## Project Skills` section:
```
- `humane-design-engine`: Use for any digital design work — websites, landing pages, dashboards, components, mobile interfaces, SVG, animations, icons, data visualizations. Triggers on design creation, styling, UI/UX, visual work. File: `skills/humane-design-engine/SKILL.md`
```

- [ ] **Step 2: Verify complete file structure**

```bash
find skills/humane-design-engine -type f | sort
# Expected: 11 files matching the spec
```

- [ ] **Step 3: Verify SKILL.md under 500 lines**

```bash
wc -l skills/humane-design-engine/SKILL.md
```

- [ ] **Step 4: Verify scripts have valid syntax**

```bash
bash -n skills/humane-design-engine/scripts/setup-environment.sh
node --check skills/humane-design-engine/scripts/preview-and-screenshot.js
node --check skills/humane-design-engine/scripts/analyze-design.js
```

- [ ] **Step 5: Final commit**

```bash
git add CLAUDE.md
git commit -m "feat: register humane-design-engine skill in CLAUDE.md"
```
