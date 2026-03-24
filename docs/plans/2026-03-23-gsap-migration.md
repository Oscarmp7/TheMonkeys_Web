# GSAP Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace `motion/react` entirely with GSAP across all 8 animated components, preserving every existing animation behavior.

**Architecture:** Install `gsap` + `@gsap/react`, migrate each component using `useGSAP` hook with refs. Entry animations become `gsap.timeline()` calls; scroll-triggered animations use GSAP ScrollTrigger; infinite loops use `repeat: -1, yoyo: true`; the sticky navbar AnimatePresence is replaced by always-mounted nav with GSAP show/hide.

**Tech Stack:** GSAP 3.x, @gsap/react 2.x, Next.js 15 App Router, TypeScript

---

### Task 1: Install GSAP and uninstall motion

**Files:**
- Modify: `package.json` (via npm commands)

**Step 1: Install GSAP**

```bash
cd C:/Users/omato/OneDrive/Desktop/Dev/TheMonkeys_Web
npm install gsap @gsap/react
```

Expected output: `added N packages`

**Step 2: Uninstall motion**

```bash
npm uninstall motion
```

Expected output: `removed N packages`

**Step 3: Verify package.json**

Check that `package.json` contains:
```json
"gsap": "^3.x.x",
"@gsap/react": "^2.x.x"
```
And does NOT contain `"motion"`.

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: replace motion/react with gsap + @gsap/react"
```

---

### Task 2: Simplify layout-provider.tsx

`LayoutGroup` from motion has no GSAP equivalent needed. The component just becomes a passthrough.

**Files:**
- Modify: `src/components/providers/layout-provider.tsx`

**Step 1: Replace the file content**

```tsx
export function LayoutProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

Remove: `"use client"` directive (no longer needed), `LayoutGroup` import.

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors related to this file.

**Step 3: Commit**

```bash
git add src/components/providers/layout-provider.tsx
git commit -m "refactor: remove LayoutGroup from layout-provider"
```

---

### Task 3: Migrate navbar-hero.tsx

Single `motion.nav` with fade-in → plain `<nav>` with `useGSAP`.

**Files:**
- Modify: `src/components/layout/navbar-hero.tsx`

**Step 1: Replace the file**

