# Performance & Scalability Audit — TheMonkeys Web
**Branch:** `feat/bold-corporate-redesign`
**Date:** 2026-03-15
**Auditor:** Claude Code (claude-sonnet-4-6)
**Stack:** Next.js 16, React 19, Tailwind CSS v4, Framer Motion 12, next-intl 4, Sanity CMS, Vercel

---

## Executive Summary

The site is a statically-generated marketing page with good architectural bones: `generateStaticParams` for locale pre-rendering, `Promise.all` data fetching, passive scroll listeners, and a `prefers-reduced-motion` CSS reset. However, several patterns will meaningfully impact LCP, bundle size, and runtime frame rate at real device speeds. The most critical issues are the triple `priority` image overload, the missing ISR/cache tags on Sanity fetches, and the proliferation of scroll-driven `useScroll` hooks that run on the main thread.

**Finding count by severity:**

| Severity | Count |
|---|---|
| Critical | 2 |
| High | 5 |
| Medium | 7 |
| Low | 4 |

---

## 1. Image Optimization

### FINDING-01 — Triple `priority` Images Block LCP
**Severity:** Critical
**Estimated impact:** +200–400 ms LCP on 4G mobile
**Files:**
- `src/components/layout/navbar.tsx` lines 82–101 (two logo images, both `priority`)
- `src/components/sections/hero.tsx` line 172 (MK monogram, `priority`)
- `src/components/sections/portfolio.tsx` line 49 (featured project, `priority`)

**Problem:**
The browser can only parallelise a limited number of high-priority fetches. Declaring four images as `priority` simultaneously forces the browser to preload all four before it can paint, defeating the purpose of the flag. The `priority` attribute should be reserved for the single image that is the Largest Contentful Paint candidate. On desktop that is the hero panel logo; on mobile it is almost certainly the hero heading text, not any image at all.

Additionally, the navbar renders two logo variants (`logo-navy.png` and `logo-white.png`) simultaneously, using CSS (`dark:hidden` / `dark:block`) to toggle visibility. Both get `priority`. The hidden variant wastes a preload slot and its network bytes entirely.

**Recommendation:**
Remove `priority` from the navbar's dark-mode logo variant and from `FeaturedProject`. Keep `priority` only on the hero MK image.

```tsx
// navbar.tsx — only the visible (light) logo needs priority
<Image src="/logos/logo-navy.png" ... priority />
<Image src="/logos/logo-white.png" ... />   // no priority on hidden variant

// portfolio.tsx — featured project is below the fold on most viewports
<Image src={project.image} ... />           // drop priority, add loading="lazy"
```

---

### FINDING-02 — Sanity Images Fetched at Fixed 1200×900 for All Viewports
**Severity:** Medium
**Estimated impact:** +150–400 KB per portfolio image on mobile
**File:** `src/lib/site-data.ts` line 252

**Problem:**
`urlFor(project.mainImage)?.width(1200).height(900).fit("crop").url()` always generates a 1200 px wide Sanity CDN URL regardless of the device rendering it. `next/image` will generate its own responsive `srcset`, but the base URL it starts from is already the largest size. Sanity's Image URL builder should provide a reasonable maximum that matches the `sizes` attribute used in the components.

**Recommendation:**
Match the Sanity URL width to the largest breakpoint the image actually occupies. The featured project uses `sizes="(min-width: 1280px) 1200px, 100vw"`, so 1200 px is fine there. Secondary cards use `sizes="(min-width: 768px) 33vw, 100vw"` — their Sanity width should be capped at ~600.

```ts
// site-data.ts — secondary card images
urlFor(project.mainImage)?.width(600).height(450).fit("crop").url()
```

---

### FINDING-03 — PNG Logos Instead of SVG/WebP
**Severity:** Medium
**Estimated impact:** +40–80 KB per page load
**Files:** `src/components/layout/navbar.tsx`, `src/components/layout/mobile-drawer.tsx`, `src/components/sections/hero.tsx`

