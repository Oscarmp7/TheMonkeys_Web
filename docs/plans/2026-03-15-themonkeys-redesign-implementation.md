# The Monkeys Web — Redesign v2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build The Monkeys agency website from scratch — brandbook-concept homepage, bilingüe ES/EN, single theme, premium scroll animations, production-ready security.

**Architecture:** Next.js 15 App Router with static content (no CMS), next-intl for ES/EN i18n, Framer Motion `layoutId` for the hero→brandbook logo travel animation. All data lives in typed `src/lib/` modules as single sources of truth.

**Tech Stack:** Next.js 15, TypeScript (strict), Tailwind CSS v4, Framer Motion, next-intl, Resend, @upstash/ratelimit

**Design Doc:** `docs/plans/2026-03-15-themonkeys-redesign-design.md`

---

## Task 0: Install SEO skill + reset project

**Goal:** Clean the repo, keep only brand assets and docs, install claude-seo skill.

**Files to keep:**
- `docs/brief-the-monkeys.md`
- `docs/Issues/` (all files)
- `docs/Logo/`
- `docs/Jimetor/`
- `docs/plans/` (design doc + this plan)
- `public/logos/` (all logo PNGs)
- `public/portfolio/`
- `.vercel/project.json`
- `.git/`
- `.gitignore`
- `.claude/`

**Step 1: Install claude-seo skill**

```bash
git clone https://github.com/AgriciDaniel/claude-seo.git ~/.claude/skills/seo
```

Verify: `ls ~/.claude/skills/seo/` should show skill files.

**Step 2: Delete old project files**

```bash
cd /c/Users/omato/OneDrive/Desktop/Dev/TheMonkeys_Web

# Remove source and config
rm -rf src/ .next/ node_modules/ .full-review/
rm -f next.config.ts next-env.d.ts package.json package-lock.json
rm -f postcss.config.mjs eslint.config.mjs tsconfig.json
rm -f sanity.config.ts sanity.cli.ts README.md
rm -f .env.local.example
rm -f public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg

# Remove old plans (design doc and implementation plan stay)
rm -f docs/plans/2026-03-09-*.md docs/plans/2026-03-10-*.md docs/plans/2026-03-11-*.md
```

**Step 3: Scaffold package.json**

Create `package.json`:

```json
{
  "name": "themonkeys-web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "node --test --require tsx/cjs tests/**/*.test.ts"
  },
  "dependencies": {
    "next": "^15.2.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "framer-motion": "^11.0.0",
    "next-intl": "^3.26.0",
    "resend": "^4.0.0",
    "@upstash/ratelimit": "^2.0.0",
    "@upstash/redis": "^1.34.0",
    "lucide-react": "^0.473.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.0",
    "tsx": "^4.19.0",
    "@tailwindcss/postcss": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.2.0"
  }
}
```

**Step 4: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, no errors.

**Step 5: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Step 6: Commit clean state**

```bash
git add -A
git commit -m "chore: reset project to clean slate, keep brand assets"
```

---

## Task 1: Next.js + Tailwind configuration

**Files:**
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `src/app/globals.css`

**Step 1: Create `next.config.ts`**

```typescript
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://vitals.vercel-insights.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: "/(.*)",
      headers: securityHeaders,
    },
  ],
  images: {
    formats: ["image/webp", "image/avif"],
  },
};

export default withNextIntl(nextConfig);
```

**Step 2: Create `postcss.config.mjs`**

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

**Step 3: Create `src/app/globals.css`**

```css
@import "tailwindcss";

@theme {
  /* Brand colors */
  --color-brand-navy: #1b2f4f;
  --color-brand-navy-dark: #0f1e35;
  --color-brand-yellow: #f6c300;
  --color-off-white: #f8f7f4;

  /* Typography */
  --font-display: "Bebas Neue", sans-serif;
  --font-body: "Space Grotesk", sans-serif;

  /* Motion */
  --ease-premium: cubic-bezier(0.16, 1, 0.3, 1);
}

@layer base {
  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
  }

  body {
    font-family: var(--font-body);
    background-color: var(--color-off-white);
    color: var(--color-brand-navy);
  }
}

/* Noise texture utility */
@layer utilities {
  .noise-overlay::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    opacity: 0.06;
    mix-blend-mode: overlay;
    pointer-events: none;
    z-index: 1;
  }
}
```

**Step 4: Run dev to verify Tailwind works**

```bash
npm run dev
```

Expected: compiles without errors (404 page is fine, no files yet).

**Step 5: Commit**

```bash
git add next.config.ts postcss.config.mjs src/app/globals.css tsconfig.json package.json package-lock.json
git commit -m "feat: configure Next.js with security headers and Tailwind v4 brand tokens"
```

---

## Task 2: i18n setup (next-intl)

**Files:**
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/request.ts`
- Create: `src/middleware.ts`
- Create: `src/messages/es.json`
- Create: `src/messages/en.json`

**Step 1: Create `src/i18n/routing.ts`**

```typescript
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  pathnames: {
    "/": "/",
    "/servicios": { es: "/servicios", en: "/services" },
    "/portafolio": { es: "/portafolio", en: "/portfolio" },
    "/portafolio/[slug]": { es: "/portafolio/[slug]", en: "/portfolio/[slug]" },
  },
});

export type Locale = (typeof routing.locales)[number];
```

**Step 2: Create `src/i18n/request.ts`**

```typescript
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "es" | "en")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

**Step 3: Create `src/middleware.ts`**

```typescript
/**
 * i18n routing middleware (Next.js App Router).
 * Intercepts all non-asset, non-API requests and applies next-intl locale routing.
 * Redirects bare paths (e.g. /) to the default locale (/es).
 * Excluded: /api/*, /_next/*, /_vercel/*, /studio/*, and file extensions.
 */
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|studio|.*\\..*).*)"],
};
```

**Step 4: Create `src/messages/es.json`**

