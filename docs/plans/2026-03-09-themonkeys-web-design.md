# The Monkeys — Web Design Document

**Date**: 2026-03-09
**Status**: Approved
**Client**: The Monkeys — Creative Digital Agency
**Domain**: themonkeys.do
**Location**: Santiago de los Caballeros, RD

---

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **CMS**: Sanity (embedded studio at `/studio`)
- **i18n**: next-intl (ES/EN)
- **Animations**: Framer Motion
- **Email**: Resend (contact form)
- **Deploy**: Vercel
- **Analytics**: Google Analytics + Meta Pixel

---

## Brand Identity

### Colors
- **Primary Yellow**: `#FFCD00` (Pantone 116 C)
- **Primary Navy**: `#00263E` (Pantone 2965 C)
- **Light bg**: `#FFFFFF` / `#F8F9FA` (alt sections)
- **Dark bg**: `#00263E` / `#001A2C` (deeper variant)
- **WhatsApp Green**: `#25D366`

### Logo Assets
- Logo full (yellow/navy, mono navy, mono yellow, white, black/white)
- Isotipo "MK" (same 5 variants)
- Use isotipo "MK" in navbar, full logo in footer

### Typography
- Distinctive display font for headings (bold, high-impact)
- Clean sans-serif for body text
- Both loaded via Google Fonts or self-hosted for performance

---

## Sections

