# Phase 1C: Visual + SEO Audit — TheMonkeys Web

**Date**: 2026-03-30 | Herramienta: Playwright + análisis de código

---

## AUDITORÍA VISUAL

### Estado del Dev Server
**El dev server lanza HTTP 500 en TODAS las páginas.**
- Error: `TypeError: __webpack_modules__[moduleId] is not a function` en `vendor-chunks/gsap.js`
- Causa: cache de `.next/` en estado incoherente con los archivos modificados sin commitear
- **Fix inmediato**: `rm -rf .next && npm run dev`
- Sin este fix, el sitio está completamente caído. Los screenshots no pudieron tomarse.

---

### Hallazgos Visuales (derivados de análisis de código)

#### V-01 [HIGH] — FOUC garantizado si GSAP falla
**Páginas**: Todas

`globals.css` aplica `opacity: 0` a `[data-hero-reveal]`, `[data-hero-title]`, `[data-deco-number]`, `nav[data-nav-animate]`, `[data-page-transition]` vía CSS. Si GSAP no carga, estos elementos quedan **permanentemente invisibles** — el usuario ve una página negra.

El `prefers-reduced-motion` cubre ese caso pero NO el caso de GSAP fallando para usuarios normales.

**Fix**:
```css
/* globals.css — fallback si GSAP no ejecuta en 1s */
```
O en `PageTransition.tsx`: `useEffect` que pone `opacity: 1` tras 1 segundo si GSAP no ejecutó.

---

#### V-02 [HIGH] — "Portafolio" en navbar va a Behance, no a /portafolio
**Páginas**: Todas (navbar desktop y mobile)

En `nav.ts` línea 12: `portafolio: "BEHANCE"` → el link abre Behance en nueva pestaña. La página `/portafolio` del sitio **es inaccesible desde la navegación principal**. Ningún usuario puede llegar a ella desde el navbar.

**Fix**: Cambiar en `nav.ts` a `portafolio: "/portafolio"` y actualizar navbar para tratarlo como ruta interna en vez de externa.

---

#### V-03 [MEDIUM] — `isNavKeyActive` de portafolio nunca se activa
Como el link va a Behance (URL externa), `pathname` nunca coincide con `/portafolio`. El estado activo del link nunca se muestra. Fix: resolver V-02.

---

#### V-04 [MEDIUM] — CTA hero "PORTAFOLIO" también va a Behance
**Archivo**: `src/components/sections/hero.tsx` línea 188

El botón secundario del hero (`target="_blank"`) apunta a `SITE.behance`. Si el objetivo es mostrar el portafolio interno, debe ir a `/portafolio`.

---

#### V-05 [MEDIUM] — Redundancia UX: "Contacto" en pill + botón "Cotizar" → misma URL
En desktop, el pill del navbar tiene "Contacto" y justo al lado el botón amarillo "Cotizar", ambos apuntando a `/contacto`. Puede confundir al usuario. Revisar si "Cotizar" debería diferenciarse (ej. ancla al formulario directamente).

---

#### V-06 [LOW] — Cuadrículas en /contacto: NO EXISTEN ✅
No hay ningún grid decorativo en contacto. Los fondos son gradientes lineales/radiales. Este punto está correcto.

---

#### V-07 [MEDIUM] — CLS potencial por opacity:0 en page transition
`PageTransition` inicia con `style={{ opacity: 0 }}` inline. En conexiones lentas, el usuario ve contenido invisible seguido de aparición. No es un CLS clásico pero sí afecta FCP percibido.

---

#### V-08 [LOW] — Breakpoint 768px: pill desktop y hamburger coexisten
`md:hidden` = visible hasta 767px para hamburger. `hidden md:flex` = visible desde 768px para pill. En exactamente 768px ambos están disponibles. Verificar visualmente que no se solapan.

---

## AUDITORÍA SEO

### Por Página

#### Home `/` y `/en`
| Check | Estado | Problema |
|---|---|---|
| Title ES | ❌ | 83 chars — excede 60. Fix: `"The Monkeys — Agencia de Marketing en República Dominicana"` (55 chars) |
| Title EN | ❌ | 76 chars — excede 60. Fix: `"The Monkeys — Marketing Agency in the Dominican Republic"` (56 chars) |
| Description ES | ⚠️ | ~140 chars — aceptable pero en el límite inferior |
| Canonical | ❌ CRITICAL | No declarado. Next.js App Router NO genera canonical automáticamente |
| hreflang | ❌ CRITICAL | No existe en ninguna página |
| og:image | ❌ HIGH | No declarado — shares en redes sin imagen |
| twitter:image | ❌ HIGH | No declarado |
| og:url | ❌ MEDIUM | No declarado |

#### /servicios
| Check | Estado | Problema |
|---|---|---|
| Title ES | ❌ | 80 chars + "Republica Dominicana" sin tilde |
| Description ES | ❌ | ~175 chars — excede 160 |
| Canonical | ❌ CRITICAL | No declarado |
| hreflang | ❌ CRITICAL | No declarado |
| og:type, og:locale, og:title | ❌ HIGH | No se heredan del layout en páginas con generateMetadata propio |

#### /nosotros
| Check | Estado | Problema |
|---|---|---|
| Title ES | ❌ | 76 chars + "Republica Dominicana" sin tilde |
| Description ES | ❌ | ~219 chars — muy larga. Además "anos" sin tilde en es.json |
| Canonical | ❌ CRITICAL | No declarado |
| hreflang | ❌ CRITICAL | No declarado |

