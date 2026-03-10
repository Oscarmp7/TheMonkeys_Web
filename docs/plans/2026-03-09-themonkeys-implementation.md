# The Monkeys Website — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the complete The Monkeys agency website with Next.js 14, Sanity CMS, i18n, dark/light mode, and all 9 approved sections.

**Architecture:** Single-page scrollable site built with Next.js App Router. Sanity CMS embedded at `/studio` for content management. next-intl handles ES/EN with locale-based routing (`/es`, `/en`). Tailwind CSS + Framer Motion for styling and animations. Contact form via API route + Resend.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Sanity v3, next-intl, Framer Motion, Resend, Vercel

**Design Doc:** `docs/plans/2026-03-09-themonkeys-web-design.md`

---

## Phase 1: Project Foundation

### Task 1: Initialize Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`
- Create: `.env.local.example`

**Step 1: Scaffold Next.js with TypeScript + Tailwind**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Select: App Router YES, src/ YES, Tailwind YES, ESLint YES.

**Step 2: Install core dependencies**

```bash
npm install framer-motion next-intl next-themes lucide-react
npm install -D @types/node
```

**Step 3: Verify dev server starts**

```bash
npm run dev
```

Expected: Server runs at localhost:3000 with default Next.js page.

**Step 4: Commit**

```bash
git init
git add -A
git commit -m "chore: initialize Next.js 14 project with TypeScript and Tailwind"
```

---

### Task 2: Configure Tailwind theme with brand tokens

**Files:**
- Modify: `tailwind.config.ts`
- Create: `src/app/globals.css`

**Step 1: Configure Tailwind with brand colors and dark mode**

In `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#FFCD00",
          navy: "#00263E",
          "navy-light": "#003456",
          "navy-deep": "#001A2C",
        },
        surface: {
          light: "#FFFFFF",
          "light-alt": "#F8F9FA",
          dark: "#00263E",
          "dark-alt": "#001A2C",
        },
        whatsapp: "#25D366",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
    },
  },
  plugins: [],
};

export default config;
```

**Step 2: Set up base globals.css**

In `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-surface-light text-brand-navy antialiased;
  }

  .dark body {
    @apply bg-surface-dark text-white;
  }
}
```

**Step 3: Verify Tailwind compiles**

```bash
npm run dev
```

Check: No build errors, page loads.

**Step 4: Commit**

```bash
git add tailwind.config.ts src/app/globals.css
git commit -m "feat: configure Tailwind with The Monkeys brand tokens and dark mode"
```

---

### Task 3: Set up fonts

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Configure display + body fonts**

Use `next/font/google`. Display: **Space Grotesk** (bold, geometric, modern — complements the 3D logo). Body: **Inter** or **DM Sans** (clean, readable).

```typescript
import { Space_Grotesk, DM_Sans } from "next/font/google";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}
```

**Step 2: Verify fonts load**

```bash
npm run dev
```

Check: Fonts render in browser, no FOUT.

**Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: configure Space Grotesk + DM Sans fonts"
```

---

### Task 4: Set up dark/light mode with next-themes

**Files:**
- Create: `src/components/providers/theme-provider.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Create ThemeProvider wrapper**

```typescript
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
```

Note: Install next-themes if not already: `npm install next-themes`

**Step 2: Wrap layout with ThemeProvider**

In `src/app/layout.tsx`, wrap `{children}` with `<ThemeProvider>`.

**Step 3: Verify theme toggles**

Manually add `dark` class to `<html>` in dev tools. Background should change from white to navy.

**Step 4: Commit**

```bash
git add src/components/providers/theme-provider.tsx src/app/layout.tsx
git commit -m "feat: add dark/light mode with next-themes"
```

---

### Task 5: Set up i18n with next-intl

