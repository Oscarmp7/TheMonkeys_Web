"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { NavbarHero } from "@/components/layout/navbar-hero";
import { SocialSidebar } from "@/components/ui/social-sidebar";
import type { Locale } from "@/i18n/routing";

gsap.registerPlugin(useGSAP);

export function Hero({ locale }: { locale: Locale }) {
  const t = useTranslations("hero");
  const containerRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== "undefined"
          ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
          : false;

      if (prefersReduced) return;

      const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 0.8 } });

      tl.from(eyebrowRef.current, { opacity: 0, y: 30 }, 0.3)
        .from(line1Ref.current, { opacity: 0, y: 30 }, 0.5)
        .from(line2Ref.current, { opacity: 0, y: 30 }, 0.7)
        .from(bodyRef.current, { opacity: 0, y: 30 }, 1.0)
        .from(ctasRef.current, { opacity: 0, y: 30 }, 1.2)
        .from(statsRef.current, { opacity: 0, y: 60, duration: 0.7 }, 1.4)
        .from(socialsRef.current, { opacity: 0, y: 60, duration: 0.7 }, 1.6);

      gsap.from(logoRef.current, {
        opacity: 0,
        scale: 0.85,
        filter: "blur(12px)",
        duration: 1.0,
        delay: 0.6,
        ease: "expo.out",
      });

      gsap.to(logoRef.current, {
        y: -12,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(scrollIndicatorRef.current, {
        y: 8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-brand-black overflow-hidden flex flex-col"
    >
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(30,36,63,0.6) 0%, transparent 70%)",
        }}
      />

      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
        style={{ opacity: 0.04 }}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <filter id="hero-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-noise)" />
      </svg>

      <NavbarHero locale={locale} />

      <div className="relative z-10 flex-1 flex items-center justify-center w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-28 pb-24 lg:pt-20 lg:pb-0">
        <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-4">
          <div className="flex-1 flex flex-col justify-center w-full">
            <p
              ref={eyebrowRef}
              className="font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-brand-yellow/80 mb-4 sm:mb-6"
            >
              <span className="inline-block w-6 h-px bg-brand-yellow/60 align-middle mr-3" />
              {t("eyebrow")}
            </p>

            <h1
              ref={line1Ref}
              className="font-display text-[clamp(4rem,12vw,12rem)] leading-[0.85] tracking-tight text-off-white uppercase mb-3"
            >
              {t("line1")}
            </h1>

            <h1
              ref={line2Ref}
              className="font-display text-[clamp(4rem,12vw,12rem)] leading-[0.85] tracking-tight uppercase"
              style={{
                WebkitTextStroke: "2px #F5C518",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("line2")}
            </h1>

            <p
              ref={bodyRef}
              className="font-body text-off-white/60 text-base sm:text-lg max-w-md mt-6 sm:mt-8 leading-relaxed text-justify"
            >
              {t("body")}
            </p>

            <div ref={ctasRef} className="flex flex-wrap gap-4 mt-8 sm:mt-10">
              <a
                href="#contacto"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-yellow text-brand-black font-display text-sm sm:text-base tracking-wider rounded-full hover:bg-brand-yellow/90 transition-colors duration-200 cursor-pointer"
              >
                {t("cta_contact")}
              </a>
              <Link
                href="/servicios"
                className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-off-white/40 text-off-white font-display text-sm sm:text-base tracking-wider rounded-full hover:border-off-white hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {t("cta_services")}
              </Link>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center w-full max-w-lg lg:max-w-xl xl:max-w-2xl">
            <div ref={logoRef} className="relative w-full aspect-square">
              <Image
                src="/logos/mk-main.png"
                alt="The Monkeys MK 3D Logo"
                fill
                sizes="(max-width: 1024px) 80vw, 40vw"
                className="object-contain drop-shadow-[0_0_80px_rgba(245,197,24,0.2)]"
                priority
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </div>

      <div ref={socialsRef} className="hidden lg:block">
        <SocialSidebar />
      </div>

      <div ref={statsRef} className="relative z-10 w-full bg-brand-yellow">
        <div className="w-full max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 sm:divide-x sm:divide-brand-black/20 px-6 py-5">
          {(["stat1", "stat2", "stat3"] as const).map((key) => (
            <span
              key={key}
              className="font-display text-brand-black text-base sm:text-lg tracking-wider uppercase px-8 whitespace-nowrap font-bold"
            >
              {t(key)}
            </span>
          ))}
        </div>
      </div>

      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-20 sm:bottom-16 left-1/2 -translate-x-1/2 z-10"
      >
        <span
          className="inline-block text-2xl font-bold rotate-90 text-brand-yellow"
          aria-hidden="true"
        >
          &gt;
        </span>
      </div>
    </section>
  );
}
