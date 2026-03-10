# The Monkeys - Home UX Refinement Design

**Date**: 2026-03-10

## Direction

Keep the diagonal hero concept and push it into a more premium, corporate-modern execution aligned with the client brief:

- Light mode must feel intentional, not washed out.
- Dark and light themes must keep the same authority.
- Navigation should feel like a floating premium control surface.
- Services, portfolio, and client proof should look curated rather than template-based.

## Key Moves

1. Rebuild the navbar as a floating tubelight-style navigation with:
   - centered section nav
   - isolated logo capsule
   - separate controls capsule for language, theme, and CTA

2. Recompose the hero for ultrawide screens by:
   - constraining the total canvas width
   - keeping the right panel dark in both themes
   - using yellow `MK` artwork in light mode and white `MK` in dark mode
   - adding a supporting featured-case card inside the visual panel

3. Redesign services as a staggered editorial grid:
   - stronger cards
   - asymmetrical spans on desktop
   - better hover hierarchy
   - still respecting the brief requirement of icon + service name

4. Elevate project and client proof:
   - stronger featured project layout for the current single-case dataset
   - more intentional brand/logo presentation
   - a section that still feels credible with minimal real client-logo inventory

## Constraints

- No fake client logos.
- Preserve i18n, reduced-motion behavior, and current data flow.
- Keep the site compatible with current Next.js, Tailwind, and Framer Motion setup.