**Files:**
- Create: `src/i18n/request.ts`
- Create: `src/i18n/routing.ts`
- Create: `src/messages/es.json`
- Create: `src/messages/en.json`
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/[locale]/page.tsx`
- Modify: `next.config.ts`
- Create: `src/middleware.ts`

**Step 1: Create routing config**

`src/i18n/routing.ts`:

```typescript
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
});
```

**Step 2: Create request config**

`src/i18n/request.ts`:

```typescript
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

**Step 3: Create initial message files**

`src/messages/es.json`:

```json
{
  "nav": {
    "services": "Servicios",
    "portfolio": "Portfolio",
    "about": "Nosotros",
    "contact": "Contacto",
    "cta": "Cotiza Ahora!"
  },
  "hero": {
    "overheader": "Agencia Creativa Digital",
    "title": "Hacemos que las marcas crezcan en digital",
    "subtitle": "Ayudamos a las marcas a crecer en el entorno digital a través de estrategias de comunicación modernas, creativas y orientadas a resultados.",
    "cta_primary": "Cotiza Ahora!",
    "cta_secondary": "Ver Portfolio"
  },
  "services": {
    "overheader": "Lo que hacemos",
    "title": "Servicios",
    "cta": "Cotiza Ahora!",
    "items": {
      "inbound": "Inbound Marketing",
      "content_production": "Producción de Contenidos",
      "seo": "SEO",
      "web_dev": "Desarrollo Web",
      "influencers": "Marketing de Influencers",
      "campaigns": "Campaña Digital",
      "content_creation": "Creación de Contenido"
    }
  },
  "portfolio": {
    "overheader": "Nuestro trabajo",
    "title": "Portfolio",
    "cta_placeholder": "¿Quieres ser el siguiente?"
  },
  "clients": {
    "overheader": "Marcas que confían en nosotros"
  },
  "about": {
    "overheader": "Sobre nosotros",
    "statement": "Hacemos",
    "bio": "ayudamos a las marcas a crecer en el entorno digital a través de estrategias de comunicación modernas, creativas y orientadas a resultados.",
    "location": "Santiago de los Caballeros, RD",
    "values": {
      "transparency": {
        "title": "Transparencia",
        "description": "Comunicación clara y honesta en cada paso del proceso."
      },
      "quality": {
        "title": "Calidad",
        "description": "Excelencia en cada entrega, sin excepciones."
      },
      "service": {
        "title": "Buen Servicio",
        "description": "Tu éxito es nuestro éxito. Siempre disponibles."
      }
    }
  },
  "contact": {
    "overheader": "Hablemos",
    "title": "¿Listo para crecer en digital?",
    "bio": "The Monkeys es una agencia creativa digital enfocada en ayudar a las marcas a crecer dentro del entorno digital moderno mediante estrategias de marketing con valor, creatividad y enfoque en resultados.",
    "whatsapp_cta": "Escríbenos por WhatsApp",
    "form": {
      "name": "Nombre",
      "email": "Email",
      "company": "Empresa (opcional)",
      "service": "Servicio que te interesa",
      "message": "Mensaje",
      "submit": "Enviar mensaje",
      "success": "¡Mensaje enviado! Te contactaremos pronto.",
      "error": "Hubo un error. Intenta de nuevo."
    }
  },
  "footer": {
    "tagline": "Ayudamos a las marcas a crecer en digital.",
    "copyright": "© 2026 The Monkeys. Todos los derechos reservados."
  },
  "whatsapp": {
    "tooltip": "¿Hablamos?"
  }
}
```

`src/messages/en.json`:

