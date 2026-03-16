# Code Quality Review — feat/bold-corporate-redesign
**Date:** 2026-03-15
**Reviewer:** Claude Code (Sonnet 4.6)
**Branch:** `feat/bold-corporate-redesign` vs `main`
**Scope:** All files changed on the branch (37 source files reviewed)

---

## Summary

The branch represents a substantial visual redesign delivered with a good overall architecture. The component structure is clean, accessibility is well considered (focus traps, ARIA live regions, skip links, reduced-motion support), and TypeScript coverage is solid. The most significant issues cluster around three themes: duplicated utility logic that belongs in shared modules, a production-blocking sender address in the email route, and a minor but visible UX bug in the contact form.

---

## Critical Issues

### C-1 — Resend sender address is a sandbox placeholder
**File:** `src/app/api/contact/route.ts` — line 101

```ts
from: "The Monkeys Web <onboarding@resend.dev>",
```

`onboarding@resend.dev` is Resend's test sender. Emails sent from this address in production will be delivered from Resend's domain rather than the brand's domain, breaking trust signals and reply-to flows. Once the Resend domain is verified, this line must point to a sender on `themonkeys.do` (e.g., `noreply@themonkeys.do` or `hola@themonkeys.do`).

**Fix:**
```ts
from: "The Monkeys <noreply@themonkeys.do>",
```

---

### C-2 — No rate limiting on the public contact API route
**File:** `src/app/api/contact/route.ts`

The POST endpoint has honeypot and field validation, but no request-rate limiting. A single IP can submit hundreds of leads per minute, incurring Resend costs and filling the mailbox with spam. `vercel.json` also carries no header-level protections.

**Recommendation:** Add an upstash/redis rate limiter or use Vercel's built-in edge rate limiting. A minimal approach with `@upstash/ratelimit`:

```ts
// At the top of the handler, before parsing the body
const identifier = request.headers.get("x-forwarded-for") ?? "anon";
const { success } = await ratelimit.limit(identifier);
if (!success) {
  return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
}
```

---

## High Severity Issues

### H-1 — `getFocusableElements` is copy-pasted in two files
**Files:**
- `src/components/layout/mobile-drawer.tsx` — lines 24–33
- `src/components/ui/project-modal.tsx` — lines 16–26

The function is identical in both locations, including the exact selector string. This is a textbook DRY violation. If the selector needs updating (e.g., to add `[role="button"]`) only one file gets the change.

**Fix:** Extract to a shared utility:

```ts
// src/lib/focus-utils.ts
export function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  );
}
```

Then import in both components.

---

### H-2 — Navigation link definitions are triplicated
**Files:**
- `src/components/layout/navbar.tsx` — lines 12–17
- `src/components/layout/mobile-drawer.tsx` — lines 17–22
- `src/components/layout/footer.tsx` — lines 28–33 (slightly different shape)

Three separate arrays define the same four section anchors. Adding a new section requires three edits. The navbar and drawer shapes are identical (`{ key, href }`); the footer uses a different shape (`{ href, label }`) because it must compute labels inside the component via `navT()`.

**Fix:** Create a shared constant for the raw navigation data:

```ts
// src/lib/nav-config.ts
export const NAV_LINK_KEYS = [
  { key: "services", href: "#services" },
  { key: "portfolio", href: "#portfolio" },
  { key: "about", href: "#about" },
  { key: "contact", href: "#contact" },
] as const;
```

The footer builds its `{ href, label }` pairs at runtime from the same source, which keeps both shapes consistent.

---

### H-3 — Service keys are duplicated across two modules
**Files:**
- `src/components/sections/services.tsx` — lines 26–34 (`serviceKeys`)
- `src/components/ui/contact-form.tsx` — lines 7–15 (`SERVICE_KEYS`)

Both arrays contain the same seven keys in the same order. `site-data.ts` already maintains an authoritative `SERVICE_LABELS` map keyed by the same strings. The canonical list should live in one place:

```ts
// src/lib/site-data.ts  (or a dedicated services-config.ts)
export const SERVICE_KEYS = Object.keys(SERVICE_LABELS) as (keyof typeof SERVICE_LABELS)[];
```

