# Motion and Animation Reference

## Disney's 12 Principles Applied to UI

Source: Frank Thomas & Ollie Johnston, "The Illusion of Life: Disney Animation" (1981). Adaptation note: As Issara Willenskomer argues in "UX in Motion" (2016), Disney's principles don't map 1:1 to UI — they were designed for organic bodies in physical space. UI motion is a distinct medium. But several principles translate powerfully and are worth internalizing.

---

### Squash & Stretch

In UI: buttons that slightly compress on press and bounce back convey tactile feedback. Cards that stretch when dragged feel elastic and alive.

Use sparingly. Most UI elements shouldn't squash — a navigation bar or data table has no reason to behave like rubber. Reserve this for interactive touch targets, playful onboarding moments, and moments where physical feedback is the explicit goal.

---

### Anticipation

In UI: hover states prepare users for what clicking will do. A button that subtly lifts on hover anticipates the press. A drawer icon that wiggles anticipates the opening.

This is one of the most directly applicable principles. Every interaction has a before, during, and after — anticipation is the before. Missing it makes interactions feel sudden and mechanical.

---

### Staging

In UI: direct attention through motion choreography. When a modal opens, dim the background (unstage it) to focus on the modal (stage it). Only one thing should demand attention at a time.

Violations are common: multiple elements animating simultaneously with equal weight, competing for the eye. When everything moves at once, nothing communicates.

---

### Slow In, Slow Out (Easing)

Never use linear animation for UI transitions. The three fundamental cases:

- **Ease-out** (fast start, slow end): for elements entering the view — they arrive with energy and settle naturally
- **Ease-in** (slow start, fast end): for elements exiting — they hesitate then leave decisively
- **Ease-in-out**: for elements moving between positions within the view — balanced and controlled

Linear motion feels mechanical and artificial because nothing in the physical world moves at constant velocity.

---

### Follow Through & Overlapping Action

In UI: when a card settles into position, its children (text, images, metadata) should settle with slight delays — staggered animation. This creates organic, layered motion instead of everything moving as a rigid block.

The key insight: rigid objects move as one. Living things don't. If your list items all animate identically and simultaneously, the interface feels like a spreadsheet, not a living system.

---

### Secondary Action

In UI: when a primary action occurs (button click, form submit), secondary elements can react — a subtle ripple, a particle burst on success, a state badge updating, a counter incrementing. These reinforce the primary action without competing for attention.

The secondary action must never upstage the primary. If the user submitted a form, the confirmation is primary, and a confetti animation is secondary. Swap those priorities and the interface becomes noise.

---

### Timing

Duration communicates personality. Specific ranges with intent:

| Duration | Character | Use case |
|---|---|---|
| 100–200ms | Snappy, confident | Mobile tap feedback, tooltips, micro-interactions |
| 200–400ms | Measured, intentional | Button states, dropdown opens, hover transitions |
| 400–600ms | Contemplative, dramatic | Page transitions, modal entrances, onboarding steps |
| 600ms+ | Sluggish, labored | Almost never justified — only for cinematic moments |

A 600ms button hover is broken. A 150ms page transition feels incomplete. The range matters as much as the easing curve.

---

### Exaggeration

In UI: subtle exaggeration makes interactions more readable. A toggle that overshoots slightly before settling. An error shake that's a bit theatrical. A success checkmark that bounces.

The calibration matters: exaggeration in UI should be felt, not seen. If the user consciously notices "that animated a lot," you've gone too far. The goal is heightened realism, not cartoon physics.

---

### Appeal

The overall personality of motion. Is your interface quick and playful? Smooth and luxurious? Precise and minimal? Motion must match the visual concept.

- Stripe's motion: precise, fast, confident — matches the brand
- Airbnb's motion: warm, gentle, unhurried — matches the brand
- Linear's motion: exact, immediate, tool-like — matches the brand

If you're building a marketplace for professional developer tools and your animations feel like a children's app, something is wrong at the system level, not the component level.

---

## CSS Easing Curves and Their Emotional Properties

These are the curves you'll use in `transition-timing-function` and Framer Motion's `ease` prop.

```css
/* Ease-out — use for entrances */
cubic-bezier(0, 0, 0.58, 1)
/* Element arrives with energy, settles gently. Feels natural and welcoming. */

/* Ease-in — use for exits */
cubic-bezier(0.42, 0, 1, 1)
/* Element hesitates, then accelerates away. Feels decisive. */

/* Ease-in-out — use for repositioning */
cubic-bezier(0.42, 0, 0.58, 1)
/* Symmetrical acceleration/deceleration. Feels balanced and controlled. */

/* Spring/overshoot — use for attention-grabbing moments */
cubic-bezier(0.34, 1.56, 0.64, 1)
/* Element overshoots target then bounces back. Feels playful and alive. */

/* Linear — almost never use for UI */
/* Feels mechanical and artificial. Exception: progress bars, loading indicators,
   continuous rotation (spinners). Never for transitions. */
```

In Framer Motion, these map to the `ease` prop or `transition.type: "spring"` with `stiffness`/`damping` values. Springs are often more natural than cubic-bezier for interactive elements because they respond to velocity rather than fixed timing.

---

## Animation Staggering

When multiple elements enter the view simultaneously, stagger their animation:

- **Stagger interval**: 30–80ms between each element
- **Entry order**: reading order (top-to-bottom, left-to-right for LTR languages — reverse for RTL)
- **Animation once**: elements should animate once when they first appear, not every time they scroll in and out
- **Group limit**: don't stagger more than 8–10 individual elements. Beyond that, group them and stagger groups

Staggering creates a sense of orchestration — like a curtain rising to reveal a scene rather than a sudden flash of content.

Framer Motion implementation pattern:
```tsx
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05, // 50ms
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { ease: [0, 0, 0.58, 1], duration: 0.3 } },
};
```

---

## Scroll-Based Animation

**Trigger mechanism**: Use Intersection Observer API (or Framer Motion's `whileInView`) to trigger animations when elements enter the viewport. Do not animate on mount for below-the-fold content — wait until visible.

**Trigger once**: Set `once: true` on `whileInView` unless there's a specific reason to re-animate on re-entry (e.g., a hero section after returning from a subpage).

**Parallax**: Limit speed differential to 10–20% — a background element moving at 0.8× scroll speed relative to foreground. Heavy parallax (0.5× and below) causes motion sickness, especially on mobile. Test on a physical device at full scroll speed before shipping.

**Performance**: Always animate `transform` and `opacity` properties. Never animate `width`, `height`, `top`, `left`, `margin`, or `padding` — these trigger layout recalculation on every frame and cause jank.

Properties that are GPU-composited and safe to animate:
- `transform: translateX/Y/Z`
- `transform: scale`
- `transform: rotate`
- `opacity`
- `filter` (with caveats — can be expensive at large blur values)

---

## Reduced Motion

This is a requirement, not a suggestion.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

In Framer Motion, check `const { reducedMotion } = useReducedMotion()` and skip transitions entirely, or use immediate snap instead of animated transition.

The reduced-motion version should still be polished — a crisp appearance/disappearance is better than a broken animation. Don't degrade to an unstyled experience.

Users who set `prefers-reduced-motion` include people with vestibular disorders, epilepsy, and migraine conditions. This is an accessibility requirement.
