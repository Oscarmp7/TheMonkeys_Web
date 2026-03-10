# Site Remediation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Bring the marketing site to a production-ready baseline across accessibility, responsive behavior, content integrity, SEO, and code quality.

**Architecture:** Keep the current App Router structure and major sections, but replace invalid interaction patterns, centralize site data flow, and reduce hardcoded placeholder content. Use lightweight regression tests for key UI semantics and rely on lint/build as final quality gates.

**Tech Stack:** Next.js 16, React 19, TypeScript, next-intl, next-sanity, framer-motion, Tailwind CSS v4, Node test runner, jsdom.

---

### Task 1: Add regression verification

**Files:**
- Create: `tests/setup-dom.ts`
- Create: `tests/accessibility.test.tsx`
- Modify: `package.json`
- Modify: `tsconfig.json`

**Step 1: Write failing tests**
- Add tests for skip link presence, main landmark uniqueness, dialog semantics, menu button state, and labeled contact form fields.

**Step 2: Run tests to verify they fail**
- Run: `node --test --import ./tests/setup-dom.ts ./tests/accessibility.test.tsx`

**Step 3: Add minimal test runner wiring**
- Add `test` script and test TypeScript config support.

**Step 4: Re-run tests**
- Confirm tests execute and fail for the expected missing semantics.

### Task 2: Fix global foundations

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Add accessibility and layout foundations**
- Add skip link, main content target, scroll offsets, reduced-motion handling, stable focus styles, and updated color tokens.

**Step 2: Remove invalid document structure**
- Ensure only one main landmark exists and global layout semantics are correct.

**Step 3: Run lint/build/tests**
- Confirm the foundation changes do not regress app structure.

### Task 3: Refactor interactive UI

**Files:**
- Modify: `src/components/layout/navbar.tsx`
- Modify: `src/components/layout/mobile-drawer.tsx`
- Modify: `src/components/ui/hamburger-button.tsx`
- Modify: `src/components/ui/theme-toggle.tsx`
- Modify: `src/components/ui/language-toggle.tsx`
- Modify: `src/components/sections/hero.tsx`
- Modify: `src/components/sections/services.tsx`
- Modify: `src/components/sections/portfolio.tsx`
- Modify: `src/components/ui/portfolio-card.tsx`
- Modify: `src/components/ui/project-modal.tsx`
- Modify: `src/components/ui/section-header.tsx`
- Modify: `src/components/ui/contact-form.tsx`
- Modify: `src/components/sections/contact.tsx`
- Modify: `src/components/ui/particle-button.tsx`
- Modify: `src/components/ui/whatsapp-button.tsx`

**Step 1: Replace invalid nested interaction markup**
- Remove anchor/button nesting and convert click-only cards to keyboard-accessible buttons.

**Step 2: Fix dialog and drawer accessibility**
- Add ARIA semantics, escape handling, focus behavior, and mobile-safe states.

**Step 3: Fix form accessibility**
- Replace placeholder-only controls with visible labels, hints, and announced states.

**Step 4: Improve responsive behavior**
- Adjust spacing, sizing, scrolling offsets, viewport units, and mobile layout behavior.

### Task 4: Connect real content and remove placeholders

**Files:**
- Modify: `src/components/sections/client-logos.tsx`
- Modify: `src/components/ui/logo-cloud.tsx`
- Modify: `src/components/layout/footer.tsx`
- Modify: `src/components/seo/json-ld.tsx`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/sanity/lib/queries.ts`
- Create: `src/lib/site-data.ts`

**Step 1: Create shared site fallbacks**
- Centralize contact, social, and brand data.

**Step 2: Wire CMS-backed content where available**
- Read project logos/site settings from Sanity with resilient fallbacks.

**Step 3: Remove fake brand proof**
- Replace unrelated placeholder client logos with branded or neutral fallback data.

### Task 5: Clean technical debt and verify

**Files:**
- Modify: `src/app/api/contact/route.ts`
- Modify: `src/i18n/request.ts`
- Modify: `src/sanity/lib/image.ts`
- Modify: `src/components/ui/floating-shapes.tsx`
- Modify: `README.md`
- Rename: `src/middleware.ts` to `src/proxy.ts`

**Step 1: Fix lint errors and unsafe typing**
- Remove `any`, unused variables, impure render logic, and deprecated patterns.

**Step 2: Harden contact route**
- Improve validation, escaping, and server-side error handling.

**Step 3: Update docs**
- Replace starter README with project-specific setup and runtime notes.

**Step 4: Run full verification**
- Run: `node --test --import ./tests/setup-dom.ts ./tests/accessibility.test.tsx`
- Run: `npm run lint`
- Run: `npm run build`