Then both files import `SERVICE_KEYS` from the shared module.

---

### H-4 — Email validation logic is duplicated between client and server
**Files:**
- `src/components/ui/contact-form.tsx` — line 32 (`emailPattern`)
- `src/app/api/contact/route.ts` — lines 26–28 (`isValidEmail`)

Both use the same regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`. If the acceptable pattern changes (e.g., to allow `+` aliases), one location may be missed.

**Fix:** Place the shared regex in a utility file:

```ts
// src/lib/validation.ts
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value);
}
```

The contact form's `validateContactFormValues` and the API route both import from `@/lib/validation`.

---

### H-5 — Potential theme hydration flash in Hero
**File:** `src/components/sections/hero.tsx` — lines 37–57

`resolvedTheme` from `next-themes` is `undefined` during the server render and the first client render before hydration. Variables like `panelBg`, `mkSrc`, `dotColor` derive directly from `isDark` with no guard, which means the server-rendered HTML will always use the light-theme values, then swap after hydration, producing a visible layout shift or color flash for dark-mode users.

`next-themes` documents this exact issue and recommends checking `resolvedTheme !== undefined` before branching:

```ts
const isDark = resolvedTheme === "dark"; // undefined === "dark" is false — shows light first

// Safer pattern:
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
const isDark = mounted && resolvedTheme === "dark";
```

The `ThemeToggle` component has the same issue but its visual impact is lower (icon swap only).

---

### H-6 — `PortfolioCard` component exists but is not used
**File:** `src/components/ui/portfolio-card.tsx`

The component was created (or kept) on this branch but is imported nowhere — confirmed by a project-wide search. The `Portfolio` section uses its own inline `FeaturedProject` and `SecondaryCard` components instead. Dead code increases the maintenance surface and can mislead future contributors.

**Fix:** Delete `src/components/ui/portfolio-card.tsx`, or replace the inline components in `portfolio.tsx` with it if they are meant to converge.

---

## Medium Severity Issues

### M-1 — Body scroll-lock is managed in two uncoordinated places
**Files:**
- `src/components/layout/navbar.tsx` — lines 67–69
- `src/components/ui/project-modal.tsx` — lines 40 and 75

`navbar.tsx` manages `document.body.style.overflow` for the mobile drawer. `project-modal.tsx` manages it independently for the modal. If both are active at the same time (unlikely but possible on small screens), the modal's cleanup on close will unconditionally set `overflow = ""` even if the drawer is still open.

**Fix:** Extract a shared `useBodyScrollLock(isLocked: boolean)` hook that uses a ref-count or a stack approach so multiple callers co-operate correctly.

---

### M-2 — Company hint text is rendered twice for screen readers
**File:** `src/components/ui/contact-form.tsx` — lines 243–265

The `company_hint` translation string is used as the visible `<span>` inside the `<label>` (line 246) AND as the content of a separate hint `<p>` element that is linked via `aria-describedby` (line 263). Screen readers will read the hint twice: once as part of the label, and once when announcing the `aria-describedby` description.

**Fix:** Remove the inline `<span>` from inside the label, or remove the `aria-describedby` link. The hint paragraph is the correct accessible pattern — keep that and remove the `<span>` in the label.

---

### M-3 — `SanityProject.mainImage` and `SanityClientLogo.logo` typed as `unknown`
**File:** `src/lib/site-data.ts` — lines 20 and 29

These fields are typed as `unknown` and then passed directly to `urlFor()` which accepts `SanityImageSource`. This works at runtime but forfeits TypeScript's ability to catch misuse. The `@sanity/image-url` package exports `SanityImageSource`, which should be the declared type.

**Fix:**
```ts
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

type SanityProject = {
  // ...
  mainImage?: SanityImageSource | null;
};