### 1. Navbar
- Sticky on scroll with glassmorphism blur
- Logo MK isotipo left
- Nav links: Servicios | Portfolio | Nosotros | Contacto (smooth scroll)
- ES/EN language toggle
- Dark/light mode toggle (moon/sun icon)
- CTA button: "Cotiza Ahora!" (yellow #FFCD00, navy text)
- Mobile: Hamburger with unique morph-to-X animation, drawer lateral
- Light mode: White bg, navy links
- Dark mode: Navy bg, white links

### 2. Hero
- Two-column layout: 60% text / 40% visual element
- Overheader: "Agencia Creativa Digital"
- H1: "Hacemos que las marcas crezcan en digital"
- Subtitle: Bio corta from brief
- Two CTAs: "Cotiza Ahora!" (primary, yellow → WhatsApp) + "Ver Portfolio" (outline → scroll)
- Right side: Abstract generative visual (geometric shapes in yellow/navy, subtle floating animation)
- Text animation: Stagger word reveal on H1, fade-in subtitle
- Scroll indicator arrow at bottom
- Light: White/cream bg, navy text
- Dark: Navy bg, white text

### 3. Servicios
- Overheader: "Lo que hacemos" / H2: "Servicios"
- Clean grid: 3 cols desktop, 2 tablet, 1 mobile
- 7 service cards (minimal): Line-art icon + service name only
  - Inbound Marketing
  - Produccion de Contenidos
  - SEO
  - Desarrollo Web
  - Marketing de Influencers
  - Campana Digital (Google Ads, Meta Ads, TikTok Ads, LinkedIn Ads)
  - Creacion de Contenido (fotos/videos)
- Hover: Card elevates with shadow, icon turns yellow
- Animation: Stagger entrance on scroll
- CTA at bottom: "Cotiza Ahora!"
- Light: White cards, subtle gray border
- Dark: Slightly lighter navy cards, subtle border

### 4. Portfolio / Trabajos
- Overheader: "Nuestro trabajo" / H2: "Portfolio"
- Bento grid (asymmetric layout)
- Main card (2/3 width): Jimetor Eco Village hero image, hover reveals overlay with name + service tags
- Side cards (1/3 width): Project details, services rendered, results
- Click: Opens modal or dedicated page with full case study (Behance images, description, results)
- Placeholder card: "Quieres ser el siguiente?" CTA → WhatsApp
- Animation: Stagger entrance on scroll
- Managed from Sanity: image, gallery, tags, description per project

### 5. Logos de Clientes
- Overheader: "Marcas que confian en nosotros"
- Logo row with CSS grayscale filter
- Default: `filter: grayscale(100%); opacity: 0.6`
- Hover: `filter: grayscale(0%); opacity: 1; transition: 0.4s ease` — fade to full color
- If many logos: Infinite marquee ticker, pauses on hover
- Dark mode: White/gray logos on navy, hover reveals color
- Managed from Sanity: Client uploads color logo, grayscale applied via CSS

### 6. Nosotros / About
- Overheader: "Sobre nosotros"
- H2 bold: "Hacemos" (statement from brief)
- Paragraph completing the statement (bio corta)
- 3 value cards: Transparencia, Calidad, Buen Servicio (icon + title + short description)
- Location: "Santiago de los Caballeros, RD" with pin icon
- Animation: Fade-up text, stagger value cards
- Light: Alt bg #F8F9FA
- Dark: Slightly lighter navy for section separation
- Editable from Sanity

### 7. Contacto
- Overheader: "Hablemos"
- H2: "Listo para crecer en digital?"
- Two-column layout:
  - Left: Bio larga, phone, email, location, WhatsApp button (green)
  - Right: Form (nombre, email, empresa [optional], servicio [dropdown], mensaje)
- Form submit: API route → Resend email to hola@themonkeys.do
- WhatsApp button: Opens wa.me/18097561847 with pre-filled message
- Validation: Client-side real-time
- Success: Toast/confirmation message
- Service dropdown options match the 7 services listed

### 8. Footer
- Always dark navy #00263E regardless of theme
- 3 columns: Brand (white logo + tagline), Navigation (same links), Social + Contact
- Social icons: Instagram, Facebook, LinkedIn, YouTube, Pinterest — hover turns yellow #FFCD00
- Separator line before copyright
- Copyright: "2026 The Monkeys. Todos los derechos reservados."

### 9. WhatsApp Floating Button
- Fixed position: bottom-right (24px offset)
- WhatsApp official green circle with icon
- Hover: Scale 1.1 + tooltip "Hablamos?"
- Click: wa.me/18097561847?text=Hola,%20me%20interesa%20saber%20mas%20sobre%20sus%20servicios
- Mobile: Larger touch target, hides on fast scroll down, reappears on stop
- High z-index, always above content

---

## Cross-Cutting Concerns

### Dark/Light Mode
- Toggle in navbar (moon/sun icon)
- Persisted in localStorage
- Respects system preference as default
- Footer always dark

### i18n (ES/EN)
- next-intl with ES as default
- Toggle in navbar (ES | EN)
- All CMS content in both languages (Sanity localized fields)
- URL structure: `/es/...` and `/en/...`
- SEO: hreflang tags for both languages

### SEO
- SSG/SSR via Next.js for all pages
- Structured data (JSON-LD): Organization, LocalBusiness
- Open Graph + Twitter Card meta tags
- Sitemap.xml + robots.txt
- hreflang for bilingual
- Optimized images (next/image, WebP)
- Lighthouse target: 90+ all categories

### Analytics
- Google Analytics 4 (via next/script)
- Meta Pixel (via next/script)
- Track: page views, CTA clicks, form submissions, WhatsApp clicks

### CMS (Sanity Studio)
- Accessible at themonkeys.do/studio
- Auth: Google login or email/password
- Schemas: Portfolio projects, Services, Client logos, Page texts (localized), SEO metadata, Values
- Client can manage: portfolio, client logos, texts in ES/EN, SEO meta

### Performance
- Next.js Image optimization
- Font optimization (next/font)
- Lazy loading for below-fold sections
- Framer Motion with reduced-motion respect

---

## Assets Available

### The Monkeys Brand
- Logo full: 5 color variants (PNG)
- Isotipo MK: 5 color variants (PNG)
- Color palette: .ase, .ai, .pdf
- Brand board PDF

### Jimetor Case Study
- Jimetor Eco Village logo (JPEG)
- Behance case study (PDF)
- Client request: Logo grayscale-to-color on hover

---

## Client Deliverables

1. Live website at themonkeys.do
2. CMS access at themonkeys.do/studio
3. Tutorial video (Loom) showing how to manage portfolio and content
4. Google Analytics + Meta Pixel configured
5. SEO baseline setup