```json
{
  "nav": {
    "services": "Services",
    "portfolio": "Portfolio",
    "about": "About",
    "contact": "Contact",
    "cta": "Get a Quote!"
  },
  "hero": {
    "overheader": "Creative Digital Agency",
    "title": "We make brands grow in digital",
    "subtitle": "We help brands grow in the digital environment through modern, creative, and results-oriented communication strategies.",
    "cta_primary": "Get a Quote!",
    "cta_secondary": "View Portfolio"
  },
  "services": {
    "overheader": "What we do",
    "title": "Services",
    "cta": "Get a Quote!",
    "items": {
      "inbound": "Inbound Marketing",
      "content_production": "Content Production",
      "seo": "SEO",
      "web_dev": "Web Development",
      "influencers": "Influencer Marketing",
      "campaigns": "Digital Campaigns",
      "content_creation": "Content Creation"
    }
  },
  "portfolio": {
    "overheader": "Our work",
    "title": "Portfolio",
    "cta_placeholder": "Want to be next?"
  },
  "clients": {
    "overheader": "Brands that trust us"
  },
  "about": {
    "overheader": "About us",
    "statement": "We create",
    "bio": "we help brands grow in the digital environment through modern, creative, and results-oriented communication strategies.",
    "location": "Santiago de los Caballeros, DR",
    "values": {
      "transparency": {
        "title": "Transparency",
        "description": "Clear and honest communication at every step."
      },
      "quality": {
        "title": "Quality",
        "description": "Excellence in every delivery, no exceptions."
      },
      "service": {
        "title": "Great Service",
        "description": "Your success is our success. Always available."
      }
    }
  },
  "contact": {
    "overheader": "Let's talk",
    "title": "Ready to grow in digital?",
    "bio": "The Monkeys is a creative digital agency focused on helping brands grow in the modern digital environment through marketing strategies with value, creativity, and a focus on results.",
    "whatsapp_cta": "Message us on WhatsApp",
    "form": {
      "name": "Name",
      "email": "Email",
      "company": "Company (optional)",
      "service": "Service you're interested in",
      "message": "Message",
      "submit": "Send message",
      "success": "Message sent! We'll contact you soon.",
      "error": "There was an error. Please try again."
    }
  },
  "footer": {
    "tagline": "We help brands grow in digital.",
    "copyright": "© 2026 The Monkeys. All rights reserved."
  },
  "whatsapp": {
    "tooltip": "Let's talk?"
  }
}
```

**Step 4: Create middleware for locale routing**

`src/middleware.ts`:

```typescript
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|studio|.*\\..*).*)"],
};
```

Note: `studio` is excluded so Sanity Studio works without locale prefix.

**Step 5: Update next.config.ts**

```typescript
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig = {};

export default withNextIntl(nextConfig);
```

**Step 6: Move layout and page under [locale]**

Move `src/app/layout.tsx` → `src/app/[locale]/layout.tsx` and `src/app/page.tsx` → `src/app/[locale]/page.tsx`. Update layout to use `NextIntlClientProvider`.

Create a root `src/app/layout.tsx` that just has basic html/body tags (the locale layout handles the real content).

**Step 7: Verify i18n works**

```bash
npm run dev
```

Visit `localhost:3000/es` and `localhost:3000/en`. Both should load without errors.

**Step 8: Commit**

```bash
git add .
git commit -m "feat: configure next-intl with ES/EN locale routing"
```

---

### Task 6: Set up Sanity CMS

**Files:**
- Create: `sanity.config.ts`
- Create: `sanity.cli.ts`
- Create: `src/sanity/lib/client.ts`
- Create: `src/sanity/lib/image.ts`
- Create: `src/sanity/schemas/index.ts`
- Create: `src/sanity/schemas/project.ts`
- Create: `src/sanity/schemas/clientLogo.ts`
- Create: `src/sanity/schemas/siteSettings.ts`
- Create: `src/app/studio/[[...tool]]/page.tsx`
- Create: `src/app/studio/layout.tsx`

**Step 1: Install Sanity dependencies**

```bash
npm install sanity @sanity/vision @sanity/image-url next-sanity
```

**Step 2: Create Sanity project**

Go to sanity.io/manage, create a new project called "The Monkeys". Note the project ID. Add `localhost:3000` and `themonkeys.do` to CORS origins.

Create `.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=<your-token>
```

**Step 3: Create Sanity config files**

`sanity.config.ts`:

```typescript
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";

export default defineConfig({
  name: "the-monkeys",
  title: "The Monkeys CMS",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: "/studio",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
```

**Step 4: Create Sanity schemas**

`src/sanity/schemas/project.ts` — Portfolio projects with localized fields:

```typescript
import { defineType, defineField } from "sanity";

export default defineType({
  name: "project",
  title: "Portfolio Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      fields: [
        { name: "es", type: "string", title: "Español" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title.es", maxLength: 96 },
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "object",
      fields: [
        { name: "es", type: "text", title: "Español" },
        { name: "en", type: "text", title: "English" },
      ],
    }),
    defineField({
      name: "services",
      title: "Services Rendered",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Inbound Marketing", value: "inbound" },
          { title: "Producción de Contenidos", value: "content_production" },
          { title: "SEO", value: "seo" },
          { title: "Desarrollo Web", value: "web_dev" },
          { title: "Marketing de Influencers", value: "influencers" },
          { title: "Campaña Digital", value: "campaigns" },
          { title: "Creación de Contenido", value: "content_creation" },
        ],
      },
    }),
    defineField({
      name: "featured",
      title: "Featured Project",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
    }),
  ],
  orderings: [{ title: "Display Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
});
```

`src/sanity/schemas/clientLogo.ts`:

```typescript
import { defineType, defineField } from "sanity";

export default defineType({
  name: "clientLogo",
  title: "Client Logo",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Client Name", type: "string" }),
    defineField({
      name: "logo",
      title: "Logo (color version)",
      type: "image",
      description: "Upload the color logo. Grayscale is applied automatically on the website.",
    }),
    defineField({ name: "url", title: "Client Website", type: "url" }),
    defineField({ name: "order", title: "Display Order", type: "number" }),
  ],
});
```

`src/sanity/schemas/siteSettings.ts`:

```typescript
import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "object",
      fields: [
        { name: "es", type: "string", title: "Español" },
        { name: "en", type: "string", title: "English" },
      ],
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "object",
      fields: [
        { name: "es", type: "text", title: "Español" },
        { name: "en", type: "text", title: "English" },
      ],
    }),
    defineField({ name: "ogImage", title: "OG Image", type: "image" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "whatsapp", title: "WhatsApp Number", type: "string" }),
    defineField({ name: "address", title: "Address", type: "string" }),
  ],
});
```

`src/sanity/schemas/index.ts`:

```typescript
import project from "./project";
import clientLogo from "./clientLogo";
import siteSettings from "./siteSettings";

export const schemaTypes = [project, clientLogo, siteSettings];
```

**Step 5: Create Studio route**

`src/app/studio/[[...tool]]/page.tsx`:

```typescript
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

`src/app/studio/layout.tsx`:

```typescript
export const metadata = { title: "The Monkeys — CMS" };

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

**Step 6: Create Sanity client**

`src/sanity/lib/client.ts`:

```typescript
import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: true,
});
```

`src/sanity/lib/image.ts`:

```typescript
import createImageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
```

**Step 7: Verify Studio loads**

```bash
npm run dev
```

Visit `localhost:3000/studio`. Sanity Studio should load with the 3 schemas.

**Step 8: Commit**

```bash
git add .
git commit -m "feat: configure Sanity CMS with project, clientLogo, and siteSettings schemas"
```

---

## Phase 2: Layout & Core Components

### Task 7: Copy logo assets to public folder

**Files:**
- Create: `public/logos/logo-main.png` (yellow/navy)
- Create: `public/logos/logo-white.png` (white variant)
- Create: `public/logos/logo-navy.png` (mono navy)
- Create: `public/logos/mk-main.png` (isotipo yellow/navy)
- Create: `public/logos/mk-white.png` (isotipo white)
- Create: `public/logos/mk-navy.png` (isotipo navy)
- Create: `public/logos/favicon.png` (MK isotipo for favicon)