**Problem:**
All logo files referenced (`/logos/logo-navy.png`, `/logos/logo-white.png`, `/logos/mk-navy.png`, `/logos/mk-white.png`, `/logos/mk-main.png`) are `.png`. Logos are ideal candidates for SVG (infinitely scalable, typically 2–10 KB) or at minimum WebP. `next/image` does not auto-convert local static `.png` files to WebP unless the request comes through its optimisation pipeline — and that pipeline only activates when the `src` is a path string and the image is served through Next.js's image route, which it is. However, the source `.png` files will be larger than necessary because Next.js cannot compress them as aggressively as a purpose-built SVG.

**Recommendation:**
Convert logos to SVG and inline or import them as React components, eliminating the network request entirely and enabling CSS theming without dual-file variants.

---

## 2. Bundle Size

### FINDING-04 — `@sanity/vision` in Production Dependencies
**Severity:** High
**Estimated impact:** +~80 KB gzipped bundle
**File:** `package.json` line 15

**Problem:**
`@sanity/vision` is a Sanity Studio query explorer tool intended for development only. It is listed under `dependencies` rather than `devDependencies`. Even if it is never imported by application code, being in `dependencies` means it is included in the production node_modules tree and can affect bundle analysis tooling and deployment artifact size. More importantly, if it is accidentally imported anywhere, it will be included in the client bundle.

**Recommendation:**
Move `@sanity/vision` to `devDependencies`.

```json
"devDependencies": {
  "@sanity/vision": "^5.13.0",
  ...
}
```

---

### FINDING-05 — No Dynamic Imports for Below-Fold Heavy Sections
**Severity:** High
**Estimated impact:** −30–60 KB initial JS, −50–150 ms TTI
**File:** `src/app/[locale]/page.tsx` lines 1–13

**Problem:**
All six page sections are statically imported at the top of `page.tsx`. `Portfolio`, `ClientLogos`, `About`, and `Contact` are all below the fold. Since `Portfolio` brings in `ProjectModal` (Framer Motion `AnimatePresence`, focus trap logic) and `ClientLogos` brings in `InfiniteSlider` + `ProgressiveBlur` + `react-use-measure`, their JS is included in the initial chunk and parsed on page load even though the user may never scroll to them.

**Recommendation:**
Use `next/dynamic` with `ssr: false` for sections that are entirely below the fold and have no SSR-critical content.

```tsx
// page.tsx
import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";

const Portfolio   = dynamic(() => import("@/components/sections/portfolio").then(m => ({ default: m.Portfolio })));
const ClientLogos = dynamic(() => import("@/components/sections/client-logos").then(m => ({ default: m.ClientLogos })));
const About       = dynamic(() => import("@/components/sections/about").then(m => ({ default: m.About })));
const Contact     = dynamic(() => import("@/components/sections/contact").then(m => ({ default: m.Contact })));
```

---

### FINDING-06 — `lucide-react` Full Package Import Pattern
**Severity:** Low
**Estimated impact:** Minimal if tree-shaking is working; risk of +30 KB if it breaks
**Files:** `src/components/sections/services.tsx` lines 5–13, `src/components/sections/about.tsx` lines 4–6

**Problem:**
Icons are imported individually (`import { Camera, Search, ... } from "lucide-react"`), which is correct for tree-shaking. However, `lucide-react` v0.577 is a large package with hundreds of icons. If the bundler's tree-shaking fails for any reason (e.g., a CommonJS interop path), the full icon set can be included. The current usage is fine but worth monitoring with `@next/bundle-analyzer`.

---

## 3. Animation Performance

### FINDING-07 — Infinite CSS `animate` Loop on Hero Floating Elements
**Severity:** High
**Estimated impact:** Continuous compositor thread work; potential jank on low-end devices
**File:** `src/components/sections/hero.tsx` lines 161–191

**Problem:**
Three decorative elements run infinite Framer Motion JS animations:
1. The MK logo: `animate={{ y: [0, -8, 0], rotate: [-0.5, 0.5, -0.5] }}` repeating forever (duration 6 s)
2. A circle: `animate={{ scale: [1, 1.04, 1] }}` repeating forever (duration 5 s)
3. A rotated square: `animate={{ rotate: [0, 30, 0] }}` repeating forever (duration 8 s)

Framer Motion's `animate` API drives these via a JS `requestAnimationFrame` loop. While Framer offloads `transform`-only animations to the compositor in many cases, the `y` on the logo interacts with a `useTransform` scroll-linked `style={{ y: logoY }}` on the parent. Mixing JS-driven scroll transforms and JS-driven animation on the same element forces Framer to merge the values on every frame, preventing full compositor offload.

