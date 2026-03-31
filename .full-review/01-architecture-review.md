# Architectural Review -- TheMonkeys Web

**Date:** 2026-03-30
**Reviewer:** Claude Opus 4.6 (Software Architecture)
**Stack:** Next.js 15 App Router / React 19 / TypeScript 5.7 / Tailwind CSS v4 / GSAP 3.14 / next-intl 3.26 / Resend / Upstash Redis
**Deploy target:** Vercel

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Separation of Responsibilities](#2-separation-of-responsibilities)
3. [Folder Structure](#3-folder-structure)
4. [i18n Routing](#4-i18n-routing)
5. [Data Layer (src/lib)](#5-data-layer)
6. [Component Architecture](#6-component-architecture)
7. [API Route /api/contact](#7-api-route)
8. [SEO Architecture](#8-seo-architecture)
9. [GSAP Animation Architecture](#9-gsap-animation-architecture)
10. [Duplicate Detection: Footer Files](#10-duplicate-detection)
11. [next.config.ts](#11-nextconfigts)
12. [Cross-Page Layout Consistency](#12-cross-page-layout-consistency)
13. [Dead Code and Orphan Files](#13-dead-code-and-orphan-files)
14. [Consolidated Findings Table](#14-consolidated-findings-table)

---

## 1. Executive Summary

The codebase demonstrates a well-organized Next.js 15 App Router application with thoughtful architectural decisions around i18n, security headers, and animation accessibility. The single source of truth pattern for brand data in `src/lib/` is properly applied, and the separation between Server Components (pages) and Client Components (interactive sections) follows React 19 conventions correctly.

However, several architectural issues need attention before considering the site fully production-ready:

- **2 Critical** findings (missing `setRequestLocale` on the home page, missing `generateMetadata` on portfolio pages)
- **5 High** findings (hardcoded locale strings in footer, CSP missing analytics connect-src, missing `not-found.tsx`, inconsistent reduced-motion patterns, navbar component size)
- **7 Medium** findings
- **5 Low** findings

---

## 2. Separation of Responsibilities

### Server Components vs Client Components

**Assessment: Good, with minor issues**

The project correctly leverages the Server/Client Component boundary:

- **Pages** (`src/app/[locale]/*.tsx`) are all async Server Components that handle data fetching (`getTranslations`, `setRequestLocale`) and metadata generation. This is correct.
- **Interactive sections** (`src/components/sections/*.tsx`, `src/components/pages/*.tsx`) are properly marked `"use client"` since they use GSAP, `useState`, and browser APIs.
- **Layout components** like `Footer` (`src/components/layout/footer.tsx`) are Server Components that delegate rendering to the Client Component `EditorialFooter`. This is an appropriate pattern.
- **`JsonLd`** is a Server Component rendering `<script>` tags -- correct, no interactivity needed.

| Finding | Severity | Details |
|---------|----------|---------|
| F2.1 -- `page.tsx` (home) missing `setRequestLocale` | **Critical** | Every page using `next-intl` static rendering must call `setRequestLocale(locale)`. The home page at `src/app/[locale]/page.tsx` does not call it, though every other page does. This will cause static generation failures for the home page in production. |
| F2.2 -- `ContactoContent` receives `homeHref` as a string | **Low** | `contacto/page.tsx` passes `homeHref={`/${locale}`}` rather than using the `Link` component from `@/i18n/navigation`. This bypasses next-intl's localized pathname resolution and hardcodes locale prefix logic. The breadcrumb `<a>` tag inside `ContactoContent` is a plain anchor, not a next-intl `Link`. |

### Data Fetching

Data is purely static. No runtime fetching or caching patterns are needed. All content comes from `src/lib/*.ts` modules and `src/messages/*.json` files. This is architecturally sound for a brochure site.

---

## 3. Folder Structure

### Assessment: Well-organized, follows conventions

```
src/
  app/
    [locale]/           -- locale-scoped pages (correct App Router pattern)
      layout.tsx         -- locale layout with fonts, providers, analytics
      page.tsx           -- home
      error.tsx          -- error boundary
      nosotros/page.tsx
      servicios/page.tsx
      portafolio/page.tsx
      portafolio/[slug]/page.tsx
      contacto/page.tsx
    layout.tsx           -- root layout (passthrough -- correct)
    globals.css
    robots.ts
    sitemap.ts
    api/contact/route.ts
  components/
    layout/              -- navbar, footer, page-transition
    pages/               -- full page content (client components)
    sections/            -- home page sections
    seo/                 -- JSON-LD
    ui/                  -- reusable UI primitives
  hooks/                 -- custom hooks
  i18n/                  -- routing, navigation, request config
  lib/                   -- data constants, utilities, validation
  messages/              -- i18n JSON files
  middleware.ts
```

| Finding | Severity | Details |
|---------|----------|---------|
| F3.1 -- Missing `not-found.tsx` | **High** | There is no `not-found.tsx` at the `[locale]` or root level. When a user navigates to a non-existent route, Next.js will show its default 404 page with no branding. For a production site, a branded 404 is expected. |
| F3.2 -- `navbar-inner.tsx` referenced in scope but does not exist | **Low** | The git status shows `src/components/layout/navbar-inner.tsx` as untracked, but the file does not exist on disk (read returned an error). If it was deleted or is in progress, it should be cleaned up from git tracking or completed. |
| F3.3 -- `src/components/pages/` convention | **Medium** | The `pages/` directory inside `components/` contains full-page Client Components (`NosotrosContent`, `ServiciosContent`, `ContactoContent`). These are large monolithic components (622, 558, 849 lines respectively). While functional, they would benefit from being decomposed into smaller sub-section components, similar to how the home page uses `sections/`. |

---

## 4. i18n Routing

### Assessment: Solid implementation

The next-intl setup is correctly configured:

- `routing.ts` defines both locales (`es`, `en`), default locale (`es`), `localePrefix: "as-needed"` (hides `/es` prefix), and `localeDetection: false` (no auto-redirect).
- `navigation.ts` exports `Link`, `redirect`, `usePathname`, `useRouter` from `createNavigation(routing)`.
- `request.ts` provides `getRequestConfig` with dynamic import for messages.
- `middleware.ts` delegates entirely to `createMiddleware(routing)` with an appropriate matcher.
- `generateStaticParams` is present on every page, including the dynamic `[slug]` route.
- Localized pathnames are correctly defined (e.g., `/servicios` -> `/services`).

| Finding | Severity | Details |
|---------|----------|---------|
| F4.1 -- `localePrefix: "as-needed"` may affect SEO | **Medium** | With `as-needed`, the default locale (`es`) gets no prefix (just `/`), which is fine. However, the `sitemap.ts` correctly generates both `/` and `/en` variants. The concern is that Google may see `/` and `/es` as duplicate content if a user manually types `/es`. Consider adding a canonical URL in metadata or verifying that next-intl handles this redirect. |
| F4.2 -- Breadcrumb uses raw `<a>` instead of next-intl `Link` | **Medium** | In `contacto-content.tsx` line 735, the breadcrumb `<a href={homeHref}>` uses a plain HTML anchor instead of the next-intl `Link`. This bypasses client-side navigation and causes a full page reload. Same issue exists in `nosotros-content.tsx` (uses `NextLink` from `next/link` instead of the i18n-aware `Link`). |

---

## 5. Data Layer

### Assessment: Excellent single source of truth pattern

- `SITE` in `site.ts` -- single source for all brand constants (name, email, phone, social URLs, domain).
- `NAV_LINK_KEYS` / `NAV_ANCHORS` in `nav.ts` -- navigation structure.
- `PROJECTS` in `portfolio.ts` -- portfolio data.
- `SERVICE_KEYS` / `SERVICE_ICONS` in `services.ts` -- service definitions.
- `CLIENT_LOGOS` in `clients.ts` -- client logo list.
- `SOCIALS_CONFIG` in `socials.tsx` -- social link configuration.
- `validation.ts` -- shared validation logic for client and server.

All pages and components import from these modules rather than redeclaring values.

| Finding | Severity | Details |
|---------|----------|---------|
| F5.1 -- Footer hardcodes locale-dependent strings | **High** | `src/components/layout/footer.tsx` contains extensive hardcoded copy in both Spanish and English (lines 15-47) rather than using `useTranslations`. The `footer` namespace in the JSON messages only has `location` and `rights`, but the footer renders `kicker`, `headlineLine1`, `headlineLine2`, `description`, `navTitle`, `contactTitle`, `socialTitle`, `primaryAction`, `secondaryAction`, `portfolio`, `locationLabel`, `rights`, and `signature` -- all hardcoded. This violates the i18n architecture and makes the footer unmaintainable for future language additions. |
| F5.2 -- `NAV_ANCHORS` / `INNER_NAV_TARGETS` are deprecated but not removed | **Low** | `nav.ts` contains `@deprecated` exports that are no longer imported anywhere. `NavbarHero` defines its own `NAV_ROUTES` constant internally. The deprecated exports should be removed to avoid confusion. |
| F5.3 -- Service key inconsistency across files | **Medium** | `src/lib/services.ts` defines `SERVICE_KEYS` as `["inbound", "contenidos", "seo", "web", "influencers", "ads", "foto_video"]`, which are the canonical keys. But `services-section.tsx` defines its own `SERVICE_KEYS` as `["strategy", "content", "production", "ads", "seo", "web", "influencers"]`, and `servicios-content.tsx` uses `["strategy", "content", "campaigns", "inbound", "seo", "web", "influencers"]`, and `contacto-content.tsx` uses `["strategy", "content", "campaigns", "inbound", "seo", "web", "influencers", "full"]`. These are all different sets of keys that map to different i18n namespaces. While they serve different purposes (lib/services is for portfolio tagging, the others are for display), the naming overlap is confusing and fragile. |
| F5.4 -- `portfolio.ts` has bilingual data inline | **Medium** | `Project` has `titleEs`/`titleEn` and `descriptionEs`/`descriptionEn` fields. The portfolio detail page manually selects `locale === "es" ? project.titleEs : project.titleEn`. This could use `useTranslations` with a `portfolio_projects` namespace instead, which would scale better and align with the i18n pattern used everywhere else. |

---

## 6. Component Architecture

### Assessment: Good composition, some components are oversized

| Finding | Severity | Details |
|---------|----------|---------|
| F6.1 -- `NavbarHero` is 518 lines | **High** | This single component handles: scroll detection, compact state, mobile menu open/close with GSAP, focus trap, magic line hover effect, locale switching with View Transitions API, logo glitch animation, and responsive breakpoint detection. This violates Single Responsibility. Consider extracting: `useMagicLine()`, `useMobileMenu()`, `useCompactNavbar()`, `LocaleSwitcher`, and `MobileMenuOverlay` as separate components/hooks. |
| F6.2 -- `ContactoContent` is 849 lines with 5 inline sub-components | **Medium** | While the sub-components (`ContactCard`, `ContactInfoStack`, `QuickChannelGrid`, `SocialRow`, `ContactPageForm`, `FaqSection`) are defined in the same file, they should be extracted to separate files under `src/components/pages/contacto/` for maintainability. The FAQ section alone is a significant feature. |
| F6.3 -- Props drilling is minimal | **Low** (positive) | The locale prop passes through page -> navbar/footer, which is a shallow hierarchy. Translation keys use `useTranslations()` within each component. No excessive props drilling detected. |

---

## 7. API Route /api/contact

### Assessment: Well-designed security layers

The contact API implements a solid defense-in-depth architecture:

1. **Origin check** (production only) -- validates against `ALLOWED_ORIGINS`
2. **JSON parsing** with try/catch
3. **Honeypot** bot trap (hidden `website` field)
4. **IP rate limiting** via Upstash Redis (5 requests / 1 hour sliding window)
5. **Server-side validation** using shared `validateContactForm`
6. **Sanitization** (`sanitize` + `escapeHtml`) before building HTML email
7. **Email delivery** via Resend with `replyTo` set to the submitter

| Finding | Severity | Details |
|---------|----------|---------|
| F7.1 -- Rate limiter is skipped silently when Redis is unavailable | **Low** | When `UPSTASH_REDIS_REST_URL` or `UPSTASH_REDIS_REST_TOKEN` are not set, rate limiting is completely skipped. This is documented as "safe for local dev" in `CLAUDE.md`, which is fine. The risk is if someone deploys to production without setting these env vars -- the form becomes unlimited. A `console.warn` would be prudent. |
| F7.2 -- `ALLOWED_ORIGINS` includes `VERCEL_URL` preview deployments | **Low** (positive) | Good practice -- preview deployments can submit the form during testing. |
| F7.3 -- Email HTML is not template-based | **Low** | The HTML body is built via string interpolation. While sanitization is applied, using a template library or React email would be more maintainable and less error-prone. Not critical for a simple contact form. |
| F7.4 -- Missing CSRF protection | **Medium** | The API route does not validate a CSRF token. While the origin check provides some protection in production, a determined attacker can spoof the `Origin` header in server-to-server requests. For a contact form, this is acceptable risk, but a CSRF token or `SameSite` cookie strategy would be more robust. |

---

## 8. SEO Architecture

### Assessment: Strong foundation, with gaps

**Metadata API usage:**
- `generateMetadata` is present on: home layout, nosotros, servicios, contacto.
- `generateMetadata` is **missing** on: `portafolio/page.tsx` and `portafolio/[slug]/page.tsx`.

**JSON-LD:**
- Single `JsonLd` component renders `LocalBusiness` schema in `<head>`.
- Uses `SITE` constants correctly.
- Includes `sameAs` for social profiles.
- HTML-safe via `replace(/</g, "\\u003c")`.

**Sitemap:**
- Covers all static routes in both locales.
- Dynamically generates portfolio project routes.
- Uses `SITE.domain` as base URL.

**Robots:**
- Allows all user agents, references sitemap URL.

| Finding | Severity | Details |
|---------|----------|---------|
| F8.1 -- `portafolio/page.tsx` missing `generateMetadata` | **Critical** | The portfolio listing page and the portfolio detail page (`[slug]/page.tsx`) do not export `generateMetadata`. They will inherit the home page's title/description from the layout, meaning Google will index them with "The Monkeys - Agencia de Marketing..." instead of page-specific titles. For the detail page, this is especially problematic as each project should have unique title/description for SEO. |
| F8.2 -- No `alternateLinks` / `hreflang` in metadata | **Medium** | The `generateMetadata` functions do not include `alternates.languages` to tell search engines about the other locale version. This is important for international SEO to prevent duplicate content issues between `/servicios` and `/en/services`. |
| F8.3 -- `JsonLd` is not locale-aware | **Medium** | The JSON-LD schema always renders English service types ("SEO", "Web Development", etc.) regardless of locale. The `address.addressLocality` is always "Santiago de los Caballeros" (which is fine since it is a proper noun). Consider adding `@language` or producing locale-specific schemas. |
| F8.4 -- `sitemap.ts` uses `new Date()` for `lastModified` | **Low** | Every URL shows today's date as `lastModified`, which tells crawlers the content changes daily. For a brochure site with infrequent updates, this reduces the signal value of `lastModified`. Consider using build-time constants or actual content modification dates. |
| F8.5 -- Missing OpenGraph image | **Medium** | The `generateMetadata` in the locale layout sets `openGraph.title` and `openGraph.description` but no `openGraph.images`. When the site is shared on social media, there will be no preview image. |

---

## 9. GSAP Animation Architecture

### Assessment: Well-implemented, consistent patterns

**Positive patterns observed:**

- `useGSAP` from `@gsap/react` is used consistently for automatic cleanup.
- `gsap.registerPlugin()` is called at module level in each component that uses plugins.
- `usePrefersReducedMotion()` is an SSR-safe hook that returns `false` on server, `true/false` on client based on the user's OS setting.
- Every animation component checks `prefersReduced` and either skips animations or uses `gsap.set()` for immediate visibility.
- CSS-level `opacity: 0` on `[data-hero-reveal]` elements prevents FOUC, with `prefers-reduced-motion: reduce` override in `globals.css`.
- `ScrollTrigger` is used with `once: true` for reveal animations -- good for performance.
- The `scope` parameter is correctly passed to `useGSAP` for DOM scoping.

| Finding | Severity | Details |
|---------|----------|---------|
| F9.1 -- Inconsistent reduced-motion handling | **High** | Most components use the `usePrefersReducedMotion()` hook, but `StatsBar` and `ProjectCard` use inline `window.matchMedia("(prefers-reduced-motion: reduce)").matches` instead. This creates two different patterns: the hook is reactive (updates when the user changes their OS preference), while the inline check is a one-time snapshot. All components should use the hook for consistency. |
| F9.2 -- `gsap.registerPlugin(useGSAP)` is called in every file | **Low** | GSAP plugin registration is global and idempotent, so calling it in every file works but is redundant. A single registration in a shared module or layout would be cleaner. However, this has zero runtime cost since `registerPlugin` deduplicates, so it is not a real problem. |
| F9.3 -- Hero animations use `headlineRef.current!.children[0]` | **Medium** | The `Hero` component (line 35-36) uses non-null assertion and `.children[0]` to target child elements of the headline. This is fragile -- if the DOM structure changes, the animation will break silently. Using `data-*` attributes (already used elsewhere) or refs would be more robust. |
| F9.4 -- `PageTransition` wraps all page content with `opacity: 0` | **Low** | The `PageTransition` component starts with `style={{ opacity: 0 }}` and fades in. On slow JavaScript execution or SSR, content may be invisible for a moment. The `prefers-reduced-motion` CSS fallback in `globals.css` (line 57-59) mitigates this for reduced-motion users, but regular users on slow connections may see a flash of invisible content. |

---

## 10. Duplicate Detection: Footer Files

### Assessment: Not a true duplicate -- Composition pattern

- `src/components/layout/footer.tsx` -- **Wrapper component** (Server Component). This is the one imported by all pages. It receives `locale`, builds the copy object, and passes it to `EditorialFooter`.
- `src/components/ui/footer.tsx` -- **Presentational component** (Client Component). Exports `EditorialFooter`, which receives all content as props and renders the actual footer HTML.

**Verdict:** These are not duplicates. They follow a correct composition pattern where the layout-level footer handles data/locale logic and the UI-level footer is a reusable, framework-agnostic presentation component.

| Finding | Severity | Details |
|---------|----------|---------|
| F10.1 -- Naming could be clearer | **Low** | Having two files named `footer.tsx` in different directories can confuse developers at a glance. Consider renaming `src/components/ui/footer.tsx` to `editorial-footer.tsx` to match the exported component name `EditorialFooter`. |

---

## 11. next.config.ts

### Assessment: Strong security configuration

**Security headers are comprehensive:**
- `X-Frame-Options: DENY` -- prevents clickjacking
- `X-Content-Type-Options: nosniff` -- prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` -- appropriate
- `Strict-Transport-Security` with 2-year max-age -- correct
- `Permissions-Policy` -- disables camera, microphone, geolocation
- `Content-Security-Policy` -- properly configured for the site's needs

**Image optimization:**
- `formats: ["image/avif", "image/webp"]` -- correct modern format support

| Finding | Severity | Details |
|---------|----------|---------|
| F11.1 -- CSP `connect-src` missing analytics domains | **High** | The CSP allows `connect-src 'self' https://vitals.vercel-insights.com` but the site loads Google Analytics (`https://www.google-analytics.com`) and Facebook Pixel (`https://www.facebook.com`). These scripts make network requests that will be blocked by the CSP in browsers that enforce it. Additionally, `https://va.vercel-scripts.com` (used by newer `@vercel/analytics`) may be needed. |
| F11.2 -- CSP uses `'unsafe-eval'` in `script-src` | **Medium** | `'unsafe-eval'` is present in the script-src directive. This weakens the CSP significantly. Check if this is actually needed -- GSAP does not require `eval()`. If it was added for a third-party script, consider using nonce-based CSP instead. |
| F11.3 -- Missing `X-DNS-Prefetch-Control` header | **Low** | This header can improve performance for external resources. Not critical. |

---

## 12. Cross-Page Layout Consistency

### Assessment: Consistent pattern across all pages

All inner pages (nosotros, servicios, portafolio, contacto) follow the same structure:

```
<>
  <NavbarHero locale={locale} variant="inner" />
  <main>
    <PageContent />
  </main>
  <Footer locale={locale} />
</>
```

The home page uses `variant="home"` for the navbar and wraps the hero in a `sticky top-0 z-0` container with a scrolling content overlay.

| Finding | Severity | Details |
|---------|----------|---------|
| F12.1 -- Navbar and Footer are not in the layout | **Medium** | Every page manually renders `<NavbarHero>` and `<Footer>`. In Next.js App Router, shared UI like navigation and footer typically belong in `layout.tsx` to avoid re-rendering on navigation and to ensure consistency. The reason they are per-page here is likely the `variant` prop ("home" vs "inner"), but this could be determined from the pathname inside the layout itself. Moving these to the layout would reduce boilerplate and prevent accidental omission of navbar/footer on new pages. |
| F12.2 -- `<main>` is not in the layout | **Low** | Each page wraps its content in `<main>`. If the navbar/footer were in the layout, `<main>` could also live there, ensuring semantic HTML structure is consistent. |

---

## 13. Dead Code and Orphan Files

| Finding | Severity | Details |
|---------|----------|---------|
| F13.1 -- `navbar-inner.tsx` is untracked and does not exist | **Low** | Git status shows this file as untracked (`??`) but it does not exist on disk. This is likely a leftover from a previous iteration. Clean up with `git clean` or ensure it is gitignored. |
| F13.2 -- `eslint.config.mjs` is deleted per git status | **Low** | The ESLint config file shows as deleted (`D`). This means `npm run lint` may fail or use a default configuration. Either restore it or confirm that the project runs without it. |
| F13.3 -- Deprecated exports in `nav.ts` | **Low** | `INNER_NAV_KEYS`, `InnerNavKey`, `INNER_NAV_TARGETS` are marked `@deprecated` but still present. They are not imported anywhere in the codebase. Remove them. |
| F13.4 -- `NAV_ANCHORS` in `nav.ts` is never imported | **Low** | The `NAV_ANCHORS` record is defined but grep shows no imports. `NavbarHero` defines its own `NAV_ROUTES`. This is dead code. |

---

## 14. Consolidated Findings Table

| ID | Severity | Area | Summary |
|----|----------|------|---------|
| F2.1 | **Critical** | i18n / SSG | Home page missing `setRequestLocale(locale)` -- will break static generation |
| F8.1 | **Critical** | SEO | Portfolio pages missing `generateMetadata` -- will inherit wrong title/description |
| F5.1 | **High** | i18n | Footer hardcodes 30+ locale-dependent strings instead of using translations |
| F11.1 | **High** | Security | CSP `connect-src` missing GA and Facebook Pixel domains -- requests will be blocked |
| F3.1 | **High** | UX | Missing `not-found.tsx` -- no branded 404 page |
| F9.1 | **High** | Accessibility | Inconsistent reduced-motion handling (hook vs inline `matchMedia`) |
| F6.1 | **High** | Maintainability | `NavbarHero` at 518 lines violates SRP, needs decomposition |
| F12.1 | **Medium** | Architecture | Navbar/Footer repeated in every page instead of layout |
| F5.3 | **Medium** | Data | Service key naming inconsistency across 4 different files |
| F5.4 | **Medium** | i18n | Portfolio data has inline bilingual fields instead of using i18n |
| F8.2 | **Medium** | SEO | No `alternates.languages` / hreflang in metadata |
| F8.3 | **Medium** | SEO | JSON-LD is not locale-aware |
| F8.5 | **Medium** | SEO | Missing OpenGraph image for social media previews |
| F7.4 | **Medium** | Security | No CSRF protection on contact form |
| F11.2 | **Medium** | Security | CSP uses `'unsafe-eval'` in script-src |
| F3.3 | **Medium** | Maintainability | Page content components are 500-850 line monoliths |
| F4.1 | **Medium** | SEO | `localePrefix: "as-needed"` may need canonical URL strategy |
| F4.2 | **Medium** | i18n | Breadcrumbs use raw `<a>` or `NextLink` instead of i18n `Link` |
| F6.2 | **Medium** | Maintainability | `ContactoContent` has 5 inline sub-components in 849 lines |
| F9.3 | **Medium** | Robustness | Hero animation targets DOM children by index instead of data attributes |
| F2.2 | **Low** | i18n | `ContactoContent` receives `homeHref` as a raw string |
| F5.2 | **Low** | Code hygiene | Deprecated exports in `nav.ts` still present |
| F6.3 | **Low** | Architecture | Props drilling is minimal (positive finding) |
| F7.1 | **Low** | Ops | Rate limiter silently skipped when Redis unavailable |
| F7.3 | **Low** | Maintainability | Email HTML built via string interpolation |
| F8.4 | **Low** | SEO | Sitemap `lastModified` always returns `new Date()` |
| F9.2 | **Low** | Code hygiene | `gsap.registerPlugin` called redundantly in every file |
| F9.4 | **Low** | UX | `PageTransition` opacity:0 may cause invisible content flash |
| F10.1 | **Low** | Naming | Two files named `footer.tsx` in different directories |
| F11.3 | **Low** | Performance | Missing `X-DNS-Prefetch-Control` header |
| F13.1 | **Low** | Code hygiene | Orphan untracked `navbar-inner.tsx` |
| F13.2 | **Low** | Tooling | `eslint.config.mjs` deleted from git |
| F13.3 | **Low** | Code hygiene | Deprecated `INNER_NAV_*` exports not removed |
| F13.4 | **Low** | Code hygiene | `NAV_ANCHORS` is dead code |
| F3.2 | **Low** | Code hygiene | `navbar-inner.tsx` in scope but does not exist |

---

## Priority Action Items

### Immediate (before production launch)

1. **Add `setRequestLocale(locale)` to `src/app/[locale]/page.tsx`** (F2.1)
2. **Add `generateMetadata` to both portfolio pages** (F8.1) -- include project-specific title, description, and OG image
3. **Fix CSP `connect-src`** to include Google Analytics, Facebook Pixel, and Vercel Analytics domains (F11.1)

### Short-term (next sprint)

4. Move footer copy to i18n JSON files (F5.1)
5. Create a branded `not-found.tsx` (F3.1)
6. Add `alternates.languages` to all `generateMetadata` exports (F8.2)
7. Standardize reduced-motion handling to always use the hook (F9.1)
8. Add OpenGraph images to metadata (F8.5)

### Medium-term (backlog)

9. Decompose `NavbarHero` into smaller components/hooks (F6.1)
10. Extract `ContactoContent` sub-components to separate files (F6.2)
11. Move navbar/footer to `layout.tsx` with pathname-based variant detection (F12.1)
12. Clean up dead code in `nav.ts` (F5.2, F13.3, F13.4)
13. Consider removing `'unsafe-eval'` from CSP (F11.2)
14. Add CSRF token or double-submit cookie to contact form (F7.4)
