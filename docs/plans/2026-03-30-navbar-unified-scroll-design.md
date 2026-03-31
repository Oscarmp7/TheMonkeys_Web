# Navbar Unified Scroll Design

## Context

The site currently has two navbar behaviors:

- `Home` uses [`src/components/layout/navbar-hero.tsx`](C:/Users/omato/OneDrive/Desktop/Dev/TheMonkeys_Web/src/components/layout/navbar-hero.tsx) with a large floating state that compacts after scroll.
- Inner pages use either [`src/components/layout/navbar-hero.tsx`](C:/Users/omato/OneDrive/Desktop/Dev/TheMonkeys_Web/src/components/layout/navbar-hero.tsx) with `forceScrolled` or [`src/components/layout/navbar-inner.tsx`](C:/Users/omato/OneDrive/Desktop/Dev/TheMonkeys_Web/src/components/layout/navbar-inner.tsx), which starts compact immediately.

That creates an inconsistent navigation model: `Home` feels branded and cinematic, while inner pages feel utilitarian from first paint.

## Goal

Use one navbar system across the site:

- `Home` keeps its current open hero behavior on first paint.
- Inner pages use the same visual language, but in a reduced `hero-lite` initial state.
- All pages compact into the same sticky navbar once the user scrolls.

## Approved Direction

### 1. One Navbar System

Keep [`src/components/layout/navbar-hero.tsx`](C:/Users/omato/OneDrive/Desktop/Dev/TheMonkeys_Web/src/components/layout/navbar-hero.tsx) as the source of truth and expand it into a configurable shared navbar.

Do not maintain separate visual systems in `navbar-hero` and `navbar-inner`.

Recommended prop model:

- `variant: "home" | "inner"`
- `compactThreshold?: number`

`variant` controls the initial visual density.
`compactThreshold` controls when the navbar becomes sticky/compact.

### 2. Visual States

The navbar will have three real states:

- `home-open`
  - Current `Home` behavior.
  - More vertical padding and more floating separation from the top.
  - No hard background fill on first paint.

- `inner-open`
  - Same language as `home-open`, but reduced.
  - Slightly tighter top spacing and smaller perceived empty area.
  - Still transparent or near-transparent so it feels related to `Home`.

- `compact-sticky`
  - Shared across `Home`, `Servicios`, `Nosotros`, `Contacto`, and `Portafolio`.
  - Blur, dark backing, subtle border, tighter vertical padding, persistent CTA.

### 3. Scroll Behavior

`Home` and inner pages should not compact at the same moment.

Recommended thresholds:

- `Home`: compact after roughly `0.75-0.85` viewport height, close to the current behavior.
- Inner pages: compact after roughly `80-120px`.

This preserves the cinematic opening on `Home` while giving internal pages faster utility.

### 4. Motion Behavior

Navbar state changes should feel structural, not flashy.

Approved motion direction:

- open -> compact:
  - reduce top/bottom padding
  - add blur/backdrop and border
  - slightly tighten pill position and overall vertical footprint
  - duration around `220-300ms`

- compact -> open:
  - reverse the same properties
  - slightly softer easing on expansion

Do not add decorative gimmicks beyond what already exists.

### 5. Page Coverage

The unified navbar must be used in:

- [`src/app/[locale]/page.tsx`](C:/Users/omato/OneDrive/Desktop/Dev/TheMonkeys_Web/src/app/[locale]/page.tsx)
- [`src/app/[locale]/contacto/page.tsx`](C:/Users/omato/OneDrive/Desktop/Dev/TheMonkeys_Web/src/app/[locale]/contacto/page.tsx)
- [`src/app/[locale]/servicios/page.tsx`](C:/Users/omato/OneDrive/Desktop/Dev/TheMonkeys_Web/src/app/[locale]/servicios/page.tsx)
- [`src/app/[locale]/nosotros/page.tsx`](C:/Users/omato/OneDrive/Desktop/Dev/TheMonkeys_Web/src/app/[locale]/nosotros/page.tsx)
- [`src/app/[locale]/portafolio/page.tsx`](C:/Users/omato/OneDrive/Desktop/Dev/TheMonkeys_Web/src/app/[locale]/portafolio/page.tsx)
- [`src/app/[locale]/portafolio/[slug]/page.tsx`](C:/Users/omato/OneDrive/Desktop/Dev/TheMonkeys_Web/src/app/[locale]/portafolio/[slug]/page.tsx)

### 6. Deletions / Simplification

If `navbar-hero` fully covers the inner-page use case after refactor, [`src/components/layout/navbar-inner.tsx`](C:/Users/omato/OneDrive/Desktop/Dev/TheMonkeys_Web/src/components/layout/navbar-inner.tsx) should be removed.

That is the cleanest outcome because:

- behavior is centralized
- the mobile menu stays consistent
- the language switcher stays consistent
- future navbar changes only happen in one file

### 7. Risks

Primary risk: making inner pages feel too empty by copying the `Home` opening state too literally.

Mitigation:

- use `inner-open` instead of full `home-open`
- keep tighter vertical padding and earlier compact threshold on inner pages

Secondary risk: scroll threshold flicker near the breakpoint.

Mitigation:

- use one derived `isCompact` state per variant
- avoid mixing `forceScrolled` with scroll-derived state after the refactor

## Acceptance Criteria

- `Home` still opens with its existing cinematic top composition.
- `Servicios`, `Nosotros`, `Contacto`, and `Portafolio` open with a lighter version of the same navbar, not the already-compacted one.
- After scroll, all pages show the same compact sticky navbar.
- Desktop and mobile menus remain functional.
- Language switcher remains functional.
- `npm run build` passes.
- Visual verification is done in a real browser with Playwright on `Home`, `Contacto`, `Servicios`, `Nosotros`, and `Portafolio`.
