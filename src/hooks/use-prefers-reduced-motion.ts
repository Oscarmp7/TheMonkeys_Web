"use client";
import { useState, useEffect } from "react";

/**
 * SSR-safe hook that tracks the user's prefers-reduced-motion setting.
 * Returns false on the server and the real value on the client.
 * Updates reactively if the user changes their system preference.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reduced;
}
