# Testing Strategy Audit — TheMonkeys Web
**Branch:** `feat/bold-corporate-redesign`
**Date:** 2026-03-15
**Auditor:** Claude Code (automated review)

---

## Executive Summary

The project has **exactly one test file** covering five assertions. There is no test runner configuration, no testing framework installed as a devDependency, no E2E suite, no integration tests, and no CI test gate. The single file (`tests/accessibility.test.ts`) runs via the Node.js built-in test runner (`node --import tsx --test`) and exercises three narrow surface areas: form label rendering, live-region presence, and client-side validation logic.

Every other critical code path — the API route, Sanity data layer, i18n middleware, theme hydration, and WhatsApp URL construction — has zero test coverage.

---

## 1. Test Infrastructure Inventory

| Artifact | Status |
|---|---|
| `tests/accessibility.test.ts` | Exists — 5 tests |
| `jest.config.*` | Not present |
| `vitest.config.*` | Not present |
| `playwright.config.*` | Not present |
| `cypress/` directory | Not present |
| `e2e/` directory | Not present |
| `__tests__/` directories in `src/` | None |
| Testing devDependencies | None (`@testing-library`, `vitest`, `jest`, `playwright` all absent) |
| Test script in `package.json` | `node --import tsx --test tests/accessibility.test.ts` — executes only that one file |

The `tsx` package is not listed in `devDependencies`, meaning the test command would silently fail on a clean install unless `tsx` is globally available.

---

## 2. Findings

---

### Finding 1 — No server-side route tests

**Severity: Critical**

**What is untested:** `src/app/api/contact/route.ts` contains all server-side logic for the contact form: JSON parsing, honeypot detection, required-field validation, email format validation, length cap enforcement, HTML escaping, and Resend API integration. None of these code paths have a single test.

**Specific gaps:**
- Honeypot bypass: the `website` field check (`if (data.website) return { success: true }`) is a security control — it silently accepts the request and does not send an email. An attacker who discovers this field and intentionally sets it to empty bypasses no logic, but a regression could invert the condition. This is completely untested.
- The `escapeHtml` function is used to sanitize user input in the HTML email body. XSS prevention logic with no test coverage is a high-risk gap.
- Missing `RESEND_API_KEY` path returns HTTP 500, not a user-facing safe error. Untested.
- Malformed JSON body returns HTTP 400. Untested.
- Fields exceeding the 120-character and 4000-character limits return HTTP 400. Untested.
- Resend SDK throwing an exception returns HTTP 500. Untested.

**Recommended tests:**

```typescript
// tests/api/contact.test.ts
import test from "node:test";
import assert from "node:assert/strict";

// Pull helper functions out of route.ts via a dedicated lib file, or test
// the full handler by importing it in a node:test environment.

test("escapeHtml neutralises XSS vectors", () => {
  // Import escapeHtml once extracted to a shared lib
  assert.equal(escapeHtml('<script>alert("xss")</script>'), '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  assert.equal(escapeHtml("O'Brien & Co"), "O&#39;Brien &amp; Co");
});

test("POST /api/contact — honeypot filled returns 200 without sending email", async () => {
  const req = new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Bot", email: "bot@x.com", service: "SEO",
                           message: "spam", website: "http://spam.com" }),
  });
  const res = await POST(req);
  assert.equal(res.status, 200);
  // assert Resend was NOT called (mock assertion)
});

test("POST /api/contact — malformed JSON returns 400", async () => {
  const req = new Request("http://localhost/api/contact", {
    method: "POST",
    body: "not json",
    headers: { "Content-Type": "application/json" },
  });
  const res = await POST(req);
  assert.equal(res.status, 400);
});

test("POST /api/contact — name exceeding 120 chars returns 400", async () => {
  const longName = "A".repeat(121);
  // ... assert status 400
});

test("POST /api/contact — Resend failure returns 500", async () => {
  // Mock Resend to throw, assert status 500
});

test("POST /api/contact — missing RESEND_API_KEY returns 500", async () => {
  const saved = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  // ... assert status 500
  process.env.RESEND_API_KEY = saved;
});
```

**Note:** `escapeHtml`, `sanitizeText`, `isValidEmail`, and `normalizePayload` are all module-private functions. To make them unit-testable without full HTTP handler overhead, they should be extracted to `src/lib/email-utils.ts` and exported.

