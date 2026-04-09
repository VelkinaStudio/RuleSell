import type { Variants } from "framer-motion";

import { softOut, spring } from "./transitions";

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: softOut },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: softOut },
};

export const cardHover: Variants = {
  rest: { y: 0 },
  hover: { y: -2, transition: softOut },
};

export const pressBounce: Variants = {
  rest: { scale: 1 },
  pressed: { scale: 0.96, transition: spring },
};

export const pillBounce: Variants = {
  rest: { scale: 1 },
  pressed: { scale: 1.08, transition: spring },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};
