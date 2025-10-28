"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
const highlightSize = 480;
const highlightRadius = highlightSize / 2;

type Metric = {
  label: string;
  value: string;
  descriptor: string;
};

const metrics: Metric[] = [
  {
    label: "Retention uplift",
    value: "+38%",
    descriptor: "Across our last five launches.",
  },
  {
    label: "Delivery cadence",
    value: "72h",
    descriptor: "Average sprint for interaction polish.",
  },
  {
    label: "Precision QA",
    value: "11 passes",
    descriptor: "Device & breakpoint validations.",
  },
];

type Feature = {
  title: string;
  description: string;
  accent: string;
  stat: string;
};

const features: Feature[] = [
  {
    title: "Adaptive narrative systems",
    description:
      "Responsive typographic scales and content modules harmonize using fluid spacing ratios, maintaining clarity from mobile to cinematic displays.",
    accent: "Editorial systems",
    stat: "Fluid scaling · 1.25× / 1.618×",
  },
  {
    title: "Luminescent surface choreography",
    description:
      "Layered gradients and specular cues create depth while staying performant, calibrated via live color-mixing tokens unique to your brand.",
    accent: "Visual direction",
    stat: "Light map library · 48 states",
  },
  {
    title: "Cinematic motion language",
    description:
      "Framer Motion orchestrations pair eased hover states with focus treatments that feel effortless, translating to measurable engagement lifts.",
    accent: "Motion design",
    stat: "Interaction latency · 180 ms",
  },
];

