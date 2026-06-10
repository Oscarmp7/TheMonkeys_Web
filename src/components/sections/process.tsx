"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { ProcessStepsGrid } from "@/components/sections/process-steps";

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

      // Signature: the connecting line draws first, then each step pops in
      // along it (scale from the circle) — a sequence, not a uniform fade.
      gsap.from("[data-process-line]", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-process-grid]",
          start: "top 85%",
          once: true,
        },
      });

      gsap.from("[data-process-step]", {
        opacity: 0,
        scale: 0.82,
        y: 16,
        transformOrigin: "top center",
        duration: 0.5,
        stagger: 0.14,
        ease: "expo.out",
        delay: 0.25,
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
      className="bg-off-white-warm py-20 sm:py-28 px-5 sm:px-6 md:px-8 relative overflow-hidden"
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

          {/* Right column (~60%) — headline leads (no eyebrow) */}
          <div className="md:col-span-3" data-process-header>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-brand-navy uppercase leading-none">
              <span className="block">{t("headline_line1")}</span>
              <span className="block text-brand-yellow mt-1">{t("headline_line2")}</span>
            </h2>
          </div>
        </div>

        {/* Grid of 4 steps */}
        <ProcessStepsGrid
          steps={STEPS.map((step) => ({
            title: t(`steps.${step}.title`),
            description: t(`steps.${step}.description`),
          }))}
          activeStep={activeStep}
          onStepEnter={setActiveStep}
          variant="home"
          gridDataAttr="data-process-grid"
          stepDataAttr="data-process-step"
          lineDataAttr="data-process-line"
          onGridMouseLeave={() => setActiveStep(0)}
        />
      </div>
    </section>
  );
}
