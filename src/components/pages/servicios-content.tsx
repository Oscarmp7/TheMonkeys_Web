"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { buildWhatsAppHref } from "@/lib/site";
import { SERVICE_KEYS } from "@/lib/services";
import { ProcessStepsGrid } from "@/components/sections/process-steps";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PROCESS_STEPS = ["analysis", "strategy", "execution", "followup"] as const;

export function ServiciosContent() {
  const t = useTranslations("services_page");
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const [isProcessVisible, setIsProcessVisible] = useState(false);
  const [isProcessHovered, setIsProcessHovered] = useState(false);
  const whatsappHref = buildWhatsAppHref(t("whatsapp_prefill"));

  useEffect(() => {
    if (prefersReduced || !isProcessVisible || isProcessHovered) return;

    const intervalId = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % PROCESS_STEPS.length);
    }, 2100);

    return () => window.clearInterval(intervalId);
  }, [isProcessHovered, isProcessVisible, prefersReduced]);

  useGSAP(
    () => {
      if (prefersReduced) return;

      gsap.fromTo(
        "[data-srv-hero]",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "expo.out",
          delay: 0.2,
        }
      );

      gsap.fromTo(
        "[data-srv-grid-header]",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: {
            trigger: "[data-srv-grid-section]",
            start: "top 80%",
            once: true,
          },
        }
      );

      // Same wipe language as the home services grid — cards reveal from a
      // bottom clip, our consistent "service card" motion signature.
      gsap.fromTo(
        "[data-srv-card]",
        { clipPath: "inset(100% 0 0 0)", y: 16 },
        {
          clipPath: "inset(0% 0 0 0)",
          y: 0,
          duration: 0.7,
          stagger: 0.07,
          ease: "expo.out",
          scrollTrigger: {
            trigger: "[data-srv-grid]",
            start: "top 90%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        "[data-srv-quote]",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "expo.out",
          scrollTrigger: {
            trigger: "[data-srv-quote]",
            start: "top 85%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        "[data-srv-process-header]",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: "[data-srv-process]",
            start: "top 80%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        "[data-srv-step]",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: {
            trigger: "[data-srv-steps]",
            start: "top 85%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        "[data-srv-process-line]",
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-srv-steps]",
            start: "top 85%",
            once: true,
          },
        }
      );

      ScrollTrigger.create({
        trigger: "[data-srv-process]",
        start: "top 72%",
        end: "bottom 28%",
        onEnter: () => setIsProcessVisible(true),
        onEnterBack: () => setIsProcessVisible(true),
        onLeave: () => setIsProcessVisible(false),
        onLeaveBack: () => setIsProcessVisible(false),
      });

      gsap.fromTo(
        "[data-srv-cta]",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: "[data-srv-cta-section]",
            start: "top 80%",
            once: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef}>
      <section className="relative flex min-h-[74vh] flex-col justify-end overflow-hidden bg-brand-black pt-36 pb-20 sm:pt-40 sm:pb-24">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(30,36,63,0.6) 0%, transparent 70%)",
          }}
        />

        <svg
          className="absolute inset-0 z-[1] h-full w-full pointer-events-none"
          style={{ opacity: 0.04 }}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <filter id="srv-hero-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#srv-hero-noise)" />
        </svg>

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 sm:px-12">
          <h1
            data-srv-hero
            className="font-display text-[clamp(3rem,11vw,10rem)] uppercase leading-[0.85] tracking-tight"
          >
            <span className="block text-off-white">{t("hero_title_line1")}</span>
            <span className="mt-2 block text-off-white sm:mt-3">{t("hero_title_line2")}</span>
            <span className="mt-2 block sm:mt-3 text-stroke-yellow">
              {t("hero_title_line3_outline")}
              {t("hero_title_line3_yellow")}
            </span>
          </h1>

          <p
            data-srv-hero
            className="mt-6 max-w-[580px] font-body text-sm leading-relaxed text-off-white/60 text-justify sm:mt-8 sm:text-base lg:text-lg"
          >
            {t("hero_subtitle")}{" "}
            <strong className="text-off-white">{t("hero_subtitle_bold")}</strong>{" "}
            {t("hero_subtitle_end")}
          </p>
        </div>
      </section>

      <section data-srv-grid-section className="bg-brand-navy-dark py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-12">
          <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-16">
            <div className="lg:w-[55%]">
              <h2
                data-srv-grid-header
                className="font-display text-4xl uppercase leading-none text-off-white sm:text-5xl md:text-6xl lg:text-7xl"
              >
                <span className="block">{t("grid_title_line1")}</span>
                <span className="block text-brand-yellow mt-1">{t("grid_title_line2")}</span>
              </h2>
            </div>
            <div data-srv-grid-header className="lg:w-[45%]">
              <p className="font-body text-base leading-relaxed text-off-white/50 lg:text-right">
                {t("grid_intro")}
              </p>
            </div>
          </div>

          <div data-srv-grid className="grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-8">
            {SERVICE_KEYS.map((key) => {
              const tags: string[] = t.raw(`services.${key}.tags`) as string[];

              return (
                <div
                  key={key}
                  data-srv-card
                  className="group relative flex min-h-[23rem] cursor-default flex-col overflow-hidden border-t border-white/12 px-1 pt-5 pb-3 transition-all duration-300 ease-premium hover:-translate-y-1.5 sm:min-h-[25rem] sm:pt-6"
                >
                  <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_52%,rgba(245,197,24,0.05))] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <span
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-brand-yellow/60 via-white/15 to-transparent transition-[opacity,transform] duration-300 ease-premium group-hover:scale-x-[1.02] group-hover:from-brand-yellow group-hover:via-brand-yellow/30"
                    aria-hidden="true"
                  />
                  <span
                    className="absolute top-5 left-0 h-[72%] w-px bg-white/8 transition-colors duration-300 group-hover:bg-brand-yellow/45 sm:top-6"
                    aria-hidden="true"
                  />

                  <div className="relative z-10 flex h-full flex-col pl-5 sm:pl-6">
                    <h3 className="mb-4 font-display text-xl uppercase leading-[1.02] text-off-white transition-transform duration-300 ease-premium group-hover:translate-x-1 sm:text-[1.9rem]">
                      {t(`services.${key}.title`)}
                    </h3>

                    <p className="mb-8 flex-1 max-w-[26ch] font-body text-sm leading-relaxed text-off-white/50 transition-colors duration-300 group-hover:text-off-white/72 sm:text-[0.98rem]">
                      {t(`services.${key}.description`)}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 transition-transform duration-300 ease-premium group-hover:translate-y-0.5">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="border-b border-brand-yellow/20 pb-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-brand-yellow/62 transition-colors duration-300 group-hover:border-brand-yellow/40 group-hover:text-brand-yellow/82"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            <div
              data-srv-card
              className="group relative flex min-h-[23rem] flex-col overflow-hidden border-t border-brand-yellow/70 bg-brand-yellow px-1 pt-5 pb-3 transition-all duration-300 ease-premium hover:-translate-y-1.5 hover:shadow-[0_24px_64px_rgba(245,197,24,0.18)] sm:min-h-[25rem] sm:pt-6"
            >
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_58%,rgba(10,15,34,0.08))] opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-0 bg-brand-black transition-[height] duration-300 ease-premium group-hover:h-24"
                aria-hidden="true"
              />
              <span
                className="absolute top-5 left-0 h-[72%] w-px bg-brand-black/18 transition-colors duration-300 group-hover:bg-brand-black/28 sm:top-6"
                aria-hidden="true"
              />
              <span
                className="absolute inset-x-0 top-0 h-px bg-brand-black/20 transition-colors duration-300 group-hover:bg-brand-black/35"
                aria-hidden="true"
              />
              <div className="relative flex h-full flex-col pl-5 sm:pl-6">
                <h3 className="mb-4 font-display text-xl uppercase leading-[1.02] text-brand-black sm:text-[1.9rem]">
                  {t("cta_card_title")}
                </h3>
                <p className="mb-8 max-w-[24ch] flex-1 font-body text-sm leading-relaxed text-brand-black/62 sm:text-[0.98rem]">
                  {t("cta_card_body")}
                </p>
                <Link
                  href="/contacto"
                  className="inline-flex w-fit cursor-pointer items-center justify-center border-b border-brand-black/35 pb-1 font-display text-sm uppercase tracking-[0.18em] text-brand-black transition-all duration-300 ease-premium group-hover:translate-x-1 group-hover:border-brand-yellow/70 group-hover:text-brand-yellow"
                >
                  {t("cta_card_button")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-black py-16 text-center sm:py-20">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(30,36,63,0.4) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-12">
          <p
            data-srv-quote
            className="font-display text-[clamp(1.5rem,5vw,4rem)] uppercase leading-tight text-off-white"
          >
            {t("quote_line1")}
            <br />
            <span className="text-stroke-yellow">{t("quote_line2")}</span>
          </p>
        </div>
      </section>

      <section
        data-srv-process
        className="relative flex flex-col justify-center overflow-hidden bg-off-white-warm px-6 py-16 sm:px-8 sm:py-24"
      >
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-5 md:gap-12">
            <div className="md:col-span-3" data-srv-process-header>
              <h2 className="font-display text-4xl uppercase leading-none text-brand-navy sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block">{t("process_title_line1")}</span>
                <span className="block text-brand-yellow mt-1">{t("process_title_line2")}</span>
              </h2>
            </div>
            <div className="md:col-span-2" data-srv-process-header>
              <p className="font-body text-brand-navy/65 text-sm sm:text-[0.96rem] leading-relaxed">
                {t("process_description")}
              </p>
            </div>
          </div>

          <ProcessStepsGrid
            steps={PROCESS_STEPS.map((step) => ({
              title: t(`process_steps.${step}.title`),
              description: t(`process_steps.${step}.description`),
            }))}
            activeStep={activeStep}
            onStepEnter={setActiveStep}
            variant="services"
            gridDataAttr="data-srv-steps"
            stepDataAttr="data-srv-step"
            lineDataAttr="data-srv-process-line"
            onGridMouseEnter={() => setIsProcessHovered(true)}
            onGridMouseLeave={() => setIsProcessHovered(false)}
          />
        </div>
      </section>

      <section data-srv-cta-section className="relative overflow-hidden bg-brand-black py-20 text-center sm:py-28">
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(ellipse, rgba(245,197,24,0.1) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none"
          style={{ opacity: 0.04 }}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <filter id="srv-cta-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#srv-cta-noise)" />
        </svg>

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-12">
          <h2
            data-srv-cta
            className="font-display text-[clamp(3rem,10vw,10rem)] uppercase leading-[0.85] tracking-tight"
          >
            <span className="block text-stroke-yellow">{t("cta_title_outline")}</span>
            <span className="mt-3 block sm:mt-4">
              <span className="text-off-white">{t("cta_title_mid")}</span>{" "}
              <span className="text-brand-yellow">{t("cta_title_yellow")}</span>
            </span>
          </h2>

          <p
            data-srv-cta
            className="mx-auto mt-4 mb-8 max-w-md font-body text-sm leading-relaxed text-off-white/60 sm:mt-6 sm:mb-10 sm:text-base"
          >
            {t("cta_subtitle")}
          </p>

          <div data-srv-cta className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center justify-center rounded-full bg-brand-yellow px-6 py-3 font-display text-sm uppercase tracking-wider text-brand-black transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_24px_rgba(245,197,24,0.45)] sm:px-8 sm:py-3.5 sm:text-base"
            >
              {t("cta_button_primary")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