type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Luma Atlas treated our brand with a couture mindset. Their motion polish translated directly to a 42% jump in launch conversions.",
    name: "Valentina Moreau",
    role: "CMO, Atelier Refract",
  },
  {
    quote:
      "Their QA rituals caught nuances no one else saw—gradients, micro shadows, typography cadence. The result feels like a $10k+ showpiece.",
    name: "Jordan Kim",
    role: "Head of Product Design, Haloa Systems",
  },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [cursor, setCursor] = useState({ x: highlightRadius, y: highlightRadius });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (bounds) {
      setCursor({ x: bounds.width / 2, y: bounds.height / 2 });
    }
  }, []);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;

    setCursor({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
  };

  const activateHighlight = () => {
    if (!shouldReduceMotion) {
      setIsActive(true);
    }
  };

  const deactivateHighlight = () => {
    if (!shouldReduceMotion) {
      setIsActive(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_10%_0%,rgba(139,92,246,0.25),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_90%_10%,rgba(56,189,248,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(140%_140%_at_50%_100%,rgba(251,191,36,0.12),transparent_70%)]" />
        <div className="absolute inset-y-0 left-1/2 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent md:block" />
      </div>

      <main
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={activateHighlight}
        onPointerLeave={deactivateHighlight}
        className="relative z-10 isolate mx-auto flex min-h-screen max-w-6xl flex-col gap-[var(--section-spacing)] px-6 pb-32 pt-24 sm:px-10 lg:px-16 lg:pt-32"
      >
        <motion.div
          className="pointer-events-none absolute left-1/2 top-0 z-0 hidden h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 blur-[120px] md:block"
          aria-hidden
          initial={{ opacity: 0.25 }}
          animate={{ opacity: 0.4 }}
          transition={{ ease, duration: 1.6 }}
          style={{
            background:
              "radial-gradient(circle at center, rgba(139, 92, 246, 0.45), rgba(244, 114, 182, 0.12) 60%, transparent 75%)",
          }}
        />
        <motion.div
          className="pointer-events-none absolute z-0 hidden md:block"
          aria-hidden
          animate={
            shouldReduceMotion
              ? { opacity: 0 }
              : {
                  x: cursor.x - highlightRadius,
                  y: cursor.y - highlightRadius,
                  opacity: isActive ? 0.75 : 0,
                }
          }
          transition={{ ease, duration: 0.6 }}
          style={{
            width: highlightSize,
            height: highlightSize,
            background:
              "radial-gradient(circle at center, rgba(139, 92, 246, 0.55), rgba(56, 189, 248, 0.22) 45%, rgba(244, 114, 182, 0.18) 60%, transparent 75%)",
            filter: "blur(72px)",
          }}
        />

        <div className="relative z-10 flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease, duration: 0.7 }}
            className="max-w-2xl space-y-6"
          >
            <span className="inline-flex items-center gap-2 rounded-pill border border-white/5 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.32em] text-brand-400 backdrop-blur-sm">
              Signature release
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-brand-400"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ ease, duration: 2.4, repeat: Infinity }}
              />
            </span>
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Orchestrating content journeys that feel cinematic on every scroll.
            </h1>
            <p className="text-lg leading-relaxed text-muted sm:text-xl">
              Luma Atlas designs adaptive ecosystems where typography, light, and motion coalesce.
              Every component is tuned for resonance—across breakpoints, resolutions, and moments of delight.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <motion.a
                href="#consult"
                className="group inline-flex items-center gap-3 rounded-pill bg-brand-500 px-7 py-3 text-base font-semibold text-white shadow-floating transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                whileHover={{
                  y: -4,
                  boxShadow:
                    "0 32px 80px rgba(139, 92, 246, 0.45), 0 2px 12px rgba(251, 191, 36, 0.25)",
                }}
                whileFocus={{
                  y: -2,
                  boxShadow:
                    "0 32px 80px rgba(139, 92, 246, 0.45), 0 2px 12px rgba(251, 191, 36, 0.25)",
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ ease, duration: 0.45 }}
              >
                Start a content immersion
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.75 5.75h9.5v9.5m0-9.5L5.5 18.5" />
                </svg>
              </motion.a>
              <motion.a
                href="#playbook"
                className="inline-flex items-center gap-3 rounded-pill border border-white/10 bg-surface/60 px-6 py-3 text-base font-medium text-foreground backdrop-blur-md transition-colors hover:border-brand-500/60 hover:text-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                whileHover={{
                  y: -2,
                  boxShadow: "0 24px 60px rgba(20, 16, 38, 0.45)",
                }}
                whileFocus={{
                  y: -2,
                  boxShadow: "0 24px 60px rgba(20, 16, 38, 0.45)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ ease, duration: 0.45 }}
              >
                Review our motion playbook
              </motion.a>
            </div>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease, duration: 0.7, delay: 0.08 }}
            className="grid w-full max-w-[360px] grid-cols-1 gap-4 text-sm text-muted sm:grid-cols-2 sm:gap-6 md:text-base lg:grid-cols-1"
          >
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-card border border-white/10 bg-surface/60 p-5 shadow-soft backdrop-blur-lg"
              >
                <dt className="text-xs uppercase tracking-[0.2em] text-white/60">
                  {metric.label}
                </dt>
                <dd className="mt-3 text-3xl font-semibold text-foreground">
                  {metric.value}
                </dd>
                <p className="mt-1 text-sm text-muted">{metric.descriptor}</p>
              </div>
            ))}
          </motion.dl>
        </div>

        <section id="playbook" className="relative z-10 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ ease, duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            <span className="text-sm uppercase tracking-[0.28em] text-brand-soft">
              Motion-first craftsmanship
            </span>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Architecture designed for expressive storytelling.
            </h2>
            <p className="max-w-3xl text-lg leading-relaxed text-muted">
              Each module is orchestrated using premium eased transitions—ensuring typography
              breathes, spacing settles with intention, and every hover is a cinematic cue.
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                className="group relative overflow-hidden rounded-card border border-white/10 bg-surface p-8 shadow-soft backdrop-blur-xl"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ ease, duration: 0.6, delay: index * 0.04 }}
                whileHover={{
                  y: -10,
                  boxShadow:
                    "0 32px 90px rgba(10, 5, 22, 0.65), 0 0 0 1px rgba(139, 92, 246, 0.3)",
                }}
                whileFocus={{
                  y: -6,
                  boxShadow:
                    "0 32px 90px rgba(10, 5, 22, 0.65), 0 0 0 1px rgba(139, 92, 246, 0.3)",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(139, 92, 246, 0.28), rgba(56, 189, 248, 0.18) 45%, rgba(244, 114, 182, 0.22))",
                  }}
                  aria-hidden
                />
                <div className="relative z-10 space-y-6">
                  <span className="inline-flex items-center rounded-pill bg-brand-500/20 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-brand-400">
                    {feature.accent}
                  </span>
                  <h3 className="text-2xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-base text-muted">{feature.description}</p>
                  <div className="flex items-center justify-between text-sm text-brand-soft">
                    <span>{feature.stat}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 6H18v9.5M18 6 6 18" />
                    </svg>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ ease, duration: 0.6 }}
            className="space-y-6"
          >
            <span className="text-sm uppercase tracking-[0.24em] text-brand-rose">
              Lightfield studies
            </span>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Content surfaces that glow with intentional motion.
            </h2>
            <p className="text-lg leading-relaxed text-muted">
              We choreograph depth through layered shadows, gradient lighting, and responsive
              easing curves—rendering every tap and scroll with perceptible polish.
            </p>
            <ul className="space-y-4 text-base text-muted">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-brand-500" />
                <span>
                  Premium Bezier curves (<code>0.16, 1, 0.3, 1</code>) unify transitions from hero reveals to card lifts.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-brand-soft" />
                <span>
                  Cursor-follow luminance creates contextual highlights without overwhelming the content narrative.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-brand-rose" />
                <span>
                  Motion-responsive shadows breathe subtly to reinforce spatial hierarchy on hover and focus.
                </span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ ease, duration: 0.7 }}
            className="relative overflow-hidden rounded-[32px] border border-white/10 bg-surface-elevated p-8 shadow-floating backdrop-blur-2xl"
          >
            <motion.div
              className="absolute -top-20 right-12 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.45),transparent_65%)] opacity-70 blur-2xl"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ ease, duration: 6, repeat: Infinity }}
            />
            <div className="relative z-10 flex flex-col gap-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-pill bg-white/8 px-4 py-2 text-sm font-medium text-foreground">
                Live prototype
                <motion.span
                  className="h-2 w-2 rounded-full bg-brand-amber"
                  animate={{ scale: [1, 1.35, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ ease, duration: 2.8, repeat: Infinity }}
                />
              </span>
              <p className="text-lg text-muted">
                Hover across the surface to feel lighting shifts, gradient refractions, and tactile elevation cues—rendered at 120fps for clarity on high-density displays.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-muted">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                    Refinement loop
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">3.4 iterations</p>
                  <p className="mt-1">Average to reach pixel-perfect QA.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-muted">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                    Motion latency
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">180 ms</p>
                  <p className="mt-1">Response time for adaptive hover states.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="relative z-10 space-y-10">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ ease, duration: 0.6 }}
            className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Trusted by teams crafting ultra-premium experiences.
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <motion.blockquote
                key={testimonial.name}
                className="group relative overflow-hidden rounded-card border border-white/8 bg-surface p-8 text-base leading-relaxed text-muted shadow-soft backdrop-blur-xl"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ ease, duration: 0.6, delay: index * 0.08 }}
                whileHover={{
                  y: -6,
                  boxShadow: "0 28px 80px rgba(10, 5, 22, 0.55)",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(56, 189, 248, 0.16), rgba(139, 92, 246, 0.24))",
                  }}
                  aria-hidden
                />
                <p className="relative z-10">“{testimonial.quote}”</p>
                <footer className="relative z-10 mt-6 flex items-center justify-between text-sm text-foreground/70">
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-muted">{testimonial.role}</div>
                  </div>
                  <motion.span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-brand-soft"
                    animate={{ rotate: [0, 8, 0, -8, 0] }}
                    transition={{ ease, duration: 8, repeat: Infinity, delay: index * 0.6 }}
                  >
                    ✶
                  </motion.span>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </section>

        <motion.section
          id="consult"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ ease, duration: 0.6 }}
          className="relative z-10 overflow-hidden rounded-[36px] border border-white/10 bg-surface-elevated p-10 shadow-floating backdrop-blur-2xl sm:p-12 lg:p-16"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.35),transparent_65%)] opacity-70" />
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-4">
              <span className="text-sm uppercase tracking-[0.28em] text-brand-soft">
                QA certified
              </span>
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Every interaction audited across breakpoints and devices.
              </h2>
              <p className="text-base leading-relaxed text-muted">
                Retina, ultra-wide, and mobile views checked for clarity, compression, and gradient
                fidelity. Motion tuned for both performance and delight.
              </p>
            </div>
            <motion.a
              href="mailto:hello@lumaatlas.co"
              className="inline-flex items-center justify-center rounded-pill bg-brand-500 px-8 py-3 text-base font-semibold text-white shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              whileHover={{
                y: -3,
                boxShadow:
                  "0 36px 72px rgba(139, 92, 246, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.12)",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ ease, duration: 0.45 }}
            >
              Book your launch runway
            </motion.a>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
