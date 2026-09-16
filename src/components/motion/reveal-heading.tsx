"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

type RevealHeadingProps = {
  children: ReactNode;
  className?: string;
  "data-career-heading"?: true;
  id?: string;
};

export function RevealHeading({ children, ...props }: RevealHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(headingRef, { amount: 0.35, once: true });
  const reduceMotion = useReducedMotion();

  return (
    <motion.h2
      ref={headingRef}
      {...props}
      initial={reduceMotion ? false : { opacity: 0, y: 56 }}
      animate={
        isInView || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 56 }
      }
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.h2>
  );
}
