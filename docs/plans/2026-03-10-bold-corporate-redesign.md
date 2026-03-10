# Bold Corporate Redesign — The Monkeys

**Date:** 2026-03-10
**Status:** Approved

## Design Principles

- Typography as protagonist — Space Grotesk large, bold, tight tracking. Titles command.
- High contrast — Sections alternate light (white/cream) and dark (navy deep). No yellow background gradients.
- Yellow only as functional accent — CTAs, overheaders, punctual details. Never section backgrounds.
- Generous spacing — Ample vertical padding, grids with breathing room.
- Sober cards — Subtle borders, minimal shadows, no exaggerated glassmorphism.
- Animations — Fade-in + translate on scroll, stagger in grids, hover states with personality. Nothing auto-moving.
- Parallax — Subtle, max 3-4 elements site-wide. Hero panel, portfolio featured image, about statement.

## Brand Palette (unchanged)

- Yellow: #FFCD00 (accent only)
- Navy: #00263E (primary)
- Navy Light: #003456
- Navy Deep: #001A2C
- WhatsApp: #0F766E

## Sections

### Body/Global
- Remove yellow radial-gradient from body background
- Clean white/cream for light, solid navy for dark

### Hero (keep, minor adjustments)
- Remove body radial-gradient yellow
- Add parallax: panel diagonal moves at 0.3x scroll speed, MK logo at 0.2x, decorative shapes inverse
- Everything else stays

### Navbar (redesign)
- Single clean horizontal bar, full width
- Transparent → blur + bg on scroll transition
- Logo left, centered nav links with animated underline (grows from center), controls right
- Remove TubelightNavbar component, use inline nav
- Mobile hamburger + existing drawer kept

### Services (redesign)
- Two-column desktop: left text block (overheader + title + intro), right service list
- Each service is a horizontal row: number + icon + name + decorative line
- Hover: name shifts right, line grows, icon turns yellow
- No card borders, no shadows. Typography and space only.
- Subtle parallax on numbers/icons (slight offset from text)
- CTA centered below

### Portfolio (redesign)
- Featured project: full-width image (16:9), dark gradient overlay from bottom, title large bottom-left, service tags as chips
- Parallax on featured image (image taller than container, moves on scroll — window effect)
- Secondary projects: 3-col grid, simple cards — image with hover zoom + overlay title
- CTA: horizontal banner (navy bg, white text, yellow button) replaces yellow card

### Client Logos (redesign)
- Remove featured project card (already in Portfolio)
- Logos only section
- Infinite slider full-width (breaks container), grayscale → color on hover
- Overheader + title centered above
- No card wrappers for logos
- Dark navy deep background

### About (redesign)
- Statement: huge typography (clamp 3rem-5rem), max 2 lines, centered, with parallax (slower than scroll)
- Bio paragraph below, contained width
- Values: 3 columns with vertical divider lines between. Icon small above, bold title, short description. No cards, no shadows.
- Location: subtle line at bottom with pin + address

### Contact (refinement)
- Keep 2-column layout
- Left: simplify contact items to simple lines with icon (no card borders)
- Form: thinner borders, taller inputs, more label tracking
- Light background

### Footer (minor)
- Social icons: remove circle border, increase to ~24px

## Bug Fixes (bundled)

1. Remove circular CSS variables (globals.css:24-25)
2. Fix `.dark body` selector to `html.dark body`
3. Translate SERVICE_OPTIONS in contact-form.tsx using i18n
4. Translate hardcoded string in mobile-drawer.tsx:133
5. Add generateStaticParams to page.tsx
6. Delete dead code: animated-slideshow.tsx, floating-shapes.tsx
7. Fix TypeScript error in tests/accessibility.test.ts
