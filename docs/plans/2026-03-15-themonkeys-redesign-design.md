# Design Doc — The Monkeys Web (Rediseño desde cero)

**Fecha:** 2026-03-15
**Estado:** Aprobado
**Branch objetivo:** `feat/themonkeys-redesign-v2`

---

## Concepto central

El home funciona como un **brandbook interactivo**. La experiencia es:

1. **Portada** — hero espectacular, azul marca, logotipo masivo
2. **Página de identidad** — cortina revela sección brandbook con logo full-right
3. **Contenido** — secciones más limpias con micro-animaciones, neutrales, respirando
4. **Cierre** — footer amarillo marca como bookend visual

El easter egg: quienes conocen de branding entienden inmediatamente que están viendo un brandbook. El cliente que no lo sabe igual lo percibe como algo premium y diferente.

**Referencia clave:** https://portavia.framer.website/ — apertura espectacular → transición suave → secciones limpias con motion language consistente.

---

## Stack

| Tecnología | Versión | Motivo |
|---|---|---|
| Next.js App Router | 15+ | SSG, i18n routing, API routes |
| TypeScript | strict | Seguridad de tipos |
| Tailwind CSS v4 | latest | Single theme, sin dark/light |
| Framer Motion | latest | `layoutId` para logo travel, scroll animations |
| next-intl | latest | i18n ES/EN, App Router pattern |
| Resend | latest | Contact form email |
| Upstash Ratelimit | latest | Rate limiting en `/api/contact` desde día 1 |

**Lo que NO entra (decisiones deliberadas):**
- ~~Sanity CMS~~ → contenido estático, sin panel de gestión por ahora
- ~~Dark/light mode~~ → single theme, cero hydration flash, cero `dark:` variants
- ~~next-themes~~ → eliminado completamente

---

## Paleta de colores

```
--brand-navy:      #1B2F4F   /* fondo hero y navbar */
--brand-navy-dark: #0F1E35   /* gradiente oscuro del hero */
--brand-yellow:    #F6C300   /* logo, CTAs, footer background */
--off-white:       #F8F7F4   /* fondo secciones neutras */
--white:           #FFFFFF   /* texto sobre azul */
--text-dark:       #1B2F4F   /* texto sobre secciones claras */
```

**Gradiente del hero:**
```css
background: linear-gradient(160deg, #1B2F4F 0%, #0F1E35 100%);
```

---

## Tipografía

| Uso | Fuente | Peso |
|---|---|---|
| Display / logo text | Bebas Neue | 400 (condensed bold) |
| Headings secciones | Space Grotesk | 700 |
| Body / párrafos | Space Grotesk | 400 |
| Navbar links | Space Grotesk | 500 |

---

## Estructura de páginas

### Home (micropage — todo lo importante aquí)

| # | Sección | Fondo | Propósito |
|---|---|---|---|
| 1 | Hero | `#1B2F4F → #0F1E35` + noise | Impacto visual, identidad |
| 2 | Brandbook + Servicios | `#F8F7F4` | About + servicios con íconos |
| 3 | Portfolio | `#F8F7F4` | 3–4 proyectos destacados |
| 4 | Logos Banner | `#F8F7F4` | Clientes en infinite scroll |
| 5 | Contacto + Footer | Footer: `#F6C300` | Lead generation + cierre |

### Sub-páginas

| Ruta ES | Ruta EN | Contenido |
|---|---|---|
| `/servicios` | `/en/services` | Cards detalladas por servicio |
| `/portafolio` | `/en/portfolio` | Grid completo de proyectos |
| `/portafolio/[slug]` | `/en/portfolio/[slug]` | Case study individual |

---

## Hero — Diseño detallado

```
┌─────────────────────────────────────────────────────┐
│  [MK]   Inicio · Servicios · Contacto  [Cotizar]  ES|EN  │  ← navbar dentro del hero
│                                          [in][yt][pi][fb][ig] │  ← social icons derecha
│                                                     │
│                                                     │
│              THE                                    │
│           MONKEYS                                   │  ← logo masivo centrado
│                                                     │     Bebas Neue, amarillo
│                                                     │
│         tagline corta                               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Elementos:**
- Navbar integrado al hero (no separado)
- MK monogram (amarillo) — top left
- Nav pill flotante centrada: `Inicio · Servicios · Contacto · Cotizar`
- Toggle ES/EN — top right
- Social icons verticales — right side, centrados verticalmente
- "THE MONKEYS" — Bebas Neue, amarillo `#F6C300`, ~20vw de tamaño, ligero italic/tilt
- Noise texture overlay sutil (SVG feTurbulence, opacity 0.06)

---

## Transición Hero → Brandbook (el mecanismo clave)

**Mecánica:**
1. Hero: `position: sticky, top: 0, z-index: 1`
2. Sección Brandbook: `z-index: 2`, sube desde abajo cubriendo el hero
3. El logotipo "THE MONKEYS" usa `layoutId="brand-logo"` de Framer Motion
4. Conforme la sección 2 cubre el hero, Framer interpola el logo desde su posición centrada hasta su slot en el lado derecho del grid

