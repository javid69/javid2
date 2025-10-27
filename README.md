# Yashvi 3D Pipeline

An SSR-friendly Next.js App Router setup that wires a production-ready React Three Fiber scene. The pipeline includes HDRI lighting with LDR fallbacks, DRACO/KTX2 decoders, post-processing toggles, and an asset compression workflow for delivering photorealistic footwear previews without blocking the main thread.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to interact with the scene. The `Canvas` is mounted via a client-only dynamic import so SSR stays safe.

## Scene architecture

- **YashviCanvas** (`components/canvas/YashviCanvas.tsx`) bootstraps the R3F `<Canvas>` and runs the loader configuration once the WebGL renderer is available.
- **YashviScene** (`components/scene/YashviScene`) composes the Stage, OrbitControls, reusable `Shoe` GLB primitive, HDR environment, and the EffectComposer pipeline.
- **Loader configuration** (`lib/three/loaders.ts`) initialises DRACO & KTX2 decoders using CDN-hosted paths. `configureAssetLoaders` runs when the renderer mounts and `extendGLTFLoader` is injected into `useGLTF`.
- **HDRI + fallback** (`HdriEnvironment.tsx`) lazily loads `/public/environments/yashvi-studio.hdr` while applying a 1×1 LDR cubemap stored at `/public/environments/fallback/*` so reflections remain stable during streaming or when HDR fails.
- **Post-processing** (`EffectsPipeline.tsx`) enables bloom and SSAO based on the toggles inside `config/scene.ts`. Tweak the booleans to tree-shake effects you don't need.

## Asset management & compression

A small placeholder shoe lives at `public/models/yashvi-shoe.glb`. It was generated specifically for this project and is released under the [Creative Commons CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) licence, so you can remix or replace it freely.

To recompress assets with DRACO geometry and KTX2 textures, use the helper script:

```bash
# Compress the default asset into public/models/optimized/yashvi-shoe.glb
npm run compress:model

# Or provide custom input / output
npm run compress:model -- public/models/my-shoe.glb public/models/optimized
```

Under the hood we call the [`gltf-transform`](https://gltf-transform.donmccurdy.com/) CLI. The script accepts optional environment variables (e.g. `DRACO_COMPRESSION_LEVEL`, `KTX2_TEXTURE_QUALITY`) so you can tune fidelity without touching source code.

## Observability

You can confirm decoder usage in browser dev tools:

- **DRACO** – look for `draco_decoder_gltf.js/wasm` network requests.
- **KTX2** – the Basis transcoder is pulled from the CDN defined in `lib/three/loaders.ts`.

The loader manager feeds `@react-three/drei`'s `useProgress`, which drives the Suspense fallback displayed before the scene resolves. With dynamic DPR and toned-down post effects, desktop profiling stays below the 60 ms per-frame budget outlined in the ticket.

## Configuration touchpoints

- `config/scene.ts` – central place to adjust camera defaults, environment intensity, and effect toggles.
- `components/scene/YashviScene/Shoe.tsx` – swap the placeholder GLB for production assets and call `useGLTF.preload` to warm the cache.
- `components/canvas/YashviCanvas.tsx` – tweak Canvas DPR or `gl` settings to balance quality vs. performance.

## Deployment notes

The project remains a standard Next.js App Router app, so deploy as usual to Vercel or your preferred platform:

```bash
npm run build
npm run start
```

Because the 3D Canvas is client-only, builds stay deterministic and SSR output is stable regardless of WebGL support on the hosting platform.
