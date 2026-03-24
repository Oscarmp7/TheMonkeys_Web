"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { Locale } from "@/i18n/routing";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SERVICE_TAGS = {
  es: ["ESTRATEGIA", "CONTENIDO", "PRODUCCIÓN", "CAMPAÑAS", "WEBSITES", "SEO"],
  en: ["STRATEGY", "CONTENT", "PRODUCTION", "CAMPAIGNS", "WEBSITES", "SEO"],
} as const;

export function Brandbook({ locale }: { locale: Locale }) {
  const t = useTranslations("brandbook");
  const containerRef = useRef<HTMLElement>(null);
  const tags = SERVICE_TAGS[locale];
  const prefersReduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced) return;

      gsap.from("[data-bb-animate]", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          once: true,
        },
      });

      gsap.from("[data-bb-photo]", {
        opacity: 0,
        x: -20,
        duration: 0.7,
        ease: "expo.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          once: true,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="nosotros"
      ref={containerRef}
      className="bg-off-white min-h-screen flex items-center"
    >
      <div className="w-full mx-auto max-w-[1200px] px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* LEFT — Photo with floating badge */}
          <div data-bb-photo className="relative w-full shrink-0 lg:w-[44%]">
            {/* Badge floating outside image top-left */}
            <div className="absolute -left-3 -top-3 z-10 bg-brand-yellow px-3 py-2">
              <p className="font-display text-2xl leading-none text-brand-black">
                {t("badge_line1")}
              </p>
              <p className="mt-0.5 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-brand-black">
                {t("badge_line2")}
              </p>
            </div>

            {/* Founders photo placeholder */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-navy/10">
              <div className="absolute inset-0 flex items-center justify-center text-brand-navy">
                <svg
                  viewBox="0 0 200 280"
                  className="w-3/4 opacity-[0.15]"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  {/* Person 1 — behind, smaller */}
                  <circle cx="75" cy="70" r="28" />
                  <path d="M30 280 Q30 160 75 145 Q120 160 120 280Z" />
                  {/* Person 2 — front, larger */}
                  <circle cx="130" cy="85" r="32" />
                  <path d="M80 280 Q80 170 130 155 Q180 170 180 280Z" />
                </svg>
              </div>
              <p className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 font-mono text-xs text-brand-navy/30">
                {"// founders photo"}
              </p>
            </div>
          </div>

          {/* RIGHT — Copy */}
          <div className="flex flex-1 flex-col">
            {/* Eyebrow */}
            <div data-bb-animate className="flex items-center gap-3">
              <span
                className="inline-block h-0 w-7 border-t-2 border-brand-navy/40"
                aria-hidden="true"
              />
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-brand-navy/60">
                {t("eyebrow")}
              </span>
            </div>

            {/* Headline */}
            <div data-bb-animate className="mt-4">
              <h2 className="font-display text-[2.25rem] leading-[1] text-brand-navy md:text-5xl lg:text-[3.5rem]">
                {t("headline1")}
              </h2>
              <span className="mt-1 inline-block bg-brand-navy px-2 py-[2px] font-display text-[2.25rem] leading-[1] text-brand-yellow md:text-5xl lg:text-[3.5rem]">
                {t("headline2")}
              </span>
            </div>

            {/* Body paragraphs */}
            <p
              data-bb-animate
              className="mt-6 text-sm leading-relaxed text-brand-navy/80 text-justify md:text-base"
            >
              {t("body1_before")}
              <strong className="font-bold text-brand-navy">
                {t("body1_bold")}
              </strong>
              {t("body1_after")}
            </p>
            <p
              data-bb-animate
              className="mt-4 text-sm leading-relaxed text-brand-navy/80 text-justify md:text-base"
            >
              {t("body2_before")}
              <strong className="font-bold text-brand-navy">
                {t("body2_bold")}
              </strong>
              {t("body2_after")}
            </p>

            {/* Service tags */}
            <div data-bb-animate className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={tag}
                  className={`rounded-full font-mono text-xs uppercase tracking-wider px-4 py-1.5 transition-all duration-200 cursor-default ${
                    index === 0
                      ? "bg-brand-yellow text-brand-black hover:scale-105"
                      : "border border-brand-navy/50 bg-transparent text-brand-navy hover:border-brand-yellow hover:text-brand-yellow hover:bg-brand-yellow/5"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <a
              data-bb-animate
              href="#contacto"
              className="mt-6 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-brand-navy px-6 py-3 font-display text-sm tracking-wider text-off-white transition-transform duration-200 hover:scale-[1.03]"
            >
              {t("cta")} &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