Additionally, these animations are purely decorative and the `prefers-reduced-motion` CSS reset in `globals.css` does not stop them — the CSS reset only affects CSS animations/transitions, not Framer Motion JS animations.

**Recommendation:**
Replace the infinite JS animations with CSS `@keyframes` animations, which the browser can offload to the compositor independently. Separately, add a `useReducedMotion` guard in `Hero` (as `InfiniteSlider` already does correctly).

```tsx
// hero.tsx — replace infinite JS animate with CSS class
<div className="animate-float">
  <Image ... />
</div>

// globals.css
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(-0.5deg); }
  50%       { transform: translateY(-8px) rotate(0.5deg); }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .animate-float { animation: none; }
}
```

---

### FINDING-08 — `ProgressiveBlur` Spawns 8 `motion.div` Elements with `backdropFilter`
**Severity:** High
**Estimated impact:** 8 separate GPU compositing layers per blur instance; ×2 for two instances = 16 layers
**File:** `src/components/ui/progressive-blur.tsx` lines 31–56
**Called from:** `src/components/ui/logo-cloud.tsx` lines 58–67 (two instances)

**Problem:**
`ProgressiveBlur` renders `blurLayers` (default 8) `motion.div` elements, each with a unique `backdropFilter: blur(Npx)` and mask gradient. `backdrop-filter` forces the browser to create a new compositing layer for each element. With two `ProgressiveBlur` instances on the page (left and right edges of the logo carousel), this creates 16 active compositor layers just for the blur effect.

Furthermore, each `motion.div` receives `{...props}` spread from the parent, which includes any `motion`-specific props the caller passes. In `logo-cloud.tsx` no motion props are passed, but the spread pattern is risky: if a parent ever passes `animate` or `transition`, all 8 layers will animate simultaneously.

`backdropFilter` on overlapping elements is one of the most GPU-intensive CSS properties and a common cause of dropped frames on mobile.

**Recommendation:**
Replace the multi-layer `backdropFilter` approach with a simple CSS gradient mask overlay using a single `div`. This achieves a visually similar fade-out effect without the GPU cost.

```tsx
// Replace ProgressiveBlur instances in logo-cloud.tsx with:
<div
  className="pointer-events-none absolute left-0 top-0 h-full w-[84px]"
  style={{
    background: "linear-gradient(to right, var(--color-surface-light), transparent)"
  }}
/>
```

---

### FINDING-09 — Multiple Simultaneous `useScroll` Hooks
**Severity:** Medium
**Estimated impact:** N×1 scroll listener overhead; layout thrash risk when many items are visible
**Files:**
- `src/components/sections/hero.tsx` lines 41–44 (1 hook)
- `src/components/sections/portfolio.tsx` lines 20–23 (1 hook per `FeaturedProject`, called inside the component)
- `src/components/sections/about.tsx` lines 18–21 (1 hook)

**Problem:**
Each `useScroll` call from Framer Motion attaches a scroll listener and uses `ResizeObserver`. With the hero, the about section, and every featured portfolio project each registering their own scroll listener, the page has at minimum 3 active scroll listeners simultaneously. Framer Motion batches these internally, but each `useTransform` derivative still needs to compute a new value on every scroll event.

`FeaturedProject` is particularly problematic: if the Sanity CMS returns multiple featured projects, each card creates its own `useScroll` + `useTransform` pair. At scale (10+ projects), this becomes a real performance risk.

**Recommendation:**
For the `FeaturedProject` parallax, consider using CSS `@property` + `animation-timeline: scroll()` (now baseline in modern browsers), which executes entirely off the main thread with no JS scroll listeners.

```css
/* CSS scroll-driven alternative */
@keyframes parallax-image {
  to { transform: translateY(8%); }
}
.parallax-image {
  animation: parallax-image linear both;
  animation-timeline: view();
  animation-range: entry 0% exit 100%;
}
```

---

## 4. Data Fetching & Caching

### FINDING-10 — No ISR Revalidation on Sanity Fetches
**Severity:** Critical
**Estimated impact:** Stale content in production; no way to update without full redeploy
**Files:** `src/lib/site-data.ts` (all three fetch functions), `src/app/[locale]/page.tsx`

