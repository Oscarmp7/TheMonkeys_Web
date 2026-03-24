"use client";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTranslations } from "next-intl";

gsap.registerPlugin(useGSAP);

export function StatsBar() {
  const t = useTranslations("hero");
  const containerRef = useRef<HTMLDivElement>(null);
  const statsViewportRef = useRef<HTMLDivElement>(null);
  const statsTrackRef = useRef<HTMLDivElement>(null);
  const statsMeasureRef = useRef<HTMLDivElement>(null);
  const heroStats = [t("stat1"), t("stat2"), t("stat3")];
  const statsSignature = heroStats.join("|");
  const [statsSetWidth, setStatsSetWidth] = useState(0);
  const [statsCopies, setStatsCopies] = useState(4);

  useEffect(() => {
    const viewport = statsViewportRef.current;
    const measureEl = statsMeasureRef.current;
    if (!viewport || !measureEl || typeof window === "undefined") return;

    let frameId = 0;

    const measure = () => {
      frameId = 0;

      const viewportWidth = viewport.offsetWidth;
      const measuredWidth = measureEl.scrollWidth;

      if (!viewportWidth || !measuredWidth) return;

      const nextCopies = Math.max(4, Math.ceil((viewportWidth * 2) / measuredWidth) + 1);

      setStatsSetWidth((current) =>
        Math.abs(current - measuredWidth) > 1 ? measuredWidth : current
      );
      setStatsCopies((current) => (current === nextCopies ? current : nextCopies));
    };

    const scheduleMeasure = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(measure);
    };

    scheduleMeasure();

    const resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(viewport);
    resizeObserver.observe(measureEl);
    window.addEventListener("resize", scheduleMeasure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [statsSignature]);

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== "undefined"
          ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
          : false;

      if (prefersReduced || !statsTrackRef.current || statsSetWidth <= 0) return;

      gsap.set(statsTrackRef.current, { x: 0 });
      gsap.to(statsTrackRef.current, {
        x: -statsSetWidth,
        duration: statsSetWidth / 55,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: statsViewportRef, dependencies: [statsSetWidth, statsCopies] }
  );

  return (
    <div ref={containerRef} className="w-full overflow-hidden bg-brand-yellow">
      <p className="sr-only">{heroStats.join(" | ")}</p>

      <div className="stats-marquee-fallback mx-auto w-full max-w-[1400px] flex-col items-center justify-center gap-2 px-6 py-5 sm:flex-row sm:gap-0 sm:divide-x sm:divide-brand-black/20">
        {heroStats.map((stat) => (
          <span
            key={stat}
            className="px-8 font-display text-base font-bold uppercase tracking-wider whitespace-nowrap text-brand-black sm:text-lg"
          >
            {stat}
          </span>
        ))}
      </div>

      <div ref={statsViewportRef} className="relative">
        <div
          ref={statsMeasureRef}
          className="pointer-events-none absolute left-0 top-0 flex items-center whitespace-nowrap opacity-0"
          aria-hidden="true"
        >
          {heroStats.map((stat, index) => (
            <div key={`measure-${index}`} className="flex shrink-0 items-center">
              <span className="px-8 font-display text-base font-bold uppercase tracking-wider text-brand-black sm:text-lg">
                {stat}
              </span>
              <span className="h-5 w-px bg-brand-black/20" />
            </div>
          ))}
        </div>

        <div ref={statsTrackRef} className="stats-marquee-track py-5 whitespace-nowrap" aria-hidden="true">
          {Array.from({ length: statsCopies }, (_, copyIndex) => (
            <div key={copyIndex} className="stats-marquee-set">
              {heroStats.map((stat, index) => (
                <div key={`${copyIndex}-${index}`} className="flex shrink-0 items-center">
                  <span className="px-8 font-display text-base font-bold uppercase tracking-wider text-brand-black sm:text-lg">
                    {stat}
                  </span>
                  <span className="h-5 w-px bg-brand-black/20" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
