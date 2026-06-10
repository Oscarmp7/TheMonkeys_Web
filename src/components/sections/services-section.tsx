"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SERVICE_KEYS } from "@/lib/services";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ServicesSection() {
  const t = useTranslations("services_section");
  const containerRef = useRef<HTMLElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced) return;

      gsap.fromTo(
        "[data-svc-header]",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Signature: cards wipe up from a bottom clip instead of a flat fade —
      // reads like panels being revealed, not content fading in.
      gsap.fromTo(
        "[data-svc-card]",
        { clipPath: "inset(100% 0 0 0)", y: 16 },
        {
          clipPath: "inset(0% 0 0 0)",
          y: 0,
          duration: 0.7,
          stagger: 0.07,
          ease: "expo.out",
          scrollTrigger: {
            trigger: "[data-svc-grid]",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      id="servicios"
      ref={containerRef}
      className="bg-off-white flex flex-col justify-center py-20 sm:py-28"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 w-full">
        {/* Header — two columns */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16 mb-12">
          {/* Left column — headline leads (no eyebrow) */}
          <div className="lg:w-[55%]">
            <h2 data-svc-header>
              <span className="block font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-brand-navy uppercase leading-none">
                {t("headline_line1")}
              </span>
              <span className="block font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-brand-yellow uppercase leading-none mt-1">
                {t("headline_line2")}
              </span>
              <span className="block font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-brand-navy uppercase leading-none mt-1">
                {t("headline_line3")}
              </span>
            </h2>
          </div>

          {/* Right column */}
          <div data-svc-header className="lg:w-[45%]">
            <p className="font-body text-brand-navy/70 text-base leading-relaxed lg:text-right">
              {t("subheadline")}
            </p>
          </div>
        </div>

        {/* Grid */}
        <div
          data-svc-grid
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* 7 service cards */}
          {SERVICE_KEYS.map((key) => (
            <div
              key={key}
              data-svc-card
              className="group relative bg-white p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden"
            >
              {/* Yellow left border reveal */}
              <span
                className="absolute left-0 top-0 w-1 h-full bg-brand-yellow origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-premium"
                aria-hidden="true"
              />
              <h3 className="font-display text-xl text-brand-navy leading-tight mb-3">
                {t(`cards.${key}.title`)}
              </h3>
              <p className="font-body text-sm text-brand-navy/65 leading-relaxed">
                {t(`cards.${key}.description`)}
              </p>
            </div>
          ))}

          {/* CTA card */}
          <div
            data-svc-card
            className="group bg-brand-yellow p-6 flex flex-col justify-between hover:brightness-110 transition-all duration-200"
          >
            <h3 className="font-display text-xl text-brand-navy leading-tight mb-4">
              {t("cta_card.title")}
            </h3>
            <a
              href="#contacto"
              className="block bg-brand-navy text-off-white font-display text-sm tracking-widest uppercase px-6 py-3 w-full text-center cursor-pointer transition-all duration-200 group-hover:bg-brand-navy-deepest group-hover:shadow-lg"
            >
              {t("cta_card.button")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