**Problem:**
The three Sanity fetch functions (`getSiteSettings`, `getPortfolioProjects`, `getClientLogos`) call `client.fetch()` with no `next: { revalidate }` option. In Next.js App Router, `fetch` calls inside Server Components are cached indefinitely by default during static generation. When the page is generated at build time (via `generateStaticParams`), the data is baked in and never refreshed unless a new build is triggered.

For a marketing site managed through Sanity CMS, content editors expect changes to reflect without a code deploy. Without ISR or on-demand revalidation, a content update in Sanity will not appear on the live site.

`next-sanity`'s `createClient` supports passing `next` options to individual `fetch` calls:

**Recommendation:**
Add `revalidate` to each Sanity fetch, and export a `revalidate` constant from the page route. For a marketing site, 300–3600 seconds (5–60 minutes) is appropriate.

```ts
// site-data.ts
const data = await client.fetch<SanitySiteSettings | null>(
  siteSettingsQuery,
  {},
  { next: { revalidate: 3600, tags: ["site-settings"] } }
);

const projects = await client.fetch<SanityProject[]>(
  projectsQuery,
  {},
  { next: { revalidate: 3600, tags: ["projects"] } }
);

const logos = await client.fetch<SanityClientLogo[]>(
  clientLogosQuery,
  {},
  { next: { revalidate: 3600, tags: ["client-logos"] } }
);
```

```ts
// page.tsx — also export segment config
export const revalidate = 3600;
```

For on-demand revalidation (instant content updates from Sanity), add a Sanity webhook pointing to a Next.js Route Handler that calls `revalidateTag("projects")`.

---

### FINDING-11 — `getSiteSettings` Called Twice Per Request
**Severity:** Medium
**Estimated impact:** 1 extra Sanity API round-trip per page render
**File:** `src/app/[locale]/layout.tsx` lines 37, 93

**Problem:**
`generateMetadata` calls `getSiteSettings(appLocale)` at line 37, and `LocaleLayout` calls it again at line 93. In Next.js App Router, `generateMetadata` and the layout render are separate function calls and do not share a request context by default. Without React's `cache()` wrapper, `getSiteSettings` will make two separate Sanity HTTP requests per page render — one for metadata, one for the layout body.

**Recommendation:**
Wrap `getSiteSettings` (and the other fetch functions) with React's `cache()` to deduplicate within a single render pass.

```ts
// site-data.ts
import { cache } from "react";

export const getSiteSettings = cache(async (locale: AppLocale): Promise<SiteSettings> => {
  // ... existing implementation
});
```

React `cache()` deduplicates calls with identical arguments within the same render tree, reducing 2 Sanity calls to 1.

---

### FINDING-12 — GROQ Query Fetches `gallery` Field That Is Never Used
**Severity:** Low
**Estimated impact:** Slightly larger Sanity response payload
**File:** `src/sanity/lib/queries.ts` line 5

**Problem:**
The `projectsQuery` selects `gallery` in its projection, but `SanityProject` type in `site-data.ts` does not include a `gallery` field and the data normalisation function never reads it. This fetches unnecessary data from the Sanity CDN.

**Recommendation:**
Remove `gallery` from the GROQ projection.

```ts
export const projectsQuery = groq`
  *[_type == "project"] | order(order asc) {
    _id, title, slug, mainImage, description, services, featured
  }
`;
```

---

## 5. CSS Performance

### FINDING-13 — `scroll-behavior: smooth` Without `@media (prefers-reduced-motion)` Guard at the HTML Level
**Severity:** Low
**Estimated impact:** Vestibular motion sickness risk for ~35% of users with motion sensitivity
**File:** `src/app/globals.css` lines 25–26

**Problem:**
`html { scroll-behavior: smooth; }` is declared unconditionally. The `prefers-reduced-motion` block at line 116 does set `scroll-behavior: auto` inside the media query, which is correct. However, the unconditional declaration runs first for all users and sets the default. This is only partially mitigated if a user's OS reports reduced motion.

The current implementation is actually correct in its final result — the media query override will apply. This is a low-severity note to confirm the ordering is intentional and will work correctly.