---

### Finding 2 — No tests for Sanity data layer fallback logic

**Severity: Critical**

**What is untested:** `src/lib/site-data.ts` contains three async data-fetching functions (`getSiteSettings`, `getPortfolioProjects`, `getClientLogos`) with a conditional null-client pattern and three distinct execution paths each:

1. `client === null` — return fallback immediately
2. `client.fetch()` returns empty array — return fallback
3. `client.fetch()` throws — catch and return fallback

Path 1 is never verified. Path 2 and path 3 are also unverified. If a refactor accidentally returns `undefined` instead of the fallback array, the site renders broken but no test catches it.

Additional untested utilities:
- `getWhatsAppHref` — constructs a URL with `encodeURIComponent`. If the phone number contains formatting chars like `(`, `)`, or spaces, `toPhoneDigits` strips them. Edge cases: empty string input, non-numeric string, already-clean number.
- `getOrganizationSchema` and `getLocalBusinessSchema` — structured data passed to `<script type="application/ld+json">`. Schema validity is never checked.
- `getLocalizedValue` — locale fallback chain `value?.[locale] ?? value?.es ?? value?.en ?? fallback` has four branches; only one happy path is implicitly exercised.

**Recommended tests:**

```typescript
// tests/lib/site-data.test.ts
import test from "node:test";
import assert from "node:assert/strict";
import { getWhatsAppHref, getLocalBusinessSchema } from "../../src/lib/site-data";

test("getWhatsAppHref — strips non-digit chars from phone number", () => {
  const href = getWhatsAppHref("es", "(809) 756-1847");
  assert.match(href, /wa\.me\/8097561847/);
});

test("getWhatsAppHref — encodes message text correctly", () => {
  const href = getWhatsAppHref("es");
  assert.match(href, /\?text=/);
  assert.doesNotMatch(href, / /); // spaces must be encoded
});

test("getSiteSettings — returns es fallback when client is null", async () => {
  // Mock client module to return null, then call getSiteSettings("es")
  const settings = await getSiteSettings("es"); // with mocked null client
  assert.equal(settings.email, "hola@themonkeys.do");
  assert.ok(settings.seoTitle.length > 0);
});

test("getPortfolioProjects — returns fallback when fetch throws", async () => {
  // Mock client.fetch to throw
  const projects = await getPortfolioProjects("es");
  assert.ok(Array.isArray(projects));
  assert.ok(projects.length > 0); // fallback should not be empty
});

test("getPortfolioProjects — returns fallback when fetch returns empty array", async () => {
  // Mock client.fetch to return []
  const projects = await getPortfolioProjects("en");
  assert.ok(projects.length > 0);
});
```

---

### Finding 3 — Locale coercion logic is untested

**Severity: High**

**What is untested:** The expression `locale === "en" ? "en" : "es"` appears in three separate files:
- `src/app/[locale]/layout.tsx` line 35
- `src/app/[locale]/layout.tsx` line 91
- `src/app/[locale]/page.tsx` line 25

This means any locale value that is not exactly `"en"` is silently coerced to `"es"`. There is no test verifying:
- `"en"` resolves to `"en"`
- `"es"` resolves to `"es"`
- A garbage value like `"fr"`, `"zh"`, or `""` resolves to `"es"` (intended behavior)
- `undefined` resolves to `"es"` (currently impossible at runtime but fragile to refactor)

The coercion is duplicated across files rather than being a single exported function, making it a maintenance and regression risk.

**Recommended fix and test:**

Extract to `src/lib/locale-utils.ts`:
```typescript
export function toAppLocale(locale: string | undefined): AppLocale {
  return locale === "en" ? "en" : "es";
}
```

Then test:
```typescript
test("toAppLocale — returns 'en' only for 'en'", () => {
  assert.equal(toAppLocale("en"), "en");
  assert.equal(toAppLocale("es"), "es");
  assert.equal(toAppLocale("fr"), "es");
  assert.equal(toAppLocale(""), "es");
  assert.equal(toAppLocale(undefined), "es");
});
```

---

### Finding 4 — Theme hydration guard is untested

**Severity: High**

**What is untested:** `src/components/ui/theme-toggle.tsx` computes `isDark` as:

```typescript
const isDark = resolvedTheme === "dark";
```

