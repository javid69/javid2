const VALUE_PROPS = [
  {
    title: "Granular code splitting",
    description:
      "Critical path rendering stays server-driven. Dynamic imports and suspenseful boundaries only hydrate when the user is ready to interact.",
  },
  {
    title: "Asset streaming pipeline",
    description:
      "GLB geometry ships with Draco compression while textures leverage KTX2 BasisU. Requests consolidate through a single CDN host to avoid waterfalls.",
  },
  {
    title: "Adaptive post-processing",
    description:
      "High-powered devices see cinematic bloom + reflections; constrained hardware falls back to a static preview without jank.",
  },
  {
    title: "Observation-driven lazy media",
    description:
      "Below-the-fold imagery is guarded by IntersectionObserver gates so bytes never move until content is in view.",
  },
];

export function ValueProps() {
  return (
    <section className="grid gap-6 rounded-3xl border border-white/10 bg-slate-900/50 px-8 py-12 md:grid-cols-2" id="playbook">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.34em] text-emerald-300/80">
          Optimization playbook
        </p>
        <h2 className="text-3xl font-semibold text-white">
          Opinionated defaults for fast immersive surfaces.
        </h2>
        <p className="max-w-xl text-base text-white/60">
          Each optimization is measurable and reversible. Clamp hydration, push
          heavy shaders out of the critical path, and keep the network quiet
          until the viewport actually asks for media.
        </p>
      </div>
      <ul className="grid gap-4">
        {VALUE_PROPS.map((item) => (
          <li
            key={item.title}
            className="rounded-2xl border border-white/10 bg-black/30 p-5 text-white/70 shadow-inner"
          >
            <p className="text-base font-semibold text-white">{item.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
