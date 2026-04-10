# Design Evaluation Rubric

Use this rubric to assess design quality before considering any pass complete. Score each dimension 1–5. A design needs at least a **3.5 average** to pass. Below that, it requires another revision cycle.

This rubric maps to the Braintrust design critique standard: it catches problems that are technically correct but creatively hollow.

---

## Scoring Dimensions

### 1. Concept Clarity (1–5)

Is there a clear, specific visual concept? Can you articulate it in one sentence?

| Score | Meaning |
|-------|---------|
| 1 | No identifiable concept. Generic patterns, no through-line |
| 2 | A vague direction exists but it's inconsistently applied |
| 3 | Concept is present and visible in most decisions |
| 4 | Clear, specific concept. Most design decisions are defensible against it |
| 5 | Strong, unique concept that guides every decision. You can articulate it in one sentence and every element confirms it |

**The question to ask:** What is this design's concept? If you can't answer in one sentence, it scores 1–2.

---

### 2. Visual Hierarchy (1–5)

Does the eye move through the design in the intended order? Is there a clear primary, secondary, and tertiary level?

| Score | Meaning |
|-------|---------|
| 1 | Everything competes for attention equally. No clear focal point |
| 2 | Some hierarchy but multiple elements fight for dominance |
| 3 | Primary focus is clear. Secondary level is inconsistent |
| 4 | Clear primary, secondary, tertiary levels. Eye moves with intention |
| 5 | Effortless eye movement. The viewer can't help but see things in the right order |

**The question to ask:** What do you see first? Second? Third? Is that the intended order?

---

### 3. Typography (1–5)

Are fonts well-chosen, properly sized, with good line lengths and line heights?

| Score | Meaning |
|-------|---------|
| 1 | Default fonts, poor sizing, unreadable at some sizes |
| 2 | Functional but generic. No personality. Line lengths or heights poorly set |
| 3 | Readable and adequate. Font choice isn't actively wrong |
| 4 | Fonts chosen with intention. Good scale, readable, appropriate character |
| 5 | Distinctive, readable, hierarchical. Typography contributes to the concept. Every type decision is defensible |

**The question to ask:** Why was this font chosen? Does the type feel like a decision or a default?

---

### 4. Color Purpose (1–5)

Does the color palette serve the concept and function? Are contrasts accessible?

| Score | Meaning |
|-------|---------|
| 1 | Random or default colors (generic blues/purples). No clear roles. Accessibility failures |
| 2 | Colors exist but aren't serving the concept. May have contrast issues |
| 3 | Colors are functional and accessible but lack character |
| 4 | Intentional palette with clear roles: brand, action, signal, neutral, surface |
| 5 | Palette is both beautiful and purposeful. Every color has a role. WCAG AA minimum met throughout |

**The question to ask:** What is each color's job? Cover the text — does the palette say anything?

---

### 5. Spatial Rhythm (1–5)

Is spacing consistent and meaningful? Does whitespace create breathing room?

| Score | Meaning |
|-------|---------|
| 1 | Inconsistent spacing, cramped, elements feel randomly placed |
| 2 | Some spacing logic but it breaks down in places |
| 3 | Functional spacing. Consistent enough but not generous or expressive |
| 4 | Rhythmic spacing. Whitespace is used intentionally. Density varies appropriately |
| 5 | Breathing room is itself a design tool. Spacing conveys importance. Dense where active, open where resting |

**The question to ask:** Does anything feel cramped? Is there a consistent spacing unit? Does the whitespace feel purposeful?

---

### 6. Originality (1–5)

Would this design stand out among peers? Does it actively avoid the anti-patterns in `anti-patterns.md`?

| Score | Meaning |
|-------|---------|
| 1 | Looks like every other AI-generated design. Fails the Originality Test |
| 2 | Has familiar patterns throughout with minor deviations |
| 3 | Generally competent. A few distinctive choices but mostly conventional |
| 4 | Clearly distinctive. Someone would notice it in a portfolio |
| 5 | Genuinely memorable. Would stand out on Dribbble or in a design review |

