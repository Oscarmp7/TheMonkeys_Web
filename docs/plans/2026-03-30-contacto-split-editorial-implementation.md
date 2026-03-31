# Contacto Split Editorial Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the `Contacto` page so it matches the current `Home` line using the approved `Split Editorial` direction.

**Architecture:** Keep the route and translation contract intact while rebuilding the page composition inside the existing contact page component. Reuse current data sources and form behavior, but change layout, hierarchy, interaction polish, and section rhythm.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, GSAP, next-intl, Lucide React

---

### Task 1: Lock The Contact Page Design Contract

**Files:**
- Modify: `src/components/pages/contacto-content.tsx`
- Read: `design-system/MASTER.md`
- Read: `design-system/pages/contacto.md`
- Read: `.mateo/context.md`

**Step 1: Read current contract files**

Run: `Get-Content design-system/MASTER.md`

Expected: global visual rules available

**Step 2: Confirm contact override rules**

Run: `Get-Content design-system/pages/contacto.md`

Expected: `Split Editorial` page rules available

**Step 3: Map current page blocks**

Target blocks:
- opening split shell
- contact routes / quick channels
- form panel
- FAQ section

**Step 4: Keep route and translation interfaces unchanged**

- Do not break existing `contact_page` translation keys
- Do not change `/api/contact` behavior

### Task 2: Rebuild The Opening Split Experience

**Files:**
- Modify: `src/components/pages/contacto-content.tsx`
- Read: `src/messages/es.json`
- Read: `src/messages/en.json`

**Step 1: Replace the current hero wrapper with a desktop split / mobile stacked shell**

- Left panel should carry narrative and contact routes
- Right panel should become an off-white form slab
- Preserve responsive stacking order for mobile

**Step 2: Rework contact routes and quick channels**

- Use existing Lucide icons only
- Keep email, phone, and location as primary routes
- Keep social / quick channels compact and deliberate

**Step 3: Restyle the form**

- Keep validation and submit behavior intact
- Move from underline-heavy styling to a cleaner premium form surface
- Preserve labels, error states, disabled states, and success state

**Step 4: Keep motion restrained**

- Preserve reveal animation quality
- Avoid oversized hover transforms
- Respect `prefers-reduced-motion`

### Task 3: Refine FAQ Continuation And Final Polish

**Files:**
- Modify: `src/components/pages/contacto-content.tsx`
- Modify: `src/messages/es.json` only if a missing label or helper line is strictly required
- Modify: `src/messages/en.json` only if a missing label or helper line is strictly required

**Step 1: Align FAQ hierarchy with the new opening split**

- Stronger editorial heading
- Better spacing and readability
- Keep current accordion interaction

**Step 2: Run responsive fit passes**

Check:
- `375px`
- `768px`
- `1024px`
- `1440px`

Expected:
- no horizontal scroll
- no clipped split content
- no broken form rows

**Step 3: Run project verification**

Run: `npm run test`

Expected: existing tests pass

Run: `npm run build`

Expected: production build passes

**Step 4: Run Playwright visual QA**

Use local Edge-backed Playwright screenshots for desktop and mobile.

Expected:
- page feels visually aligned with `Home`
- no emoji icons
- no custom cursor
- stable hover / accordion behavior
