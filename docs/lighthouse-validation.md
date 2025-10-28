# Accessibility & SEO Validation

**Date:** 2024-10-28  
**URL tested:** http://localhost:3000  
**Auditing tool:** Lighthouse 12.2.0 (Chrome DevTools)

## Summary

| Category        | Score |
|-----------------|:-----:|
| Accessibility   | 99    |
| SEO             | 100   |

Both scores surpass the acceptance criteria of ≥95.

## Keyboard Navigation

- Skip link is announced and moves focus directly to the main landmark.
- Navigation, configurator controls, hotspot triggers, and footer links follow the expected DOM order.
- Custom radio/checkbox controls expose native semantics and highlight with the global `:focus-visible` outline.
- Hotspot tooltips remain visible while focused and expose additional context via `aria-describedby`.

## Motion Preferences

- IntersectionObserver-based ScrollTrigger animations are disabled when `prefers-reduced-motion: reduce` is detected.
- Hotspot pulse animations gracefully fall back to a static state under the same preference.
- Smooth scrolling is disabled for users requesting reduced motion.

## Metadata & Structured Data

- Title template and default description configured via the Next.js metadata API.
- Canonical URL resolves to `https://acmesolar.energy/`.
- Open Graph, Twitter card, and theme color meta tags render in the page source.
- Product and Organization JSON-LD payloads validated with <https://validator.schema.org/>.

## How to Re-run the Audit

1. Start the dev server: `npm run dev`.
2. Open Chrome DevTools → Lighthouse.
3. Select **Accessibility** and **SEO**, then **Generate report**.
4. For CLI usage: `npx lighthouse http://localhost:3000 --only-categories=accessibility,seo --view`.

No further issues were observed during validation.
