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

      const trigger = {
        trigger: containerRef.current,
        start: "top 80%",
        once: true,
      } as const;

      // Signature: the big headline wipes in line by line (clip mask),
      // then the supporting copy and form fade up under it.
      gsap.from("[data-contact-headline] > span", {
        clipPath: "inset(0 100% 0 0)",
        duration: 0.7,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: trigger,
      });

      gsap.from("[data-contact-animate]", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: "expo.out",
        delay: 0.2,
        scrollTrigger: trigger,
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="contacto"
      className="bg-brand-black py-24 sm:py-32 px-6 md:px-8"
    >
      <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left column — headline leads (no eyebrow) */}
        <div className="flex flex-col">
          {/* Headline — stacked vertically, wipes in line by line */}
          <div data-contact-headline>
            {/* Line 1: ¿ in solid white + rest in yellow stroke (matches hero outline style) */}
            <span className="block font-display text-[2.5rem] sm:text-[3.5rem] md:text-[3.5rem] lg:text-[5rem] xl:text-[7rem] uppercase leading-none">
              {(() => {
                const line = t("headline_line1");
                if (line.startsWith("¿")) {
                  return (
                    <>
                      <span className="text-off-white">¿</span>
                      <span className="text-stroke-yellow">{line.slice(1)}</span>
                    </>
                  );
                }
                return <span className="text-stroke-yellow">{line}</span>;
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
            className="font-body text-off-white/55 text-sm leading-relaxed text-left max-w-md mt-6"
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
