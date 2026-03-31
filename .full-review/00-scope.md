# Review Scope — TheMonkeys Web

## Target

Auditoría global de producción del sitio web completo de **The Monkeys** (agencia creativa dominicana).
El objetivo es detectar cualquier problema que impida que el sitio sea production-ready una vez se agreguen las imágenes de los clientes.

## Stack

- **Framework**: Next.js 15.2 (App Router)
- **UI**: React 19, TypeScript 5.7 (strict)
- **Styling**: Tailwind CSS v4 (CSS-first, @theme {})
- **Animations**: GSAP 3.14 + @gsap/react 2.1
- **i18n**: next-intl 3.26 (es/en, localized pathnames)
- **Email**: Resend 4.0
- **Rate limiting**: Upstash Redis + @upstash/ratelimit
- **Analytics**: @vercel/analytics
- **Icons**: lucide-react 0.473
- **Deploy target**: Vercel

## Pages / Routes

| Route (es) | Route (en) | Archivo |
|---|---|---|
| / | /en | src/app/[locale]/page.tsx |
| /nosotros | /en/about | src/app/[locale]/nosotros/page.tsx |
| /servicios | /en/services | src/app/[locale]/servicios/page.tsx |
| /portafolio | /en/portfolio | src/app/[locale]/portafolio/page.tsx |
| /portafolio/[slug] | /en/portfolio/[slug] | src/app/[locale]/portafolio/[slug]/page.tsx |
| /contacto | /en/contact | src/app/[locale]/contacto/page.tsx |

## Files in Scope

### App Shell
- src/app/layout.tsx
- src/app/[locale]/layout.tsx
- src/app/[locale]/page.tsx
- src/app/[locale]/error.tsx
- src/app/globals.css
- src/app/robots.ts
- src/app/sitemap.ts
- src/middleware.ts

### Pages
- src/app/[locale]/nosotros/page.tsx
- src/app/[locale]/servicios/page.tsx
- src/app/[locale]/portafolio/page.tsx
- src/app/[locale]/portafolio/[slug]/page.tsx
- src/app/[locale]/contacto/page.tsx

### API
- src/app/api/contact/route.ts

### Components — Layout
- src/components/layout/navbar-hero.tsx
- src/components/layout/footer.tsx
- src/components/layout/page-transition.tsx

### Components — Pages
- src/components/pages/nosotros-content.tsx
- src/components/pages/servicios-content.tsx
- src/components/pages/contacto-content.tsx

### Components — Sections (Home)
- src/components/sections/hero.tsx
- src/components/sections/brandbook.tsx
- src/components/sections/contact.tsx
- src/components/sections/methodology.tsx
- src/components/sections/process.tsx
- src/components/sections/services-section.tsx
- src/components/sections/stats-bar.tsx

### Components — SEO
- src/components/seo/json-ld.tsx

### Components — UI
- src/components/ui/contact-form.tsx
- src/components/ui/footer.tsx       ← POSIBLE DUPLICADO con layout/footer.tsx
- src/components/ui/logo-wordmark.tsx
- src/components/ui/project-card.tsx
- src/components/ui/social-sidebar.tsx

### Hooks
- src/hooks/use-focus-trap.ts
- src/hooks/use-prefers-reduced-motion.ts

### i18n
- src/i18n/routing.ts
- src/i18n/navigation.ts
- src/i18n/request.ts
- src/messages/es.json
- src/messages/en.json

### Lib / Data
- src/lib/site.ts
- src/lib/nav.ts
- src/lib/portfolio.ts
- src/lib/services.ts
- src/lib/clients.ts
- src/lib/socials.tsx
- src/lib/utils.ts
- src/lib/validation.ts

### Config
- next.config.ts
- tsconfig.json
- postcss.config.mjs
- vercel.json
- package.json

### Tests
- tests/api-contact.test.ts
- tests/validation.test.ts

## Flags

- Security Focus: no
- Performance Critical: yes (Vercel deploy, Core Web Vitals)
- Strict Mode: no
- Framework: Next.js 15 App Router

## Áreas adicionales de auditoría (solicitadas explícitamente)

1. Visual/responsive con Playwright (375px, 768px, 1024px, 1440px)
2. SEO general (metadata, OG, robots, sitemap, JSON-LD, canonical)
3. SEO puntual por página
4. Animaciones GSAP (patrones, cleanup, SSR, performance)
5. Consistencia visual (design tokens, tipografía, colores)
6. Dependencias y tecnologías
7. Lógica del formulario de contacto y API

## Review Phases

1. Code Quality & Architecture
2. Security & Performance + Visual Playwright Audit
3. Testing & Documentation
4. Best Practices & Standards
5. Consolidated Report
