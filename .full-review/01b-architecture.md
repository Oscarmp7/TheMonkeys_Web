# Phase 1B: Architecture Review — TheMonkeys Web

**Date**: 2026-03-30 | **Stack**: Next.js 15.2 / React 19 / TypeScript 5.7 / Tailwind CSS v4 / GSAP 3.14 / next-intl 3.26

---

## CRITICAL (0)
Sin hallazgos críticos arquitectónicos.

---

## HIGH (3)

### A-H01 — Home page no llama `setRequestLocale` — rompe SSG/ISR
**File**: `src/app/[locale]/page.tsx` | **Severidad**: High

Todas las páginas internas (nosotros, servicios, contacto, portafolio, portafolio/[slug]) llaman `setRequestLocale(locale)` después del `await params`. La home page NO. next-intl lo requiere en cada page y layout para que el rendering estático funcione.

**Fix**:
```ts
const { locale } = await params;
setRequestLocale(locale); // ← añadir esta línea
```

### A-H02 — Sin hreflang alternates en ninguna página — SEO multilingüe roto
**File**: `src/app/[locale]/layout.tsx` (generateMetadata) | **Severidad**: High

Cero páginas generan `alternates` en su metadata. Google usa hreflang para entender qué versión mostrar por locale. Sin esto, las páginas en español e inglés compiten entre sí en resultados de búsqueda y Google puede indexar solo un locale.

**Fix** (añadir a generateMetadata de cada página):
```ts
alternates: {
  canonical: `${SITE.domain}${locale === 'es' ? '/ruta' : '/en/route'}`,
  languages: {
    es: `${SITE.domain}/ruta`,
    en: `${SITE.domain}/en/route`,
  },
},
```

### A-H03 — `portafolio/page.tsx` y `portafolio/[slug]/page.tsx` sin `generateMetadata`
**Severidad**: High

Ambas páginas de portafolio heredan la metadata del home (`The Monkeys | Agencia de Marketing...`). Cada proyecto debería tener title y description únicos para SEO.

**Fix**: Agregar `generateMetadata` usando los datos de `PROJECTS` para generar títulos y descripciones específicas por proyecto.

---

## MEDIUM (6)

### A-M01 — Footer hardcodea strings i18n en lugar de usar getTranslations
**File**: `src/components/layout/footer.tsx` líneas 14-47 | **Severidad**: Medium

El footer tiene un objeto `copy` con strings inline en español/inglés. Como Server Component, debería usar `getTranslations` de `next-intl/server`. Si una traducción cambia en los JSON, el footer queda desincronizado.

### A-M02 — Número de teléfono formateado duplicado en 3+ lugares
**Severidad**: Medium

`"+1 (809) 756-1847"` existe en:
- `src/components/layout/footer.tsx` línea 7 (hardcoded)
- `src/components/pages/contacto-content.tsx` línea 111 (hardcoded)
- `src/messages/es.json` y `en.json` (en meta descriptions)

`SITE.phone` tiene `"+18097561847"` sin formato. **Fix**: Agregar `phoneFormatted: "+1 (809) 756-1847"` a `src/lib/site.ts` y referenciar desde ahí.

### A-M03 — `nosotros-content.tsx` y `servicios-content.tsx` usan `NextLink` — rompe i18n
**Severidad**: Medium (mismo que H-04 del Code Reviewer — coinciden en prioridad alta)

Estos componentes importan `NextLink from "next/link"` para links a `/contacto` y `/servicios`. En `/en/about`, el link navega a `/contacto` (ES) en vez de `/en/contact` (EN). **Rompe la navegación i18n para usuarios en inglés.**

### A-M04 — Sin CSRF token en `/api/contact`
**File**: `src/app/api/contact/route.ts` | **Severidad**: Medium

El check de `Origin` header provee protección básica, pero puede ser spoofed en contextos non-browser. El honeypot + rate limiter mitigan el riesgo para un formulario de contacto, pero un CSRF token daría defense-in-depth.

### A-M05 — Sin imagen OpenGraph especificada
**File**: `src/app/[locale]/layout.tsx` líneas 60-66 | **Severidad**: Medium

El metadata de `openGraph` no incluye `images`. Al compartir en redes sociales no habrá preview image. Las plataformas usan la primera imagen que encuentran en la página, que puede no ser ideal.