During SSR and the hydration flash window, `resolvedTheme` is `undefined` (this is a known `next-themes` behavior). When `resolvedTheme === undefined`, `isDark` is `false`, the component renders the Sun icon, and clicking the button calls `setTheme("dark")`. This is the intended behavior, but it is not verified.

There is no test ensuring that:
- When `resolvedTheme` is `undefined`, the button does not crash and renders a deterministic state.
- The `aria-label` is still present and correct when theme is unresolved.
- The component is suppressed from hydration mismatch via `suppressHydrationWarning` in the layout (already present, but rendering the toggle in SSR context to confirm no mismatch is unverified).

**Recommended tests:**

```typescript
test("ThemeToggle renders without crashing when resolvedTheme is undefined", () => {
  // Mock useTheme to return { resolvedTheme: undefined, setTheme: () => {} }
  const html = renderWithMessages(React.createElement(ThemeToggle));
  assert.match(html, /aria-label/i);
  // Should render — does not throw
});

test("ThemeToggle aria-label is always present regardless of theme state", () => {
  for (const theme of [undefined, "light", "dark"]) {
    // Mock resolvedTheme = theme
    const html = renderWithMessages(React.createElement(ThemeToggle));
    assert.match(html, /aria-label=/i);
  }
});
```

---

### Finding 5 — i18n request config locale validation is untested

**Severity: High**

**What is untested:** `src/i18n/request.ts` validates the incoming `requestLocale` and falls back to `routing.defaultLocale` when it is missing or not in the allowed list. This is the i18n guard layer:

```typescript
if (!locale || !routing.locales.some((value) => value === locale)) {
  locale = routing.defaultLocale;
}
```

There are no tests for:
- A valid locale passes through unchanged.
- An empty/null locale falls back to `"es"`.
- A locale not in the allowed list (e.g. `"fr"`) falls back to `"es"`.
- The dynamic `import(`../messages/${locale}.json`)` for both `"es"` and `"en"` resolves correctly.
- An invalid locale after fallback doesn't cause a runtime import failure (would throw `MODULE_NOT_FOUND`).

**Recommended tests:**

```typescript
// This function is currently inline in the getRequestConfig callback.
// Extract the guard to a pure function to make it independently testable:

export function resolveLocale(
  requested: string | undefined,
  allowed: readonly string[],
  defaultLocale: string,
): string {
  if (!requested || !allowed.includes(requested)) return defaultLocale;
  return requested;
}

// Then test:
test("resolveLocale — returns requested locale when valid", () => {
  assert.equal(resolveLocale("en", ["es", "en"], "es"), "en");
  assert.equal(resolveLocale("es", ["es", "en"], "es"), "es");
});

test("resolveLocale — falls back to default for invalid locale", () => {
  assert.equal(resolveLocale("fr", ["es", "en"], "es"), "es");
  assert.equal(resolveLocale(undefined, ["es", "en"], "es"), "es");
  assert.equal(resolveLocale("", ["es", "en"], "es"), "es");
});
```

---

### Finding 6 — Client-side validation has incomplete edge case coverage

**Severity: Medium**

**What is tested:** The existing test in `tests/accessibility.test.ts` covers the all-empty case (all four required errors returned) and an invalid email format. This is good as a smoke test.

**What is missing:**

| Scenario | Tested |
|---|---|
| All fields valid — zero errors returned | No |
| Name has only whitespace (`"   "`) — should fail | No |
| Email with only whitespace (`"   "`) — should fail | No |
| Email that is technically valid but unusual (`a+b@x.co.uk`) | No |
| Service is whitespace-only — should fail | No |
| Message is whitespace-only — should fail | No |
| Email valid but name/service/message empty — only those three errors | No |
| Company field left empty — should NOT produce an error | No |
| Website field (honeypot) — has no validation, any value accepted | No |

The `trim()` check in the validator means `"   "` (spaces only) should fail as required. This is not tested and is a meaningful edge case for copy-paste inputs.

**Recommended additions to existing test file:**

