import dynamic from "next/dynamic";

const YashviCanvas = dynamic(() => import("@/components/canvas/YashviCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[420px] w-full items-center justify-center rounded-3xl border border-white/15 bg-zinc-950/40 px-6 py-12 text-sm uppercase tracking-[0.35em] text-zinc-500 shadow-inner">
      Initialising 3D Scene
    </div>
  ),
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col gap-8 bg-gradient-to-br from-[#050510] via-zinc-900 to-black px-6 pb-16 pt-12 text-zinc-100 sm:px-10 lg:px-20">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:flex-row lg:items-end">
        <div className="flex-1 space-y-6">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-zinc-300">
            Yashvi Labs
          </span>
          <h1 className="text-4xl font-semibold leading-snug tracking-tight text-white sm:text-5xl lg:text-6xl">
            Photorealistic footwear preview in real-time
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            The Yashvi 3D pipeline stitches together HDRI lighting, compressed GLB assets and an
            optional post-processing stack so your product teams can iterate rapidly without blocking the
            main thread.
          </p>
          <dl className="grid grid-cols-2 gap-4 text-sm text-zinc-400 sm:grid-cols-3 lg:w-3/4">
            <div>
              <dt className="font-semibold text-zinc-200">Pipeline</dt>
              <dd>DRACO + KTX2 ready</dd>
            </div>
            <div>
              <dt className="font-semibold text-zinc-200">Lighting</dt>
              <dd>HDRI with LDR fallback</dd>
            </div>
            <div>
              <dt className="font-semibold text-zinc-200">Effects</dt>
              <dd>Bloom / SSAO toggles</dd>
            </div>
          </dl>
        </div>
        <div className="max-w-sm space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-300 backdrop-blur">
          <h2 className="text-lg font-semibold text-white">Pipeline summary</h2>
          <ul className="space-y-2">
            <li>SSR-safe canvas mount via dynamic import</li>
            <li>Lazy HDR environment + fallback cubemap</li>
            <li>Suspense-powered loader manager</li>
            <li>EffectComposer toggles for bloom and SSAO</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-zinc-500">
          <span>Interactive Preview</span>
          <span>Drag to orbit</span>
        </div>
        <div className="relative aspect-[5/3] w-full overflow-hidden rounded-[32px] border border-white/10 bg-black/50 shadow-lg">
          <YashviCanvas />
        </div>
      </section>
    </main>
  );
}
