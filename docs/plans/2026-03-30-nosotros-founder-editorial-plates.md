# Nosotros Founder Editorial Plates Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refine the Nosotros page into a quieter editorial layout with founder-led plates, cleaner surfaces, and subtle motion, without changing copy or section flow.

**Architecture:** Keep `NosotrosContent` as the single source of truth. Preserve translations and section order, update surfaces and composition inside the page component, then validate with build, tests, and Playwright on desktop and mobile.

**Tech Stack:** Next.js App Router, React, Tailwind CSS, GSAP ScrollTrigger, Playwright

---

### Task 1: Rebalance the hero and history surfaces

**Files:**
- Modify: `src/components/pages/nosotros-content.tsx`

**Step 1:** Remove watermark-style decorative backgrounds from the hero and history sections.

**Step 2:** Tighten hero spacing and rebuild the background atmosphere using restrained glow and optional grain only.

**Step 3:** Refine the history placeholder and badge composition so it feels intentional and editorial.

### Task 2: Convert the founder area into editorial plates

**Files:**
- Modify: `src/components/pages/nosotros-content.tsx`

**Step 1:** Replace heavy founder cards with lighter plate-style layouts.

**Step 2:** Reduce surface density with thinner borders, cleaner dividers, and better typography hierarchy.

**Step 3:** Keep placeholders visible and integrated into the layout on desktop and mobile.

### Task 3: Quiet the value split and polish the CTA

**Files:**
- Modify: `src/components/pages/nosotros-content.tsx`

**Step 1:** Reduce the dominance of the yellow split section with better spacing and proportion.

**Step 2:** Keep the CTA message but improve spacing and section pacing so the close feels aligned with the rest of the site.

### Task 4: Refine motion and verify fit

**Files:**
- Modify: `src/components/pages/nosotros-content.tsx`
- Verify: `output/playwright/*`

**Step 1:** Keep GSAP motion limited to subtle reveal sequencing and founder/value section activation.

**Step 2:** Run `npm run build`

**Step 3:** Run `npm run test`

**Step 4:** Capture updated Nosotros screenshots in production mode with Playwright on desktop and mobile.