```tsx
"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Link as IntlLink, usePathname } from "@/i18n/navigation";
import { LogoWordmark } from "@/components/ui/logo-wordmark";
import { NAV_LINK_KEYS, NAV_ANCHORS } from "@/lib/nav";
import type { Locale } from "@/i18n/routing";

gsap.registerPlugin(useGSAP);

/** Nav keys that correspond to real routes (not hash anchors). */
const ROUTE_KEYS = new Set(["servicios"] as const);

export function NavbarHero({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useGSAP(() => {
    if (prefersReduced || !navRef.current) return;
    gsap.from(navRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.6,
      delay: 0.1,
      ease: "expo.out",
    });
  }, { scope: navRef });

  return (
    <nav
      ref={navRef}
      className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 sm:px-10 lg:px-16 xl:px-24 py-6"
    >
      {/* Logo wordmark — left */}
      <div className="relative w-20 sm:w-24 lg:w-28 xl:w-32 aspect-square -my-4">
        <LogoWordmark variant="yellow" className="w-full h-full" sizes="128px" priority />
      </div>

      {/* Nav links — center (glass pill) */}
      <div className="hidden md:flex items-center gap-1 backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-6 py-2">
        {NAV_LINK_KEYS.map((key) => {
          const href = NAV_ANCHORS[key];
          if (!ROUTE_KEYS.has(key as "servicios")) {
            return (
              <Link
                key={key}
                href={href}
                className="px-4 py-2 text-off-white/70 hover:text-off-white text-sm font-body font-medium tracking-wide transition-colors duration-200 cursor-pointer"
              >
                {t(key)}
              </Link>
            );
          }
          return (
            <IntlLink
              key={key}
              href={href as "/"}
              className="px-4 py-2 text-off-white/70 hover:text-off-white text-sm font-body font-medium tracking-wide transition-colors duration-200 cursor-pointer"
            >
              {t(key)}
            </IntlLink>
          );
        })}
        <Link
          href="#contacto"
          className="ml-3 px-6 py-2 bg-brand-yellow text-brand-black text-sm font-display tracking-wider rounded-full hover:bg-brand-yellow/90 transition-colors duration-200 cursor-pointer"
        >
          {t("cotizar")}
        </Link>
      </div>

      {/* Language toggle — pill */}
      <div className="flex items-center border border-white/20 rounded-full px-1 py-1 gap-1">
        <IntlLink
          href={pathname as "/"}
          locale="es"
          className={`rounded-full px-3 py-1 text-sm font-mono uppercase cursor-pointer transition-colors duration-200 ${
            locale === "es"
              ? "bg-white/10 text-white"
              : "text-white/40 hover:text-white/60"
          }`}
        >
          ES
        </IntlLink>
        <IntlLink
          href={pathname as "/"}
          locale="en"
          className={`rounded-full px-3 py-1 text-sm font-mono uppercase cursor-pointer transition-colors duration-200 ${
            locale === "en"
              ? "bg-white/10 text-white"
              : "text-white/40 hover:text-white/60"
          }`}
        >
          EN
        </IntlLink>
      </div>
    </nav>
  );
}
```

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add src/components/layout/navbar-hero.tsx
git commit -m "refactor: migrate navbar-hero animations to gsap"
```

---

### Task 4: Migrate navbar-sticky.tsx

`AnimatePresence` + conditional render → always-mounted nav, GSAP controls opacity/y.

**Files:**
- Modify: `src/components/layout/navbar-sticky.tsx`

**Step 1: Replace the file**

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Link as IntlLink, usePathname } from "@/i18n/navigation";
import { MKMonogram } from "@/components/ui/logo-wordmark";
import { NAV_LINK_KEYS, NAV_ANCHORS } from "@/lib/nav";
import type { Locale } from "@/i18n/routing";

gsap.registerPlugin(useGSAP);

/** Nav keys that correspond to real routes (not hash anchors). */
const ROUTE_KEYS = new Set(["servicios"] as const);

export function NavbarSticky({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(() => {
    if (!navRef.current) return;
    gsap.to(navRef.current, {
      y: visible ? 0 : -80,
      opacity: visible ? 1 : 0,
      duration: 0.35,
      ease: "power2.out",
      pointerEvents: visible ? "auto" : "none",
    });
  }, { dependencies: [visible] });

  return (
    <nav
      ref={navRef}
      style={{ opacity: 0, transform: "translateY(-80px)", pointerEvents: "none" }}
      className="fixed top-0 left-0 right-0 z-50 bg-brand-black/95 backdrop-blur-md border-b border-off-white/10"
    >
      <div className="flex items-center justify-between px-6 sm:px-10 lg:px-16 py-4">
        {/* Logo */}
        <MKMonogram variant="yellow" />

        {/* Nav links — centered */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINK_KEYS.map((key) => {
            const href = NAV_ANCHORS[key];
            if (!ROUTE_KEYS.has(key as "servicios")) {
              return (
                <Link
                  key={key}
                  href={href}
                  className="px-3 py-1 text-off-white/70 hover:text-off-white text-sm font-body font-medium tracking-wide transition-colors duration-200 cursor-pointer"
                >
                  {t(key)}
                </Link>
              );
            }
            return (
              <IntlLink
                key={key}
                href={href as "/"}
                className="px-3 py-1 text-off-white/70 hover:text-off-white text-sm font-body font-medium tracking-wide transition-colors duration-200 cursor-pointer"
              >
                {t(key)}
              </IntlLink>
            );
          })}
        </div>

        {/* Right: Cotizar + language toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="#contacto"
            className="px-5 py-2 bg-brand-yellow text-brand-black text-sm font-display tracking-wider hover:bg-brand-yellow/90 transition-colors duration-200 cursor-pointer"
          >
            {t("cotizar")}
          </Link>

          <div className="flex items-center gap-1 text-sm font-display">
            <IntlLink
              href={pathname as "/"}
              locale="es"
              className={
                locale === "es"
                  ? "bg-brand-yellow text-brand-black w-7 h-7 flex items-center justify-center text-xs tracking-wider cursor-pointer"
                  : "text-off-white/50 hover:text-off-white text-xs tracking-wider cursor-pointer transition-colors duration-200"
              }
            >
              ES
            </IntlLink>
            <IntlLink
              href={pathname as "/"}
              locale="en"
              className={
                locale === "en"
                  ? "bg-brand-yellow text-brand-black w-7 h-7 flex items-center justify-center text-xs tracking-wider cursor-pointer"
                  : "text-off-white/50 hover:text-off-white text-xs tracking-wider cursor-pointer transition-colors duration-200"
              }
            >
              EN
            </IntlLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add src/components/layout/navbar-sticky.tsx
git commit -m "refactor: migrate navbar-sticky AnimatePresence to gsap"
```

---

### Task 5: Migrate hero.tsx

Most complex: full staggered timeline + logo scale-in + infinite float + scroll indicator.

**Files:**
- Modify: `src/components/sections/hero.tsx`

