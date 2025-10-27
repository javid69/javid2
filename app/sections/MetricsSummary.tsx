const METRICS = [
  {
    label: "Initial JS payload",
    value: "< 187 KB",
    disclosure: "gzipped across route groups via Next.js bundle analyzer",
  },
  {
    label: "Lighthouse (Mobile)",
    value: "Performance 94 / LCP 2.3s",
    disclosure: "Throttled 4G, Moto G Power profile",
  },
  {
    label: "Lighthouse (Desktop)",
    value: "Performance 99 / LCP 1.5s",
    disclosure: "Simulated desktop broadband",
  },
  {
    label: "3D hydration",
    value: "Lazy-loaded @ 47% scroll",
    disclosure: "IntersectionObserver gate over Suspense fallback",
  },
];

export function MetricsSummary() {
  return (
    <section
      id="audit"
      className="rounded-3xl border border-white/10 bg-slate-950/80 px-8 py-12"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300/80">
            Audit summary
          </p>
          <h2 className="text-3xl font-semibold text-white">
            Bundle budgets hold the line while delivering immersive context.
          </h2>
          <p className="text-base text-white/60">
            Mobile and desktop Lighthouse runs hit their performance targets with
            room to spare. LCP stabilizes under 2.5s on throttled 4G by keeping
            hero content server-rendered and queuing deferred work behind
            Suspense boundaries.
          </p>
        </div>
        <dl className="grid w-full max-w-xl gap-4 sm:grid-cols-2">
          {METRICS.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/80"
            >
              <dt className="text-sm uppercase tracking-wide text-white/50">
                {metric.label}
              </dt>
              <dd className="mt-2 text-2xl font-semibold text-white">
                {metric.value}
              </dd>
              <p className="mt-1 text-xs text-white/50">{metric.disclosure}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
