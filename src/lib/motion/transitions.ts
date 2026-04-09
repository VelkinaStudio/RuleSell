import type { Transition } from "framer-motion";

export const softOut: Transition = {
  duration: 0.24,
  ease: [0.16, 1, 0.3, 1],
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
  ease: [0.16, 1, 0.3, 1],
};
