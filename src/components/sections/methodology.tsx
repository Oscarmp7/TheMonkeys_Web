"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PILLAR_KEYS = ["m", "o", "n", "k", "e", "y", "s"] as const;

export function Methodology() {
  const t = useTranslations("methodology");
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== "undefined"
          ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
          : false;

      if (prefersReduced) return;

      gsap.from("[data-meth-header]", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          once: true,
        },
      });

      gsap.fromTo("[data-meth-card]",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "expo.out",
          scrollTrigger: {
            trigger: "[data-meth-grid]",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="bg-brand-navy-dark min-h-screen flex flex-col items-center justify-center py-20 px-6"
    >
      {/* Header block */}
      <div className="flex flex-col items-center text-center">
        {/* Eyebrow */}
        <div data-meth-header className="flex items-center gap-3">
          <span
            className="inline-block w-8 h-[2px] bg-brand-yellow"
            aria-hidden="true"
          />
          <span className="font-mono text-[0.65rem] tracking-[0.25em] uppercase text-off-white/50">
            {t("eyebrow")}
          </span>
        </div>

        {/* Headline */}
        <h2
          data-meth-header
          className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl uppercase text-off-white"
        >
          {t("headline1")}{" "}
          <span className="text-brand-yellow">{t("headline2")}</span>
        </h2>

        {/* Subheadline */}
        <p
          data-meth-header
          className="font-body text-off-white/60 text-center max-w-2xl text-base leading-relaxed mt-4"
        >
          {t("subheadline")}
        </p>
      </div>

      {/* Cards grid */}
      <div
        data-meth-grid
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-12 w-full max-w-[1400px]"
      >
        {PILLAR_KEYS.map((key, i) => (
          <div
            key={key}
            data-meth-card
            className="group bg-brand-navy border border-white/10 hover:border-white/20 rounded-sm p-5 flex flex-col transition-all duration-200 hover:-translate-y-1 cursor-default"
          >
            {/* Letter */}
            <span className="font-display text-5xl md:text-6xl text-brand-yellow leading-none mb-3 transition-transform duration-200 group-hover:scale-110">
              {t(`pillars.${key}.letter`)}
            </span>
            {/* Title */}
            <span className="font-display text-sm text-off-white uppercase tracking-wide mb-2">
              {t(`pillars.${key}.title`)}
            </span>
            {/* Description */}
            <span className="font-body text-xs text-off-white/55 leading-relaxed flex-1">
              {t(`pillars.${key}.description`)}
            </span>
            {/* Number */}
            <span className="font-mono text-[0.6rem] text-off-white/25 mt-4 self-end">
              0.{i + 1}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
