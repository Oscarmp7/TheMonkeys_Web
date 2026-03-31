# Servicios Open Editorial Rails Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the services card grid into a lighter open editorial system without changing content or section flow.

**Architecture:** Keep `ServiciosContent` as the single source of truth and limit changes to the services grid classes and micro-interactions. Preserve translations and ordering, adjust only presentation, then verify in production mode and Playwright.

**Tech Stack:** Next.js App Router, React, Tailwind CSS, GSAP, Playwright

---

### Task 1: Refine service card structure

**Files:**
- Modify: `src/components/pages/servicios-content.tsx`

**Step 1:** Replace filled card surfaces with open editorial rails, lighter dividers, and more breathing room.

**Step 2:** Restyle tag treatments from chips to lighter editorial labels.

**Step 3:** Keep the CTA card in-grid, but clean up its emphasis so it complements the new system.

### Task 2: Preserve premium hover behavior

**Files:**
- Modify: `src/components/pages/servicios-content.tsx`

**Step 1:** Keep hover motion short and restrained.

**Step 2:** Use contrast/rule activation instead of decorative effects.

### Task 3: Verify visual fit

**Files:**
- Verify: `output/playwright/*`

**Step 1:** Run `npm run build`

**Step 2:** Run `npm run test`

**Step 3:** Capture updated Servicios screenshots in production mode with Playwright.