---

### FINDING-14 — `backdrop-blur-xl` on Navbar on Every Scroll State Change
**Severity:** Medium
**Estimated impact:** Repaints on every scroll cross-threshold; GPU paint on cheap devices
**File:** `src/components/layout/navbar.tsx` lines 74–78

**Problem:**
The navbar toggles a Tailwind class that includes `backdrop-blur-xl` when `scrolled` changes. `backdrop-blur` forces GPU compositing. The state change fires at `window.scrollY > 20`, which means every user who scrolls past 20px triggers a React re-render that adds/removes the backdrop-blur class. While the scroll listener is passive and the threshold is small, the re-render itself causes a style recalculation.

The actual `setScrolled` trigger is fine for UX, but the `duration-500` transition on the `backdrop-filter` means the browser is transitioning a GPU-intensive property over 500ms.

**Recommendation:**
`backdrop-filter` transitions are not GPU-composited in the same way `transform` and `opacity` are. Reduce the transition duration for the blur specifically, or use a separate `opacity` transition on a pre-composed blurred background instead.

---

## 6. Font Loading

### FINDING-15 — Four Font Weight Variants Loaded for Space Grotesk
**Severity:** Low
**Estimated impact:** +10–25 KB of font data
**File:** `src/app/[locale]/layout.tsx` lines 15–19