type SanityClientLogo = {
  // ...
  logo?: SanityImageSource | null;
};
```

---

### M-4 — `ProgressiveBlur` uses array index as React key
**File:** `src/components/ui/progressive-blur.tsx` — line 31

```tsx
{Array.from({ length: layers }).map((_, index) => {
  // ...
  return <motion.div key={index} ...
```

Using array index as `key` is harmless when the list is static (fixed `blurLayers`), but React documentation discourages it for lists that could be reordered or have dynamic length. More importantly, passing all `...props` from `HTMLMotionProps<'div'>` (line 53) into every child layer is unintentional — the spread includes `className`, `style`, and event handlers, which should only apply to the container.

---

### M-5 — Sanity API version is over a year old
**File:** `src/sanity/lib/client.ts` — line 12

```ts
apiVersion: "2024-01-01",
```

Sanity's Content Lake evolves its API; using an outdated version may miss query optimizations or behavioral fixes. The version should be updated periodically and should ideally be extracted to a constant in a config file so it appears in exactly one place.

---

### M-6 — `locale` ternary repeated ad-hoc in components instead of using `useTranslations`
**Files:**
- `src/components/sections/hero.tsx` — line 60: `locale === "es" ? "Web" : "Website"`
- `src/components/ui/portfolio-card.tsx` — line 30: `locale === "es" ? "Proyecto" : "Case Study"`
- `src/components/ui/project-modal.tsx` — line 32: `locale === "es" ? "Cerrar diálogo" : "Close dialog"`

These strings bypass the i18n system entirely. They will not appear in translation files, cannot be audited by translators, and would break if a third locale is added. All three strings belong in the relevant i18n JSON files and should be accessed via `useTranslations`.

---

### M-7 — `InfiniteSlider` renders children twice without semantic wrapper
**File:** `src/components/ui/infinite-slider.tsx` — lines 94–95

The slider renders `{children}{children}` to create the looping effect. The duplicated elements share the same keys (delegated to the child), which will trigger React key-collision warnings in development if any child has an explicit key prop. The `LogoCloud` passes keyed `<LogoItem>` components directly.

**Recommendation:** Wrap each copy in a `<React.Fragment key="a">` and `<React.Fragment key="b">` or pass children through a cloning step that prefixes the key.

---

## Low Severity / Suggestions

### L-1 — `locale` fallback pattern duplicated in layout and page
**Files:**
- `src/app/[locale]/layout.tsx` — line 35: `locale === "en" ? "en" : "es"`
- `src/app/[locale]/page.tsx` — line 25: `locale === "en" ? "en" : "es"`

The same ternary to coerce a raw `string` to `AppLocale` is copied verbatim. Extract once:

```ts
// src/lib/locale-utils.ts
import type { AppLocale } from "./site-data";
export function toAppLocale(locale: string): AppLocale {
  return locale === "en" ? "en" : "es";
}
```

---

### L-2 — Inconsistent quote style in `infinite-slider.tsx` and `progressive-blur.tsx`
**Files:** `src/components/ui/infinite-slider.tsx`, `src/components/ui/progressive-blur.tsx`

Both files use single quotes for imports and JSX attribute strings, while the rest of the codebase consistently uses double quotes. This suggests these files were sourced from a third-party library and pasted in without reformatting. A Prettier pass would normalize them.

---

### L-3 — Magic numbers for animation timings are not documented
**Files:** `src/components/sections/hero.tsx` (lines 46–48), `src/components/ui/infinite-slider.tsx` (line 47)

Numeric literals like `"18%"`, `"28%"`, `"-15%"`, and `currentDuration * Math.abs(...)` appear without comments explaining their intent. While this is common in animation code, brief inline comments would help the next developer tune values without trial and error.

---

### L-4 — `HamburgerButton` mixes Tailwind duration with inline style transition
**File:** `src/components/ui/hamburger-button.tsx` — lines 21–27

The button applies a full-rotation via inline `style={{ transition: "transform 0.4s ease" }}` while the individual bars use `transition-all duration-400` from Tailwind. The outer rotation and inner bar transforms are controlled by different mechanisms, making timing adjustments require two edits. Consolidating to one approach (preferably Tailwind) would be cleaner. Note also that `duration-400` is not a default Tailwind duration step (`duration-300` and `duration-500` exist); if it works it is via a custom config or a JIT arbitrary value.

---

### L-5 — `getWhatsAppHref` uses non-breaking `toPhoneDigits` but message text contains untranslated accented characters
**File:** `src/lib/site-data.ts` — lines 201–204

The pre-filled WhatsApp message is hardcoded in the data layer with inline Spanish/English strings rather than coming from the i18n message files. This is a minor consistency issue — if the message copy needs adjustment a developer must find and edit it in `site-data.ts` rather than the translation JSON.

---

### L-6 — `globals.css` uses `-webkit-font-smoothing` as a CSS property AND an `@apply` directive redundantly
**File:** `src/app/globals.css` — lines 38–40

`antialiased` via `@apply` already sets `-webkit-font-smoothing: antialiased` and `text-rendering: optimizeLegibility`. The subsequent manual declarations are no-ops but add noise.

---

## What Was Done Well

- **Accessibility:** Focus traps in the mobile drawer and project modal are correctly implemented with keyboard navigation (Tab, Shift+Tab, Escape) and focus restoration on close. The `aria-live` region in the contact form, skip link, and `MotionConfig reducedMotion="user"` show deliberate a11y thinking.
- **Fallback resilience:** Every Sanity fetch in `site-data.ts` has a try/catch that returns typed fallback data, making the site deployable without CMS credentials.
- **Honeypot spam protection:** The hidden `website` field in `contact-form.tsx` + silent success in the API route is a clean, unobtrusive bot deterrent.
- **Sanity null safety:** The `client = hasSanityConfig ? ... : null` pattern and `urlFor` null guard make the CMS integration safe to operate with or without environment variables.
- **Scroll-aware navbar:** The `IntersectionObserver`-based active section detection with `{ passive: true }` scroll listeners and a resize handler closing the drawer are all correct and performant patterns.
- **Theme provider:** `MotionConfig reducedMotion="user"` wrapping the entire app from a single provider is the right level of abstraction.
- **API route input validation:** Length caps, email regex, required field checks, and HTML escaping before template insertion are all present and correct.

---

## Issue Summary Table

| ID  | Severity | File(s) | Topic |
|-----|----------|---------|-------|
| C-1 | Critical | `api/contact/route.ts` | Sandbox sender address in production |
| C-2 | Critical | `api/contact/route.ts` | No rate limiting on public API |
| H-1 | High | `mobile-drawer.tsx`, `project-modal.tsx` | Duplicated `getFocusableElements` |
| H-2 | High | `navbar.tsx`, `mobile-drawer.tsx`, `footer.tsx` | Triplicated nav link arrays |
| H-3 | High | `services.tsx`, `contact-form.tsx` | Duplicated service key arrays |
| H-4 | High | `contact-form.tsx`, `route.ts` | Duplicated email validation regex |
| H-5 | High | `hero.tsx` | Theme hydration flash |
| H-6 | High | `portfolio-card.tsx` | Dead component, not imported anywhere |
| M-1 | Medium | `navbar.tsx`, `project-modal.tsx` | Uncoordinated body scroll lock |
| M-2 | Medium | `contact-form.tsx` | Company hint read twice by screen readers |
| M-3 | Medium | `site-data.ts` | `unknown` types for Sanity image fields |
| M-4 | Medium | `progressive-blur.tsx` | Index keys + unintended prop spread |
| M-5 | Medium | `sanity/lib/client.ts` | Outdated Sanity API version |
| M-6 | Medium | `hero.tsx`, `portfolio-card.tsx`, `project-modal.tsx` | Locale strings bypass i18n |
| M-7 | Medium | `infinite-slider.tsx` | Duplicate children may cause key collisions |
| L-1 | Low | `layout.tsx`, `page.tsx` | Duplicated locale coercion ternary |
| L-2 | Low | `infinite-slider.tsx`, `progressive-blur.tsx` | Inconsistent quote style |
| L-3 | Low | `hero.tsx`, `infinite-slider.tsx` | Undocumented magic animation numbers |
| L-4 | Low | `hamburger-button.tsx` | Mixed transition mechanisms |
| L-5 | Low | `site-data.ts` | WhatsApp pre-fill message not in i18n |
| L-6 | Low | `globals.css` | Redundant font-smoothing declarations |
