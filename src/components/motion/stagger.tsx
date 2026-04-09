"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { Children } from "react";

import { fadeInUp, staggerContainer } from "@/lib/motion/variants";

interface StaggerProps {
  children: ReactNode;
  className?: string;
}

export function Stagger({ children, className }: StaggerProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {Children.map(children, (child, idx) => (
        <motion.div key={idx} variants={fadeInUp}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
