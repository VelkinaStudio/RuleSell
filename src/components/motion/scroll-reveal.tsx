"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { fadeInUp } from "@/lib/motion/variants";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  amount?: number;
}

export function ScrollReveal({
  amount = 0.3,
  children,
  className,
}: ScrollRevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}