**Step 1: Create public/logos directory and copy optimized logo PNGs**

Copy from `docs/Logo/The Monkeys Entrega/The Monkeys Entrega/PNG/` to `public/logos/` with clean filenames. Optimize with a tool or manually ensure reasonable file sizes.

**Step 2: Set up favicon**

Use the MK isotipo as favicon in `src/app/[locale]/layout.tsx` metadata.

**Step 3: Commit**

```bash
git add public/logos
git commit -m "feat: add logo assets to public directory"
```

---

### Task 8: Build Navbar component

**Files:**
- Create: `src/components/layout/navbar.tsx`
- Create: `src/components/ui/theme-toggle.tsx`
- Create: `src/components/ui/language-toggle.tsx`
- Create: `src/components/ui/hamburger-button.tsx`
- Create: `src/components/layout/mobile-drawer.tsx`

**Step 1: Build ThemeToggle**

Moon/sun icon toggle using `next-themes` useTheme hook. Lucide icons for sun/moon.

**Step 2: Build LanguageToggle**

ES | EN toggle using next-intl's `useRouter` and `useLocale`. Changes URL from `/es` to `/en`.

**Step 3: Build HamburgerButton**

Custom SVG morph animation: 3 lines → X with a subtle rotation. Uses CSS transitions only (no Framer Motion needed). The middle line fades out while top/bottom rotate into X with a slight 180deg twist.

**Step 4: Build MobileDrawer**

Slide-in drawer from right with backdrop blur. Contains nav links + language toggle + theme toggle + CTA. Uses Framer Motion for slide animation.

**Step 5: Build Navbar**

Combines all pieces. Sticky on scroll with `backdrop-blur-md bg-white/80 dark:bg-brand-navy/80`. Logo (MK isotipo) left, nav links center, toggles + CTA right.

**Step 6: Verify navbar renders**

Add Navbar to the locale layout. Check:
- Desktop: all elements visible
- Mobile (resize): hamburger shows, drawer opens
- Theme toggle switches classes
- Language toggle changes URL

**Step 7: Commit**

```bash
git add src/components/layout src/components/ui
git commit -m "feat: build responsive navbar with theme/language toggles and mobile drawer"
```

---

### Task 9: Build Hero section

**Files:**
- Create: `src/components/sections/hero.tsx`
- Create: `src/components/ui/floating-shapes.tsx`
- Create: `src/components/ui/scroll-indicator.tsx`

**Step 1: Build FloatingShapes**

Abstract geometric shapes (circles, rectangles, triangles) in yellow/navy. Framer Motion infinite floating animation with different speeds per shape. Positioned absolutely in the right 40% of the hero.

**Step 2: Build ScrollIndicator**

Chevron-down icon with a bounce animation. Positioned at bottom center of hero.

**Step 3: Build Hero**

Two-column layout. Left: overheader (small caps, yellow), H1 with stagger word animation (Framer Motion), subtitle fade-in, two CTA buttons. Right: FloatingShapes component. Full viewport height.

CTA primary: yellow bg, navy text → links to `wa.me/18097561847`.
CTA secondary: outline border → smooth scroll to `#portfolio`.

**Step 4: Verify hero renders**

Check both light/dark mode. Check mobile layout (single column, shapes hidden or reduced).

**Step 5: Commit**

```bash
git add src/components/sections/hero.tsx src/components/ui/floating-shapes.tsx src/components/ui/scroll-indicator.tsx
git commit -m "feat: build hero section with animations and floating shapes"
```

---

### Task 10: Build Servicios section

**Files:**
- Create: `src/components/sections/services.tsx`
- Create: `src/components/ui/service-card.tsx`
- Create: `src/components/ui/section-header.tsx`

**Step 1: Build SectionHeader**

Reusable component: overheader (small text, yellow accent) + H2 (large, bold). Used across all sections.

**Step 2: Build ServiceCard**

