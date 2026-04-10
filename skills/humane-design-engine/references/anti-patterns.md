# Anti-Patterns: What Makes Design Look "AI-Generated"

These are the patterns Claude must actively avoid. Recognizing them is not enough — actively design against them.

---

## The 10 AI Design Anti-Patterns

### 1. The Generic Hero

Full-width gradient background (usually purple-to-blue), centered headline in a geometric sans-serif, floating UI mockup screenshot, two buttons side by side. This is the single most common AI design pattern on the web today. It signals "I used a template" without saying it.

**What to do instead:** Choose a visual concept first. The hero should answer a specific conceptual question — is this about speed? trust? precision? discovery? Let the answer drive layout, typography, and imagery choices. A hero without a concept is just a banner.

---

### 2. Meaningless Gradient Mesh

Abstract gradient blobs used as decoration without any conceptual purpose. You see these everywhere — soft purple/pink/orange orbs floating behind content, adding "depth" that doesn't mean anything.

Gradients are powerful when intentional: conveying depth, temperature, transition, energy. They become visual noise when used as default "modern" decoration.

**Test:** Can you explain in one sentence why this gradient exists? If not, remove it.

---

### 3. Glassmorphism Without Purpose

Frosted glass effects applied everywhere because they look "modern." Glass effects are meaningful when there's actual content behind them that you're deliberately obscuring — suggesting depth, layering, or partial transparency. When there's nothing behind the glass, it's just blur.

Glass is a relationship between layers. Without the layers, there's no glass.

**Test:** Is there meaningful content or context visible through the blur? If the effect were removed, would the interface lose information? If no, remove it.

---

### 4. Symmetry Addiction

AI tends to center everything and make both sides perfectly balanced. Two-column layouts where both columns have identical visual weight. Centered headlines on every section. Perfectly spaced icon grids.

Real design uses asymmetry deliberately. Tension, visual interest, and implied movement come from breaking symmetry. The eye needs somewhere to go, and symmetry gives it nowhere to travel.

**What to do instead:** Decide on a dominant side. Create visual hierarchy through size and weight, not just position. Let one element be significantly larger or more prominent than others.

---

### 5. Cookie-Cutter Cards

Every piece of content presented in identical rounded-rectangle cards with an image, headline, and description. This is the default "content container" pattern that gets applied indiscriminately.

Cards are appropriate for collections of similar, scannable items with parallel structure. They are not appropriate for editorial content, testimonials, process steps, or any information that benefits from a distinct visual treatment.

**Ask:** Does this content need a container at all? Would the information breathe better without a card? Could different types of content have different visual treatments?

---

### 6. Font Cowardice

Defaulting to safe, ubiquitous fonts — Inter, Roboto, Open Sans — because they're "clean" and "professional." These fonts are genuinely excellent for body text in specific contexts. But they carry no personality, no era, no point of view.

A design with Inter feels like a design that didn't choose a font. It feels like a design that accepted the default.

**What to do instead:** Choose typography that has a relationship with the product's personality. Not decorative for its own sake — but deliberate. A developer tool can use a font with technical precision. A creative marketplace can use something with more warmth. The font choice should be defensible.

---

### 7. Color by Committee

Using 3-4 desaturated blues and purples because they're inoffensive. This is the color equivalent of beige walls — it upsets no one and impresses no one.

Good color palettes have character and intention. They can be bold or muted, warm or cold, saturated or tonal — but they are CHOSEN, not defaulted to. Colors should have assigned roles: brand, action, signal, neutral, surface.

**Test:** Cover all the text. Does the color palette say anything? Does it feel like anyone made a decision?

---

### 8. Decorative Illustration Syndrome

Adding generic isometric illustrations or abstract vector shapes that don't relate to the content. The illustrations look like stock illustrations because they are stock illustrations, or because they were generated with zero relationship to the product.

Every visual element should earn its place. Illustration is powerful when it communicates something that text and UI cannot — metaphor, process, emotion, complexity made visible.

**Test:** Remove the illustration. Does the page lose information or emotional content? If not, the illustration is decoration.

---

### 9. Over-Polished Uncanny Valley

Everything is too perfect — too smooth, too consistent, too balanced. Every corner radius matches. Every spacing value is a multiple of 8. Every color is from the palette. The result is something that looks like it was made by a machine, because no human would achieve this level of uniformity.

Human design has intentional imperfection. A slightly unexpected spacing choice. A typeface with character. An asymmetric layout. An image that's a little raw. The Japanese concept of wabi-sabi — beauty found in imperfection and incompleteness — is deeply relevant here.

**What to do instead:** Make at least one deliberate deviation from the "obvious" choice. An unexpected font pairing. A layout where the grid is broken on purpose. A color accent that shouldn't work but does.

---

### 10. Motion Without Meaning

Elements that bounce, fade, slide, and scale on scroll just because animation is possible. Every section fades up. Every card has a hover scale. The nav slides in. It's all movement, no communication.

Every motion should answer the question: "What is this animation communicating?" Is it showing progression? Confirming an action? Drawing attention to something important? Revealing hierarchy?

**Test:** Watch the animation and ask: what did I learn from that? What changed in my understanding? If nothing, the animation is decorative.

---

## The Originality Test

Before finalizing any design, ask:

> "If I showed this to someone and removed all the text content, could they tell what makes this design different from a hundred similar pages?"

If the answer is no, the design lacks a concept.

This is not about being avant-garde or experimental for its own sake. It's about having a reason for each decision. A strong design concept makes every subsequent decision easier: does this element support the concept, or work against it?

---

## Quick Reference: Anti-Pattern Checklist

Before shipping, verify you haven't defaulted to:

- [ ] Purple-to-blue gradient hero
- [ ] Gradient mesh blobs used as decoration
- [ ] Frosted glass without meaningful background content
- [ ] Everything centered, nothing asymmetric
- [ ] All content in identical cards
- [ ] Inter/Roboto/Open Sans throughout without reason
- [ ] 3-4 desaturated blues as the full palette
- [ ] Isometric illustration with no content relationship
- [ ] Perfect uniformity with no deliberate variation
- [ ] Scroll animations on every section with no communicative purpose
