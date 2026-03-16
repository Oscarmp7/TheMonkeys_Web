"use client";
import { useScroll, type MotionValue } from "motion/react";
import { useRef } from "react";

/**
 * Returns scroll progress (0→1) for a section, scoped to its container.
 * Used for scroll-driven animations — attaches to a section ref.
 */
export function useSectionScrollProgress(): {
  ref: React.RefObject<HTMLDivElement | null>;
  progress: MotionValue<number>;
} {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: progress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  return { ref, progress };
}