Card with Lucide line-art icon + service name. Hover: `translateY(-4px)` + shadow + icon color turns yellow. Framer Motion for entrance animation with stagger.

Icon mapping:
- Inbound Marketing → `TrendingUp`
- Producción de Contenidos → `Film`
- SEO → `Search`
- Desarrollo Web → `Code`
- Marketing de Influencers → `Users`
- Campaña Digital → `Megaphone`
- Creación de Contenido → `Camera`

**Step 3: Build Services section**

SectionHeader + 3-column grid of ServiceCards + CTA button at bottom.

**Step 4: Verify services render**

Check grid on desktop (3 cols), tablet (2), mobile (1). Check hover effects. Check dark/light modes.

**Step 5: Commit**

```bash
git add src/components/sections/services.tsx src/components/ui/service-card.tsx src/components/ui/section-header.tsx
git commit -m "feat: build services section with card grid and animations"
```

---

### Task 11: Build Portfolio section

**Files:**
- Create: `src/components/sections/portfolio.tsx`
- Create: `src/components/ui/portfolio-card.tsx`
- Create: `src/components/ui/project-modal.tsx`
- Create: `src/sanity/lib/queries.ts`

**Step 1: Create Sanity queries**

`src/sanity/lib/queries.ts`:

```typescript
import { groq } from "next-sanity";

export const projectsQuery = groq`
  *[_type == "project"] | order(order asc) {
    _id, title, slug, mainImage, gallery, description, services, featured
  }
`;

export const clientLogosQuery = groq`
  *[_type == "clientLogo"] | order(order asc) {
    _id, name, logo, url
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]
`;
```

**Step 2: Build PortfolioCard**

Bento-style card with image fill. Hover: overlay with project title + service tags. Featured projects get `col-span-2 row-span-2` in the bento grid.

**Step 3: Build ProjectModal**

Framer Motion animated modal with backdrop. Shows: full gallery (image carousel), title, description, service tags. Close on backdrop click or X button.

**Step 4: Build Portfolio section**

Fetches projects from Sanity (or fallback to static Jimetor data). Bento grid layout. Includes placeholder "¿Quieres ser el siguiente?" card linking to WhatsApp.

**Step 5: Seed Jimetor data in Sanity**

Through the Studio at `/studio`, create the Jimetor Eco Village project entry with the available assets.

**Step 6: Verify portfolio renders**

Check bento layout, hover effects, modal opens/closes, responsive layout.

**Step 7: Commit**

```bash
git add src/components/sections/portfolio.tsx src/components/ui/portfolio-card.tsx src/components/ui/project-modal.tsx src/sanity/lib/queries.ts
git commit -m "feat: build portfolio section with bento grid and project modal"
```

---

### Task 12: Build Client Logos section

**Files:**
- Create: `src/components/sections/client-logos.tsx`

**Step 1: Build ClientLogos section**

Fetches logos from Sanity. Displays in a flex row (or marquee if many). Each logo: `filter: grayscale(100%); opacity: 0.6` default → `grayscale(0%); opacity: 1` on hover with `transition: all 0.4s ease`.

If few logos (< 5), static centered row. If 5+, infinite marquee with CSS animation that pauses on hover.

**Step 2: Seed Jimetor logo in Sanity**

Upload Jimetor logo through Studio.

**Step 3: Verify grayscale/color hover effect**

Hover on logo, should smoothly fade from gray to full color.

**Step 4: Commit**

```bash
git add src/components/sections/client-logos.tsx
git commit -m "feat: build client logos section with grayscale-to-color hover"
```

---

### Task 13: Build About section

**Files:**
- Create: `src/components/sections/about.tsx`
- Create: `src/components/ui/value-card.tsx`

**Step 1: Build ValueCard**

Icon + title + short description. Framer Motion stagger entrance. Icons from Lucide:
- Transparencia → `Eye`
- Calidad → `Award`
- Buen Servicio → `Handshake`

**Step 2: Build About section**