**Layout de la sección Brandbook:**
```
┌──────────────────┬──────────────────┐
│                  │                  │
│  Hacemos         │                  │
│                  │   THE            │
│  ayudamos a las  │   MONKEYS        │  ← logo full-bleed derecha
│  marcas a crecer │                  │     viajó desde el hero
│  en el entorno   │                  │     via layoutId
│  digital...      │                  │
│                  │                  │
│  ● Inbound       │                  │
│  ● SEO           │                  │
│  ● Dev Web       │                  │
│  ● Contenido     │                  │
│  [Cotizar →]     │                  │
└──────────────────┴──────────────────┘
```

**Implementación Framer Motion:**
```tsx
// Hero
<motion.div layoutId="brand-logo" className="flex items-center justify-center">
  <LogoWordmark className="text-[20vw] text-brand-yellow" />
</motion.div>

// Brandbook Section
<div className="grid grid-cols-2 min-h-screen">
  <div className="p-16 flex flex-col justify-center">
    {/* info + servicios */}
  </div>
  <motion.div layoutId="brand-logo" className="flex items-center justify-center w-full h-full">
    <LogoWordmark className="w-full px-8 text-brand-navy" />
  </motion.div>
</div>
```

---

## Motion Language (sistema global)

```
Easing:     cubic-bezier(0.16, 1, 0.3, 1)   ← "snappy" premium
Duration:   400ms UI elements / 700ms large transitions
Trigger:    whileInView, once: true, threshold: 0.15
```

| Sección | Micro-animación |
|---|---|
| Brandbook | Texto línea por línea, stagger 80ms; logo con spring |
| Portfolio | Cards fade + translateY(20px), hover scale(1.02) |
| Logos Banner | CSS infinite scroll puro, pausa en hover |
| Contacto | Form fields en secuencia |
| Footer | Bloque sólido, redes hover navy→yellow |

---

## Noise Effect (nativo, sin Framer)

```css
.hero-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><filter id='noise'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23noise)'/></svg>");
  opacity: 0.06;
  mix-blend-mode: overlay;
  pointer-events: none;
}
```

---

## Footer (amarillo marca)

```
┌─────────────────────────────────────────────────┐  bg: #F6C300
│  [THE MONKEYS logo — navy]                       │
│  Santiago, RD  ·  hola@themonkeys.do            │
│  (809) 756-1847                                 │
│                            [in][yt][pi][fb][ig]  │
│  © 2026 The Monkeys  ·  ES | EN                 │
└─────────────────────────────────────────────────┘
```

---

## Navbar (post-hero)

Una vez que el hero queda fuera del viewport, aparece un navbar sticky compacto:
- Fondo: `#1B2F4F` con backdrop-blur
- Logo: MK monogram amarillo — izquierda
- Links: Inicio · Servicios · Contacto
- CTA: `Cotizar` — pill amarillo
- Toggle: ES | EN

---

## Arquitectura de código (single source of truth)

```
src/
  app/
    [locale]/
      page.tsx                    ← home
      servicios/page.tsx
      portafolio/page.tsx
      portafolio/[slug]/page.tsx
    api/
      contact/route.ts            ← rate limited desde día 1
  components/
    sections/
      hero.tsx
      brandbook.tsx
      portfolio.tsx
      logos-banner.tsx
      contact.tsx
    layout/
      navbar.tsx
      footer.tsx
    ui/                           ← componentes reutilizables
  hooks/
    use-focus-trap.ts             ← un hook, dos consumidores
    use-scroll-progress.ts
  lib/
    nav.ts                        ← NAV_LINKS — single source of truth
    services.ts                   ← SERVICE_KEYS + SERVICE_LABELS
    portfolio.ts                  ← proyectos estáticos
    site.ts                       ← metadata, social links, contacto
    validation.ts                 ← isValidEmail, sanitize
  messages/
    es.json
    en.json
  i18n/
    routing.ts
    request.ts
  middleware.ts                   ← next-intl (nombrado correctamente)
```

---

## SEO

- `generateMetadata` por página con título, descripción, OG tags
- JSON-LD: `Organization` + `LocalBusiness` schema
- `sitemap.ts` generado automáticamente
- `robots.ts` configurado
- Security headers en `next.config.ts` desde día 1
- Solo 1 imagen con `priority` (logo del hero)
- `alt` text en todos los assets

---

## Decisiones que NO se tomaron (y por qué)

| Decisión | Alternativa descartada | Motivo |
|---|---|---|
| Contenido estático | Sanity CMS | Simplificar primera versión, iterar después |
| Single theme | Dark/light mode | Cero complejidad, cero hydration issues |
| next-intl ES/EN | Solo español | Mercado USA hispano + RD |
| Framer Motion | GSAP / CSS scroll-driven | `layoutId` es ideal para logo travel, mejor DX |
| `middleware.ts` | `proxy.ts` | Convención correcta de Next.js |
