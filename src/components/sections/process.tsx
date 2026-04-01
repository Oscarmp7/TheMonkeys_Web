"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STEPS = ["analysis", "strategy", "execution", "followup"] as const;

export function Process() {
  const t = useTranslations("process");
  const containerRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const prefersReduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced) return;

      // Header animation
      gsap.from("[data-process-header]", {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true,
        },
      });

      // Steps stagger animation
      gsap.from("[data-process-step]", {
        opacity: 0,
        y: 32,
        duration: 0.5,
        stagger: 0.15,
        ease: "expo.out",
        scrollTrigger: {
          trigger: "[data-process-grid]",
          start: "top 85%",
          once: true,
        },
      });

      // Connecting line draw
      gsap.from("[data-process-line]", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-process-grid]",
          start: "top 85%",
          once: true,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="bg-[#F1F0EB] py-12 sm:py-20 px-5 sm:px-6 md:px-8 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Header — two columns aligned to bottom */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-end">
          {/* Left column (~40%) */}
          <div className="md:col-span-2" data-process-header>
            <p className="font-display-alt font-normal text-brand-navy text-sm sm:text-base md:text-lg uppercase leading-tight">
              {t("left_line1")}
              <br />
              {t("left_line2")}
            </p>
          </div>

          {/* Right column (~60%) */}
          <div className="md:col-span-3" data-process-header>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-brand-navy" aria-hidden="true" />
              <span className="font-mono text-xs tracking-widest text-brand-navy uppercase">
                {t("eyebrow")}
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-brand-navy uppercase leading-none">
              <span className="block">{t("headline_line1")}</span>
              <span className="block text-brand-yellow">{t("headline_line2")}</span>
            </h2>
          </div>
        </div>

        {/* Grid of 4 steps */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 sm:gap-y-12 gap-x-2 sm:gap-x-0 mt-12 sm:mt-16 lg:mt-20 relative"
          data-process-grid
          onMouseLeave={() => setActiveStep(0)}
        >
          {/* Connecting horizontal line (visible on lg+ only) */}
          <div
            className="hidden lg:block absolute top-10 left-[10%] right-[10%] border-t-2 border-brand-navy/20"
            data-process-line
            aria-hidden="true"
          />

          {STEPS.map((step, i) => {
            const num = String(i + 1).padStart(2, "0");
            const isActive = i === activeStep;

            return (
              <div
                key={step}
                className="group flex flex-col items-center relative z-10 cursor-default"
                data-process-step
                onMouseEnter={() => setActiveStep(i)}
              >
                {/* Numbered circle */}
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex items-center justify-center transition-all duration-300 ease-out hover:scale-[1.08] ${
                    isActive
                      ? "bg-brand-yellow border-brand-yellow"
                      : "bg-off-white border-brand-navy/30"
                  }`}
                >
                  <span
                    className={`font-display text-2xl sm:text-3xl transition-colors duration-300 ease-out ${
                      isActive ? "text-brand-navy" : "text-brand-navy/50"
                    }`}
                  >
                    {num}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display text-base sm:text-lg text-brand-navy text-center mt-3 sm:mt-4 uppercase">
                  {t(`steps.${step}.title`)}
                </h3>

                {/* Description */}
                <p className="font-body text-xs sm:text-sm text-brand-navy/65 text-center mt-2 leading-relaxed max-w-[240px] lg:max-w-[200px] mx-auto">
                  {t(`steps.${step}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