#### /portafolio
| Check | Estado | Problema |
|---|---|---|
| generateMetadata | ❌ CRITICAL | **Completamente ausente** — hereda title/desc del home |
| Canonical | ❌ CRITICAL | No existe |
| hreflang | ❌ CRITICAL | No existe |

#### /portafolio/[slug]
| Check | Estado | Problema |
|---|---|---|
| generateMetadata | ❌ CRITICAL | **Completamente ausente** — TODOS los proyectos usan el title del home |
| Canonical | ❌ CRITICAL | No existe |
| hreflang | ❌ CRITICAL | No existe |

#### /contacto
| Check | Estado | Problema |
|---|---|---|
| Title ES | ❌ | 79 chars + "Republica" sin tilde |
| Canonical | ❌ CRITICAL | No declarado |
| hreflang | ❌ CRITICAL | No declarado |
| og:image, twitter:image | ❌ HIGH | No declarados (herencia rota) |

---

### Hallazgos Globales SEO

#### SEO-G1 [CRITICAL] — Canonical ausente en TODAS las páginas
Next.js App Router no genera canonical automáticamente. Google puede indexar duplicados (`/` vs `/es`, URLs con/sin barra final). **Afecta todo el sitio.**

#### SEO-G2 [CRITICAL] — hreflang completamente ausente
`alternates.languages` no existe en ningún `generateMetadata`. Google no sabe que `/servicios` y `/en/services` son la misma página. Posicionamiento i18n completamente nulo.

**Mapeo correcto de hreflang**:
```
/ → en: /en
/servicios → en: /en/services
/nosotros → en: /en/about
/portafolio → en: /en/portfolio
/portafolio/[slug] → en: /en/portfolio/[slug]
/contacto → en: /en/contact
```

#### SEO-G3 [HIGH] — og:image y twitter:image ausentes en TODO el sitio
Se necesita: `/public/og-image.jpg` (1200×630px) y declararla en todos los metadata. Sin imagen OG, CTR en redes sociales = 0.

#### SEO-G4 [HIGH] — Todos los títulos exceden 60 caracteres
Además, `es.json` tiene errores tipográficos en keys de metadata: "Republica Dominicana" (sin tilde), "anos" (sin tilde). Visibles en SERPs.

#### SEO-G5 [HIGH] — OG metadata no se hereda en páginas con generateMetadata propio
En Next.js App Router, cuando una página define su propio `generateMetadata`, **sobrescribe** (no merges) el OG del layout padre. Las páginas de servicios, nosotros y contacto solo declaran `title` y `description` → `og:type`, `og:locale`, `og:title`, `twitter:card` quedan ausentes en esas páginas.

**Cada página debe declarar el set completo de OG + Twitter en su `generateMetadata`.**

#### SEO-G6 [MEDIUM] — JSON-LD incompleto para LocalBusiness
Faltan: `image`, `logo` (ImageObject), `@id` canónica, `openingHours`, `priceRange`, `description`. Estos son campos requeridos/recomendados para rich results de LocalBusiness.

#### SEO-G7 [MEDIUM] — Sin schemas específicos por página
- `/servicios` → debería tener `Service` o `ItemList`
- `/portafolio/[slug]` → debería tener `CreativeWork`
- `/nosotros` → podría tener schemas `Person` para los fundadores
- `/contacto` → podría tener `ContactPage`

#### SEO-G8 [MEDIUM] — Sitemap usa `new Date()` como lastModified
El sitemap genera `lastModified: new Date()` para todas las páginas. Google lee esto como "todo cambió en cada rebuild", lo cual puede afectar el crawl budget. **Fix**: usar fechas fijas o de git para páginas estáticas.

#### SEO-G9 [LOW] — Robots.txt ✅ Correcto
Permite todo, apunta correctamente al sitemap. No hay nada bloqueado incorrectamente.

#### SEO-G10 [HIGH] — CSP `connect-src` bloquea analytics (confirmado desde código)
Idéntico a C-03 del Code Reviewer y A-M de Arquitectura. Analytics silenciosamente roto.

#### SEO-G11 [OK] — LCP image con fetchPriority="high" ✅
`hero.tsx` línea 209 tiene `fetchPriority="high"` y `priority`. Correctamente implementado.

#### SEO-G12 [MEDIUM] — Meta Pixel y GA sin consentimiento de cookies
Se cargan con `strategy="afterInteractive"` para todos los visitantes. Para mercado RD el riesgo legal es bajo pero conviene documentarlo. Si la agencia tiene clientes internacionales que visiten el sitio desde la UE, puede haber implicaciones GDPR.

#### SEO-G13 [LOW] — Favicon en PNG, sin SVG ni ICO
`/logos/mk-main.png` como favicon. No es bloqueante para SEO pero para mejor soporte cross-browser se recomienda `.ico` + SVG.

---

## Resumen Visual + SEO

| Severidad | Count | Categoría |
|---|---|---|
| Critical | 1 | Dev server caído (cache .next corrupto) |
| Critical | 5 | SEO: canonical ausente, hreflang ausente, portafolio sin metadata (×2 páginas) |
| High | 6 | Visual: FOUC, portafolio en navbar a Behance; SEO: og:image, titles largos, OG no heredado, CSP |
| Medium | 5 | SEO: JSON-LD, schemas por página, sitemap lastModified, consentimiento cookies |
| Low | 3 | Favicon, robots.txt OK, breakpoint 768px |
