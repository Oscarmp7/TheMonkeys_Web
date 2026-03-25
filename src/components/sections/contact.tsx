"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { ContactForm } from "@/components/ui/contact-form";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Contact() {
  const t = useTranslations("contact");
  const containerRef = useRef<HTMLElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced) return;

      gsap.from("[data-contact-animate]", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="contacto"
      className="min-h-screen flex items-center bg-brand-black py-24 px-6 md:px-8"
    >
      <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left column — headline */}
        <div className="flex flex-col">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8" data-contact-animate>
            <span
              className="w-8 h-[2px] bg-brand-yellow"
              aria-hidden="true"
            />
            <span className="font-mono text-[0.65rem] tracking-[0.25em] uppercase text-brand-yellow">
              {t("eyebrow")}
            </span>
          </div>

          {/* Headline — stacked vertically */}
          <div data-contact-animate>
            {/* Line 1: ¿ in solid white + rest in yellow stroke (matches hero outline style) */}
            <span className="block font-display text-[2.5rem] sm:text-[3.5rem] md:text-[3.5rem] lg:text-[5rem] xl:text-[7rem] uppercase leading-none">
              {(() => {
                const line = t("headline_line1");
                if (line.startsWith("¿")) {
                  return (
                    <>
                      <span className="text-off-white">¿</span>
                      <span style={{ WebkitTextStroke: "2px #F5C518", WebkitTextFillColor: "transparent" }}>
                        {line.slice(1)}
                      </span>
                    </>
                  );
                }
                return (
                  <span style={{ WebkitTextStroke: "2px #F5C518", WebkitTextFillColor: "transparent" }}>
                    {line}
                  </span>
                );
              })()}
            </span>
            <span className="block font-display text-[2.5rem] sm:text-[3.5rem] md:text-[3.5rem] lg:text-[5rem] xl:text-[7rem] text-off-white uppercase leading-none">
              {t("headline_line2")}
            </span>
            <span className="block font-display text-[2.5rem] sm:text-[3.5rem] md:text-[3.5rem] lg:text-[5rem] xl:text-[7rem] text-brand-yellow uppercase leading-none">
              {t("headline_line3")}
            </span>
          </div>

          {/* Body text */}
          <p
            className="font-body text-off-white/55 text-sm leading-relaxed text-justify max-w-md mt-6"
            data-contact-animate
          >
            {t("body")}
          </p>
        </div>

        {/* Right column — form */}
        <div data-contact-animate>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
