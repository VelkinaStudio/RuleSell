import type { Transition } from "framer-motion";

/*
 * Easing arrays — exported for use in both Framer Motion and inline CSS.
 *
 * These MUST stay aligned with the CSS motion tokens in tokens.css:
 *   --ease-out:    cubic-bezier(0.16, 1, 0.3, 1)   → EASE_OUT
 *   --ease-in:     cubic-bezier(0.7, 0, 0.84, 0)    → EASE_IN
 *   --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1) → EASE_SPRING_APPROX
 *
 * The Framer `spring` transition uses a real spring simulation (stiffness /
 * damping) which produces different motion than the CSS cubic-bezier
 * approximation. The CSS token is intentionally a "close enough" fallback.
 */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_IN: [number, number, number, number] = [0.7, 0, 0.84, 0];
export const EASE_SPRING_APPROX: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

export const softOut: Transition = {
  duration: 0.24,
  ease: EASE_OUT,
};

export const spring: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 26,
};

export const snap: Transition = {
  duration: 0.12,
  ease: "linear",
};

export const pageFade: Transition = {
  duration: 0.3,
  ease: EASE_OUT,
};
