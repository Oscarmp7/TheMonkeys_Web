# Phase 1A: Code Quality Review — TheMonkeys Web

**Date**: 2026-03-30 | **Stack**: Next.js 15 / React 19 / TypeScript 5.7 / Tailwind CSS v4 / GSAP 3.14 / next-intl

---

## CRITICAL (3)

### C-01 — Non-null assertions en refs del hero animation
**File**: `src/components/sections/hero.tsx` líneas 35-36 | **Severidad**: Critical

`headlineRef.current!.children[0]` y `headlineRef.current!.children[1]` con non-null assertions. Si el ref no está attached (SSR, race condition), lanza runtime error y crashea la página.

**Fix**:
```ts
const headline = headlineRef.current;
if (!headline || headline.children.length < 2) return;
tl.fromTo(headline.children[0], ...)
tl.fromTo(headline.children[1], ...)
```

### C-02 — Tracking IDs hardcodeados en source code
**File**: `src/app/[locale]/layout.tsx` líneas 103-136 | **Severidad**: Critical

Facebook Pixel ID (`2481755865582352`) y Google Analytics ID (`G-DJB60KVLWB`) hardcodeados. Deben ser env vars (`NEXT_PUBLIC_FB_PIXEL_ID`, `NEXT_PUBLIC_GA_ID`) para no exponerlos en todos los environments y permitir rotación sin cambios de código.

### C-03 — CSP `connect-src` demasiado restrictivo — bloquea analytics
**File**: `next.config.ts` líneas 14-25 | **Severidad**: Critical

`connect-src` solo permite `'self' https://vitals.vercel-insights.com`. Esto bloquea silenciosamente los beacons de:
- Meta Pixel (`https://connect.facebook.net`, `https://www.facebook.com`)
- Google Analytics (`https://www.google-analytics.com`)

El script-src sí permite cargarlos, pero `connect-src` bloquea sus peticiones XHR/fetch. Analytics está silenciosamente roto en producción.

**Fix**: Agregar a `connect-src`:
```
connect-src 'self' https://vitals.vercel-insights.com https://www.google-analytics.com https://connect.facebook.net https://www.facebook.com
```

---

## HIGH (7)

### H-01 — Footer con strings i18n hardcodeadas en lugar de useTranslations
**File**: `src/components/layout/footer.tsx` líneas 14-47 | **Severidad**: High

El footer construye un objeto `copy` con strings inline en español/inglés en vez de `useTranslations`. Las keys `footer.location` y `footer.rights` existen en los JSON pero nunca se usan — el footer construye sus propias versiones. ~12 strings no son traducibles por traductores sin modificar código.

### H-02 — Dos archivos Footer con nombres confusos
**Files**: `src/components/layout/footer.tsx` + `src/components/ui/footer.tsx`

No son duplicados funcionales (`layout/footer.tsx` es el wrapper data-layer, `ui/footer.tsx` es el presentacional `EditorialFooter`), pero los nombres confunden. **Fix**: Renombrar `ui/footer.tsx` → `ui/editorial-footer.tsx`.

### H-03 — Exports deprecated aún presentes en `nav.ts`
**File**: `src/lib/nav.ts` líneas 16-25 | **Severidad**: High

`INNER_NAV_KEYS` y `INNER_NAV_TARGETS` marcados `@deprecated` pero ningún archivo los importa. Dead code. **Fix**: Eliminar.

### H-04 — `nosotros-content.tsx` usa `next/link` en vez de i18n Link — rompe routing
**File**: `src/components/pages/nosotros-content.tsx` líneas 8, 316, 604, 610 | **Severidad**: High

`import NextLink from "next/link"` para links a `/contacto` y `/servicios`. En `/en/about`, estos links navegan a `/contacto` (literal) en vez de `/en/contact`. **Rompe i18n para usuarios en inglés.**

**Fix**: `import { Link } from "@/i18n/navigation"` y usar `<Link href="/contacto">` (next-intl resuelve el pathname localizado automáticamente).

**Mismo problema en `servicios-content.tsx`** (línea 8, 353).

### H-05 — `contacto-content.tsx` breadcrumb usa `<a>` raw en vez de i18n Link
**File**: `src/components/pages/contacto-content.tsx` líneas 733-737 | **Severidad**: High

`<a href={homeHref}>` donde `homeHref` es `/${locale}`. Para el locale por defecto (`es`), esto genera `/es` que redirige a `/` — redirect innecesario. **Fix**: Usar i18n `Link` con `href="/"`.

### H-06 — `navbar-hero.tsx` con 518 líneas — demasiada complejidad
**Severidad**: High