SectionHeader + statement H2 "Hacemos" + paragraph + 3 ValueCards + location with MapPin icon.

Alt background: `bg-surface-light-alt dark:bg-brand-navy-deep`.

**Step 3: Verify about renders**

Check text, value cards, location. Both themes.

**Step 4: Commit**

```bash
git add src/components/sections/about.tsx src/components/ui/value-card.tsx
git commit -m "feat: build about section with values and statement"
```

---

### Task 14: Build Contact section

**Files:**
- Create: `src/components/sections/contact.tsx`
- Create: `src/components/ui/contact-form.tsx`
- Create: `src/app/api/contact/route.ts`

**Step 1: Install Resend**

```bash
npm install resend
```

Add to `.env.local`: `RESEND_API_KEY=<your-key>`

**Step 2: Build API route**

`src/app/api/contact/route.ts`:

```typescript
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { name, email, company, service, message } = await request.json();

  try {
    await resend.emails.send({
      from: "The Monkeys Web <onboarding@resend.dev>",
      to: "hola@themonkeys.do",
      subject: `Nuevo lead: ${name} — ${service}`,
      html: `
        <h2>Nuevo contacto desde themonkeys.do</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Empresa:</strong> ${company || "No especificada"}</p>
        <p><strong>Servicio:</strong> ${service}</p>
        <p><strong>Mensaje:</strong> ${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
```

**Step 3: Build ContactForm**

Client component with form state management. Fields: name (required), email (required), company (optional), service (dropdown, required), message (required). Client-side validation. Submits to `/api/contact`. Shows success/error toast.

**Step 4: Build Contact section**

Two columns. Left: bio larga, phone, email, address, WhatsApp button (green). Right: ContactForm.

**Step 5: Verify form submits**

Test with Resend test key. Check validation, success message.

**Step 6: Commit**

```bash
git add src/components/sections/contact.tsx src/components/ui/contact-form.tsx src/app/api/contact/route.ts
git commit -m "feat: build contact section with form and Resend email integration"
```

---

### Task 15: Build Footer

**Files:**
- Create: `src/components/layout/footer.tsx`

**Step 1: Build Footer**

Always dark navy. 3 columns: brand (white logo + tagline), navigation links (smooth scroll), social icons + contact info.

Social icons with hover `text-brand-yellow` transition. Links:
- Instagram: https://www.instagram.com/themonkeys.do/
- Facebook: https://www.facebook.com/themonkeys.do
- LinkedIn: https://www.linkedin.com/company/the-monkeysrd/
- YouTube: https://www.youtube.com/@Themonkeysrd
- Pinterest: https://www.pinterest.com/themonkeysdo/

Separator line + copyright.

**Step 2: Verify footer renders**

Check all links open correctly. Check responsive layout (stacks on mobile).

**Step 3: Commit**

```bash
git add src/components/layout/footer.tsx
git commit -m "feat: build footer with social links and navigation"
```

---

### Task 16: Build WhatsApp Floating Button

**Files:**
- Create: `src/components/ui/whatsapp-button.tsx`

**Step 1: Build WhatsApp button**

Fixed position bottom-right. WhatsApp SVG icon in green circle. Hover: scale(1.1) + tooltip "¿Hablamos?". Click: opens `wa.me/18097561847?text=Hola,%20me%20interesa%20saber%20más%20sobre%20sus%20servicios`.

On mobile: larger touch target. Hides on fast scroll down (track scroll direction), reappears on scroll up or stop.

**Step 2: Verify button behavior**

Check fixed positioning, hover effect, click opens WhatsApp link. Check mobile scroll hide/show.

**Step 3: Commit**

```bash
git add src/components/ui/whatsapp-button.tsx
git commit -m "feat: add floating WhatsApp button with scroll behavior"
```

---

## Phase 3: Assembly & Polish

### Task 17: Assemble the full page

**Files:**
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/app/[locale]/layout.tsx`

**Step 1: Compose all sections in page.tsx**

Import all section components and render in order: Hero → Services → Portfolio → ClientLogos → About → Contact. Add `id` attributes for smooth scroll targets.

**Step 2: Add Navbar and Footer to layout**

Navbar at top, Footer at bottom, WhatsApp button in layout (always present).

**Step 3: Add smooth scroll CSS**

```css
html {
  scroll-behavior: smooth;
}
```

**Step 4: Full page walkthrough**

Scroll through entire page. Check section transitions, animations trigger on scroll, all links work, both themes, both languages.

**Step 5: Commit**

```bash
git add src/app/[locale]/page.tsx src/app/[locale]/layout.tsx
git commit -m "feat: assemble full single-page layout with all sections"
```

---

### Task 18: SEO & Metadata

**Files:**
- Modify: `src/app/[locale]/layout.tsx`
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Create: `src/components/seo/json-ld.tsx`

**Step 1: Configure metadata in layout**

Dynamic metadata based on locale: title, description, Open Graph, Twitter Card, hreflang alternates.

**Step 2: Add JSON-LD structured data**

Organization + LocalBusiness schema for Google.

**Step 3: Create sitemap.ts**

Dynamic sitemap with both locales.

**Step 4: Create robots.ts**

Allow all, disallow `/studio`.

**Step 5: Verify SEO**

Check page source for meta tags, Open Graph, hreflang. Check `/sitemap.xml` and `/robots.txt` load.

**Step 6: Commit**

```bash
git add src/app/[locale]/layout.tsx src/app/sitemap.ts src/app/robots.ts src/components/seo/json-ld.tsx
git commit -m "feat: add SEO metadata, JSON-LD, sitemap, and robots.txt"
```

---

### Task 19: Analytics Integration

**Files:**
- Create: `src/components/analytics/google-analytics.tsx`
- Create: `src/components/analytics/meta-pixel.tsx`
- Modify: `src/app/[locale]/layout.tsx`

**Step 1: Build GoogleAnalytics component**

Uses `next/script` with strategy `afterInteractive`. Loads GA4 tag.

**Step 2: Build MetaPixel component**

Uses `next/script` with strategy `afterInteractive`. Loads Meta Pixel.

**Step 3: Add to layout**

Both components conditionally loaded (only if env vars present).

Env vars: `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`.

**Step 4: Commit**

```bash
git add src/components/analytics src/app/[locale]/layout.tsx
git commit -m "feat: add Google Analytics 4 and Meta Pixel integration"
```

---

### Task 20: Final polish and responsive QA

**Step 1: Test all breakpoints**

- Mobile (375px): Everything stacks, hamburger works, touch targets adequate
- Tablet (768px): 2-column grids, drawer works
- Desktop (1280px+): Full layout, all hover effects

**Step 2: Test both themes**

Full scroll in light mode, full scroll in dark mode. Check contrast, readability.

**Step 3: Test both languages**

Full scroll in ES, full scroll in EN. Check all text switches.

**Step 4: Test Sanity Studio**

Go to `/studio`. Create a test project, verify it appears in portfolio. Upload a client logo, verify grayscale-to-color hover.

**Step 5: Run Lighthouse**

```bash
npx lighthouse http://localhost:3000/es --view
```

Target: 90+ Performance, Accessibility, Best Practices, SEO.

**Step 6: Final commit**

```bash
git add .
git commit -m "chore: responsive QA and final polish"
```

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 1-6 | Foundation: Next.js, Tailwind, fonts, dark mode, i18n, Sanity |
| 2 | 7-16 | Components: Navbar, Hero, Services, Portfolio, Logos, About, Contact, Footer, WhatsApp |
| 3 | 17-20 | Assembly: Full page, SEO, analytics, polish |

**Total: 20 tasks**

**Deploy:** After all tasks pass QA, deploy to Vercel with env vars configured. Point `themonkeys.do` DNS to Vercel.
