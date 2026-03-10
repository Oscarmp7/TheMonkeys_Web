# TheMonkeys Web — UI Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix hero/navbar issues, integrate animated LogoCloud (brands) and HoverSlider (services), then deploy to GitHub + Vercel as themonkeys.vercel.app.

**Architecture:** All UI changes are isolated to existing section files + new UI primitive files. No new routes, no schema changes, no API changes. New components live in `src/components/ui/`. Brands and Services sections are replaced in-place.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, framer-motion v12, next-intl, next-themes. New dep: `react-use-measure`.

---

### Task 1: Install dependency

**Files:** `package.json`

**Step 1: Install react-use-measure**

```bash
npm install react-use-measure
```

Expected: package added to dependencies.

**Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add react-use-measure for infinite slider"
```

---

### Task 2: Fix Navbar — bigger logo

**Files:**
- Modify: `src/components/layout/navbar.tsx`

**Step 1: Update logo size in navbar**

In `src/components/layout/navbar.tsx`, find the `<Image>` for the logo and update:

```tsx
<Image
  src={logoSrc}
  alt="The Monkeys"
  width={300}
  height={100}
  className={`object-contain transition-all duration-300 ${
    scrolled ? "h-14 w-auto" : "h-24 w-auto"
  }`}
  priority
/>
```

**Step 2: Verify visually** — run `npm run dev`, open browser, confirm logo is large and readable in navbar.

**Step 3: Commit**

```bash
git add src/components/layout/navbar.tsx
git commit -m "fix: increase navbar logo size for legibility"
```

---

### Task 3: Fix Hero section

**Files:**
- Modify: `src/components/sections/hero.tsx`

**Step 1: Remove internal hero logo + fix layout**

Replace the entire content of `src/components/sections/hero.tsx` with this:

```tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Globe, Phone, MapPin } from "lucide-react";
import { ParticleButton } from "@/components/ui/particle-button";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function Hero() {
  const t = useTranslations("hero");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const mkSrc = isDark ? "/logos/mk-white.png" : "/logos/mk-main.png";

  return (
    <motion.section
      id="hero"
      className="relative flex w-full min-h-screen flex-col overflow-hidden md:flex-row"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Left Side: Content */}
      <div className="flex w-full flex-col justify-center p-8 pt-24 md:w-1/2 md:p-12 md:pt-28 lg:w-3/5 lg:p-16 lg:pt-32">
        {/* Overheader tagline */}
        <motion.p
          className="mb-6 text-xs tracking-[0.3em] uppercase text-brand-navy/60 dark:text-white/40 font-semibold"
          variants={itemVariants}
        >
          {t("overheader")}
        </motion.p>

        {/* Main Content */}
        <motion.main variants={containerVariants}>
          <motion.h1
            className="font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
            variants={itemVariants}
          >
            {t("title_line1")}{" "}
            <br />
            <span className="text-brand-yellow">{t("title_line2")}</span>
          </motion.h1>

          <motion.div
            className="my-6 h-1 w-20 bg-brand-yellow"
            variants={itemVariants}
          />

          <motion.p
            className="mb-8 max-w-md text-base text-brand-navy/70 dark:text-white/60"
            variants={itemVariants}
          >
            {t("subtitle")}
          </motion.p>

          <motion.div className="flex flex-wrap gap-4" variants={itemVariants}>
            <a
              href="https://wa.me/18097561847?text=Hola,%20me%20interesa%20saber%20m%C3%A1s%20sobre%20sus%20servicios"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ParticleButton
                variant="default"
                size="lg"
                className="bg-brand-yellow text-brand-navy font-bold hover:shadow-xl hover:scale-105 tracking-wider"
                successDuration={800}
              >
                {t("cta_primary")}
              </ParticleButton>
            </a>
            <a href="#portfolio">
              <ParticleButton
                variant="outline"
                size="lg"
                className="font-bold tracking-wider"
                successDuration={800}
              >
                {t("cta_secondary")}
              </ParticleButton>
            </a>
          </motion.div>
        </motion.main>

        {/* Bottom: Contact Info */}
        <motion.footer className="mt-12 w-full" variants={itemVariants}>
          <div className="grid grid-cols-1 gap-4 text-xs text-brand-navy/80 dark:text-white/60 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-brand-yellow flex-shrink-0" />
              <span>themonkeys.do</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand-yellow flex-shrink-0" />
              <span>(809) 756-1847</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-yellow flex-shrink-0" />
              <span>Santiago de los Caballeros, RD</span>
            </div>
          </div>
        </motion.footer>
      </div>

      {/* Right Side: MK with clip-path diagonal */}
      <motion.div
        className="relative w-full min-h-[280px] md:w-1/2 md:min-h-full lg:w-2/5 flex items-center justify-center"
        style={{ backgroundColor: isDark ? "#001A2C" : "#FFCD00" }}
        initial={{ clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" }}
        animate={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}
        transition={{ duration: 1.2, ease: "circOut" }}
      >
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? "#FFCD00" : "#00263E"} 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* MK Logo */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [-1, 1, -1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src={mkSrc}
              alt="MK"
              width={400}
              height={400}
              className="w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Decorative shapes */}
        <motion.div
          className="absolute w-16 h-16 rounded-full border-2 border-brand-navy/20 dark:border-white/20"
          style={{ top: "15%", right: "20%" }}
          animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-8 h-8 rounded-full bg-brand-navy/10 dark:bg-white/10"
          style={{ bottom: "25%", left: "15%" }}
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute w-12 h-12 rounded-lg border-2 border-brand-navy/10 dark:border-white/10"
          style={{ bottom: "15%", right: "30%" }}
          animate={{ rotate: [0, 45, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </motion.div>

      <ScrollIndicator />
    </motion.section>
  );
}
```

**Step 2: Update i18n files — split title into two lines**

In `src/messages/en.json`, replace the `hero` block:
```json
"hero": {
  "overheader": "Creative Digital Agency",
  "title_line1": "We make brands",
  "title_line2": "grow in digital",
  "subtitle": "We help brands grow in the digital environment through modern, creative, and results-oriented communication strategies.",
  "cta_primary": "Get a Quote!",
  "cta_secondary": "View Portfolio"
},
```

In `src/messages/es.json`, replace the `hero` block:
```json
"hero": {
  "overheader": "Agencia Digital Creativa",
  "title_line1": "Hacemos que las marcas",
  "title_line2": "crezcan en digital",
  "subtitle": "Ayudamos a las marcas a crecer en el entorno digital mediante estrategias de comunicación modernas, creativas y orientadas a resultados.",
  "cta_primary": "¡Cotiza ahora!",
  "cta_secondary": "Ver Portafolio"
},
```

**Step 3: Verify** — confirm no double logo, hero looks clean, title changes with language toggle.

**Step 4: Commit**

```bash
git add src/components/sections/hero.tsx src/messages/en.json src/messages/es.json
git commit -m "fix: remove hero double logo, fix i18n title, fix contact info visibility"
```

---

### Task 4: Create InfiniteSlider component

**Files:**
- Create: `src/components/ui/infinite-slider.tsx`

**Step 1: Create the file**

```tsx
'use client';
import { cn } from '@/lib/utils';
import { useMotionValue, animate, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import useMeasure from 'react-use-measure';

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  className?: string;
};

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [currentDuration, setCurrentDuration] = useState(duration);
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    let controls: ReturnType<typeof animate> | undefined;
    const size = direction === 'horizontal' ? width : height;
    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;

    if (isTransitioning) {
      controls = animate(translation, [translation.get(), to], {
        ease: 'linear',
        duration: currentDuration * Math.abs((translation.get() - to) / contentSize),
        onComplete: () => {
          setIsTransitioning(false);
          setKey((prevKey) => prevKey + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: 'linear',
        duration: currentDuration,
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
        onRepeat: () => { translation.set(from); },
      });
    }

    return controls?.stop;
  }, [key, translation, currentDuration, width, height, gap, isTransitioning, direction, reverse]);

  const hoverProps = durationOnHover
    ? {
        onHoverStart: () => { setIsTransitioning(true); setCurrentDuration(durationOnHover); },
        onHoverEnd: () => { setIsTransitioning(true); setCurrentDuration(duration); },
      }
    : {};

  return (
    <div className={cn('overflow-hidden', className)}>
      <motion.div
        className="flex w-max"
        style={{
          ...(direction === 'horizontal' ? { x: translation } : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
        }}
        ref={ref}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/ui/infinite-slider.tsx
git commit -m "feat: add InfiniteSlider component"
```

---

### Task 5: Create ProgressiveBlur component

**Files:**
- Create: `src/components/ui/progressive-blur.tsx`

**Step 1: Create the file**

```tsx
'use client';
import { cn } from '@/lib/utils';
import { HTMLMotionProps, motion } from 'framer-motion';

export const GRADIENT_ANGLES = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
};

export type ProgressiveBlurProps = {
  direction?: keyof typeof GRADIENT_ANGLES;
  blurLayers?: number;
  className?: string;
  blurIntensity?: number;
} & HTMLMotionProps<'div'>;

export function ProgressiveBlur({
  direction = 'bottom',
  blurLayers = 8,
  className,
  blurIntensity = 0.25,
  ...props
}: ProgressiveBlurProps) {
  const layers = Math.max(blurLayers, 2);
  const segmentSize = 1 / (blurLayers + 1);

  return (
    <div className={cn('relative', className)}>
      {Array.from({ length: layers }).map((_, index) => {
        const angle = GRADIENT_ANGLES[direction];
        const gradientStops = [
          index * segmentSize,
          (index + 1) * segmentSize,
          (index + 2) * segmentSize,
          (index + 3) * segmentSize,
        ].map(
          (pos, posIndex) =>
            `rgba(255, 255, 255, ${posIndex === 1 || posIndex === 2 ? 1 : 0}) ${pos * 100}%`
        );
        const gradient = `linear-gradient(${angle}deg, ${gradientStops.join(', ')})`;

        return (
          <motion.div
            key={index}
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              maskImage: gradient,
              WebkitMaskImage: gradient,
              backdropFilter: `blur(${index * blurIntensity}px)`,
            }}
            {...props}
          />
        );
      })}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/ui/progressive-blur.tsx
git commit -m "feat: add ProgressiveBlur component"
```

---

### Task 6: Create LogoCloud and replace Brands section

**Files:**
- Create: `src/components/ui/logo-cloud.tsx`
- Modify: `src/components/sections/client-logos.tsx`

**Step 1: Create logo-cloud.tsx**

```tsx
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

type Logo = {
  src: string;
  alt: string;
};

type LogoCloudProps = {
  logos: Logo[];
};

export function LogoCloud({ logos }: LogoCloudProps) {
  return (
    <div className="relative mx-auto max-w-4xl py-6">
      <InfiniteSlider gap={48} duration={40} durationOnHover={80} reverse>
        {logos.map((logo) => (
          <img
            alt={logo.alt}
            className="pointer-events-none h-8 w-auto select-none grayscale opacity-60 hover:opacity-100 transition-opacity md:h-10"
            key={`logo-${logo.alt}`}
            loading="lazy"
            src={logo.src}
          />
        ))}
      </InfiniteSlider>

      <ProgressiveBlur
        blurIntensity={1}
        className="pointer-events-none absolute top-0 left-0 h-full w-[120px]"
        direction="left"
      />
      <ProgressiveBlur
        blurIntensity={1}
        className="pointer-events-none absolute top-0 right-0 h-full w-[120px]"
        direction="right"
      />
    </div>
  );
}
```

**Step 2: Update client-logos.tsx**

Replace the full file:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { LogoCloud } from "@/components/ui/logo-cloud";

const logos = [
  { src: "https://svgl.app/library/nvidia-wordmark-light.svg", alt: "Nvidia" },
  { src: "https://svgl.app/library/supabase_wordmark_light.svg", alt: "Supabase" },
  { src: "https://svgl.app/library/openai_wordmark_light.svg", alt: "OpenAI" },
  { src: "https://svgl.app/library/turso-wordmark-light.svg", alt: "Turso" },
  { src: "https://svgl.app/library/vercel_wordmark.svg", alt: "Vercel" },
  { src: "https://svgl.app/library/github_wordmark_light.svg", alt: "GitHub" },
  { src: "https://svgl.app/library/claude-ai-wordmark-icon_light.svg", alt: "Claude AI" },
  { src: "https://svgl.app/library/clerk-wordmark-light.svg", alt: "Clerk" },
];

export function ClientLogos() {
  const t = useTranslations("clients");

  return (
    <section
      id="clients"
      className="py-24 lg:py-32 bg-surface-light-alt dark:bg-brand-navy-deep"
    >
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader overheader={t("overheader")} title="" />
          <LogoCloud logos={logos} />
        </motion.div>
      </div>
    </section>
  );
}
```

**Step 3: Verify** — logos scroll infinitely with blur on edges, no layout breaks.

**Step 4: Commit**

```bash
git add src/components/ui/logo-cloud.tsx src/components/sections/client-logos.tsx
git commit -m "feat: replace static brand logos with animated infinite LogoCloud"
```

---

### Task 7: Create AnimatedSlideshow component

**Files:**
- Create: `src/components/ui/animated-slideshow.tsx`

**Step 1: Create the file**

```tsx
"use client"

import * as React from "react"
import { HTMLMotionProps, MotionConfig, motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TextStaggerHoverProps {
  text: string
  index: number
}
interface HoverSliderImageProps {
  index: number
  imageUrl: string
}

function splitText(text: string) {
  const words = text.split(" ").map((word) => word.concat(" "))
  const characters = words.map((word) => word.split("")).flat(1)
  return { characters }
}

const HoverSliderContext = React.createContext<
  { activeSlide: number; changeSlide: (index: number) => void } | undefined
>(undefined)

function useHoverSliderContext() {
  const context = React.useContext(HoverSliderContext)
  if (context === undefined) {
    throw new Error("useHoverSliderContext must be used within HoverSlider")
  }
  return context
}

export const HoverSlider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const [activeSlide, setActiveSlide] = React.useState<number>(0)
  const changeSlide = React.useCallback((index: number) => setActiveSlide(index), [])

  return (
    <HoverSliderContext.Provider value={{ activeSlide, changeSlide }}>
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    </HoverSliderContext.Provider>
  )
})
HoverSlider.displayName = "HoverSlider"

export const TextStaggerHover = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & TextStaggerHoverProps
>(({ text, index, className, ...props }, ref) => {
  const { activeSlide, changeSlide } = useHoverSliderContext()
  const { characters } = splitText(text)
  const isActive = activeSlide === index

  return (
    <span
      className={cn("relative inline-block cursor-pointer", className)}
      ref={ref}
      onMouseEnter={() => changeSlide(index)}
      {...props}
    >
      {characters.map((char, i) => (
        <span key={`${char}-${i}`} className="relative inline-block overflow-hidden">
          <MotionConfig
            transition={{ delay: i * 0.02, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.span
              className="inline-block"
              style={{ opacity: isActive ? 1 : 0.35 }}
              initial={{ y: "0%" }}
              animate={isActive ? { y: "-110%" } : { y: "0%" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
            <motion.span
              className="absolute left-0 top-0 inline-block"
              initial={{ y: "110%" }}
              animate={isActive ? { y: "0%" } : { y: "110%" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          </MotionConfig>
        </span>
      ))}
    </span>
  )
})
TextStaggerHover.displayName = "TextStaggerHover"

export const clipPathVariants = {
  visible: { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
  hidden:  { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0px)" },
}

export const HoverSliderImageWrap = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "grid overflow-hidden [&>*]:col-start-1 [&>*]:col-end-1 [&>*]:row-start-1 [&>*]:row-end-1 [&>*]:size-full",
      className
    )}
    {...props}
  />
))
HoverSliderImageWrap.displayName = "HoverSliderImageWrap"

export const HoverSliderImage = React.forwardRef<
  HTMLImageElement,
  HTMLMotionProps<"img"> & HoverSliderImageProps
>(({ index, imageUrl, className, ...props }, ref) => {
  const { activeSlide } = useHoverSliderContext()
  return (
    <motion.img
      className={cn("inline-block align-middle", className)}
      transition={{ ease: [0.33, 1, 0.68, 1], duration: 0.8 }}
      variants={clipPathVariants}
      animate={activeSlide === index ? "visible" : "hidden"}
      ref={ref}
      {...props}
    />
  )
})
HoverSliderImage.displayName = "HoverSliderImage"
```

**Step 2: Commit**

```bash
git add src/components/ui/animated-slideshow.tsx
git commit -m "feat: add HoverSlider animated slideshow component"
```

---

### Task 8: Replace Services section with HoverSlider

**Files:**
- Modify: `src/components/sections/services.tsx`

**Step 1: Replace services.tsx**

```tsx
"use client";

import { useTranslations } from "next-intl";
import {
  HoverSlider,
  HoverSliderImage,
  HoverSliderImageWrap,
  TextStaggerHover,
} from "@/components/ui/animated-slideshow";

const SLIDES = [
  {
    id: "inbound",
    titleKey: "inbound",
    imageUrl:
      "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&auto=format&fit=crop",
  },
  {
    id: "content_production",
    titleKey: "content_production",
    imageUrl:
      "https://images.unsplash.com/photo-1574717025058-2f8737d2e2b7?w=800&auto=format&fit=crop",
  },
  {
    id: "seo",
    titleKey: "seo",
    imageUrl:
      "https://images.unsplash.com/photo-1571721795195-a2ca2d3370a9?w=800&auto=format&fit=crop",
  },
  {
    id: "web_dev",
    titleKey: "web_dev",
    imageUrl:
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&auto=format&fit=crop",
  },
  {
    id: "influencers",
    titleKey: "influencers",
    imageUrl:
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop",
  },
  {
    id: "campaigns",
    titleKey: "campaigns",
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
  },
  {
    id: "content_creation",
    titleKey: "content_creation",
    imageUrl:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop",
  },
];

export function Services() {
  const t = useTranslations("services");

  return (
    <section id="services">
      <HoverSlider className="min-h-svh flex flex-col justify-center px-6 py-24 md:px-12 lg:px-16 bg-surface-light dark:bg-brand-navy">
        {/* Overheader */}
        <p className="mb-8 text-xs font-medium uppercase tracking-widest text-brand-yellow">
          / {t("overheader")}
        </p>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          {/* Service list */}
          <div className="flex flex-col gap-3 md:gap-5">
            {SLIDES.map((slide, index) => (
              <TextStaggerHover
                key={slide.id}
                index={index}
                text={t(`items.${slide.titleKey}`)}
                className="text-3xl font-bold uppercase tracking-tight text-brand-navy dark:text-white md:text-4xl lg:text-5xl"
              />
            ))}
          </div>

          {/* Image stack — hidden on mobile */}
          <div className="hidden lg:block w-[420px] flex-shrink-0">
            <HoverSliderImageWrap className="aspect-[4/3] rounded-2xl overflow-hidden">
              {SLIDES.map((slide, index) => (
                <HoverSliderImage
                  key={slide.id}
                  index={index}
                  imageUrl={slide.imageUrl}
                  src={slide.imageUrl}
                  alt={t(`items.${slide.titleKey}`)}
                  className="size-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              ))}
            </HoverSliderImageWrap>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16">
          <a
            href="https://wa.me/18097561847?text=Hola,%20me%20interesa%20saber%20más%20sobre%20sus%20servicios"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-brand-yellow text-brand-navy px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {t("cta")}
          </a>
        </div>
      </HoverSlider>
    </section>
  );
}
```

**Step 2: Verify** — hover over service names, image animates in with clip-path. Mobile shows list only.

**Step 3: Commit**

```bash
git add src/components/sections/services.tsx
git commit -m "feat: replace service cards with animated HoverSlider section"
```

---

### Task 9: Push to GitHub and deploy to Vercel

**Step 1: Check if remote origin exists**

```bash
git remote -v
```

If no remote: create a new GitHub repo via gh CLI:

```bash
gh repo create themonkeys-web --public --source=. --remote=origin --push
```

If remote exists, just push:

```bash
git push origin master
```

**Step 2: Check for Vercel CLI**

```bash
vercel --version
```

If not installed:
```bash
npm install -g vercel
```

**Step 3: Deploy to Vercel**

```bash
vercel --prod
```

Follow prompts:
- Link to existing project OR create new
- Framework: Next.js (auto-detected)
- Build command: `next build` (default)
- Output dir: `.next` (default)

**Step 4: Set domain alias to themonkeys**

After deploy, in Vercel dashboard or via CLI:
```bash
vercel alias set <deployment-url> themonkeys.vercel.app
```

Note: `themonkeys.vercel.app` can only be claimed if it's not already taken by another Vercel user. If it is, the alias will fail and you'll need to use a different subdomain or a custom domain.

**Step 5: Verify** — open the deployed URL, confirm all sections render correctly.

---

## Summary of files changed

| File | Action |
|------|--------|
| `package.json` | Add react-use-measure |
| `src/components/layout/navbar.tsx` | Bigger logo |
| `src/components/sections/hero.tsx` | Remove double logo, fix i18n, fix opacity |
| `src/messages/en.json` | Split hero title into two lines |
| `src/messages/es.json` | Split hero title into two lines |
| `src/components/ui/infinite-slider.tsx` | Create |
| `src/components/ui/progressive-blur.tsx` | Create |
| `src/components/ui/logo-cloud.tsx` | Create |
| `src/components/sections/client-logos.tsx` | Replace with LogoCloud |
| `src/components/ui/animated-slideshow.tsx` | Create |
| `src/components/sections/services.tsx` | Replace with HoverSlider |