```json
{
  "nav": {
    "inicio": "Inicio",
    "servicios": "Servicios",
    "contacto": "Contacto",
    "cotizar": "Cotizar"
  },
  "hero": {
    "tagline": "Hacemos marcas crecer en el mundo digital"
  },
  "brandbook": {
    "statement": "Hacemos",
    "bio": "ayudamos a las marcas a crecer en el entorno digital a través de estrategias de comunicación modernas, creativas y orientadas a resultados.",
    "cta": "Cotiza Ahora"
  },
  "services": {
    "title": "Servicios",
    "inbound": "Inbound Marketing",
    "contenidos": "Producción de Contenidos",
    "seo": "SEO",
    "web": "Desarrollo Web",
    "influencers": "Marketing de Influencers",
    "ads": "Campaña Digital",
    "foto_video": "Foto & Video"
  },
  "portfolio": {
    "title": "Nuestro trabajo",
    "cta": "Ver portafolio completo"
  },
  "contact": {
    "title": "¿Listo para crecer?",
    "subtitle": "Cuéntanos tu proyecto",
    "name": "Nombre",
    "email": "Correo electrónico",
    "company": "Empresa (opcional)",
    "service": "Servicio de interés",
    "message": "Mensaje",
    "submit": "Enviar mensaje",
    "whatsapp": "Escríbenos por WhatsApp",
    "success": "¡Mensaje enviado! Te contactaremos pronto.",
    "error": "Hubo un error. Por favor intenta de nuevo."
  },
  "footer": {
    "location": "Santiago de los Caballeros, RD",
    "rights": "Todos los derechos reservados"
  },
  "meta": {
    "home_title": "The Monkeys — Agencia Digital en Santiago, RD",
    "home_description": "Agencia creativa digital especializada en SEO, desarrollo web, producción de contenidos y campañas digitales. Santiago de los Caballeros, República Dominicana."
  }
}
```

**Step 5: Create `src/messages/en.json`**

```json
{
  "nav": {
    "inicio": "Home",
    "servicios": "Services",
    "contacto": "Contact",
    "cotizar": "Get a Quote"
  },
  "hero": {
    "tagline": "We help brands grow in the digital world"
  },
  "brandbook": {
    "statement": "We do",
    "bio": "We help brands grow in the digital environment through modern, creative, results-driven communication strategies.",
    "cta": "Get a Quote"
  },
  "services": {
    "title": "Services",
    "inbound": "Inbound Marketing",
    "contenidos": "Content Production",
    "seo": "SEO",
    "web": "Web Development",
    "influencers": "Influencer Marketing",
    "ads": "Digital Campaigns",
    "foto_video": "Photo & Video"
  },
  "portfolio": {
    "title": "Our work",
    "cta": "View full portfolio"
  },
  "contact": {
    "title": "Ready to grow?",
    "subtitle": "Tell us about your project",
    "name": "Name",
    "email": "Email address",
    "company": "Company (optional)",
    "service": "Service of interest",
    "message": "Message",
    "submit": "Send message",
    "whatsapp": "Message us on WhatsApp",
    "success": "Message sent! We'll be in touch soon.",
    "error": "Something went wrong. Please try again."
  },
  "footer": {
    "location": "Santiago de los Caballeros, DR",
    "rights": "All rights reserved"
  },
  "meta": {
    "home_title": "The Monkeys — Digital Agency in Santiago, DR",
    "home_description": "Creative digital agency specializing in SEO, web development, content production, and digital campaigns. Santiago de los Caballeros, Dominican Republic."
  }
}
```

**Step 6: Commit**

```bash
git add src/i18n/ src/middleware.ts src/messages/
git commit -m "feat: add next-intl i18n setup with ES/EN routing and messages"
```

---

## Task 3: Single-source-of-truth data modules

**Files:**
- Create: `src/lib/nav.ts`
- Create: `src/lib/services.ts`
- Create: `src/lib/portfolio.ts`
- Create: `src/lib/site.ts`
- Create: `src/lib/validation.ts`

**Step 1: Create `src/lib/nav.ts`**

```typescript
/** Single source of truth for navigation links. Import everywhere — never redeclare. */
export const NAV_LINK_KEYS = ["inicio", "servicios", "contacto"] as const;
export type NavLinkKey = (typeof NAV_LINK_KEYS)[number];

export const NAV_ANCHORS: Record<NavLinkKey, string> = {
  inicio: "/",
  servicios: "/servicios",
  contacto: "#contacto",
};
```

**Step 2: Create `src/lib/services.ts`**

```typescript
import {
  TrendingUp, FileText, Search, Globe, Users, Megaphone, Camera,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Single source of truth for service keys. */
export const SERVICE_KEYS = [
  "inbound", "contenidos", "seo", "web", "influencers", "ads", "foto_video",
] as const;

export type ServiceKey = (typeof SERVICE_KEYS)[number];

export const SERVICE_ICONS: Record<ServiceKey, LucideIcon> = {
  inbound: TrendingUp,
  contenidos: FileText,
  seo: Search,
  web: Globe,
  influencers: Users,
  ads: Megaphone,
  foto_video: Camera,
};
```

**Step 3: Create `src/lib/portfolio.ts`**

```typescript
export interface Project {
  slug: string;
  client: string;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  services: string[];
  coverImage: string;
  featured: boolean;
}

export const PROJECTS: Project[] = [
  {
    slug: "jimetor",
    client: "Jimetor",
    titleEs: "Identidad digital & SEO",
    titleEn: "Digital identity & SEO",
    descriptionEs: "Fotografía, video, manejo de redes sociales y posicionamiento SEO para Jimetor.",
    descriptionEn: "Photography, video, social media management and SEO positioning for Jimetor.",
    services: ["foto_video", "seo", "contenidos"],
    coverImage: "/portfolio/jimetor-logo.jpeg",
    featured: true,
  },
];
```

**Step 4: Create `src/lib/site.ts`**

```typescript
/** Site-wide constants. Single source of truth. */
export const SITE = {
  name: "The Monkeys",
  email: "hola@themonkeys.do",
  phone: "+18097561847",
  whatsapp: "+18097561847",
  location: { es: "Santiago de los Caballeros, RD", en: "Santiago de los Caballeros, DR" },
  domain: "https://themonkeys.do",
  instagram: "https://www.instagram.com/themonkeys.do/",
  linkedin: "https://www.linkedin.com/company/the-monkeysrd/",
  facebook: "https://www.facebook.com/themonkeys.do",
  youtube: "https://www.youtube.com/@Themonkeysrd",
  pinterest: "https://www.pinterest.com/themonkeysdo/",
} as const;

export function getWhatsAppHref(messageEs: string, locale: "es" | "en"): string {
  const messages = {
    es: encodeURIComponent(messageEs),
    en: encodeURIComponent("Hi! I'd like to get a quote from The Monkeys."),
  };
  return `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${messages[locale]}`;
}
```

