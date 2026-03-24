"use client";
import { useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { SocialSidebar } from "@/components/ui/social-sidebar";
import { StatsBar } from "@/components/sections/stats-bar";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function Hero() {
  const t = useTranslations("hero");
  const containerRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const prefersReduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced) return;

      const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 0.8 } });

      tl.from(eyebrowRef.current, { opacity: 0, y: 30 }, 0.3)
        .from(headlineRef.current!.children[0], { opacity: 0, y: 30 }, 0.5)
        .from(headlineRef.current!.children[1], { opacity: 0, y: 30 }, 0.7)
        .from(bodyRef.current, { opacity: 0, y: 30 }, 1.0)
        .from(ctasRef.current, { opacity: 0, y: 30 }, 1.2);

      // Logo entrance — attached to timeline for proper cleanup
      tl.from(logoRef.current, {
        opacity: 0,
        scale: 0.85,
        filter: "blur(12px)",
        duration: 1.0,
        ease: "expo.out",
      }, 0.6);

      // Logo float — separate infinite tween, but useGSAP scope will kill it on unmount
      gsap.to(logoRef.current, {
        y: -12,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: containerRef, dependencies: [prefersReduced] }
  );

  /* CTA primary hover — scale + yellow glow */
  const handleCtaPrimaryEnter = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (prefersReduced) return;
      gsap.to(e.currentTarget, {
        scale: 1.04,
        boxShadow: "0 0 24px rgba(245,197,24,0.45)",
        duration: 0.25,
        ease: "expo.out",
      });
    },
    [prefersReduced]
  );

  const handleCtaPrimaryLeave = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (prefersReduced) return;
      gsap.to(e.currentTarget, {
        scale: 1,
        boxShadow: "0 0 0px rgba(245,197,24,0)",
        duration: 0.25,
        ease: "expo.out",
      });
    },
    [prefersReduced]
  );

  /* Eyebrow hover — tracking expansion */
  const handleEyebrowEnter = useCallback(
    (e: React.MouseEvent<HTMLParagraphElement>) => {
      if (prefersReduced) return;
      gsap.to(e.currentTarget, {
        letterSpacing: "0.35em",
        duration: 0.3,
        ease: "expo.out",
      });
    },
    [prefersReduced]
  );

  const handleEyebrowLeave = useCallback(
    (e: React.MouseEvent<HTMLParagraphElement>) => {
      if (prefersReduced) return;
      gsap.to(e.currentTarget, {
        letterSpacing: "0.25em",
        duration: 0.3,
        ease: "expo.out",
      });
    },
    [prefersReduced]
  );

  return (
    <section
      ref={containerRef}
      className="relative h-screen bg-brand-black overflow-hidden flex flex-col"
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

      <div className="hidden lg:block">
        <SocialSidebar />
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-28 pb-24 lg:pt-20 lg:pb-0">
        <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-4">
          <div className="flex-1 flex flex-col justify-center w-full">
            <p
              ref={eyebrowRef}
              className="font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-brand-yellow/80 mb-4 sm:mb-6 cursor-default"
              onMouseEnter={handleEyebrowEnter}
              onMouseLeave={handleEyebrowLeave}
            >
              <span className="inline-block w-6 h-px bg-brand-yellow/60 align-middle mr-3" />
              {t("eyebrow")}
            </p>

            <h1
              ref={headlineRef}
              className="font-display text-[clamp(4rem,12vw,12rem)] leading-[0.85] tracking-tight uppercase"
            >
              <span className="block text-off-white mb-3">
                {t("line1")}
              </span>
              <span
                className="block"
                style={{
                  WebkitTextStroke: "2px #F5C518",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t("line2")}
              </span>
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
                className="hero-cta-primary inline-flex items-center justify-center px-8 py-3.5 bg-brand-yellow text-brand-black font-display text-sm sm:text-base tracking-wider rounded-full transition-all duration-200 cursor-pointer"
                onMouseEnter={handleCtaPrimaryEnter}
                onMouseLeave={handleCtaPrimaryLeave}
              >
                {t("cta_contact")}
              </a>
              <Link
                href="/servicios"
                className="hero-cta-outline group relative inline-flex items-center justify-center px-8 py-3.5 border-2 border-off-white/40 text-off-white font-display text-sm sm:text-base tracking-wider rounded-full overflow-hidden transition-colors duration-200 cursor-pointer hover:border-off-white hover:text-brand-black"
              >
                <span className="absolute inset-0 bg-off-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <span className="relative z-10">{t("cta_services")}</span>
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

      {/* Scroll indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 hidden lg:flex flex-col items-center gap-2 motion-reduce:hidden">
        <span className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-off-white/30">
          Scroll
        </span>
        <div className="w-5 h-8 rounded-full border border-off-white/20 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-brand-yellow animate-bounce" />
        </div>
      </div>

      {/* Stats bar pinned at bottom of hero — visible on load before scroll content covers it */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <StatsBar />
      </div>
    </section>
  );
}
