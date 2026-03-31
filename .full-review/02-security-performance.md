# Phase 2: Security & Performance — TheMonkeys Web

## Resumen Fase 2

| Categoría | Critical | High | Medium | Low |
|---|---|---|---|---|
| Seguridad (2A) | 2 | 5 | 4 | 6 |
| Performance (2B) | 1 | 10 | 11 | 5 |
| **TOTAL Fase 2** | **3** | **15** | **15** | **11** |

---

## SECURITY FINDINGS (ver detalle en 02a-security.md)

### Critical
- **SEC-03**: `connect-src` bloquea GA + FB Pixel → analytics 100% no funcional en producción
- **SEC-06**: Submissions perdidas silenciosamente si falta `RESEND_API_KEY`

### High
- **SEC-01**: `unsafe-eval` en `script-src` → innecesario en producción, amplifica XSS
- **SEC-07**: Rate limit bypasseable via `X-Forwarded-For` spoofing fuera de Vercel
- **SEC-08**: Rate limit deshabilitado silenciosamente si faltan env vars Redis en producción
- **SEC-12**: FB Pixel ID + GA ID hardcodeados en source → usar `NEXT_PUBLIC_*` env vars
- **SEC-17**: Sin logging de seguridad en API → imposible detectar patrones de ataque

### CSP corregido listo para implementar (en 02a-security.md)

---

## PERFORMANCE FINDINGS

### CRITICAL (1)

**P2-CWV-01** — `PageTransition` wrapper con `opacity:0` retrasa LCP +500-800ms
**File**: `src/components/layout/page-transition.tsx:42`

Todo el contenido de la página empieza invisible. GSAP lo anima a `opacity:1`, pero esto sucede después de que React hidrata y GSAP inicializa. El LCP real (imagen hero o H1) queda bloqueado hasta que GSAP ejecute la animación. En conexiones lentas o dispositivos de gama baja, esto puede causar un LCP de 3-4 segundos.

**Fix**: Cambiar a animación que no bloquee el LCP:
```tsx
// Opción A: CSS animation como fallback + GSAP como enhancement
<div data-page-transition style={{ opacity: 1 }}>
  {children}
</div>
// GSAP anima desde opacity:0 solo si es "navegación" (no carga inicial)

// Opción B: Solo animar en transiciones de página, no en carga inicial
const isFirstRender = useRef(true);
useGSAP(() => {
  if (isFirstRender.current) { isFirstRender.current = false; return; }
  // animate only on route changes
});
```

---

### HIGH (10)

| ID | Problema | Archivo | Impacto |
|---|---|---|---|
| P2-CWV-02 | Hero animations `y:30` sin espacio reservado → CLS ~0.05-0.1 | `hero.tsx:34-38` | CLS falla Core Web Vitals |
| P2-CWV-03 | Sin fallback CSS si GSAP falla → página negra permanente | `globals.css:38-43` | UX crítica |
| P2-CWV-04 | Logo glitch anima `filter:brightness` en `mouseenter` → paint costoso | `navbar-hero.tsx:257-260` | +5-15ms INP |
| P2-JS-02 | Sin `dynamic()` en componentes pesados (contacto 849 líneas, servicios, nosotros) | Varios | ~30-60KB en bundle crítico |
| P2-FONT-01 | Barlow Condensed solo weight 900, `nosotros-content` usa `font-normal` → síntesis del browser | `layout.tsx:22` | CLS ~0.02-0.05 + fuente sintetizada |
| P2-IMG-01 | Logos PNG sin comprimir + `"The Monkeys Logo.png"` duplicado 44KB con espacios en nombre | `public/logos/` | +150-200KB innecesarios |
| P2-IMG-02 | Imágenes de portfolio JPEG sin optimización previa, sin `priority` en primer card | `public/portfolio/` | LCP lento en /portafolio |
| P2-GSAP-01 | `registerPlugin` en 12 archivos → centralizar en `src/lib/gsap.ts` | 12 archivos | Código redundante |
| P2-GSAP-02 | StatsBar duplicado en desktop: 2 tweens GSAP + 2 ResizeObservers corriendo siempre | `page.tsx:29` + `hero.tsx:229` | CPU constante, battery drain |
| P2-DEP-01 | `playwright` en devDependencies sin tests E2E → 200-300MB innecesarios en CI | `package.json:34` | CI +30-60s install time |

---

### MEDIUM (11)

| ID | Problema | Archivo |
|---|---|---|
| P2-CWV-05 | `ProjectCard` sin `priority` en primer card de portafolio | `project-card.tsx:54` |
| P2-JS-03 | `PageTransition` importa GSAP completo para una animación simple de fade | `page-transition.tsx` |
| P2-JS-04 | `ProjectCard` es Client Component solo por `useGSAP` decorativo en hover | `project-card.tsx` |
| P2-FONT-02 | 4 fuentes cargadas (Anton, Barlow Condensed, Syne, DM Mono) — DM Mono solo en labels/eyebrows | `layout.tsx` |
| P2-FONT-03 | Syne sin weight declarado → carga variable font completo (-5-10KB si se especifica) | `layout.tsx:28` |
| P2-IMG-03 | Favicon PNG 29KB → debería ser SVG/ICO | `layout.tsx:57` |
| P2-GSAP-03 | `gsap.from()` en ProjectCard vs `gsap.fromTo()` — flash risk | `project-card.tsx:32` |
| P2-GSAP-04 | `matchMedia()` directo en StatsBar y ProjectCard vs hook `usePrefersReducedMotion` | `stats-bar.tsx:68-73` |
| P2-GSAP-05 | Logo glitch: timelines acumuladas en mouseenter rápido → memory overhead | `navbar-hero.tsx:255-260` |
| P2-DEP-02 | `@upstash/ratelimit`, `@upstash/redis` con versiones desactualizadas | `package.json` |
| P2-DEP-03 | `resend@4.0.0` → 4.1.0 disponible | `package.json` |

---

## Issues críticos para Fases 3 y 4

### Para Testing (Fase 3):
1. Sin tests E2E (Playwright instalado pero sin specs)
2. Sin tests para el flujo de rate limiting
3. Sin tests para el caso RESEND_API_KEY ausente
4. Sin tests de accesibilidad automatizados
5. `StatsBar` duplicado en desktop — ningún test cubre este caso

### Para Best Practices (Fase 4):
1. `eslint.config.mjs` eliminado — `npm run lint` puede fallar
2. `gsap.registerPlugin` en 12 archivos — patrón no idiomático
3. `next/link` vs `@/i18n/navigation` Link — patrón inconsistente
4. `"The Monkeys Logo.png"` con espacios — convención de nombres rota
5. `cn()` usado en solo 3 componentes — inconsistencia de patrón
