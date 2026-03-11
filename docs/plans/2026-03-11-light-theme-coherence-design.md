# Light Theme Coherence Design

**Date:** March 11, 2026

## Goal

Bring the site into visual coherence with the brief by making light mode feel intentional, corporate, and brand-consistent while preserving the dark mode personality and keeping the footer as the only blue closing block. At the same time, improve lead capture UX and remove the most visible technical debt from navigation and contact flows.

## Brief Alignment

- The brand should feel corporate, modern, and trustworthy, not playful or noisy.
- Animations should stay subtle and supportive.
- The site should prioritize credibility, portfolio clarity, and lead generation.
- The primary CTA remains WhatsApp/contact.

## Approved Constraint

- In light mode, blue brand surfaces should be minimized across the page.
- The footer remains the only full-width deep blue closure section in light mode.

## Visual System

### Light Mode Rules

- `brand-navy` becomes the primary foreground color for headings, body copy, icons, strokes, and interface chrome.
- White text/iconography should be removed from light mode unless it sits on the footer or another intentionally dark surface.
- `brand-yellow`, `brand-yellow-soft`, and light cream surfaces become the primary accent backgrounds in light mode.
- Deep blue surfaces should not appear in hero CTAs, navigation controls, service CTAs, client logos, or section panels in light mode.

### Dark Mode Rules

- Existing dark mode structure remains mostly intact.
- Yellow remains the main accent in dark mode.
- Any light-mode adjustments must preserve readable contrast and avoid flattening the dark experience.

## Section-Level Decisions

### Navbar and Header Controls

- The CTA, hamburger button, language toggle, and theme toggle should share the same light-mode language:
  - light surfaces
  - navy text/icons
  - yellow active states
- The current blue pill/button treatment in light mode should be removed.
- The scrolled navbar can stay translucent, but the controls inside it should no longer look like dark-mode leftovers.

### Hero

- The right-side visual panel stays yellow in light mode and deep navy in dark mode.
- The primary CTA in light mode should use a yellow or soft-light surface with navy text instead of navy with white text.
- Secondary CTA and signal cards should keep navy text and subtle navy borders in light mode.
- The hero should continue to feel bold, but with brand clarity rather than dark/light mismatch.

### Services

- The section structure stays the same.
- In light mode, icons, dividers, and CTA treatments should reinforce the yellow-surface-plus-navy-foreground system.
- No primary light-mode CTA should use navy fill with white text.

### Portfolio

- Portfolio overlays can remain dark because they sit on imagery and rely on contrast for readability.
- The closing CTA block under portfolio should move away from a navy block in light mode, using a yellow or cream accent treatment with navy text.

### Client Logos

- The section becomes a light-mode trust band instead of a dark-mode carryover.
- In light mode:
  - background shifts to a warm light surface
  - logos become much larger
  - carousel becomes continuous and slow
  - base state uses grayscale and moderate opacity
  - hover restores full logo color with a smooth fade
- In dark mode, the section can remain darker or slightly subdued, but the carousel behavior should stay consistent.
- The edge blur can remain, but it should be subtle enough not to eat the larger logos.

### About and Contact

- These sections are already structurally aligned with the brief.
- Only color consistency adjustments should be applied where white-on-light or overly dark accents create friction.

### Footer

- Footer remains deep navy in both themes as the visual closure of the page.
- White text and yellow hover accents remain appropriate here.

## Interaction and Motion

- Keep motion restrained and deliberate.
- The client logo carousel should move slowly enough to feel premium, not like a marketplace ticker.
- Hover color restoration on logos should be smooth and immediate enough to feel interactive without flashing.

## UX and Lead Capture

### Contact Form

- Add client-side validation before submit for required fields and email format.
- Keep the existing live region and accessible labels.
- Replace generic failure-only feedback with more useful user-facing validation guidance.
- Preserve the honeypot field in the API.

### Contact Backend

- Keep the existing endpoint shape.
- Do not expand into CAPTCHA or rate limiting in this pass unless implementation remains very small; this work is lower priority than fixing the visible form UX.
- The sender address should be prepared for a branded domain in a later pass if infrastructure is not yet ready.

## Technical Cleanup

- Remove the navbar lint violation caused by synchronous state updates inside an effect.
- Remove unused animation values and other dead code in sections that have already been redesigned.
- Preserve current App Router, next-intl, and Sanity integration patterns.

## Testing Strategy

- Keep current accessibility tests passing.
- Add or expand tests around:
  - contact form validation behavior
  - navigation button accessibility state if touched
  - theme-sensitive UI logic where practical
- Run lint, tests, and production build after the implementation pass.

## Out of Scope

- Major layout rewrites
- New content architecture
- Reworking dark mode from scratch
- Adding new CMS schema or content modeling
- Full anti-spam hardening beyond the current honeypot unless the implementation remains trivial

## Success Criteria

- Light mode reads as one coherent branded system instead of a mix of dark-mode components and light backgrounds.
- Footer remains the only strong blue closure block in light mode.
- Client logos feel larger, more premium, and more obviously useful as social proof.
- Contact form feels more trustworthy and fails more gracefully before hitting the API.
- Lint, tests, and build all pass after the remediation.