**Problem:**
`Space_Grotesk` loads weights `["400", "500", "600", "700"]`. The `DM_Sans` body font loads `["400", "500", "700"]`. Loading 4 weight files for the display font is reasonable if all weights are used, but worth auditing: if `600` is never used (Tailwind's `font-semibold`), the file can be dropped.

The `next/font/google` implementation is correct — it uses `font-display: swap` by default, handles preloading, and self-hosts the font files. No FOUT risk here.

**Recommendation:**
Audit which font weights are actually used in the final CSS output. If `600` (`font-semibold`) is used in Tailwind classes, all four weights are needed. If only `500` (`font-medium`) covers the semibold cases, drop `"600"`.

---

## 7. Re-render Patterns

### FINDING-16 — Navbar Has 4 `useEffect` Hooks and 3 State Variables
**Severity:** Medium
**Estimated impact:** ~4 re-renders on page load; scroll triggers frequent re-renders
**File:** `src/components/layout/navbar.tsx` lines 25–69

**Problem:**
The `Navbar` component has:
- `scrolled` state — updated on every scroll event crossing the 20px threshold
- `mobileOpen` state — updated on hamburger click and resize
- `activeSection` state — updated by the `IntersectionObserver`
- 4 `useEffect` hooks

Each state update triggers a full re-render of the `Navbar` tree, including the two logo `<Image>` elements and all nav links. While this is a `"use client"` component and React 19 batches state updates, the scroll listener firing on every scroll event is a concern.

**Recommendation:**
The `setScrolled` handler already uses a passive listener, which is good. Consider wrapping the scroll callback with a `useCallback` (though React 19's compiler will handle this) and ensuring that `activeSection` updates are debounced at the `IntersectionObserver` level rather than per-scroll — the current `IntersectionObserver` setup is actually better than a scroll listener for active section tracking.

The main actionable here is to split `Navbar` into a `NavbarShell` (fixed position, renders controls) and a `NavbarBackground` (handles only the `scrolled` state and renders the backdrop) so scroll re-renders don't re-render the entire nav DOM.

---

## 8. Carousel / Animation Loops

### FINDING-17 — `InfiniteSlider` Children Duplicated in DOM
**Severity:** Medium
**Estimated impact:** 2× DOM nodes for all logo items; affects memory and layout time
**File:** `src/components/ui/infinite-slider.tsx` lines 94–95

**Problem:**
The loop effect renders `{children}` twice inside the scrolling container. This is the standard "cloned list" technique for CSS/JS scroll loops. With N logo images, the DOM contains 2N logo `<Image>` elements (and 2N `<img>` tags). For 10–15 logos this means 20–30 `<img>` elements, each with browser-managed lazy loading state.

The `react-use-measure` hook triggers a `ResizeObserver` on the container to measure width — this is efficient, but combined with the double-render means the measured element is twice as wide as visually expected.

This is an unavoidable tradeoff with JS-driven infinite loops. The implementation is already reasonable. The main risk is if the logo list grows very large (30+ items), at which point a pure CSS approach scales better.

**Recommendation:**
For the current logo count, the implementation is acceptable. For future scalability, a pure CSS `animation: scroll-x linear infinite` using `@keyframes` with `transform: translateX` on a single non-duplicated list is more memory-efficient and fully GPU-composited.

---

## 9. Lazy Loading Opportunities

### FINDING-18 — `ProjectModal` Always in the DOM
**Severity:** Low
**Estimated impact:** Minor — modal is conditionally rendered via `if (!project) return null`
**File:** `src/components/ui/project-modal.tsx` lines 81–83

**Problem:**
`ProjectModal` is always imported and its module is in the initial JS bundle. The early return `if (!project) return null` means the modal DOM is not rendered until needed, which is good. However, the `useEffect` for focus trapping and the `useLocale` call still run on mount regardless. This is not a critical issue.

**Recommendation:**
Combine with FINDING-05: when `Portfolio` is dynamically imported, `ProjectModal` will be in the same async chunk and only loaded when the user has scrolled to the portfolio section.

---

## 10. Vercel / Edge Optimization

### FINDING-19 — No `next.config.ts` Image Format or Quality Overrides
**Severity:** Medium
**Estimated impact:** Suboptimal Sanity CDN image format selection; potential +10–30% image size
**File:** `next.config.ts` lines 6–16

**Problem:**
The `next.config.ts` only configures `remotePatterns` for `cdn.sanity.io`. There are no `formats` or `qualities` overrides. By default, Next.js Image Optimization will serve WebP or AVIF based on Accept headers, which is correct. However, for the Sanity CDN images, Next.js acts as a proxy — it fetches the Sanity image and re-encodes it. This means the 1200×900 PNG from Sanity goes through Next.js's image pipeline twice (Sanity optimization + Next.js optimization).

**Recommendation:**
Use Sanity's native image URL builder to request WebP directly from the Sanity CDN (bypassing the Next.js optimization pipeline for external images). Add `?format=webp` or use the `.format('webp')` method on `urlFor`.

```ts
// site-data.ts
urlFor(project.mainImage)?.width(1200).height(900).fit("crop").format("webp").url()
```

This delivers WebP directly from Sanity's globally distributed CDN without Next.js proxy overhead.

---

### FINDING-20 — No `x-robots-tag` or Security Headers in Next Config
**Severity:** Low
**Estimated impact:** Not a performance issue; security/SEO hygiene
**File:** `next.config.ts`

**Problem:**
No custom HTTP headers are configured. Adding `X-Content-Type-Options`, `X-Frame-Options`, and a basic `Content-Security-Policy` is a best practice for Vercel deployments and does not impact performance.

This is out of scope for a performance audit but worth noting.

---

## Priority Action Matrix

| Priority | Finding | Effort | Impact |
|---|---|---|---|
| 1 | FINDING-10: Add ISR revalidation to Sanity fetches | Low (2–3 lines per function) | Critical — content updates without redeploy |
| 2 | FINDING-01: Fix triple `priority` images | Low (remove 3 `priority` flags) | Critical — direct LCP improvement |
| 3 | FINDING-11: Wrap fetch functions with React `cache()` | Low (import + wrap) | High — halves Sanity API calls |
| 4 | FINDING-08: Replace ProgressiveBlur with CSS gradient | Medium (refactor component) | High — removes 16 GPU layers |
| 5 | FINDING-05: Dynamic import below-fold sections | Low (4 import changes) | High — reduces initial JS parse |
| 6 | FINDING-07: CSS keyframes for hero infinite animations | Medium (CSS + remove motion code) | High — removes main-thread animation loop |
| 7 | FINDING-19: Sanity WebP format in URL builder | Low (add `.format("webp")`) | Medium — reduces image bytes |
| 8 | FINDING-04: Move `@sanity/vision` to devDeps | Trivial | High — removes dev tool from prod deps |
| 9 | FINDING-09: Reduce useScroll hooks | High (CSS scroll-timeline) | Medium — reduces scroll listener count |
| 10 | FINDING-02: Cap secondary card image sizes | Low (change width in urlFor) | Medium — reduces mobile payload |
