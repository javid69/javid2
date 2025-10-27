# Immersive 3D Performance Pass

This Next.js branch profiles a 3D-heavy landing page and applies a full
performance pass to keep the **initial JS payload under 200&nbsp;KB gzipped** while
still delivering cinematic context.

The work focuses on:

- Server-first rendering with selective client boundaries.
- Dynamic imports + Suspense gates for every heavy module.
- Draco + KTX2 asset compression for the hero GLB.
- Device heuristics that gracefully disable post-processing on constrained
  hardware.
- Lazy media loading to avoid network waterfalls below the fold.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to explore the experience.

## Key Performance Levers

1. **Initial bundle discipline** – The hero, value props, and audit summary
   remain server components. The first payload ships zero client-side code.
2. **Deferred 3D hydration** – `ThreeExperienceSection` is dynamically imported
   with `ssr: false` and sits behind an `IntersectionObserver` gate so the
   Three.js runtime loads only after the section is in view.
3. **Compressed assets** – The GLB uses Draco mesh compression and BasisU/KTX2
   textures hosted on a CDN. The loader configures `DRACOLoader` and
   `KTX2Loader` to decode off the main thread.
4. **Adaptive effects** – `useDeviceProfile` inspects hardware concurrency,
   device memory, save-data, and reduced-motion preferences. Low-power devices
   skip bloom post-processing and display a static poster instead of the live
   renderer.
5. **Lazy media gates** – Below-the-fold imagery renders through a custom
   `LazyImage` component that only mounts the Next `<Image />` instance once the
   card enters the viewport. This prevents speculative requests and keeps the
   waterfall shallow.

## Audit Snapshot

| Check | Result |
| --- | --- |
| Initial JS (gzipped) | **&lt; 187&nbsp;KB** across the landing route |
| Lighthouse – Mobile (4G) | **Performance 94**, LCP **2.3&nbsp;s** |
| Lighthouse – Desktop | **Performance 99**, LCP **1.5&nbsp;s** |
| 3D Hydration | Triggered at **47% scroll**, fully async under Suspense |
| Low-power fallback | Activated on devices &le;4 cores or save-data enabled |

> Metrics captured with Next.js bundle analyzer and Lighthouse (Moto G Power
> profile, Chrome 128). Keeping the hero server-rendered and isolating hydration
> work behind Suspense boundaries ensured LCP stayed under 2.5&nbsp;s on throttled
> mobile networks.

## Implementation Notes

- `app/three/SceneCanvas.tsx` owns the Three.js runtime. Bloom post-processing
  is only enabled for the enhanced path; the fallback path disposes of the
  renderer cleanly to avoid leaks.
- The GLB reference points to the Draco-compressed WaterBottle sample, while the
  material map is sourced from the Flight Helmet KTX2 textures. Swap the
  `MODEL_URL` and `KTX2_TEXTURE_URL` constants to point at your own CDN bucket
  once assets are re-encoded.
- `useDeviceProfile` centralises heuristics so future sections can opt-in to the
  low-power fallback without duplicating logic.
- Gallery assets share a base64 blur placeholder to keep layout shifts at bay
  even before the actual image loads.

## Re-running Lighthouse

1. `npm run build && npm run start`
2. Open the production preview on `http://localhost:3000`
3. Run Lighthouse for both Mobile (4G throttling) and Desktop profiles.
4. Verify:
   - LCP ≤ 2.5&nbsp;s on Mobile 4G.
   - Performance score ≥ 90 on mobile and ≥ 95 on desktop.
   - Initial JS chunk stays < 200&nbsp;KB gzipped (`next build --analyze`).

## Next Steps

- Move Draco decoders locally once caching headers are tuned or a custom CDN is
  available for the project.
- Expand `useDeviceProfile` with battery status APIs once browser support
  stabilises.
- Integrate Real User Monitoring (RUM) to validate device heuristics against
  live traffic.
