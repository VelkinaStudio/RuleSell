# Creative Process Reference

## The Braintrust Model

Source: Ed Catmull, "Creativity, Inc." (2014). Adapted from Pixar's internal creative review process.

At Pixar, the Braintrust is a group of trusted experts who review work-in-progress with radical candor. They watch cuts of films that aren't working and diagnose the problem. The director then decides what to do about it.

Four operating principles that make the model work:

**Diagnose, don't prescribe.** Identify what isn't working and why, but don't dictate solutions. "The hero section doesn't create urgency" is useful feedback. "Make the button red" is not — it skips the diagnosis and locks the creator into someone else's solution, which may be the wrong solution.

**No authority.** The critique informs but doesn't command. The director (or designer) retains full decision-making authority. This isn't just nice — it's structurally important. The person doing the work has context the reviewer doesn't. They may have already tried the suggested solution and found it didn't work.

**Expertise and empathy.** Critiques come from people who understand the craft AND can see through the audience's eyes. A technically flawless solution that doesn't solve the user's actual problem isn't a solution.

**Everything starts bad.** Catmull writes: "Early on, all of our movies suck." This isn't defeatism — it's the most practically useful mindset in creative work. The first version is a starting point, not a judgment. Treating it as a failure to be defended against makes you worse at iteration. Treating it as a rough sketch makes you better.

---

## Divergent Thinking for Concept Development

Before settling on a concept, generate at least 3 radically different directions. Not variations on one idea — genuinely different approaches. The goal is to find the option space before committing to a path.

Research basis: Patricia Stokes' "Creativity from Constraints" (2006) documents how the most transformative creative work — from Monet to Picasso to Stravinsky — was driven by deliberate constraint-setting, not open-ended exploration.

### Technique 1: Random Constraint Injection

Impose an arbitrary constraint and design within it. The constraint forces you out of default patterns.

Examples:
- "What if this design couldn't use any rectangles?"
- "What if every element had to relate to water?"
- "What if this page had no navigation — users could only scroll?"
- "What if the primary action had to be accessible in under 2 seconds without reading anything?"

Use the constraint to generate ideas, then relax it. You'll often find the constrained version reveals something the unconstrained version missed.

### Technique 2: Analogy Transfer

Take the structural logic of something unrelated and apply it to your design problem.

Examples:
- "What if this settings page worked like a spice rack — everything visible, organized by frequency of use, the most-used items at eye level?"
- "What if a marketplace browse page worked like a vinyl record store — you flip through covers, and the act of browsing is itself pleasurable?"
- "What if an onboarding flow worked like a Polaroid developing — things gradually becoming clearer and more defined?"

The analogy doesn't need to produce a literal visual. It produces a structural and emotional logic that you can then translate into actual UI decisions.

### Technique 3: Emotion-First

Start with the target feeling, not with the layout. Derive every visual choice from that feeling.

Steps:
1. Write a precise emotional sentence: "This should feel like the relief of stepping into air conditioning on a hot day" or "This should feel like a library at midnight — authoritative, quiet, full of things waiting to be discovered."
2. From that feeling, derive: What palette does this suggest? What typeface weight? What spacing density? What kind of motion?
3. Only then begin placing elements.

This approach prevents generic layouts because generic layouts come from starting with "where does the nav go" instead of "what should this feel like."

### Technique 4: Anti-Reference

Look at what everyone else in this space does, then deliberately choose a different direction.

Steps:
1. Screenshot 10 competitors or analogs. Note the patterns: What layout structures recur? What color palettes? What typographic choices? What kinds of photography or illustration?
2. Those patterns are now constraints you should avoid.
3. Design something that an informed observer would not mistake for a competitor.

This isn't contrarianism — it's the only reliable path to originality. Every generic AI SaaS landing page with a gradient hero, floating UI screenshots, and sans-serif headlines looks that way because designers referenced each other instead of looking outside the category.

---

## Margaret Boden's Three Types of Creativity

Source: Margaret Boden, "The Creative Mind: Myths and Mechanisms" (2004, 2nd ed.). Boden is Professor of Cognitive Science at Sussex. This framework comes from her research on computational creativity and was developed to characterize how both human and machine systems generate novel ideas.

Understanding these three types helps you accurately diagnose what kind of creative move you're making — and whether you're being as ambitious as the problem requires.

### Exploratory Creativity

Working within a defined style space but finding new, previously unexplored corners of it.

Like a jazz musician improvising within a chord progression, or a graphic designer finding a new way to use an established grid system. The rules of the space are intact; the creativity is in navigation.

In UI design: finding a new layout within an established component system, developing an unexpected color combination within a defined palette, discovering a transition style that hadn't been tried in this context.

Most everyday design work is exploratory. That's fine — it produces reliable, coherent results. But it will not produce work that feels meaningfully different from what already exists.

### Combinational Creativity

Connecting ideas from genuinely different domains to produce something that wasn't possible within either domain alone.

Like combining Japanese woodblock aesthetics with data visualization (as in information design influenced by Tufte but drawing on Hiroshige), or applying brutalist typography conventions to a consumer product (as Balenciaga has done in fashion).

