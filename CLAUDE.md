# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (Oscar starts/stops manually — do not manage dev server)
npm run dev

# Build
npm run build

# Lint
npm run lint

# Run all tests
npm run test

# Run a single test file
node --test --require tsx/cjs tests/validation.test.ts
```

## Architecture

**Stack**: Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · GSAP · next-intl · Resend · Upstash Redis

### i18n routing

All pages live under `src/app/[locale]/`. The default locale is `es`; `en` is also supported. Localized pathnames are declared in `src/i18n/routing.ts` — add new routes there. The middleware (`src/middleware.ts`) delegates entirely to next-intl.

Translation strings live in `src/messages/es.json` and `src/messages/en.json`. Both files must stay in sync for every key.

### Page structure

`src/app/[locale]/page.tsx` composes the home page from section components in order: Hero → Brandbook → Portfolio → LogosBanner → Contact → Footer. Each section is a self-contained component under `src/components/sections/`.

### Data / content sources

Static content is stored in `src/lib/`:
- `site.ts` — single source of truth for brand constants (name, email, phone, social URLs, domain)
- `nav.ts` — navigation link keys and anchor/path targets
- `portfolio.ts` — portfolio project entries
- `services.ts` — services list
- `clients.ts` — client logos

Never redeclare these values elsewhere — always import from `src/lib/`.

### Contact API

`src/app/api/contact/route.ts` handles form submissions:
1. Origin check (production only)
2. Honeypot bot trap (`website` field)
3. IP rate limiting via Upstash Redis (5 req / 1 h)
4. Validation + sanitization via `src/lib/validation.ts`
5. Email delivery via Resend

Required env vars: `RESEND_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`. Rate limiting is skipped gracefully when Redis env vars are absent (safe for local dev).

### Animations

All animations use **GSAP** (via `@gsap/react`). Motion/Framer Motion has been fully removed. Use `useGSAP` from `@gsap/react` for React integration.

### Design tokens

Defined in `src/app/globals.css` under `@theme {}` (Tailwind v4 syntax):

| Token | Value |
|---|---|
| `--color-brand-yellow` | `#F5C518` |
| `--color-brand-black` | `#080B14` |
| `--color-brand-navy` | `#1E243F` |
| `--color-brand-sky` | `#48A0D6` |
| `--color-off-white` | `#F4F3EE` |
| `--font-display` | Anton |
| `--font-display-alt` | Barlow Condensed |
| `--font-body` | Syne |
| `--font-mono` | DM Mono |
| `--ease-premium` | `cubic-bezier(0.16, 1, 0.3, 1)` |

### Testing

Tests live in `/tests/` and use Node's built-in test runner with `tsx`. Currently covers the contact API handler and validation utilities.

### Path alias

`@/` maps to `src/`. Use it for all internal imports.
