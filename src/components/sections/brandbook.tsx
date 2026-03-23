"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { LogoWordmark } from "@/components/ui/logo-wordmark";
import { SERVICE_KEYS, SERVICE_ICONS } from "@/lib/services";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Brandbook() {
  const t = useTranslations("brandbook");
  const tServices = useTranslations("services");
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== "undefined"
          ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
          : false;

      if (prefersReduced) return;

      gsap.from("[data-animate]", {
        opacity: 0,
        y: 16,
        duration: 0.5,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true,
        },
      });

      gsap.from("[data-animate-logo]", {
        opacity: 0,
        duration: 0.6,
        ease: "expo.out",
        scrollTrigger: {
          trigger: "[data-animate-logo]",
          start: "top 80%",
          once: true,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative z-10 min-h-screen bg-off-white grid md:grid-cols-2">
      <div className="flex flex-col justify-center px-12 py-20 gap-8">
        <p data-animate className="text-5xl md:text-6xl font-display text-brand-navy leading-none">
          {t("statement")}
        </p>

        <p data-animate className="text-lg text-brand-navy/70 max-w-sm leading-relaxed">
          {t("bio")}
        </p>

        <div data-animate>
          <ul className="grid grid-cols-2 gap-3">
            {SERVICE_KEYS.map((key) => {
              const Icon = SERVICE_ICONS[key];
              return (
                <li key={key} className="flex items-center gap-2 text-brand-navy/80">
                  <Icon size={18} className="text-brand-yellow flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm font-medium">{tServices(key)}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <a
          data-animate
          href="#contacto"
          className="self-start px-7 py-3 bg-brand-navy text-brand-yellow font-semibold rounded-full hover:bg-brand-navy/90 transition-colors"
        >
          {t("cta")} -&gt;
        </a>
      </div>

      <div
        data-animate-logo
        className="flex items-center justify-center bg-brand-navy/5 p-8 md:p-12 min-h-[40vh] md:min-h-screen"
      >
        <LogoWordmark
          variant="navy"
          className="w-full max-h-[60vh] aspect-[4/1]"
          sizes="50vw"
        />
      </div>
    </section>
  );
}
