"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

gsap.registerPlugin(useGSAP);

/**
 * Wraps page content with a subtle fade-in entrance animation.
 * Keep transforms off this wrapper so fixed UI like the navbar stays pinned to the viewport.
 * Respects prefers-reduced-motion — no animation for those users.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (!wrapperRef.current) return;

      if (prefersReduced) {
        gsap.set(wrapperRef.current, { opacity: 1 });
        return;
      }

      gsap.fromTo(
        wrapperRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          ease: "expo.out",
        }
      );
    },
    { scope: wrapperRef, dependencies: [prefersReduced] }
  );

  return (
    <div ref={wrapperRef} data-page-transition style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
