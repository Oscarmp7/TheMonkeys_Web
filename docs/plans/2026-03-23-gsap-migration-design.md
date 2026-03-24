# Design: Migrate motion/react → GSAP

**Date:** 2026-03-23
**Branch:** feat/bold-corporate-redesign
**Status:** Approved

## Problem

`motion/react` (Framer Motion) adds ~35KB gzip to the bundle. Every animated component requires `"use client"`, blocking server rendering. The project is expanding its animation ambitions (scroll effects, parallax, text animations), and motion/react is not well-suited for that.

## Decision

Migrate all animation code to **GSAP** (`gsap` + `@gsap/react`).

- GSAP core: ~27KB gzip
- `@gsap/react` provides `useGSAP` hook for safe React integration
- ScrollTrigger (free, bundled with GSAP) enables scroll-driven animations
- Complete removal of `motion/react` from the project

## Scope — 8 files

| File | Current motion usage | GSAP replacement |
|---|---|---|
| `src/components/sections/hero.tsx` | Entry timeline, scale-in logo, infinite float, scroll indicator | `useGSAP` + timeline + `repeat: -1, yoyo: true` |
| `src/components/layout/navbar-hero.tsx` | Entry animations on nav items | `useGSAP` + stagger |
| `src/components/layout/navbar-sticky.tsx` | `AnimatePresence` show/hide on scroll | Scroll listener + `gsap.to` opacity/y |
| `src/components/sections/brandbook.tsx` | Section entry animations | `useGSAP` + refs |
| `src/components/sections/contact.tsx` | Section entry animations | `useGSAP` + refs |
| `src/components/sections/portfolio.tsx` | Section entry animations | `useGSAP` + refs |
| `src/components/ui/project-card.tsx` | Hover/enter animations | `useGSAP` + refs |
| `src/components/providers/layout-provider.tsx` | `LayoutGroup` | Remove — no equivalent needed now |

## Architecture

### Pattern for entry animations
```tsx
"use client"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

gsap.registerPlugin(useGSAP)

export function Component() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from("[data-animate]", {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.15,
      ease: "expo.out",
    })
  }, { scope: containerRef })

  return <div ref={containerRef}>...</div>
}
```

### Hero timeline structure
```
gsap.timeline({ defaults: { ease: "expo.out" } })
  ├── eyebrow     from { opacity:0, y:30 }  t=0.3
  ├── line1       from { opacity:0, y:30 }  t=0.5
  ├── line2       from { opacity:0, y:30 }  t=0.7
  ├── body        from { opacity:0, y:30 }  t=1.0
  ├── ctas        from { opacity:0, y:30 }  t=1.2
  └── stats       from { opacity:0, y:60 }  t=1.4

gsap.from(logoRef, { scale:0.85, opacity:0, filter:"blur(12px)", duration:1, delay:0.6 })
gsap.to(logoRef,   { y:-12, repeat:-1, yoyo:true, duration:3, ease:"sine.inOut" })
gsap.from(socialsRef, { opacity:0, y:60, duration:0.7, delay:1.6 })
gsap.to(scrollIndicatorRef, { y:8, repeat:-1, yoyo:true, duration:1.5 })
```

### Navbar sticky (AnimatePresence replacement)
```tsx
const [visible, setVisible] = useState(false)
const navRef = useRef(null)

useEffect(() => {
  const onScroll = () => setVisible(window.scrollY > threshold)
  window.addEventListener("scroll", onScroll)
  return () => window.removeEventListener("scroll", onScroll)
}, [])

useGSAP(() => {
  gsap.to(navRef.current, {
    opacity: visible ? 1 : 0,
    y: visible ? 0 : -20,
    duration: 0.3,
    ease: "power2.out",
  })
}, { dependencies: [visible] })
```

### Reduced motion
```tsx
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
if (prefersReduced) return // skip all animations
```

## What stays the same
- All Tailwind classes — untouched
- HTML structure — untouched
- Visual design — identical
- `"use client"` directives — kept where needed (hooks require client)

## Dependencies change
```diff
- "motion": "^x.x.x"
+ "gsap": "^3.x.x"
+ "@gsap/react": "^2.x.x"
```

## Out of scope
- Adding new animations (done later, section by section)
- ScrollTrigger-based scroll animations (future)
- Any visual design changes
