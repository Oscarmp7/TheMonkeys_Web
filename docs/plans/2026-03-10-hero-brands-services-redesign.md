# Design: Hero + Brands + Services Redesign
Date: 2026-03-10

## Overview
Full polish pass on TheMonkeys agency website: fix hero/navbar issues, upgrade Brands section with animated logo cloud, upgrade Services section with hover-animated slideshow, and verify responsive/UX across all breakpoints.

## 1. Hero + Navbar Fixes

### Problems
- Double logo: hero section had its own logo PLUS the fixed navbar logo
- Hero h1 hardcoded in Spanish instead of using `t("title")`
- Contact info footer uses opacity-50 — nearly invisible in light mode
- Navbar logo too small: `h-14` → hard to read at actual browser size
- Excessive whitespace between hero header and main content (justify-between + mb-12)
- Mobile panel (MK logo) min-h too tall at 350px

### Changes
**`src/components/layout/navbar.tsx`:**
- Logo: `h-14 → h-24` unscrolled, `h-10 → h-14` scrolled
- Image width: `180 → 300`, height: `60 → 100`
- Increase unscrolled padding: `py-4 → py-3` (logo is taller, let it breathe naturally)

**`src/components/sections/hero.tsx`:**
- Remove entire `<motion.header>` block (logo + "CREATIVE DIGITAL AGENCY" overheader) — navbar owns the logo
- Add "CREATIVE DIGITAL AGENCY" tagline as a small standalone text above h1 (no logo duplication)
- Fix h1: replace hardcoded Spanish string with `t("title")`
- Fix contact footer opacity: `text-brand-navy/50 → text-brand-navy/80` and `dark:text-white/40 → dark:text-white/60`
- Adjust layout padding to remove excessive gap after removing header
- Reduce mobile MK panel: `min-h-[350px] → min-h-[280px]`

## 2. Brands Section — Animated LogoCloud

### New Files
- `src/components/ui/infinite-slider.tsx` — infinite scroll animation component
- `src/components/ui/progressive-blur.tsx` — edge blur effect
- `src/components/ui/logo-cloud.tsx` — composed LogoCloud using above two

### Modified Files
- `src/components/sections/client-logos.tsx` — replace static grid with LogoCloud

### Dependencies
- Install: `react-use-measure`
- Note: `framer-motion v12` already installed; all `motion/react` imports adapted to `framer-motion`
- Bug fix: LogoCloud demo passes `speed/speedOnHover` but InfiniteSlider uses `duration/durationOnHover` — use correct prop names

### Logo data
Use provided demo logos (placeholder) + keep Jimetor. Client can swap logos later.

## 3. Services Section — HoverSlider Slideshow

### New Files
- `src/components/ui/animated-slideshow.tsx` — HoverSlider, TextStaggerHover, HoverSliderImage, etc.

### Modified Files
- `src/components/sections/services.tsx` — replace ServiceCard grid with HoverSlider

### Slides (matching actual services)
1. Inbound Marketing
2. Content Production
3. SEO Optimization
4. Web Development
5. Influencer Marketing
6. Digital Campaigns
7. Content Creation

Each slide gets a relevant Unsplash image. Colors adapted to brand: dark navy bg + yellow accent text.

## 4. Responsive / UX Verification
- Verify hero on mobile, tablet, desktop after changes
- Verify HoverSlider layout on mobile (falls back to list; image hides on small screens)
- Verify LogoCloud infinite slider on mobile
- Navbar logo size verified at all breakpoints