**The question to ask:** Run the Originality Test (from `anti-patterns.md`). Would someone recognize this design as distinct if you removed the copy?

---

### 7. Emotional Resonance (1–5)

Does the design evoke the intended feeling?

| Score | Meaning |
|-------|---------|
| 1 | Emotionless. Looking at it produces no feeling |
| 2 | Some warmth or energy but it's inconsistent or unconvincing |
| 3 | Functional emotional tone. It feels appropriate but not memorable |
| 4 | Clear emotional quality. You feel something specific when you look at it |
| 5 | Strong, intentional emotional response. The feeling matches the product's purpose and the user's context |

**The question to ask:** How do you feel when you look at this? Is that the right feeling for this product and this user at this moment?

---

### 8. Technical Quality (1–5)

Is the code clean, responsive, and accessible?

| Score | Meaning |
|-------|---------|
| 1 | Broken at some viewport, inaccessible, or fundamentally unsound |
| 2 | Works on desktop but breaks on mobile, or has significant a11y gaps |
| 3 | Functional across viewports. Semantic HTML mostly correct |
| 4 | Clean code, responsive, semantic HTML, basic a11y (focus states, labels, contrast) |
| 5 | Production-ready. Fully responsive, keyboard navigable, screen-reader tested, focus management correct, CLS-safe |

**The question to ask:** Does it work on a 375px screen? Can you navigate it with keyboard only? Do interactive elements have accessible labels?

---

### 9. Motion Purpose (1–5) — *Apply only if motion is present*

Does animation communicate or decorate?

| Score | Meaning |
|-------|---------|
| 1 | Gratuitous motion that distracts from content |
| 2 | Motion exists but doesn't serve a clear communicative purpose |
| 3 | Motion is pleasant and non-distracting but adds no information |
| 4 | Most animations serve a clear purpose: showing state change, revealing hierarchy, confirming action |
| 5 | Every animation answers "what is this communicating?" Respects `prefers-reduced-motion` |

**The question to ask:** For each animation: what did the user learn from that? If nothing, remove it.

---

### 10. Craft (1–5)

Are the details attended to? Alignment, consistency, polish?

| Score | Meaning |
|-------|---------|
| 1 | Rough edges everywhere. Misaligned elements, inconsistent radii, ragged spacing |
| 2 | Generally aligned but details break down under scrutiny |
| 3 | Clean at a glance. Some inconsistencies but not distracting |
| 4 | Well-crafted. Details hold up. Consistent component behavior |
| 5 | Dieter Rams would approve. Everything is in its right place. Nothing is there that shouldn't be. Nothing is missing that should be |

**The question to ask:** Look at the design at 2x zoom. Are there any alignment issues, inconsistencies, or rough edges?

---

## Scoring Summary

| Average Score | Verdict |
|--------------|---------|
| 4.5–5.0 | Ship it. Portfolio-grade. |
| 4.0–4.4 | Strong. Minor polish remaining. |
| 3.5–3.9 | Passes minimum bar. Specific dimensions need attention. |
| 3.0–3.4 | Needs revision. Identify the 2–3 lowest scores and address them. |
| Below 3.0 | Needs a rethink. The design has a structural problem. |

---

## How to Use This Rubric

1. Score each applicable dimension honestly
2. Calculate the average
3. If below 3.5, identify which dimensions are dragging the score and return a specific revision target
4. Do not average your way past a dimension scored 1 — a 1 is a blocking issue regardless of other scores
5. Technical Quality scored 1 is always a blocker

---

## Minimum Standards (Non-Negotiable)

Regardless of average score, the following are always required:

- WCAG AA color contrast on all body text
- Focus states visible on all interactive elements
- Responsive layout that doesn't break at 375px width
- No horizontal scroll on mobile
- Semantic HTML structure (headings in order, landmarks present)
- `prefers-reduced-motion` respected if any animation is present
