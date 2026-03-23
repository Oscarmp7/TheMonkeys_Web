"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { ContactForm } from "@/components/ui/contact-form";
import { getWhatsAppHref } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// This section gets id="contacto" for the #contacto anchor links throughout the site
export function Contact({ locale }: { locale: Locale }) {
  const t = useTranslations("contact");
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
    <section ref={containerRef} id="contacto" className="py-24 px-8 bg-off-white">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        <div className="flex flex-col gap-6">
          <h2 data-animate className="text-4xl md:text-5xl font-display text-brand-navy">
            {t("title")}
          </h2>

          <p data-animate className="text-brand-navy/70">
            {t("subtitle")}
          </p>

          <a
            data-animate
            href={getWhatsAppHref("Hola! Me gustaria cotizar un servicio.", locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start px-7 py-3 bg-brand-yellow text-brand-navy font-semibold rounded-full hover:bg-brand-yellow/90 transition-colors"
          >
            {t("whatsapp")} ↗
          </a>
        </div>

        <div data-animate>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