**Step 1: Replace the file**

```tsx
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

  useGSAP(() => {
    const prefersReduced =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

    if (prefersReduced) return;

    // Entry timeline
    const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 0.8 } });
    tl.from(eyebrowRef.current, { opacity: 0, y: 30 }, 0.3)
      .from(line1Ref.current, { opacity: 0, y: 30 }, 0.5)
      .from(line2Ref.current, { opacity: 0, y: 30 }, 0.7)
      .from(bodyRef.current, { opacity: 0, y: 30 }, 1.0)
      .from(ctasRef.current, { opacity: 0, y: 30 }, 1.2)
      .from(statsRef.current, { opacity: 0, y: 60, duration: 0.7 }, 1.4)
      .from(socialsRef.current, { opacity: 0, y: 60, duration: 0.7 }, 1.6);

    // Logo scale-in with blur
    gsap.from(logoRef.current, {
      opacity: 0,
      scale: 0.85,
      filter: "blur(12px)",
      duration: 1.0,
      delay: 0.6,
      ease: "expo.out",
    });

    // Logo infinite float
    gsap.to(logoRef.current, {
      y: -12,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Scroll indicator bounce
    gsap.to(scrollIndicatorRef.current, {
      y: 8,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-brand-black overflow-hidden flex flex-col"
    >
      {/* ─── Navy depth gradient ─── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(30,36,63,0.6) 0%, transparent 70%)",
        }}
      />

      {/* ─── SVG noise texture overlay ─── */}
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

      {/* ─── Main content: split layout ─── */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-28 pb-24 lg:pt-20 lg:pb-0">
        <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-4">
          {/* ─── Left: Typography block ─── */}
          <div className="flex-1 flex flex-col justify-center w-full">
            {/* Eyebrow */}
            <p
              ref={eyebrowRef}
              className="font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-brand-yellow/80 mb-4 sm:mb-6"
            >
              <span className="inline-block w-6 h-px bg-brand-yellow/60 align-middle mr-3" />
              {t("eyebrow")}
            </p>

            {/* AGENCIA — filled white */}
            <h1
              ref={line1Ref}
              className="font-display text-[clamp(4rem,12vw,12rem)] leading-[0.85] tracking-tight text-off-white uppercase mb-3"
            >
              {t("line1")}
            </h1>

            {/* CREATIVA — outlined yellow stroke */}
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

            {/* Body text */}
            <p
              ref={bodyRef}
              className="font-body text-off-white/60 text-base sm:text-lg max-w-md mt-6 sm:mt-8 leading-relaxed text-justify"
            >
              {t("body")}
            </p>

            {/* CTAs */}
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

          {/* ─── Right: MK 3D Image ─── */}
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

      {/* ─── Social sidebar (desktop only) ─── */}
      <div ref={socialsRef} className="hidden lg:block">
        <SocialSidebar />
      </div>

      {/* ─── Bottom stats bar ─── */}
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

      {/* Scroll indicator */}
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
```

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add src/components/sections/hero.tsx
git commit -m "refactor: migrate hero animations to gsap"
```

---

### Task 6: Migrate brandbook.tsx

`whileInView` variants → GSAP ScrollTrigger.

**Files:**
- Modify: `src/components/sections/brandbook.tsx`

**Step 1: Replace the file**

```tsx
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

  useGSAP(() => {
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
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative z-10 min-h-screen bg-off-white grid md:grid-cols-2">

      {/* Left: Info + Services */}
      <div className="flex flex-col justify-center px-12 py-20 gap-8">
        <p data-animate className="text-5xl md:text-6xl font-display text-brand-navy leading-none">
          {t("statement")}
        </p>

        <p data-animate className="text-lg text-brand-navy/70 max-w-sm leading-relaxed">
          {t("bio")}
        </p>

        {/* Service list */}
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
          {t("cta")} →
        </a>
      </div>

      {/* Right: Logo */}
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
```

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add src/components/sections/brandbook.tsx
git commit -m "refactor: migrate brandbook animations to gsap"
```

---

### Task 7: Migrate contact.tsx

`whileInView` on individual elements → GSAP ScrollTrigger stagger.

**Files:**
- Modify: `src/components/sections/contact.tsx`

**Step 1: Replace the file**

```tsx
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

  useGSAP(() => {
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
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="contacto" className="py-24 px-8 bg-off-white">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Left: heading + WhatsApp CTA */}
        <div className="flex flex-col gap-6">
          <h2
            data-animate
            className="text-4xl md:text-5xl font-display text-brand-navy"
          >
            {t("title")}
          </h2>

          <p data-animate className="text-brand-navy/70">
            {t("subtitle")}
          </p>

          <a
            data-animate
            href={getWhatsAppHref("Hola! Me gustaría cotizar un servicio.", locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start px-7 py-3 bg-brand-yellow text-brand-navy font-semibold rounded-full hover:bg-brand-yellow/90 transition-colors"
          >
            {t("whatsapp")} ↗
          </a>
        </div>

        {/* Right: Contact form */}
        <div data-animate>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add src/components/sections/contact.tsx
git commit -m "refactor: migrate contact animations to gsap"
```

---

### Task 8: Migrate portfolio.tsx and project-card.tsx

`whileInView` → GSAP ScrollTrigger. `motion.article` → plain `<article>`.

**Files:**
- Modify: `src/components/sections/portfolio.tsx`
- Modify: `src/components/ui/project-card.tsx`

**Step 1: Replace portfolio.tsx**

```tsx
"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PROJECTS } from "@/lib/portfolio";
import { ProjectCard } from "@/components/ui/project-card";
import type { Locale } from "@/i18n/routing";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Portfolio({ locale }: { locale: Locale }) {
  const t = useTranslations("portfolio");
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
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
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 px-8 bg-off-white">
      <div className="max-w-5xl mx-auto">
        <h2
          data-animate
          className="text-4xl md:text-5xl font-display text-brand-navy mb-12"
        >
          {t("title")}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {PROJECTS.filter((p) => p.featured).map((project, i) => (
            <ProjectCard key={project.slug} project={project} locale={locale} index={i} />
          ))}
        </div>

        <div data-animate className="mt-12 text-center">
          <Link
            href="/portafolio"
            className="inline-flex items-center gap-2 text-brand-navy font-semibold hover:gap-3 transition-all"
          >
            {t("cta")} →
          </Link>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Replace project-card.tsx**

```tsx
"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import type { Project } from "@/lib/portfolio";
import type { Locale } from "@/i18n/routing";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ProjectCardProps {
  project: Project;
  locale: Locale;
  index: number;
}

export function ProjectCard({ project, locale, index }: ProjectCardProps) {
  const title = locale === "es" ? project.titleEs : project.titleEn;
  const description = locale === "es" ? project.descriptionEs : project.descriptionEn;
  const cardRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const prefersReduced =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

    if (prefersReduced) return;

    gsap.from(cardRef.current, {
      opacity: 0,
      y: 24,
      duration: 0.5,
      delay: index * 0.1,
      ease: "expo.out",
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top 80%",
        once: true,
      },
    });
  }, { scope: cardRef });

  return (
    <article
      ref={cardRef}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.coverImage}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>
      <div className="p-6">
        <p className="text-xs text-brand-yellow font-semibold uppercase tracking-widest mb-1">
          {project.client}
        </p>
        <h3 className="text-xl font-semibold text-brand-navy mb-2">{title}</h3>
        <p className="text-brand-navy/60 text-sm leading-relaxed">{description}</p>
      </div>
    </article>
  );
}
```

**Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

**Step 4: Commit**

```bash
git add src/components/sections/portfolio.tsx src/components/ui/project-card.tsx
git commit -m "refactor: migrate portfolio and project-card animations to gsap"
```

---

### Task 9: Remove dead hook use-scroll-progress.ts

`src/hooks/use-scroll-progress.ts` uses `useScroll` and `MotionValue` from motion/react. It is not imported anywhere — it is dead code.

**Files:**
- Delete: `src/hooks/use-scroll-progress.ts`

**Step 1: Confirm no usages**

```bash
grep -r "useSectionScrollProgress" src/
```

Expected: only the definition file, no other matches.

**Step 2: Delete the file**

```bash
rm src/hooks/use-scroll-progress.ts
```

**Step 3: Commit**

```bash
git add src/hooks/use-scroll-progress.ts
git commit -m "refactor: remove unused use-scroll-progress hook (motion/react dependency)"
```

---

### Task 10: Final verification

**Step 1: Full TypeScript check**

```bash
npx tsc --noEmit
```

Expected: zero errors.

**Step 2: Production build**

```bash
npm run build
```

Expected: build completes without errors. Check that `motion` does not appear in the bundle output.

**Step 3: Verify motion is gone**

```bash
grep -r "from \"motion" src/
```

Expected: no output (zero matches).

**Step 4: Verify motion is fully gone**

```bash
grep -r "from \"motion" src/
```

Expected: zero matches.

**Step 5: Commit**

If build passes cleanly:

```bash
git add -A
git commit -m "chore: verify gsap migration complete, motion fully removed"
```
