# The Monkeys Web

Marketing site and CMS for The Monkeys, built with Next.js App Router, `next-intl`, Sanity, and Resend.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- next-intl
- Sanity Studio
- Resend

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from the example file and fill in the values you need:

```powershell
Copy-Item .env.local.example .env.local
```

3. Start the app:

```bash
npm run dev
```

The site runs on `http://localhost:3000`.

## Environment variables

Required for CMS-backed content:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

Required for contact form email delivery:

- `RESEND_API_KEY`

Optional analytics:

- `NEXT_PUBLIC_GA_ID`
- `NEXT_PUBLIC_META_PIXEL_ID`

If Sanity is not configured, the site falls back to local portfolio, logo, and site settings data so the app still builds and renders.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm test
```

## Project structure

- `src/app`: App Router pages, metadata, API route, global styles
- `src/components`: layout, sections, UI, analytics, SEO
- `src/i18n`: locale routing and request config
- `src/lib/site-data.ts`: shared site fallbacks and CMS fetch helpers
- `src/sanity`: Sanity client, queries, schemas
- `tests/accessibility.test.ts`: regression tests for key accessibility semantics

## Notes

- The public studio is mounted at `/studio`.
- The legacy `middleware.ts` file has been migrated to `src/proxy.ts` for Next.js 16.
- The contact route includes basic honeypot and input validation, but production spam protection may still need rate limiting or CAPTCHA depending on traffic.
