# Phase 1: Code Quality, Architecture & Visual/SEO — TheMonkeys Web

## Resumen consolidado

| Fuente | Critical | High | Medium | Low |
|---|---|---|---|---|
| Code Quality (1A) | 3 | 7 | 11 | 10 |
| Architecture (1B) | 0 | 3 | 6 | 6 |
| Visual + SEO (1C) | 6 | 6 | 5 | 3 |
| **TOTAL Fase 1** | **9** | **16** | **22** | **19** |

*Nota: varios hallazgos se repiten entre los tres agentes (confirmación cruzada). El total neto sin duplicados es ~40 hallazgos únicos.*

---

## Issues Críticos que informan la Fase 2

### Para Security Review (Fase 2A):
1. **CSP `connect-src` demasiado restrictivo** — bloquea analytics (Meta Pixel + GA) silenciosamente
2. **CSP `script-src` tiene `unsafe-eval`** — vector XSS innecesario
3. **Tracking IDs hardcodeados** (FB Pixel `2481755865582352`, GA `G-DJB60KVLWB`) en source code
4. **Sin CSRF token** en `/api/contact` (honeypot + rate limit mitigan pero no eliminan)
5. **API retorna `{ ok: true }` si falta `RESEND_API_KEY`** — submissions silenciosamente perdidas
6. **Meta Pixel + GA sin consentimiento** — potencial GDPR si hay visitantes UE

### Para Performance Review (Fase 2B):
1. **Dev server en HTTP 500** — cache `.next/` corrupto, requiere `rm -rf .next && npm run dev`
2. **GSAP sin fallback CSS** — si GSAP falla, páginas en negro (FOUC crítico)
3. **StatsBar duplicado en desktop** — dos tweens GSAP + dos ResizeObservers corriendo simultáneamente
4. **`gsap.registerPlugin()` en 10+ archivos** — redundante, centralizar en `src/lib/gsap.ts`
5. **LCP con `fetchPriority="high"`** ✅ — ya correctamente implementado
6. **Todos los títulos SEO exceden 60 chars** — impacta CTR en SERPs

---

## Hallazgos de mayor impacto (prioridad de fix)

### 🔴 CRÍTICO — Fix antes de cualquier otra cosa
| ID | Problema | Fix |
|---|---|---|
| C-03 / A-M / G10 | CSP `connect-src` bloquea analytics | Añadir dominios GA + FB a connect-src |
| V-00 | Dev server HTTP 500 (cache corrupto) | `rm -rf .next && npm run dev` |
| SEO-G1 | Canonical ausente en todas las páginas | Añadir `alternates.canonical` a cada generateMetadata |
| SEO-G2 | hreflang completamente ausente | Añadir `alternates.languages` con mapeo es/en |
| SEO-P4 | /portafolio sin generateMetadata | Crear generateMetadata con title/desc/alternates |
| SEO-P5 | /portafolio/[slug] sin generateMetadata | Crear generateMetadata dinámica por proyecto |
| H-04 / A-M03 | `next/link` en nosotros-content + servicios-content | Reemplazar con i18n `Link` de `@/i18n/navigation` |
| A-H01 | Home page sin `setRequestLocale` | Añadir una línea tras `await params` |

### 🟡 ALTO — Fix antes de producción
| ID | Problema |
|---|---|
| C-02 | Tracking IDs hardcodeados → env vars |
| C-01 | Non-null assertion en hero animation → guard |
| SEO-G3 | og:image + twitter:image ausentes en todo el sitio |
| SEO-G4 | Títulos >60 chars + errores tipográficos en es.json |
| SEO-G5 | OG metadata no se hereda → cada página necesita set completo |
| V-02 | Portafolio en navbar va a Behance → decidir si ruta interna o externa |
| H-01 | Footer strings hardcodeadas → getTranslations |
| A-M02 | Número de teléfono formateado duplicado → SITE.phoneFormatted |
| A-M06 | eslint.config.mjs eliminado → verificar/restaurar |
| M-06 | Falta `not-found.tsx` con branding |
| M-10 | StatsBar duplicado en desktop |

### 🟢 MEDIO — Planificar
| ID | Problema |
|---|---|
| GSAP-02 | registerPlugin redundante → src/lib/gsap.ts |
| M-11 | gsap.from() → gsap.fromTo() en scroll animations |
| M-01 | usePrefersReducedMotion inconsistente en 2 componentes |
| SEO-G6 | JSON-LD incompleto (image, logo, @id, priceRange) |
| SEO-G7 | Sin schemas por página |
| L-03 | Barlow Condensed solo weight 900 → añadir 400 |
| L-06/7 | Metadata faltante confirmada (portafolio) |
| Form-02 | Mensajes de validación raw → localizar |
| M-02/03 | WhatsApp message hardcodeado en español |