```typescript
test("validateContactFormValues — returns empty errors for fully valid input", () => {
  const errors = validateContactFormValues(
    { name: "Oscar", email: "oscar@themonkeys.do", company: "The Monkeys",
      service: "SEO", message: "Necesito una propuesta.", website: "" },
    { required: "Required", invalidEmail: "Invalid email" },
  );
  assert.deepEqual(errors, {});
});

test("validateContactFormValues — whitespace-only name fails required check", () => {
  const errors = validateContactFormValues(
    { name: "   ", email: "valid@example.com", company: "",
      service: "SEO", message: "Test message", website: "" },
    { required: "Required", invalidEmail: "Invalid email" },
  );
  assert.equal(errors.name, "Required");
});

test("validateContactFormValues — company is optional and never produces an error", () => {
  const errors = validateContactFormValues(
    { name: "Oscar", email: "oscar@test.com", company: "",
      service: "SEO", message: "Hello", website: "" },
    { required: "Required", invalidEmail: "Invalid email" },
  );
  assert.equal(errors.company, undefined);
});

test("validateContactFormValues — accepts valid plus-addressed email", () => {
  const errors = validateContactFormValues(
    { name: "Oscar", email: "oscar+tag@themonkeys.do", company: "",
      service: "SEO", message: "Test", website: "" },
    { required: "Required", invalidEmail: "Invalid email" },
  );
  assert.equal(errors.email, undefined);
});
```

---

### Finding 7 — No rate limiting, and no tests to enforce its future addition

**Severity: Medium**

**What is untested:** The API route has no rate limiting. This is a known gap per the Phase 1 & 2 context notes. However, there is also no placeholder test that would fail until rate limiting is added — which means there is no mechanism to enforce this requirement.

Additionally, the honeypot approach (`website` field check) is the only bot mitigation in place. There are no tests verifying that repeated rapid submissions from the same IP would eventually be rejected once rate limiting is implemented.

**Recommended pattern (test-driven rate limit contract):**

```typescript
// This test should FAIL until rate limiting is implemented, serving as a
// living requirement document:
test.todo("POST /api/contact — 11th request within 10 minutes from same IP returns 429");
test.todo("POST /api/contact — rate limit resets after the time window expires");
test.todo("POST /api/contact — rate limit is per-IP, not global");
```

Using `test.todo` in Node.js built-in test runner registers pending tests that appear in output without failing the suite, making the gap visible on every test run.

---

### Finding 8 — No integration or E2E tests for critical user journey

**Severity: Medium**

**What is untested:** The contact form happy path — filling all fields, submitting, receiving the success message — has never been exercised end-to-end. This is the single most business-critical interaction on the site.

Other untested user journeys:
- Language switch via `LanguageToggle` redirects to the correct locale path
- Theme toggle persists across page reload (requires browser storage)
- Clicking a portfolio card opens the `ProjectModal` and closes on ESC key
- WhatsApp button generates the correct `wa.me` URL with the encoded message
- Skip-to-content link (`<a href="#main-content">`) reaches the main landmark
- The infinite logo slider renders all client logos without layout overflow

**Recommended tool:** Playwright with `@playwright/test`. Given the Next.js App Router architecture and the Framer Motion animations, Playwright is a better fit than Cypress for this stack.

**Minimum E2E suite:**

```typescript
// e2e/contact-form.spec.ts
import { test, expect } from "@playwright/test";

test("contact form — successful submission shows success message", async ({ page }) => {
  await page.goto("/es");
  await page.fill('[name="name"]', "Oscar Test");
  await page.fill('[name="email"]', "test@themonkeys.do");
  await page.selectOption('[name="service"]', { index: 1 });
  await page.fill('[name="message"]', "Prueba de integración E2E.");
  await page.click('button[type="submit"]');
  await expect(page.locator('[aria-live="polite"]')).toContainText("enviado", { timeout: 10000 });
});

test("contact form — validation errors shown without submitting to server", async ({ page }) => {
  await page.goto("/es");
  await page.click('button[type="submit"]');
  await expect(page.locator("#name-error")).toBeVisible();
  await expect(page.locator("#email-error")).toBeVisible();
  // Network tab should have no request to /api/contact
});

test("language toggle — switches from es to en and back", async ({ page }) => {
  await page.goto("/es");
  await page.click('[aria-pressed="false"]'); // EN button
  await expect(page).toHaveURL(/\/en/);
  await page.click('[aria-pressed="false"]'); // ES button
  await expect(page).toHaveURL(/\/es/);
});
```

---

### Finding 9 — Test runner has no coverage reporting

**Severity: Low**

