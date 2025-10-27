export function ImplementationNotes() {
  return (
    <section
      id="implementation"
      className="rounded-3xl border border-white/10 bg-slate-950/85 px-8 py-12 text-white/70"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-300/80">
            Implementation highlights
          </p>
          <h2 className="text-3xl font-semibold text-white">
            Guard every expensive byte with heuristics and Suspense.
          </h2>
          <p className="text-base text-white/60">
            All heavy code paths sit behind intersection-aware boundaries. The
            low-power heuristic inspects network preferences, device memory, and
            hardware concurrency to short-circuit post-processing.
          </p>
        </div>
        <ul className="space-y-4 text-sm leading-relaxed text-white/60">
          <li>
            <span className="font-semibold text-white">Dynamic imports:</span>
            {" "}
            The 3D experience only bundles on demand via Next.js dynamic import,
            keeping the initial Server Component tree free of client code.
          </li>
          <li>
            <span className="font-semibold text-white">Suspense coordination:</span>
            {" "}
            Fallback UI renders immediately and resolves once both Draco geometry
            and KTX2 textures finish decoding in parallel.
          </li>
          <li>
            <span className="font-semibold text-white">Device heuristics:</span>
            {" "}
            Saved data, reduced motion, limited cores (&lt;=4), or low memory
            trigger the static poster path and skip bloom post-processing.
          </li>
          <li>
            <span className="font-semibold text-white">Lazy imagery:</span>
            {" "}
            Gallery assets use a shared IntersectionObserver so no network calls
            fire until the viewport approaches the grid.
          </li>
        </ul>
      </div>
    </section>
  );
}
