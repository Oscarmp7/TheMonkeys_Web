# Light Theme Coherence Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Align light mode with the approved brand system, upgrade the client logos section into a premium infinite carousel, improve lead form UX, and remove the current lint debt without breaking dark mode or the existing content structure.

**Architecture:** Keep the current App Router and component structure intact, but shift the implementation toward a light-mode semantic color system expressed through existing Tailwind utility classes and shared component variants. The work should be done incrementally, with tests written before behavior changes where practical, followed by targeted refactors and full verification.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Framer Motion, next-intl, Node test runner

---

### Task 1: Add contact form validation coverage

**Files:**
- Modify: `tests/accessibility.test.ts`
- Test: `tests/accessibility.test.ts`

**Step 1: Write the failing test**

Add tests that render the contact form and verify:
- required field labels still exist
- invalid submission state exposes user-facing feedback for missing required fields or invalid email

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: at least one new test fails because client-side validation feedback does not exist yet.

**Step 3: Write minimal implementation**

Implement the smallest contact form state and rendering changes needed to support the new validation expectations.

**Step 4: Run test to verify it passes**

Run: `npm test`
Expected: new validation test passes and existing tests remain green.

**Step 5: Commit**

```bash
git add tests/accessibility.test.ts src/components/ui/contact-form.tsx
git commit -m "test: cover contact form validation feedback"
```

### Task 2: Implement client-side contact form validation

**Files:**
- Modify: `src/components/ui/contact-form.tsx`
- Modify: `src/messages/es.json`
- Modify: `src/messages/en.json`

**Step 1: Write the failing test**

Use the validation coverage from Task 1 as the failing test source. If the test is too broad, add a second narrower test for invalid email handling.

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: validation-related test fails for the expected reason.

**Step 3: Write minimal implementation**

Update the form to:
- validate required fields before submit
- validate email format before hitting the API
- surface field or form-level feedback clearly
- preserve existing live-region accessibility
- keep the backend submission flow unchanged when validation passes

**Step 4: Run test to verify it passes**

Run: `npm test`
Expected: validation tests pass.

**Step 5: Commit**

```bash
git add src/components/ui/contact-form.tsx src/messages/es.json src/messages/en.json tests/accessibility.test.ts
git commit -m "feat: add client-side contact form validation"
```

### Task 3: Remove the navbar lint violation

**Files:**
- Modify: `src/components/layout/navbar.tsx`

**Step 1: Write the failing test**

For this lint-driven fix, the red step is the existing lint failure. No separate unit test is required if the change is purely structural and behavior-preserving.

**Step 2: Run check to verify it fails**

Run: `npm run lint`
Expected: failure at `src/components/layout/navbar.tsx` for `react-hooks/set-state-in-effect`.

**Step 3: Write minimal implementation**

Refactor the resize/mobile-close logic so the effect subscribes to resize without synchronously setting state in the effect body.

**Step 4: Run check to verify it passes**

Run: `npm run lint`
Expected: navbar lint error is gone.

**Step 5: Commit**

```bash
git add src/components/layout/navbar.tsx
git commit -m "fix: remove navbar effect lint violation"
```

### Task 4: Clean dead code in services

**Files:**
- Modify: `src/components/sections/services.tsx`

**Step 1: Write the failing check**

Use the current lint warning as the red state.

**Step 2: Run check to verify it fails**

Run: `npm run lint`
Expected: warning for unused `numberY`.

**Step 3: Write minimal implementation**

Remove unused motion values and any import noise that remains from earlier iterations.

**Step 4: Run check to verify it passes**

Run: `npm run lint`
Expected: warning is gone.

**Step 5: Commit**

```bash
git add src/components/sections/services.tsx
git commit -m "refactor: remove unused services motion code"
```

### Task 5: Normalize shared control styling for light mode

**Files:**
- Modify: `src/components/ui/theme-toggle.tsx`
- Modify: `src/components/ui/language-toggle.tsx`
- Modify: `src/components/ui/hamburger-button.tsx`
- Modify: `src/components/layout/navbar.tsx`
- Modify: `src/components/layout/mobile-drawer.tsx`

**Step 1: Write the failing test**

If practical, add a render test asserting the hamburger button continues to expose accessible state after styling changes. If no new behavior changes are introduced, use visual/semantic review plus existing tests as the safety net.

**Step 2: Run test/check to verify current mismatch**

Run: `npm test`
Run: `npm run lint`
Expected: baseline is known before visual refactor.

**Step 3: Write minimal implementation**

Update shared controls so light mode consistently uses:
- navy text/icons
- light or yellow surfaces
- yellow active states
- no white foreground on light surfaces

Ensure dark mode styling stays readable.

**Step 4: Run verification**

Run: `npm test`
Run: `npm run lint`
Expected: no regressions.