**Step 5: Create `src/lib/validation.ts`**

```typescript
/** Contact form validation — used by both client and server. */

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const MAX_LENGTHS = { name: 120, email: 254, company: 120, service: 120, message: 4000 };

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export function sanitize(str: string, maxLength: number): string {
  return str.trim().slice(0, maxLength);
}

export interface ContactFormValues {
  name: string;
  email: string;
  company?: string;
  service: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormValues, string>>;
}

export function validateContactForm(values: ContactFormValues): ValidationResult {
  const errors: ValidationResult["errors"] = {};

  if (!values.name.trim()) errors.name = "required";
  else if (values.name.length > MAX_LENGTHS.name) errors.name = "too_long";

  if (!values.email.trim()) errors.email = "required";
  else if (!isValidEmail(values.email)) errors.email = "invalid";
  else if (values.email.length > MAX_LENGTHS.email) errors.email = "too_long";

  if (!values.service.trim()) errors.service = "required";

  if (!values.message.trim()) errors.message = "required";
  else if (values.message.length > MAX_LENGTHS.message) errors.message = "too_long";

  return { valid: Object.keys(errors).length === 0, errors };
}
```

**Step 6: Write validation tests**

Create `tests/validation.test.ts`:

```typescript
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { isValidEmail, escapeHtml, validateContactForm } from "../src/lib/validation.js";

describe("isValidEmail", () => {
  test("accepts valid email", () => assert.ok(isValidEmail("test@example.com")));
  test("accepts plus-addressed email", () => assert.ok(isValidEmail("user+tag@domain.co")));
  test("rejects missing @", () => assert.ok(!isValidEmail("notanemail")));
  test("rejects empty string", () => assert.ok(!isValidEmail("")));
  test("rejects missing TLD", () => assert.ok(!isValidEmail("user@domain")));
});

describe("escapeHtml", () => {
  test("escapes < and >", () => assert.equal(escapeHtml("<script>"), "&lt;script&gt;"));
  test("escapes &", () => assert.equal(escapeHtml("a & b"), "a &amp; b"));
  test("escapes quotes", () => assert.equal(escapeHtml('"hello"'), "&quot;hello&quot;"));
});

describe("validateContactForm", () => {
  const valid = { name: "Ana", email: "ana@test.com", service: "seo", message: "Hola" };
  test("returns valid for complete form", () => assert.ok(validateContactForm(valid).valid));
  test("returns error for empty name", () =>
    assert.ok(validateContactForm({ ...valid, name: "" }).errors.name));
  test("returns error for invalid email", () =>
    assert.ok(validateContactForm({ ...valid, email: "bad" }).errors.email));
  test("returns error for empty message", () =>
    assert.ok(validateContactForm({ ...valid, message: "" }).errors.message));
  test("allows optional company to be absent", () =>
    assert.ok(validateContactForm(valid).valid));
});
```

**Step 7: Run tests**

```bash
npm test
```

Expected: 10 tests pass.

**Step 8: Commit**

```bash
git add src/lib/ tests/
git commit -m "feat: add data modules (nav, services, portfolio, site, validation) with tests"
```

---

## Task 4: Root layout & app structure

**Files:**
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/[locale]/page.tsx` (shell only)
- Create: `src/app/layout.tsx` (root)
- Create: `src/app/favicon.ico` (copy existing)
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.ts`

**Step 1: Create `src/app/layout.tsx`**