**Fix**:
```ts
openGraph: {
  images: [{ url: `${SITE.domain}/og-image.jpg`, width: 1200, height: 630, alt: 'The Monkeys' }],
  // ...existing fields
}
```

### A-M06 — `eslint.config.mjs` eliminado según git status
**Severidad**: Medium

El git status muestra `D eslint.config.mjs`. `npm run lint` puede fallar sin config ESLint. **Fix**: Verificar que `npm run lint` funcione; si no, recrear el archivo.

---

## LOW (6)

### A-L01 — `PageTransition` como wrapper en el layout crea un Client subtree grande
**File**: `src/app/[locale]/layout.tsx` línea 96-98 | **Severidad**: Low

`PageTransition` es `"use client"` y wrappea `{children}`. El `style={{ opacity: 0 }}` inicial puede causar flash invisible si GSAP tarda. Alternativa: CSS fallback con `@supports not` o fallback `<noscript>`.

### A-L02 — WhatsApp message hardcoded en español en `servicios-content.tsx`
**File**: líneas 33-35 | **Severidad**: Low (mismo que M-02 del Code Reviewer)

### A-L03 — JSON-LD correcto pero limitado
**File**: `src/components/seo/json-ld.tsx` | **Severidad**: Low

`LocalBusiness` schema es correcto e incluye perfiles sociales. Podría añadir: `openingHours`, `logo`, `image`. Schema `FAQPage` no debe usarse (restringido 2026). `HowTo` no genera rich results. OK en ese aspecto.

### A-L04 — `gsap.registerPlugin()` duplicado en 5+ archivos
**Severidad**: Low

Idempotente pero innecesariamente repetitivo. **Fix**: `src/lib/gsap.ts` centralizado que registra todos los plugins una sola vez.

### A-L05 — `playwright` en devDependencies sin tests E2E
**File**: `package.json` | **Severidad**: Low

Playwright está instalado pero no hay tests `.spec.ts`. Peso innecesario en node_modules.

### A-L06 — `navbar-inner.tsx` fantasma en git status
**Severidad**: Low

El git status muestra `?? src/components/layout/navbar-inner.tsx` como untracked pero el archivo no existe en disco. Fue creado y borrado sin stagear. El patrón `NavbarHero variant="inner"` ya lo reemplaza. No se necesita acción.

---

## POSITIVOS (no requieren acción)

- ✅ Client/Server boundaries bien definidos — páginas son Server Components, animaciones son Client
- ✅ Routing next-intl coherente y completo (routing.ts, navigation.ts, request.ts)
- ✅ `portafolio/[slug]/page.tsx` tiene `generateStaticParams` con los slugs correctos
- ✅ Todas las páginas siguen patrón coherente: NavbarHero + main + Footer
- ✅ API `/api/contact` tiene arquitectura de seguridad sólida (origin check → honeypot → rate limit → validate → sanitize → send)
- ✅ Solo `POST` exportado en la API route
- ✅ tsconfig.json con `strict: true`, moduleResolution bundler, paths alias @/* correcto
- ✅ vercel.json mínimo y correcto — Vercel autodetecta Next.js
- ✅ Sitemap genera correctamente ambos locales con paths localizados
- ✅ GSAP hydration safety bien manejada con CSS initial state + useGSAP
- ✅ Dependencias actualizadas y sin bloat (sin Framer Motion, sin librerías innecesarias)
- ✅ Footer: `layout/footer.tsx` (container/data) + `ui/footer.tsx` (presentational) — separación correcta, no duplicados

---

## Resumen

| Severidad | Count |
|---|---|
| Critical | 0 |
| High | 3 |
| Medium | 6 |
| Low | 6 |
| **Total** | **15** |

## Orden de prioridad recomendado

1. Agregar `setRequestLocale(locale)` al home page
2. Agregar hreflang alternates a todas las páginas
3. Agregar `generateMetadata` a páginas de portafolio
4. Reemplazar `NextLink` con `IntlLink` en nosotros-content y servicios-content
5. Expandir CSP `connect-src` para analytics
6. Agregar imagen OpenGraph
7. Centralizar strings del footer en i18n
8. Verificar/restaurar `eslint.config.mjs`