Contiene navbar home + inner, menú mobile, locale switcher, magic line animation, scroll state, múltiples GSAP animations. Extraer en: `DesktopNav`, `MobileMenu`, `LocaleSwitcher`, `NavMagicLine`.

### H-07 — `@ts-expect-error` suprimiendo mismatch real en locale switching
**File**: `src/components/layout/navbar-hero.tsx` línea 267 | **Severidad**: High

Suprime TypeScript en la API de next-intl para locale switching. Funciona en runtime pero oculta errores de refactoring futuros.

---

## MEDIUM (11)

| ID | Archivo | Problema |
|---|---|---|
| M-01 | `stats-bar.tsx`, `project-card.tsx` | `window.matchMedia` inline en vez de hook `usePrefersReducedMotion` — inconsistente y no reactivo |
| M-02 | `servicios-content.tsx` línea 33-34 | WhatsApp message hardcodeado en español — usuarios en inglés reciben mensaje en español |
| M-03 | `contacto-content.tsx` línea 137 | Mismo problema WhatsApp |
| M-04 | `src/app/[locale]/error.tsx` | Error boundary en inglés, sin i18n |
| M-05 | `src/components/ui/contact-form.tsx` línea 14 | `service: "general"` no está en opciones del dropdown — home form siempre envía "general" |
| M-06 | — | Falta `not-found.tsx` en `[locale]` — 404 sin branding |
| M-07 | `src/lib/portfolio.ts` | `services: string[]` en vez de `services: ServiceKey[]` — typos pasan silenciosamente |
| M-08 | `portafolio/[slug]/page.tsx` | Cast `as ServiceKey` peligroso — si key no existe, icon es undefined |
| M-09 | `es.json`, `en.json` | Keys unused: `footer.location`, `footer.rights`, `portfolio.cta` |
| M-10 | `hero.tsx` + `page.tsx` | `StatsBar` renderizado DOS veces en desktop — dos tweens GSAP corriendo en paralelo |
| M-11 | `brandbook.tsx`, `methodology.tsx`, `process.tsx` | `gsap.from()` en lugar de `gsap.fromTo()` — flash-of-wrong-state posible |

---

## LOW (10)

| ID | Problema |
|---|---|
| L-01 | `handleMobileAnchor` definida pero nunca llamada en navbar-hero.tsx — dead code |
| L-02 | `StatsBar` importada en hero.tsx solo para el duplicado desktop |
| L-03 | `Barlow_Condensed` cargada solo weight "900" pero se usa `font-normal` (400) en nosotros — el browser sintetiza |
| L-04 | `cn()` solo usada en 3 lugares — mayoría usa template literals |
| L-05 | `contacto-content.tsx` de 849 líneas con 5 sub-componentes — extraer FaqSection y ContactPageForm |
| L-06 | `portafolio/page.tsx` sin `generateMetadata` — hereda metadata del home |
| L-07 | `portafolio/[slug]/page.tsx` sin `generateMetadata` — cada proyecto necesita su propio title/description |
| L-08 | `error.tsx` expone `error.message` raw a usuarios |
| L-09 | `NAV_ANCHORS` en nav.ts nunca importado — navbar usa su propio `NAV_ROUTES` local duplicando la data |
| L-10 | `PageTransition` empieza en `opacity: 0` sin fallback si JS falla — página invisible |

---

## i18n Findings

- ✅ Todas las keys están sincronizadas entre es.json y en.json
- ❌ Keys unused: `footer.location`, `footer.rights`, `portfolio.cta`
- ❌ Texto hardcodeado visible fuera de translation files: nosotros-content.tsx (Santiago RD, roles), error.tsx, hero.tsx ("Scroll"), brandbook.tsx placeholder

## GSAP Findings

- ✅ Todos usan `useGSAP` con `scope` — cleanup correcto
- ✅ Plugin registration al nivel de módulo
- ❌ `gsap.registerPlugin()` llamado redundantemente en 10+ archivos — crear `src/lib/gsap.ts` centralizado
- ❌ `gsap.from()` sin `clearProps` en scroll-triggered elements — usar `fromTo()` siempre

## Contact Form / API Findings

- ❌ Dos formularios con campos diferentes enviando al mismo endpoint
- ❌ Mensajes de validación son raw strings ("required", "invalid") — no localizados, se muestran al usuario tal cual
- ❌ API retorna `{ ok: true }` silenciosamente si falta `RESEND_API_KEY` — submissions se pierden sin aviso

---

## Resumen

| Severidad | Count |
|---|---|
| Critical | 3 |
| High | 7 |
| Medium | 11 |
| Low | 10 |
| **Total** | **31** |
