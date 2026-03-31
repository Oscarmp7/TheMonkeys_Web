# Phase 2A: Security Audit — TheMonkeys Web

**Date**: 2026-03-30 | Critical: 2 | High: 5 | Medium: 4 | Low: 6

---

## CRITICAL (2)

### SEC-03 — `connect-src` bloquea analytics silenciosamente
**File**: `next.config.ts:20` | CWE-16

`connect-src 'self' https://vitals.vercel-insights.com` bloquea silenciosamente todos los beacons XHR/fetch de:
- GA4: `https://www.google-analytics.com`, `https://analytics.google.com`, `https://region1.google-analytics.com`
- GTM: `https://www.googletagmanager.com`
- Meta Pixel: `https://www.facebook.com`

**Impacto**: Analytics completamente no funcional en Chrome, Firefox, Edge, Safari (todos aplican CSP). El negocio pierde toda telemetría de marketing.

**Fix**:
```typescript
"connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.googletagmanager.com https://www.facebook.com",
```

### SEC-06 — Submissions perdidas silenciosamente si falta `RESEND_API_KEY`
**File**: `src/app/api/contact/route.ts:99-123` | CWE-392

Si falta la env var, el API valida, sanitiza y retorna `{ ok: true }` sin enviar el email. El usuario ve "éxito" pero el mensaje nunca llega. Sin logs, sin alertas. Semanas de leads pueden perderse sin que nadie lo note.

**Fix**:
```typescript
if (!process.env.RESEND_API_KEY) {
  console.error("[contact] RESEND_API_KEY is not configured — submission lost");
  return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 });
}
```

---

## HIGH (5)

### SEC-01 — `unsafe-eval` en `script-src` innecesario en producción
**File**: `next.config.ts:16` | CWE-79

`unsafe-eval` permite `eval()`, `new Function()`, `setTimeout(string)`. Amplifica cualquier XSS a ejecución arbitraria de código. En Next.js 15 producción, GSAP, GTM y FB Pixel no lo requieren. Solo lo necesita el HMR de desarrollo.

**Fix**:
```typescript
const isDev = process.env.NODE_ENV === "development";
`script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://connect.facebook.net`
```

### SEC-07 — Rate limit bypasseable via `X-Forwarded-For` spoofing (fuera de Vercel)
**File**: `src/app/api/contact/route.ts:55-58` | CWE-290

En Vercel, el IP es confiable. Si el sitio migra a otro host, un atacante puede enviar `X-Forwarded-For: 1.2.3.4` diferente por request y bypassear el rate limit completamente.

**Fix**: Preferir el header exclusivo de Vercel:
```typescript
const ip =
  req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ??
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
  req.headers.get("x-real-ip") ??
  "unknown";
```

### SEC-08 — Rate limit silenciosamente deshabilitado si faltan env vars Redis
**File**: `src/app/api/contact/route.ts:60-63` | CWE-770

Si `UPSTASH_REDIS_REST_URL` o `UPSTASH_REDIS_REST_TOKEN` faltan, el rate limiting se desactiva sin aviso. En producción esto permite flood de submissions ilimitado consumiendo cuota de Resend.

**Fix**:
```typescript
if (process.env.NODE_ENV === "production" &&
    (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN)) {
  console.error("[contact] Rate limiting disabled in production — Redis env vars missing");
  return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 });
}
```

### SEC-12 — Tracking IDs hardcodeados en source code
**File**: `src/app/[locale]/layout.tsx:112,128,134` | CWE-200

FB Pixel ID `2481755865582352` y GA ID `G-DJB60KVLWB` hardcodeados. Quedan en el historial de Git permanentemente. Un competidor puede usarlos para contaminar tus datos de analytics o enviar eventos de conversión falsos a tu audiencia de remarketing de FB.

**Fix**: Mover a env vars:
```typescript
fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
```

### SEC-17 — Sin logging de seguridad en el endpoint API
**File**: `src/app/api/contact/route.ts` | CWE-778

No se loggea ningún intento de rate limiting, origin rejection, honeypot trigger, ni validación fallida. Imposible detectar patrones de ataque.

**Fix**:
```typescript
// Tras rate limit (línea 67):
console.warn(`[contact] rate-limited ip=${ip}`);
// Tras origin rejection (línea 37):
console.warn(`[contact] blocked origin=${origin}`);
// Tras honeypot (línea 51):
console.info("[contact] honeypot triggered");
```

---

## MEDIUM (4)

### SEC-02 — `unsafe-inline` en `script-src` sin nonces
**File**: `next.config.ts:16` | Deuda técnica

Requerido por los inline scripts de Meta Pixel y GA. Mientras exista, el CSP no protege contra XSS basado en scripts inline. Next.js 15 soporta nonces pero requiere configuración en middleware. Para este sitio (sin contenido generado por usuarios), riesgo práctico bajo. Documentar como deuda técnica.

### SEC-09 — `replyTo` sin escape HTML (mitigado por regex)
**File**: `src/app/api/contact/route.ts:115`

`cleanEmail` pasa por `sanitize()` pero no por `escapeHtml()`. Sin embargo, el regex del email no permite caracteres CRLF ni HTML, mitigando inyección. Riesgo residual muy bajo ya que Resend usa APIs HTTP, no SMTP directo.

### SEC-10 — Version ranges amplios con caret `^`
**File**: `package.json`

Sin verificación de que `package-lock.json` esté commiteado. Si no existe, cada `npm install` puede instalar versiones diferentes. **Verificar que `package-lock.json` está en git.**

### SEC-16 (GDPR) — Meta Pixel + GA sin consentimiento de cookies
**File**: `src/app/layout.tsx`

Se cargan con `strategy="afterInteractive"` para todos los visitantes sin cookie consent. Para mercado RD el riesgo legal es bajo, pero documentarlo si la agencia tiene clientes que visiten el sitio desde la UE.

---

## LOW (6)

| ID | Problema | Fix |
|---|---|---|
| SEC-04 | Falta `base-uri 'self'` en CSP — previene inyección de `<base>` | Agregar directiva |
| SEC-05 | Falta `upgrade-insecure-requests` en CSP | Agregar directiva |
| SEC-11 | Playwright en devDependencies — no riesgo en Vercel | No requiere acción |
| SEC-13 | `.env` en `.gitignore` ✅ — correcto | Positivo |
| SEC-14 | HSTS sin `preload` | Agregar `; preload` + registrar en hstspreload.org |
| SEC-15 | Permissions-Policy incompleto — faltan `payment=()`, `usb=()` | Agregar |

---

## CSP Corregido Completo

```typescript
const isDev = process.env.NODE_ENV === "development";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://connect.facebook.net`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https: blob:",
  "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.googletagmanager.com https://www.facebook.com",
  "frame-ancestors 'none'",
  "media-src 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "upgrade-insecure-requests",
].join("; ");
```

## Positivos

- ✅ `X-Frame-Options: DENY` — clickjacking prevenido
- ✅ `X-Content-Type-Options: nosniff` — MIME sniffing prevenido
- ✅ `Referrer-Policy: strict-origin-when-cross-origin` — correcto
- ✅ HSTS con `max-age=63072000; includeSubDomains` — correcto
- ✅ `.env` en `.gitignore` — keys no expuestas en git
- ✅ API solo exporta `POST` — 405 para otros métodos
- ✅ Middleware i18n no expone vectores de ataque
- ✅ Honeypot con silent success — correcto
- ✅ Cadena sanitize → escapeHtml — adecuada contra XSS
- ✅ Dependencias sin CVEs críticos conocidos
- ✅ Rate limiting con Upstash Redis (cuando env vars presentes)
