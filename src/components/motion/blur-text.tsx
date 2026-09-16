"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

type BlurTextProps = {
  className?: string;
  delay?: number;
  text: string;
};

export function BlurText({ className, delay = 0.08, text }: BlurTextProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(headingRef, { amount: 0.3, once: true });
  const reduceMotion = useReducedMotion();
  const words = text.split(/(\s+)/).filter(Boolean);

  let wordIndex = 0;

  return (
    <motion.h2 ref={headingRef} className={className} aria-label={text}>
      {words.map((part, index) => {
        if (/^\s+$/.test(part)) return part;

        const currentIndex = wordIndex++;
        return (
          <motion.span
            key={`${part}-${index}`}
            aria-hidden="true"
            initial={
              reduceMotion ? false : { filter: "blur(12px)", opacity: 0, y: 24 }
            }
            animate={
              isInView || reduceMotion
                ? { filter: "blur(0px)", opacity: 1, y: 0 }
                : undefined
            }
            transition={{
              delay: currentIndex * delay,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {part}
          </motion.span>
        );
      })}
    </motion.h2>
  );
}