In UI design: bringing wayfinding conventions from physical architecture into digital navigation; applying editorial magazine layout principles to a dashboard; using the visual language of scientific instruments for a developer tool.

This is where most distinctive design work lives. You're not inventing a new system — you're connecting two existing systems in a way that produces unexpected results.

### Transformational Creativity

Changing the rules of the space itself.

Like what "Spider-Man: Into the Spider-Verse" did to CG animation — it didn't explore new corners of what existing CG films look like, it changed the definition of what CG animation could look like (halftone dots, frame-skipping, misregistered color channels).

In UI design: this level is rare and usually happens at the industry level (the introduction of flat design, the shift to dark-mode-first interfaces, the emergence of glassmorphism as a system-wide style). Individual projects rarely achieve it.

However: even small rule-breaking can achieve transformational effects within a category. A developer tool that uses expressive illustration instead of technical iconography is transformationally creative within its product category, even if the technique itself is established. Identify the unwritten rules of your specific context and consider which ones are worth breaking.

---

## The Three Critic Personas for Internal Braintrust Critique

After seeing a design or producing a design output, run an internal multi-perspective critique using these three personas. Each persona sees different things. Running all three before finalizing a design catches the issues that a single-perspective review misses.

Each critic should identify 2–3 specific issues. Not "this could be better" — precise, measurable, actionable observations.

---

### The Perceiver

Perspective: Gestalt psychology and cognitive load research.

Questions this persona asks:
- Does the visual hierarchy actually work? Where does the eye go first, second, third? Can you trace the reading path?
- Are related elements grouped through proximity and similarity (Gestalt's law of proximity, law of similarity)?
- Is the figure-ground relationship clear? Can you instantly tell what's content and what's background?
- Is the cognitive load appropriate? Too many competing elements? Too sparse to guide attention?
- Does the layout follow natural reading patterns? F-pattern scanning for content-heavy pages; Z-pattern for landing pages with a single CTA.

What The Perceiver catches: hierarchy failures, grouping errors, attention conflicts, layouts that look correct in isolation but don't direct the eye.

---

### The Emotionalist

Perspective: Don Norman's three-level emotional design model (visceral, behavioral, reflective) from "Emotional Design" (2004).

Questions this persona asks:
- Does this design evoke the intended emotion from the brief?
- Is there "appeal" (Disney's 12th principle) — does this design have personality and warmth, or is it competent but inert?
- Would a human designer be proud to put their name on this? What feels generic? What feels borrowed?
- Does anything feel "off" — the subtle uncanny valley of technically correct but soulless? This is the most common failure mode of AI-assisted design.
- Where is the surprise? The delight? The moment that makes someone pause? If there isn't one, there should be.

What The Emotionalist catches: designs that pass technical checks but fail to connect with the user emotionally; derivative work that doesn't stand on its own.

---

### The Craftsperson

Perspective: Dieter Rams' ten principles of good design ("less but better") and technical production standards.

Questions this persona asks:
- Is every element necessary? What can be removed without losing meaning?
- Is typography carefully set? Check: line height 1.4–1.6 for body copy; line length 45–75 characters per line; clear three-level hierarchy (display, body, caption/label).
- Do contrast ratios meet WCAG AA minimums? 4.5:1 for normal text, 3:1 for large text (18px+ regular, 14px+ bold).
- Is spacing consistent and rhythmic? Is there a spacing scale being followed (4px, 8px, 12px, 16px, 24px, 32px, 48px)?
- Is the internal padding of containers equal to or greater than the gap between containers? (If not, elements look uncontained.)
- Does this work on a 375px viewport? Are touch targets at least 44×44px?
- Are animations purposeful or decorative? Can you state why each animation exists?

What The Craftsperson catches: production errors, accessibility failures, spacing inconsistencies, typography that looks right at a glance but breaks on inspection.

---

### Example Critique Output

```
PERCEIVER: The hero headline and the subheading below it are set at 48px and 36px
respectively — only a 12px difference. The eye can't distinguish primary from
secondary. Increase the ratio to at least 1.5:1 (e.g., 56px headline, 24px subhead)
to create clear hierarchy. Also: the CTA button and the secondary link are placed at
equal visual weight below the subhead — the eye has no clear next step.

EMOTIONALIST: The color palette (three shades of blue) feels institutional, not
inviting. The brief called for "a cafe where you want to linger" but this reads more
like a bank lobby. Consider warm neutrals with a single accent that has life —
terracotta, saffron, or olive. Also: there is no moment of surprise or delight on
this page. The layout is competent and forgettable.

CRAFTSPERSON: The card grid has 24px gaps between cards but only 16px padding inside
them. The space between cards is greater than the space between a card's edge and its
content — this weakens the cards as containers. Internal padding should equal or
exceed external gap. Separately: the body copy is set at 1.3 line height, which is
too tight for 16px text at this line length (approximately 85 characters per line —
should be reduced to 65 max, or line height increased to 1.6).
```

The format matters: each observation names the element, describes the specific problem, and states what would fix it. Vague observations waste time.
