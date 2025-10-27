import Link from "next/link";

export function Hero() {
  return (
    <section className="grid w-full gap-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-black px-8 py-16 text-slate-100 shadow-2xl lg:grid-cols-[2fr_1fr] lg:items-center lg:px-16">
      <div className="space-y-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1 text-sm uppercase tracking-[0.2em] text-white/80">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
          Lighthouse Ready
        </span>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Launch cinematic 3D stories without blowing up your First Load JS.
          </h1>
          <p className="max-w-xl text-lg text-white/70">
            This performance pass shaves every byte that doesn&apos;t serve the
            first interaction: critical UI ships instantly, 3D payloads stream
            in the background, and low-power devices get an elegant fallback.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
          <Link
            href="#audit"
            className="rounded-full bg-emerald-500 px-6 py-3 text-slate-950 transition hover:bg-emerald-400"
          >
            View audit summary
          </Link>
          <Link
            href="#implementation"
            className="rounded-full border border-white/20 px-6 py-3 text-white/70 transition hover:border-emerald-400/60 hover:text-white"
          >
            Implementation notes
          </Link>
        </div>
      </div>
      <ul className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm backdrop-blur">
        <li className="flex items-start gap-3 text-white/80">
          <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
            1
          </span>
          <div>
            <p className="font-semibold text-white">Initial bundle</p>
            <p className="text-white/60">Sub-200&nbsp;KB gzipped JS shipped above the fold with zero client components.</p>
          </div>
        </li>
        <li className="flex items-start gap-3 text-white/80">
          <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
            2
          </span>
          <div>
            <p className="font-semibold text-white">3D off the critical path</p>
            <p className="text-white/60">Draco + KTX2 assets stream under intersection-observed Suspense gates.</p>
          </div>
        </li>
        <li className="flex items-start gap-3 text-white/80">
          <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
            3
          </span>
          <div>
            <p className="font-semibold text-white">Adaptive effects</p>
            <p className="text-white/60">Mobile and low-power profiles gracefully fall back to static previews.</p>
          </div>
        </li>
      </ul>
    </section>
  );
}