```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

**Step 2: Create `src/app/[locale]/layout.tsx`**

```typescript
import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";
import type { Locale } from "@/i18n/routing";
import { SITE } from "@/lib/site";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("home_title"),
    description: t("home_description"),
    metadataBase: new URL(SITE.domain),
    openGraph: {
      title: t("home_title"),
      description: t("home_description"),
      locale: locale === "es" ? "es_DO" : "en_US",
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${bebasNeue.variable} ${spaceGrotesk.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

**Step 3: Create `src/app/[locale]/page.tsx` (shell)**

```typescript
export default function HomePage() {
  return (
    <main>
      <p>The Monkeys — coming soon</p>
    </main>
  );
}
```

**Step 4: Create `src/app/robots.ts`**

```typescript
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.domain}/sitemap.xml`,
  };
}
```

**Step 5: Create `src/app/sitemap.ts`**

```typescript
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { PROJECTS } from "@/lib/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.domain;
  const locales = ["", "/en"];

  const staticRoutes = ["/", "/servicios", "/portafolio"].flatMap((path) =>
    locales.map((locale) => ({
      url: `${base}${locale}${path === "/" ? "" : path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.8,
    }))
  );

  const projectRoutes = PROJECTS.flatMap((p) => [
    { url: `${base}/portafolio/${p.slug}`, lastModified: new Date(), priority: 0.6 },
    { url: `${base}/en/portfolio/${p.slug}`, lastModified: new Date(), priority: 0.6 },
  ]);

  return [...staticRoutes, ...projectRoutes];
}
```

**Step 6: Verify dev server**

```bash
npm run dev
```

Open `http://localhost:3000` — should redirect to `/es` and show "The Monkeys — coming soon".

**Step 7: Commit**

```bash
git add src/app/
git commit -m "feat: add root layout with fonts, i18n provider, robots.ts, sitemap.ts"
```

---

## Task 5: Shared hooks

**Files:**
- Create: `src/hooks/use-focus-trap.ts`
- Create: `src/hooks/use-scroll-progress.ts`

**Step 1: Create `src/hooks/use-focus-trap.ts`**

```typescript
"use client";
import { useEffect } from "react";

const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

/**
 * Traps focus inside containerRef when isOpen is true.
 * Closes on Escape key.
 */
export function useFocusTrap(
  isOpen: boolean,
  containerRef: React.RefObject<HTMLElement | null>,
  onClose: () => void
) {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, containerRef, onClose]);
}
```

**Step 2: Create `src/hooks/use-scroll-progress.ts`**

```typescript
"use client";
import { useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

/** Returns scroll progress (0→1) for a section, scoped to its container. */
export function useSectionScrollProgress(): {
  ref: React.RefObject<HTMLDivElement | null>;
  progress: MotionValue<number>;
} {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: progress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  return { ref, progress };
}
```

**Step 3: Commit**

```bash
git add src/hooks/
git commit -m "feat: add useFocusTrap and useSectionScrollProgress hooks"
```

---

## Task 6: Hero section

**Files:**
- Create: `src/components/sections/hero.tsx`
- Create: `src/components/ui/logo-wordmark.tsx`
- Create: `src/components/ui/social-sidebar.tsx`
- Create: `src/components/layout/navbar-hero.tsx`

**Step 1: Create `src/components/ui/logo-wordmark.tsx`**

```typescript
"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoWordmarkProps {
  variant?: "yellow" | "navy" | "white";
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function LogoWordmark({
  variant = "yellow",
  className,
  sizes = "50vw",
  priority = false,
}: LogoWordmarkProps) {
  const src = {
    yellow: "/logos/logo-yellow.png",
    navy: "/logos/logo-navy.png",
    white: "/logos/logo-white.png",
  }[variant];

  return (
    <div className={cn("relative", className)}>
      <Image
        src={src}
        alt="The Monkeys"
        fill
        sizes={sizes}
        className="object-contain"
        priority={priority}
      />
    </div>
  );
}

export function MKMonogram({
  variant = "yellow",
  className,
}: {
  variant?: "yellow" | "navy" | "white";
  className?: string;
}) {
  const src = {
    yellow: "/logos/mk-yellow.png",
    navy: "/logos/mk-navy.png",
    white: "/logos/mk-white.png",
  }[variant];

  return (
    <div className={cn("relative w-12 h-12", className)}>
      <Image src={src} alt="MK" fill className="object-contain" />
    </div>
  );
}
```

**Step 2: Create `src/lib/utils.ts`**

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Install clsx and tailwind-merge:

```bash
npm install clsx tailwind-merge
```

**Step 3: Create `src/components/ui/social-sidebar.tsx`**

```typescript
"use client";
import { Linkedin, Youtube, Instagram, Facebook, Pin } from "lucide-react";
import { SITE } from "@/lib/site";

const SOCIALS = [
  { icon: Linkedin, href: SITE.linkedin, label: "LinkedIn" },
  { icon: Youtube, href: SITE.youtube, label: "YouTube" },
  { icon: Pin, href: SITE.pinterest, label: "Pinterest" },
  { icon: Facebook, href: SITE.facebook, label: "Facebook" },
  { icon: Instagram, href: SITE.instagram, label: "Instagram" },
];

export function SocialSidebar() {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      {SOCIALS.map(({ icon: Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="w-9 h-9 rounded-full border border-brand-yellow/40 flex items-center justify-center text-brand-yellow hover:bg-brand-yellow hover:text-brand-navy transition-colors duration-300"
        >
          <Icon size={16} />
        </a>
      ))}
    </div>
  );
}
```

**Step 4: Create `src/components/layout/navbar-hero.tsx`**

```typescript
"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { MKMonogram } from "@/components/ui/logo-wordmark";
import { NAV_LINK_KEYS, NAV_ANCHORS } from "@/lib/nav";
import type { Locale } from "@/i18n/routing";

export function NavbarHero({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");

  return (
    <nav className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-6">
      {/* MK Monogram */}
      <MKMonogram variant="yellow" />

      {/* Nav pill */}
      <div className="hidden md:flex items-center gap-1 bg-brand-navy-dark/60 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
        {NAV_LINK_KEYS.map((key) => (
          <Link
            key={key}
            href={NAV_ANCHORS[key]}
            className="px-3 py-1 text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            {t(key)}
          </Link>
        ))}
        <Link
          href="#contacto"
          className="ml-2 px-4 py-1.5 bg-brand-yellow text-brand-navy text-sm font-semibold rounded-full hover:bg-brand-yellow/90 transition-colors"
        >
          {t("cotizar")}
        </Link>
      </div>

      {/* Language toggle */}
      <div className="flex items-center gap-2 text-sm font-medium">
        <Link href="/" className={locale === "es" ? "bg-brand-yellow text-brand-navy w-8 h-8 rounded-full flex items-center justify-center" : "text-white/60 hover:text-white"}>
          ES
        </Link>
        <Link href="/en" className={locale === "en" ? "bg-brand-yellow text-brand-navy w-8 h-8 rounded-full flex items-center justify-center" : "text-white/60 hover:text-white"}>
          EN
        </Link>
      </div>
    </nav>
  );
}
```

**Step 5: Create `src/components/sections/hero.tsx`**

```typescript
"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { LogoWordmark } from "@/components/ui/logo-wordmark";
import { SocialSidebar } from "@/components/ui/social-sidebar";
import { NavbarHero } from "@/components/layout/navbar-hero";
import { getWhatsAppHref } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

export function Hero({ locale }: { locale: Locale }) {
  const t = useTranslations("hero");

  return (
    <section
      className="relative min-h-screen noise-overlay overflow-hidden"
      style={{ background: "linear-gradient(160deg, #1b2f4f 0%, #0f1e35 100%)" }}
    >
      <NavbarHero locale={locale} />
      <SocialSidebar />

      {/* Centered logo — layoutId enables travel to brandbook section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-8 gap-6">
        <motion.div
          layoutId="brand-logo"
          className="relative w-[min(80vw,700px)] aspect-[4/1]"
        >
          <LogoWordmark variant="yellow" priority sizes="80vw" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-white/70 text-center text-lg md:text-xl max-w-md font-body"
        >
          {t("tagline")}
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          href={getWhatsAppHref("Hola! Me gustaría cotizar un servicio.", locale)}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-3 bg-brand-yellow text-brand-navy font-semibold rounded-full hover:scale-105 transition-transform"
        >
          WhatsApp ↗
        </motion.a>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
      >
        <div className="w-0.5 h-8 bg-white/20 mx-auto mb-1 rounded-full" />
        <span className="text-xs tracking-widest uppercase">Scroll</span>
      </motion.div>
    </section>
  );
}
```

**Step 6: Update `src/app/[locale]/page.tsx`**

```typescript
import { Hero } from "@/components/sections/hero";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return (
    <main>
      <Hero locale={locale} />
    </main>
  );
}
```

**Step 7: Verify hero renders**

```bash
npm run dev
```

Open `http://localhost:3000` — should show full-screen navy hero with yellow THE MONKEYS logo, navbar, social icons.

**Step 8: Commit**

```bash
git add src/components/ src/lib/utils.ts
git commit -m "feat: add hero section with noise bg, logo, navbar, social sidebar"
```

---

## Task 7: Brandbook section (curtain reveal + logo travel)

**Files:**
- Create: `src/components/sections/brandbook.tsx`

**Step 1: Create `src/components/sections/brandbook.tsx`**

```typescript
"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { LogoWordmark } from "@/components/ui/logo-wordmark";
import { SERVICE_KEYS, SERVICE_ICONS } from "@/lib/services";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const lineVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export function Brandbook() {
  const t = useTranslations("brandbook");
  const tServices = useTranslations("services");
  const prefersReduced = useReducedMotion();

  return (
    /*
     * z-index: 10 ensures this sits above the sticky hero.
     * The section slides up naturally in document flow.
     * Framer Motion's layoutId="brand-logo" animates the logo
     * from its hero position to fill the right half of this grid.
     */
    <section className="relative z-10 min-h-screen bg-off-white grid md:grid-cols-2">

      {/* Left: Info + Services */}
      <motion.div
        className="flex flex-col justify-center px-12 py-20 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.p variants={lineVariants} className="text-5xl md:text-6xl font-display text-brand-navy leading-none">
          {t("statement")}
        </motion.p>

        <motion.p variants={lineVariants} className="text-lg text-brand-navy/70 max-w-sm leading-relaxed">
          {t("bio")}
        </motion.p>

        {/* Services icons */}
        <motion.ul variants={containerVariants} className="grid grid-cols-2 gap-3">
          {SERVICE_KEYS.map((key) => {
            const Icon = SERVICE_ICONS[key];
            return (
              <motion.li key={key} variants={lineVariants} className="flex items-center gap-2 text-brand-navy/80">
                <Icon size={18} className="text-brand-yellow flex-shrink-0" />
                <span className="text-sm font-medium">{tServices(key)}</span>
              </motion.li>
            );
          })}
        </motion.ul>

        <motion.a
          variants={lineVariants}
          href="#contacto"
          className="self-start px-7 py-3 bg-brand-navy text-brand-yellow font-semibold rounded-full hover:bg-brand-navy/90 transition-colors"
        >
          {t("cta")} →
        </motion.a>
      </motion.div>

      {/* Right: Logo travels here from hero via layoutId */}
      <motion.div
        layoutId="brand-logo"
        className="hidden md:flex items-center justify-center bg-brand-navy/5 p-12"
      >
        <LogoWordmark
          variant="navy"
          className="w-full max-h-[60vh] aspect-[4/1]"
          sizes="50vw"
        />
      </motion.div>

    </section>
  );
}
```

**Step 2: Add `<LayoutGroup>` wrapper in page.tsx**

Framer Motion's `layoutId` requires both components to be inside a `<LayoutGroup>`:

```typescript
// src/app/[locale]/page.tsx
import { LayoutGroup } from "framer-motion";
import { Hero } from "@/components/sections/hero";
import { Brandbook } from "@/components/sections/brandbook";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return (
    <LayoutGroup>
      <main>
        <Hero locale={locale} />
        <Brandbook />
      </main>
    </LayoutGroup>
  );
}
```

Note: `LayoutGroup` requires `"use client"` — wrap page in a client provider:

Create `src/components/providers/layout-provider.tsx`:

```typescript
"use client";
import { LayoutGroup } from "framer-motion";

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  return <LayoutGroup>{children}</LayoutGroup>;
}
```

Update `page.tsx` to use `LayoutProvider` instead of importing `LayoutGroup` directly.

**Step 3: Verify curtain reveal**

```bash
npm run dev
```

Scroll down — the brandbook section should slide up over the hero. The THE MONKEYS logo should animate from the hero center to the right column of the brandbook section.

**Step 4: Commit**

```bash
git add src/components/sections/brandbook.tsx src/components/providers/
git commit -m "feat: add brandbook section with layoutId logo travel and stagger animation"
```

---

## Task 8: Portfolio section

**Files:**
- Create: `src/components/sections/portfolio.tsx`
- Create: `src/components/ui/project-card.tsx`

**Step 1: Create `src/components/ui/project-card.tsx`**

```typescript
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Project } from "@/lib/portfolio";
import type { Locale } from "@/i18n/routing";

interface ProjectCardProps {
  project: Project;
  locale: Locale;
  index: number;
}

export function ProjectCard({ project, locale, index }: ProjectCardProps) {
  const title = locale === "es" ? project.titleEs : project.titleEn;
  const description = locale === "es" ? project.descriptionEs : project.descriptionEn;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.coverImage}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>
      <div className="p-6">
        <p className="text-xs text-brand-yellow font-semibold uppercase tracking-widest mb-1">
          {project.client}
        </p>
        <h3 className="text-xl font-semibold text-brand-navy mb-2">{title}</h3>
        <p className="text-brand-navy/60 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.article>
  );
}
```

**Step 2: Create `src/components/sections/portfolio.tsx`**

```typescript
"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { PROJECTS } from "@/lib/portfolio";
import { ProjectCard } from "@/components/ui/project-card";
import type { Locale } from "@/i18n/routing";

export function Portfolio({ locale }: { locale: Locale }) {
  const t = useTranslations("portfolio");

  return (
    <section className="py-24 px-8 bg-off-white">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl font-display text-brand-navy mb-12"
        >
          {t("title")}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          {PROJECTS.filter((p) => p.featured).map((project, i) => (
            <ProjectCard key={project.slug} project={project} locale={locale} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href={locale === "es" ? "/portafolio" : "/en/portfolio"}
            className="inline-flex items-center gap-2 text-brand-navy font-semibold hover:gap-3 transition-all"
          >
            {t("cta")} →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
```

**Step 3: Add to page.tsx**

```typescript
import { Portfolio } from "@/components/sections/portfolio";
// Add <Portfolio locale={locale} /> after <Brandbook />
```

**Step 4: Commit**

```bash
git add src/components/sections/portfolio.tsx src/components/ui/project-card.tsx
git commit -m "feat: add portfolio section with animated cards"
```

---

## Task 9: Logos Banner (infinite scroll)

**Files:**
- Create: `src/components/sections/logos-banner.tsx`
- Create: `src/lib/clients.ts`

**Step 1: Create `src/lib/clients.ts`**

```typescript
export interface ClientLogo {
  name: string;
  src: string;
}

/** Add real client logos as they're acquired. */
export const CLIENT_LOGOS: ClientLogo[] = [
  { name: "Jimetor", src: "/portfolio/jimetor-logo.jpeg" },
  // Add more client logos here
];
```

**Step 2: Create `src/components/sections/logos-banner.tsx`**

```typescript
"use client";
import Image from "next/image";
import { CLIENT_LOGOS } from "@/lib/clients";

export function LogosBanner() {
  if (CLIENT_LOGOS.length === 0) return null;

  // Duplicate for seamless loop
  const logos = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <section className="py-16 bg-off-white border-y border-brand-navy/10 overflow-hidden">
      <div
        className="flex gap-16 w-max"
        style={{
          animation: "marquee 20s linear infinite",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
        onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
      >
        {logos.map((logo, i) => (
          <div key={`${logo.name}-${i}`} className="relative w-32 h-16 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
            <Image src={logo.src} alt={logo.name} fill className="object-contain" sizes="128px" />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
```

**Step 3: Add to page.tsx, commit**

```bash
git add src/components/sections/logos-banner.tsx src/lib/clients.ts
git commit -m "feat: add infinite logos banner with hover pause"
```

---

## Task 10: Contact section + Footer

**Files:**
- Create: `src/components/sections/contact.tsx`
- Create: `src/components/ui/contact-form.tsx`
- Create: `src/components/layout/footer.tsx`

**Step 1: Create `src/components/ui/contact-form.tsx`**

```typescript
"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { SERVICE_KEYS } from "@/lib/services";
import { validateContactForm, type ContactFormValues } from "@/lib/validation";

export function ContactForm() {
  const t = useTranslations("contact");
  const tServices = useTranslations("services");

  const [values, setValues] = useState<ContactFormValues & { website: string }>({
    name: "", email: "", company: "", service: "", message: "", website: "",
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = validateContactForm(values);
    if (!result.valid) { setErrors(result.errors as Record<string, string>); return; }

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <p className="text-brand-navy font-semibold text-lg py-8">{t("success")}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      {/* Honeypot — do not remove: bot spam protection */}
      <input type="text" name="website" value={values.website} onChange={handleChange} className="hidden" tabIndex={-1} aria-hidden="true" />

      {(["name", "email", "company"] as const).map((field) => (
        <div key={field}>
          <label htmlFor={field} className="block text-sm font-medium text-brand-navy mb-1">
            {t(field)}
          </label>
          <input
            id={field}
            name={field}
            type={field === "email" ? "email" : "text"}
            value={values[field] ?? ""}
            onChange={handleChange}
            className="w-full border border-brand-navy/20 rounded-lg px-4 py-2.5 text-brand-navy focus:outline-none focus:border-brand-navy transition-colors"
            aria-invalid={!!errors[field]}
          />
          {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
        </div>
      ))}

      <div>
        <label htmlFor="service" className="block text-sm font-medium text-brand-navy mb-1">{t("service")}</label>
        <select
          id="service"
          name="service"
          value={values.service}
          onChange={handleChange}
          className="w-full border border-brand-navy/20 rounded-lg px-4 py-2.5 text-brand-navy focus:outline-none focus:border-brand-navy bg-white"
        >
          <option value="">—</option>
          {SERVICE_KEYS.map((key) => (
            <option key={key} value={key}>{tServices(key)}</option>
          ))}
        </select>
        {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-brand-navy mb-1">{t("message")}</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={values.message}
          onChange={handleChange}
          className="w-full border border-brand-navy/20 rounded-lg px-4 py-2.5 text-brand-navy focus:outline-none focus:border-brand-navy resize-none"
          aria-invalid={!!errors.message}
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="self-start px-8 py-3 bg-brand-navy text-brand-yellow font-semibold rounded-full hover:bg-brand-navy/90 disabled:opacity-50 transition-colors"
      >
        {status === "loading" ? "..." : t("submit")}
      </button>

      {status === "error" && <p className="text-red-500 text-sm">{t("error")}</p>}
    </form>
  );
}
```

**Step 2: Create `src/components/sections/contact.tsx`**

```typescript
"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/ui/contact-form";
import { getWhatsAppHref } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

export function Contact({ locale }: { locale: Locale }) {
  const t = useTranslations("contact");

  return (
    <section id="contacto" className="py-24 px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display text-brand-navy mb-3">{t("title")}</h2>
          <p className="text-brand-navy/60">{t("subtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16">
          <ContactForm />

          <div className="flex flex-col justify-center gap-6">
            <a
              href={getWhatsAppHref("Hola! Me gustaría cotizar un servicio.", locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-4 border-2 border-brand-navy rounded-xl hover:bg-brand-navy hover:text-white group transition-colors"
            >
              <MessageCircle size={24} className="text-brand-navy group-hover:text-white" />
              <span className="font-semibold text-brand-navy group-hover:text-white">{t("whatsapp")}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Step 3: Create `src/components/layout/footer.tsx`**

```typescript
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Linkedin, Youtube, Instagram, Facebook } from "lucide-react";
import { SITE } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

const SOCIAL_LINKS = [
  { icon: Linkedin, href: SITE.linkedin, label: "LinkedIn" },
  { icon: Youtube, href: SITE.youtube, label: "YouTube" },
  { icon: Facebook, href: SITE.facebook, label: "Facebook" },
  { icon: Instagram, href: SITE.instagram, label: "Instagram" },
];

export function Footer({ locale }: { locale: Locale }) {
  const t = useTranslations("footer");

  return (
    <footer className="bg-brand-yellow px-8 py-12">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Logo */}
        <div className="relative w-48 h-12">
          <Image src="/logos/logo-navy.png" alt="The Monkeys" fill className="object-contain object-left" sizes="192px" />
        </div>

        {/* Info */}
        <div className="text-center md:text-left">
          <p className="text-brand-navy font-medium">{t("location")}</p>
          <p className="text-brand-navy/70 text-sm">{SITE.email}</p>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-3">
          {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-9 h-9 rounded-full bg-brand-navy/10 hover:bg-brand-navy flex items-center justify-center text-brand-navy hover:text-brand-yellow transition-colors"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-brand-navy/20 flex items-center justify-between text-sm text-brand-navy/60">
        <span>© {new Date().getFullYear()} The Monkeys · {t("rights")}</span>
        <div className="flex gap-4">
          <Link href="/" className={locale === "es" ? "font-semibold text-brand-navy" : "hover:text-brand-navy"}>ES</Link>
          <Link href="/en" className={locale === "en" ? "font-semibold text-brand-navy" : "hover:text-brand-navy"}>EN</Link>
        </div>
      </div>
    </footer>
  );
}
```

**Step 4: Add all to `page.tsx`, commit**

```bash
git add src/components/sections/contact.tsx src/components/ui/contact-form.tsx src/components/layout/footer.tsx
git commit -m "feat: add contact section, contact form with validation, and yellow footer"
```

---

## Task 11: API route — contact form with rate limiting

**Files:**
- Create: `src/app/api/contact/route.ts`
- Create: `.env.local.example`

**Step 1: Create `.env.local.example`**

```bash
# Resend — email delivery
# Get your key at resend.com
RESEND_API_KEY=re_xxxx

# Contact form
# Must be a verified sender domain in Resend
CONTACT_SENDER_EMAIL=The Monkeys <hola@themonkeys.do>
CONTACT_RECIPIENT_EMAIL=hola@themonkeys.do

# Upstash Redis — rate limiting
# Get credentials at upstash.com/redis
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxx

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=
```

**Step 2: Create `src/app/api/contact/route.ts`**

```typescript
import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { escapeHtml, sanitize, validateContactForm, MAX_LENGTHS } from "@/lib/validation";

/**
 * POST /api/contact
 *
 * Accepts a contact form submission and forwards it via Resend.
 *
 * Body (JSON):
 *   name     string  required  max 120 chars
 *   email    string  required  valid email, max 254 chars
 *   service  string  required  max 120 chars
 *   message  string  required  max 4000 chars
 *   company  string  optional  max 120 chars
 *   website  string  honeypot  must be empty
 *
 * Responses:
 *   200  { success: true }
 *   400  { success: false, error: string }
 *   429  { success: false, error: "Too many requests" }
 *   500  { success: false, error: string }
 *
 * Security: rate limiting (5 req/hour/IP) + honeypot + input validation + HTML escaping
 */

// Only initialize rate limiter if Upstash credentials are present
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(5, "1 h"),
        analytics: false,
      })
    : null;

export async function POST(request: NextRequest) {
  // Rate limiting
  if (ratelimit) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
    }
  }

  // Origin validation
  const origin = request.headers.get("origin");
  const allowedOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://themonkeys.do";
  if (origin && origin !== allowedOrigin && process.env.NODE_ENV === "production") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  let data: Record<string, string>;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Silently succeed to avoid exposing the trap.
  if (data.website) {
    return NextResponse.json({ success: true });
  }

  // Sanitize and validate
  const values = {
    name: sanitize(data.name ?? "", MAX_LENGTHS.name),
    email: sanitize(data.email ?? "", MAX_LENGTHS.email),
    company: sanitize(data.company ?? "", MAX_LENGTHS.company),
    service: sanitize(data.service ?? "", MAX_LENGTHS.service),
    message: sanitize(data.message ?? "", MAX_LENGTHS.message),
  };

  const { valid, errors } = validateContactForm(values);
  if (!valid) {
    const firstError = Object.values(errors)[0];
    return NextResponse.json({ success: false, error: firstError }, { status: 400 });
  }

  // Send email
  if (!process.env.RESEND_API_KEY) {
    console.error("[contact] RESEND_API_KEY not configured");
    return NextResponse.json({ success: false, error: "Email service not configured" }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const sender = process.env.CONTACT_SENDER_EMAIL ?? "The Monkeys <onboarding@resend.dev>";
  const recipient = process.env.CONTACT_RECIPIENT_EMAIL ?? "hola@themonkeys.do";

  const { error } = await resend.emails.send({
    from: sender,
    to: recipient,
    subject: `Nuevo mensaje de ${escapeHtml(values.name)} — The Monkeys`,
    html: `
      <h2>Nuevo mensaje de contacto</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(values.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(values.email)}</p>
      ${values.company ? `<p><strong>Empresa:</strong> ${escapeHtml(values.company)}</p>` : ""}
      <p><strong>Servicio:</strong> ${escapeHtml(values.service)}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${escapeHtml(values.message).replace(/\n/g, "<br>")}</p>
    `.replace(/</g, (m, offset, str) => str[offset - 1] === "\\" ? m : m),
    text: `Nombre: ${values.name}\nEmail: ${values.email}\nEmpresa: ${values.company}\nServicio: ${values.service}\nMensaje:\n${values.message}`,
  });

  if (error) {
    console.error("[contact] Resend error:", error.message);
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
```

**Step 3: Write API tests**

Create `tests/api-contact.test.ts`:

```typescript
import { test, describe } from "node:test";
import assert from "node:assert/strict";

// Test the validation logic used by the route (pure function, no HTTP)
import { validateContactForm, escapeHtml, sanitize } from "../src/lib/validation.js";

describe("contact route — validation", () => {
  test("rejects missing name", () => {
    const r = validateContactForm({ name: "", email: "a@b.com", service: "seo", message: "hi" });
    assert.ok(!r.valid);
    assert.ok(r.errors.name);
  });

  test("rejects invalid email", () => {
    const r = validateContactForm({ name: "A", email: "not-email", service: "seo", message: "hi" });
    assert.ok(!r.valid);
    assert.ok(r.errors.email);
  });

  test("accepts valid submission", () => {
    const r = validateContactForm({ name: "Ana", email: "ana@test.com", service: "seo", message: "Hola!" });
    assert.ok(r.valid);
  });

  test("sanitize trims and slices", () => {
    assert.equal(sanitize("  hello  ", 3), "hel");
  });

  test("escapeHtml prevents XSS", () => {
    assert.ok(!escapeHtml("<script>alert(1)</script>").includes("<script>"));
  });
});
```

**Step 4: Run tests**

```bash
npm test
```

Expected: all tests pass.

**Step 5: Commit**

```bash
git add src/app/api/ .env.local.example tests/api-contact.test.ts
git commit -m "feat: add contact API route with rate limiting, honeypot, HTML escaping, and tests"
```

---

## Task 12: Sticky navbar (post-hero)

**Files:**
- Create: `src/components/layout/navbar.tsx`

**Step 1: Create `src/components/layout/navbar.tsx`**

```typescript
"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { MKMonogram } from "@/components/ui/logo-wordmark";
import { NAV_LINK_KEYS, NAV_ANCHORS } from "@/lib/nav";
import type { Locale } from "@/i18n/routing";

export function Navbar({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      // Show navbar once user scrolls past ~100vh
      setVisible(window.scrollY > window.innerHeight * 0.8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-brand-navy/95 backdrop-blur-md border-b border-white/5"
        >
          <MKMonogram variant="yellow" className="w-10 h-10" />

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINK_KEYS.map((key) => (
              <Link
                key={key}
                href={NAV_ANCHORS[key]}
                className="px-3 py-1 text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                {t(key)}
              </Link>
            ))}
            <Link
              href="#contacto"
              className="ml-3 px-5 py-2 bg-brand-yellow text-brand-navy text-sm font-semibold rounded-full hover:bg-brand-yellow/90 transition-colors"
            >
              {t("cotizar")}
            </Link>
          </nav>

          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className={locale === "es" ? "text-brand-yellow font-semibold" : "text-white/60 hover:text-white"}>ES</Link>
            <span className="text-white/20">|</span>
            <Link href="/en" className={locale === "en" ? "text-brand-yellow font-semibold" : "text-white/60 hover:text-white"}>EN</Link>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
```

**Step 2: Add `<Navbar>` to `layout.tsx`**

Add `<Navbar locale={locale} />` inside the body, before `{children}`.

**Step 3: Commit**

```bash
git add src/components/layout/navbar.tsx
git commit -m "feat: add sticky navbar that appears after scrolling past hero"
```

---

## Task 13: JSON-LD SEO

**Files:**
- Create: `src/components/seo/json-ld.tsx`

**Step 1: Create `src/components/seo/json-ld.tsx`**

```typescript
import { SITE } from "@/lib/site";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.name,
    email: SITE.email,
    telephone: SITE.phone,
    url: SITE.domain,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Santiago de los Caballeros",
      addressCountry: "DO",
    },
    sameAs: [SITE.instagram, SITE.linkedin, SITE.facebook, SITE.youtube],
    serviceType: ["SEO", "Web Development", "Digital Marketing", "Content Production"],
  };

  return (
    <script
      type="application/ld+json"
      // Safe: JSON.stringify + </script> prevention
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
```

**Step 2: Add to `layout.tsx` inside `<head>`**

```typescript
import { JsonLd } from "@/components/seo/json-ld";
// Add <JsonLd /> inside <head> or at top of body
```

**Step 3: Commit**

```bash
git add src/components/seo/
git commit -m "feat: add JSON-LD LocalBusiness schema for SEO"
```

---

## Task 14: Sub-pages (Servicios, Portafolio)

**Files:**
- Create: `src/app/[locale]/servicios/page.tsx`
- Create: `src/app/[locale]/portafolio/page.tsx`
- Create: `src/app/[locale]/portafolio/[slug]/page.tsx`

These are simpler pages that expand on what's shown in the home. Implement them after the home is complete and working.

**Step 1: Create `src/app/[locale]/servicios/page.tsx`** — services detail page with full cards per service.

**Step 2: Create `src/app/[locale]/portafolio/page.tsx`** — full portfolio grid.

**Step 3: Create `src/app/[locale]/portafolio/[slug]/page.tsx`** — case study with `generateStaticParams` from `PROJECTS`.

**Step 4: Commit**

```bash
git commit -m "feat: add servicios and portafolio sub-pages"
```

---

## Task 15: Final QA checklist

Run through this before pushing to production:

```bash
# Build passes with no errors
npm run build

# No TypeScript errors
npx tsc --noEmit

# No lint errors
npm run lint

# All tests pass
npm test
```

**Manual checks:**
- [ ] Hero loads, noise texture visible, logo centered
- [ ] Scroll down: brandbook section slides up, logo travels to right column
- [ ] Services icons all show correctly
- [ ] Portfolio cards animate on scroll
- [ ] Logos banner scrolls continuously, pauses on hover
- [ ] Contact form: validation shows errors, submit works
- [ ] WhatsApp CTA links open WhatsApp with pre-filled message
- [ ] Sticky navbar appears after scrolling past hero
- [ ] Footer is yellow with navy logo and text
- [ ] ES/EN toggle switches language
- [ ] `/servicios` and `/portafolio` pages render
- [ ] Mobile: navbar hero collapses to hamburger (add if needed)
- [ ] `https://localhost:3000/sitemap.xml` renders correctly
- [ ] Browser DevTools: no console errors

```bash
git add -A
git commit -m "chore: final QA pass and cleanup"
```

---

## Environment variables checklist (before production)

```
RESEND_API_KEY              ← required for email
CONTACT_SENDER_EMAIL        ← must be verified Resend domain
CONTACT_RECIPIENT_EMAIL     ← where leads go
UPSTASH_REDIS_REST_URL      ← required for rate limiting
UPSTASH_REDIS_REST_TOKEN    ← required for rate limiting
NEXT_PUBLIC_SITE_URL        ← https://themonkeys.do
NEXT_PUBLIC_GA_ID           ← Google Analytics
NEXT_PUBLIC_META_PIXEL_ID   ← Meta Pixel
```