**Step 5: Commit**

```bash
git add src/components/ui/theme-toggle.tsx src/components/ui/language-toggle.tsx src/components/ui/hamburger-button.tsx src/components/layout/navbar.tsx src/components/layout/mobile-drawer.tsx tests/accessibility.test.ts
git commit -m "feat: unify light mode header controls"
```

### Task 6: Bring hero and service CTAs into the approved light-mode system

**Files:**
- Modify: `src/components/sections/hero.tsx`
- Modify: `src/components/sections/services.tsx`
- Modify: `src/app/globals.css`

**Step 1: Write the failing test**

If a stable class-based render assertion is practical, add a small render test for CTA semantics. Otherwise use lint/build as the executable safety net and keep the change small.

**Step 2: Run baseline verification**

Run: `npm run lint`
Run: `npm run build`
Expected: current state passes build before the visual pass.

**Step 3: Write minimal implementation**

Shift light-mode CTA surfaces from navy/white to yellow-or-light-surface with navy foreground while preserving dark-mode contrast.

**Step 4: Run verification**

Run: `npm run lint`
Run: `npm run build`
Expected: styling changes do not break compilation.

**Step 5: Commit**

```bash
git add src/components/sections/hero.tsx src/components/sections/services.tsx src/app/globals.css
git commit -m "feat: align hero and services with light mode color system"
```

### Task 7: Redesign the client logos section into a premium infinite carousel

**Files:**
- Modify: `src/components/sections/client-logos.tsx`
- Modify: `src/components/ui/logo-cloud.tsx`
- Modify: `src/components/ui/infinite-slider.tsx` (only if needed)
- Modify: `src/app/globals.css` (only if shared utility support is needed)

**Step 1: Write the failing test**

If feasible, add a test asserting the section still renders provided logos. If not practical, keep this task protected by build verification and focused implementation scope.

**Step 2: Run baseline verification**

Run: `npm run build`
Expected: current carousel implementation builds successfully before refactor.

**Step 3: Write minimal implementation**

Update the client logos section so it:
- uses a light-mode trust band
- keeps continuous infinite looping
- makes logos significantly larger
- uses grayscale and moderate opacity by default
- restores full color on hover with a smooth fade
- preserves reasonable presence on mobile where hover is absent

**Step 4: Run verification**

Run: `npm run lint`
Run: `npm run build`
Expected: refactor compiles cleanly.

**Step 5: Commit**

```bash
git add src/components/sections/client-logos.tsx src/components/ui/logo-cloud.tsx src/components/ui/infinite-slider.tsx src/app/globals.css
git commit -m "feat: redesign client logos as premium infinite carousel"
```

### Task 8: Rework light-mode portfolio CTA and adjacent accent blocks

**Files:**
- Modify: `src/components/sections/portfolio.tsx`
- Modify: `src/components/sections/contact.tsx` (only if adjacent contrast needs balancing)

**Step 1: Write the failing check**

Use the approved design as the red state and keep the implementation narrow to the light-mode CTA treatment.

**Step 2: Run baseline verification**

Run: `npm run build`
Expected: current state builds before refactor.

**Step 3: Write minimal implementation**

Move the portfolio closing CTA away from a full navy light-mode block while keeping the footer as the only strong blue closure.

**Step 4: Run verification**

Run: `npm run lint`
Run: `npm run build`
Expected: no compile or lint regressions.

**Step 5: Commit**

```bash
git add src/components/sections/portfolio.tsx src/components/sections/contact.tsx
git commit -m "feat: soften light mode portfolio closure accents"
```

### Task 9: Keep footer blue and verify system coherence

**Files:**
- Modify: `src/components/layout/footer.tsx` (only if spacing, contrast, or minor polish is needed)

**Step 1: Write the failing check**

No new test required if footer behavior does not change. This is a visual coherence pass.

**Step 2: Run baseline verification**

Run: `npm run build`

**Step 3: Write minimal implementation**

Make only the changes needed to preserve footer hierarchy and ensure it reads as the sole blue closure block in light mode.

**Step 4: Run verification**

Run: `npm run lint`
Run: `npm run build`

**Step 5: Commit**

```bash
git add src/components/layout/footer.tsx
git commit -m "style: preserve footer as light mode closure block"
```

### Task 10: Final verification pass

**Files:**
- Verify only

**Step 1: Run lint**

Run: `npm run lint`
Expected: exit code 0.

**Step 2: Run tests**

Run: `npm test`
Expected: all tests pass.

**Step 3: Run production build**

Run: `npm run build`
Expected: build completes successfully.

**Step 4: Review working tree**

Run: `git status --short`
Expected: only intended source and doc changes remain.

**Step 5: Commit**

```bash
git add src docs/plans tests
git commit -m "feat: improve light theme coherence and lead UX"
```
