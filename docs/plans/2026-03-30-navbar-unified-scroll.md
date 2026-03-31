# Navbar Unified Scroll Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Unify the site navbar so `Home` opens in its current cinematic state, inner pages open in a lighter matching state, and all pages transition into the same compact sticky navbar on scroll.

**Architecture:** Reuse `src/components/layout/navbar-hero.tsx` as the single navbar implementation and replace the separate inner navbar usage with variant-driven behavior. The refactor removes `forceScrolled` as the primary inner-page strategy and instead derives the compact state from variant-specific thresholds.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind CSS v4, GSAP, next-intl, Playwright CLI

---

### Task 1: Define the shared navbar API

**Files:**
- Modify: `src/components/layout/navbar-hero.tsx`

**Step 1: Replace the old prop contract**

Change the component signature from:

```ts
export function NavbarHero({ locale, forceScrolled = false }: { locale: Locale; forceScrolled?: boolean })
```

to a shared API such as:

```ts
type NavbarVariant = "home" | "inner";

export function NavbarHero({
  locale,
  variant = "home",
  compactThreshold,
}: {
  locale: Locale;
  variant?: NavbarVariant;
  compactThreshold?: number;
})
```

**Step 2: Introduce variant-derived compact logic**

Create one source of truth for the compact state:

```ts
const defaultThreshold = variant === "home"
  ? window.innerHeight * 0.8
  : 96;

const effectiveThreshold = compactThreshold ?? defaultThreshold;
const isCompact = scrollY > effectiveThreshold;
```

**Step 3: Remove `forceScrolled` logic**

Delete the `forceScrolled` branch and use the new `variant` model instead.

**Step 4: Run a focused sanity build**

Run:

```bash
npm run build
```

Expected: build succeeds with updated navbar props.

### Task 2: Add the `inner-open` visual state

**Files:**
- Modify: `src/components/layout/navbar-hero.tsx`

**Step 1: Split navbar classes into three visual states**

Implement a class strategy equivalent to:

```ts
const navClass = isCompact
  ? "py-3 backdrop-blur-md bg-brand-black/80 border-b border-white/10 shadow-lg"
  : variant === "home"
    ? "py-6"
    : "py-4 bg-transparent";
```

**Step 2: Tune pill and spacing for `inner-open`**

Ensure the navbar pill and logo sit slightly closer to the top in `inner-open` than in `home-open`, without looking already compact.

**Step 3: Keep motion subtle**

Preserve the current GSAP entrance behavior and use CSS transitions for the open/compact morph.

**Step 4: Run another build**

Run:

```bash
npm run build
```

Expected: build succeeds after the visual state split.

### Task 3: Swap all pages to the unified navbar

**Files:**
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/app/[locale]/contacto/page.tsx`
- Modify: `src/app/[locale]/servicios/page.tsx`
- Modify: `src/app/[locale]/nosotros/page.tsx`
- Modify: `src/app/[locale]/portafolio/page.tsx`
- Modify: `src/app/[locale]/portafolio/[slug]/page.tsx`

**Step 1: Update `Home` usage**

Keep:

```tsx
<NavbarHero locale={locale} variant="home" />
```

**Step 2: Update inner pages**

Replace forced compact usage with:

```tsx
<NavbarHero locale={locale as Locale} variant="inner" />
```

**Step 3: Replace `NavbarInner` imports**

On portfolio pages, replace:

```tsx
import { NavbarInner } from "@/components/layout/navbar-inner";
```

with:

```tsx
import { NavbarHero } from "@/components/layout/navbar-hero";
```

and switch render calls to the unified component.

**Step 4: Build again**

Run:

```bash
npm run build
```

Expected: all routes compile with the unified navbar.

### Task 4: Remove the obsolete inner navbar

**Files:**
- Delete: `src/components/layout/navbar-inner.tsx`

**Step 1: Verify no remaining references**

Run:

```bash
rg -n "NavbarInner|navbar-inner" src
```

Expected: no remaining matches.

**Step 2: Remove the file**

Delete:

```text
src/components/layout/navbar-inner.tsx
```

**Step 3: Re-run build**

Run:

```bash
npm run build
```

Expected: build succeeds without the old component.

### Task 5: Real-browser verification

**Files:**
- No source changes required unless issues are found.

**Step 1: Verify `Home` open state**

Run:

```bash
npx playwright screenshot --browser chromium --channel msedge --viewport-size "1440,1200" --wait-for-timeout 1800 http://127.0.0.1:3000/es output/playwright/navbar-home-open-check.png
```

Expected: `Home` opens with the current cinematic navbar spacing.

**Step 2: Verify `Contacto` inner-open state**

Run:

```bash
npx playwright screenshot --browser chromium --channel msedge --viewport-size "1440,1200" --wait-for-timeout 1800 http://127.0.0.1:3000/es/contacto output/playwright/navbar-contacto-open-check.png
```

Expected: inner page starts in the lighter open state, not already compact.

**Step 3: Verify compact state after scroll**

Capture full-page screenshots for:

```bash
npx playwright screenshot --browser chromium --channel msedge --viewport-size "1440,1200" --full-page --wait-for-timeout 1800 http://127.0.0.1:3000/es/servicios output/playwright/navbar-servicios-scroll-check.png
npx playwright screenshot --browser chromium --channel msedge --viewport-size "1440,1200" --full-page --wait-for-timeout 1800 http://127.0.0.1:3000/es/nosotros output/playwright/navbar-nosotros-scroll-check.png
npx playwright screenshot --browser chromium --channel msedge --viewport-size "1440,1200" --full-page --wait-for-timeout 1800 http://127.0.0.1:3000/es/portafolio output/playwright/navbar-portafolio-scroll-check.png
```

Expected: each page converges to the same compact sticky navbar.

**Step 4: Run regression checks**

Run:

```bash
npm run test
npm run build
```

Expected: both commands pass.
