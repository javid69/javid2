import dynamic from "next/dynamic";
import Link from "next/link";

const BrandScene = dynamic(() => import("@/components/sections/brand-scene"), {
  ssr: false,
  loading: () => (
    <div
      className="glass-surface aspect-square w-full max-w-md animate-pulse rounded-2xl"
      aria-hidden
    />
  ),
});

const colorTokens = [
  { label: "Primary", className: "bg-primary text-primary-foreground", token: "--color-primary" },
  { label: "Accent", className: "bg-accent text-accent-foreground", token: "--color-accent" },
  { label: "Surface", className: "bg-surface text-foreground", token: "--color-surface" },
  { label: "Muted", className: "bg-muted text-foreground", token: "--color-muted" },
];

const spacingTokens = [
  { label: "XS", token: "--space-xs" },
  { label: "SM", token: "--space-sm" },
  { label: "MD", token: "--space-md" },
  { label: "LG", token: "--space-lg" },
];

const typographyTokens = [
  { label: "Heading", className: "font-display text-2xl" },
  { label: "Body", className: "font-sans text-base" },
  { label: "Mono", className: "font-mono text-sm" },
];

export default function Home() {
  return (
    <div className="space-y-[var(--space-3xl)] pb-[var(--space-3xl)]">
      <section id="top" className="relative overflow-hidden pt-[var(--space-3xl)]">
        <div className="absolute inset-0 -z-10 bg-grid-yashvi opacity-50" aria-hidden />
        <div className="yashvi-container grid gap-xl lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div className="space-y-sm">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface-soft px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-accent shadow-glow" aria-hidden />
              Yashvi vision 2025
            </span>
            <h1 className="max-w-[18ch] text-4xl font-semibold leading-[1.05] text-foreground md:text-5xl lg:text-6xl">
              We illuminate daring products with cinematic web experiences.
            </h1>
            <p className="max-w-prose text-lg text-muted-foreground">
              From strategy to spatial storytelling, Yashvi Studio blends motion, interaction, and
              emerging media to craft immersive brand universes.
            </p>
            <div className="flex flex-wrap items-center gap-sm">
              <Link
                href="#contact"
                className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:translate-y-[-2px] hover:shadow-lg"
              >
                Start a project
              </Link>
              <Link
                href="#experiments"
                className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-muted-foreground transition hover:border-accent hover:text-foreground"
              >
                View experiments
              </Link>
            </div>
            <dl className="grid gap-sm text-sm text-muted-foreground sm:grid-cols-3">
              <div>
                <dt className="text-xs uppercase tracking-[0.35em]">Specialisms</dt>
                <dd className="font-medium text-foreground">Product storytelling</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.35em]">Focus</dt>
                <dd className="font-medium text-foreground">Motion-first brand systems</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.35em]">Labs</dt>
                <dd className="font-medium text-foreground">Spatial web & 3D narratives</dd>
              </div>
            </dl>
          </div>
          <div className="relative flex justify-center">
            <div
              className="absolute inset-0 -z-10 rounded-full bg-radial-yashvi opacity-60 blur-[120px]"
              aria-hidden
            />
            <BrandScene />
          </div>
        </div>
      </section>

      <section id="strategy" className="relative">
        <div className="yashvi-container space-y-md">
          <header className="flex flex-col gap-xs md:flex-row md:items-end md:justify-between">
            <div className="space-y-xs">
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                Strategy DNA
              </p>
              <h2 className="text-3xl font-semibold text-foreground md:text-4xl">
                A holistic blueprint for brand constellations
              </h2>
            </div>
            <p className="max-w-[36ch] text-sm text-muted-foreground">
              Three lenses guide every Yashvi launch—fusing insight, craft, and performance into
              experiences that glow across any surface.
            </p>
          </header>
          <div className="grid gap-sm md:grid-cols-3">
            {["Discover", "Design", "Amplify"].map((title, index) => (
              <div
                key={title}
                className="glass-surface relative flex flex-col gap-sm rounded-2xl border border-white/5 p-md"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-background-soft text-sm font-semibold text-muted-foreground">
                  0{index + 1}
                </span>
                <h3 className="text-xl font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">
                  {
                    [
                      "Map core truths, audience rituals, and the why behind every interaction.",
                      "Shape modular systems, motion languages, and expressive product storytelling.",
                      "Launch orchestrated reveals, live visuals, and scroll-driven narratives that scale.",
                    ][index]
                  }
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="experiments" className="relative">
        <div className="yashvi-container space-y-md">
          <header className="flex flex-col gap-xs md:flex-row md:items-end md:justify-between">
            <div className="space-y-xs">
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                Design tokens
              </p>
              <h2 className="text-3xl font-semibold text-foreground md:text-4xl">
                The Yashvi palette & rhythm
              </h2>
            </div>
            <p className="max-w-[36ch] text-sm text-muted-foreground">
              Built with Tailwind CSS and custom variables—swap modes, remix modules, and keep the
              brand glowing.
            </p>
          </header>

          <div className="grid gap-sm lg:grid-cols-3">
            <div className="glass-surface rounded-2xl border border-white/5 p-md">
              <h3 className="text-lg font-semibold text-foreground">Colors</h3>
              <p className="text-sm text-muted-foreground">
                Primary accents beam with violet energy while cyan sparks guide depth and motion.
              </p>
              <ul className="mt-sm grid gap-sm">
                {colorTokens.map((color) => (
                  <li key={color.token} className="flex items-center justify-between gap-sm">
                    <span
                      className={`flex h-12 flex-1 items-center justify-between rounded-xl px-4 font-medium shadow-soft ${color.className}`}
                    >
                      {color.label}
                      <span className="text-xs uppercase tracking-[0.35em] opacity-80">
                        {color.token}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-surface rounded-2xl border border-white/5 p-md">
              <h3 className="text-lg font-semibold text-foreground">Typography</h3>
              <p className="text-sm text-muted-foreground">
                System blends expressive display rhythm with agile sans and precise mono utilities.
              </p>
              <ul className="mt-sm space-y-sm">
                {typographyTokens.map((type) => (
                  <li
                    key={type.label}
                    className="space-y-1 rounded-xl border border-white/5 bg-surface-soft p-sm"
                  >
                    <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                      {type.label}
                    </span>
                    <span className={`${type.className} text-foreground`}>
                      The quick brown fox dances.
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-surface rounded-2xl border border-white/5 p-md">
              <h3 className="text-lg font-semibold text-foreground">Spacing</h3>
              <p className="text-sm text-muted-foreground">
                Elastic spacing scale keeps compositions breathing across breakpoints.
              </p>
              <ul className="mt-sm space-y-sm">
                {spacingTokens.map((space) => (
                  <li key={space.token} className="space-y-1">
                    <div className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                      {space.label}
                    </div>
                    <div className="relative flex h-6 items-center overflow-hidden rounded-full border border-white/10 bg-background-soft">
                      <span
                        className="absolute left-0 top-0 h-full rounded-full bg-accent-soft"
                        style={{ width: `var(${space.token})` }}
                      />
                      <span className="relative z-10 w-full text-center text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                        {space.token}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="yashvi-container">
          <div className="glass-surface relative overflow-hidden rounded-3xl border border-white/5 p-xl">
            <div className="absolute inset-0 bg-grid-yashvi opacity-30" aria-hidden />
            <div className="relative z-10 flex flex-col gap-sm md:flex-row md:items-end md:justify-between">
              <div className="space-y-xs">
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                  Collaborate
                </p>
                <h2 className="text-3xl font-semibold text-foreground md:text-4xl">
                  Ready to light up your next release?
                </h2>
                <p className="max-w-[40ch] text-sm text-muted-foreground">
                  Drop us a note with your timeline and ambitions. We’ll orchestrate a tailored
                  roadmap in under 48 hours.
                </p>
              </div>
              <Link
                href="mailto:hello@yashvi.studio"
                className="inline-flex items-center rounded-full bg-accent px-8 py-3 text-sm font-semibold text-accent-foreground shadow-glow transition hover:translate-y-[-2px]"
              >
                hello@yashvi.studio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
