# The Monkeys Design System

Last updated: 2026-03-30

## Source of Truth

- The visual source of truth for the project is the current `Home` experience.
- Old client brief requests do not override the current approved site direction.
- Placeholder content remains acceptable until the client provides final assets.

## Brand Core

- Tone: editorial, direct, premium, high-contrast
- Feel: dark-first, sharp, strategic, not playful, not startup-generic
- Product type: creative marketing agency with strong conversion intent

## Color System

- Brand black: `#080B14`
- Brand navy: `#1E243F`
- Brand navy dark: `#0F1528`
- Brand yellow: `#F5C518`
- Brand sky: `#48A0D6`
- Off-white: `#F4F3EE`

## Typography

- Display: `Anton`
- Secondary display: `Barlow Condensed`
- Body: `Syne`
- Mono / metadata: `DM Mono`

## Layout Rules

- Mobile-first
- Strong contrast between sections is preferred over timid tonal shifts
- Use asymmetric composition when it improves hierarchy
- Keep container widths between `1200px` and `1400px` depending on density
- Touch targets must remain at least `44x44px`
- No horizontal scroll at `375`, `768`, `1024`, or `1440`

## Motion Rules

- Hover / micro-feedback: `150-200ms`
- Small transitions: `200-300ms`
- Section reveals: `400-700ms`
- Animate only `transform` and `opacity`
- Always respect `prefers-reduced-motion`

## Component Language

- Use SVG icons only
- Buttons and links should feel deliberate and weighty, not app-generic
- Borders should be subtle but visible
- Rounded corners are acceptable only where they support hierarchy
- Avoid soft SaaS cards as the default pattern

## Do Not Introduce

- No emoji icons
- No custom cursor
- No generic purple gradients
- No overly glassy UI
- No ultra-rounded component system
- No style drift away from the current Home