**What is missing:** The `package.json` test script does not enable coverage reporting (`--experimental-test-coverage` in Node.js 22+ built-in runner, or a dedicated tool). Without coverage, it is impossible to know what percentage of source lines are exercised, making it easy to believe coverage is acceptable when it is effectively zero.

**Recommendation:**

```json
// package.json — add alongside the existing test script:
"test:coverage": "node --import tsx --experimental-test-coverage --test tests/**/*.test.ts"
```

For a project of this size, targeting 80% unit coverage on `src/lib/` and `src/app/api/` before E2E is added is a reasonable initial goal.

---

### Finding 10 — No security-specific test assertions

**Severity: Medium**

**What is untested:**

1. **XSS via email HTML body:** The `escapeHtml` function in `route.ts` is the only line preventing XSS in the email rendered by Resend. It is not exported and has no tests. A refactor that accidentally removes the `escapeHtml()` wrapping on `data.name` in the `html` template literal would silently introduce an XSS vulnerability into every contact email the agency receives.

2. **Content-Type enforcement:** The API route does not check that `Content-Type: application/json` is present. A request with `Content-Type: text/plain` and a valid JSON body will succeed. This is a low-risk issue but worth a test.

3. **HTTP method restriction:** There is only a `POST` handler exported. Next.js App Router returns 405 automatically for other methods, but this is not verified by a test.

4. **Oversized payload:** There is no check on total request body size before `request.json()` is called. A 10 MB JSON blob would be parsed in full before the field-level length checks fire. Node.js/Next.js has a default body size limit, but it is not tested.

**Recommended tests:**

```typescript
test("POST /api/contact — escapeHtml is applied to all user-supplied fields in HTML body", () => {
  // Verify that a name containing <script> results in &lt;script&gt; in the
  // rendered email HTML. Requires mocking Resend and inspecting the `html`
  // argument passed to resend.emails.send().
});

test("GET /api/contact — returns 405 Method Not Allowed", async () => {
  const req = new Request("http://localhost/api/contact", { method: "GET" });
  // Next.js returns 405 automatically; verify response.status === 405
});
```

---

## 3. Test Pyramid Summary

| Layer | Current count | Target |
|---|---|---|
| Unit (pure functions) | 2 (validation logic) | 20–30 |
| Component (SSR rendering/ARIA) | 3 (labels, live region, hamburger ARIA) | 10–15 |
| Integration (API route with mocked deps) | 0 | 8–12 |
| E2E (Playwright browser flows) | 0 | 5–8 critical journeys |

The current ratio is 5 tests total across two layers. The project is inverted from a healthy pyramid — it has zero integration and zero E2E tests while the business-critical server path (`route.ts`) is completely uncovered.

---

## 4. Missing Test Infrastructure

The following tools need to be added to `devDependencies`:

| Tool | Purpose |
|---|---|
| `tsx` | Already used by test script but not listed as a devDependency — add explicitly |
| `@testing-library/react` + `@testing-library/user-event` | Behavioral React component testing (interactions, not just SSR markup) |
| `jsdom` or `happy-dom` | DOM environment for component tests |
| `vitest` | Recommended replacement for Node.js built-in runner — better DX, watch mode, inline mocking, coverage via V8 |
| `@vitest/coverage-v8` | Coverage reports |
| `@playwright/test` | E2E browser tests for critical user journeys |
| `msw` (Mock Service Worker) | Mock `fetch` calls in component tests without monkey-patching |

**Recommended `package.json` scripts block:**

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

---

## 5. Priority Remediation Order

| Priority | Action | Estimated effort |
|---|---|---|
| 1 | Extract `escapeHtml`, `isValidEmail`, `sanitizeText` from `route.ts` to `src/lib/email-utils.ts` and add unit tests | 1–2 hours |
| 2 | Add unit tests for all three fallback paths in each `site-data.ts` function | 2–3 hours |
| 3 | Extract locale coercion to a testable pure function and test all branches | 30 minutes |
| 4 | Add missing `validateContactFormValues` edge cases (whitespace, valid full form, company optional) | 30 minutes |
| 5 | Add `tsx` to devDependencies and fix the broken clean-install scenario | 10 minutes |
| 6 | Set up Playwright and add the contact form happy-path E2E test | 3–4 hours |
| 7 | Add `test.todo` stubs for rate limiting requirements | 15 minutes |
| 8 | Add coverage reporting to CI pipeline | 1 hour |
