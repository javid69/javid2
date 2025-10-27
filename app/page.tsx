'use client';

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface StorySection {
  id: string;
  label: string;
  headline: string;
  body: string;
  support: string;
  asset: string;
  gradient: {
    start: string;
    end: string;
    accent: string;
  };
}

const STORY_SECTIONS: StorySection[] = [
  {
    id: "materials",
    label: "Materials",
    headline: "Materials with provenance.",
    body:
      "We partner with regenerative farms across Andalusia to spin fibres that stay soft under pressure. Every thread is mapped to its source so nothing in the garment is anonymous.",
    support: "Organic cotton • Recycled ocean nylon • Plant-dyed tonals",
    asset:
      "Hand-loomed jacquard swatches catching the dawn prove every dye bath and weave remains true to the design intent.",
    gradient: {
      start: "#0f172a",
      end: "#1d4ed8",
      accent: "#f59e0b",
    },
  },
  {
    id: "craftsmanship",
    label: "Craftsmanship",
    headline: "Craftsmanship in slow motion.",
    body:
      "Six artisan teams touch each piece, from selvedge binding to hand-tacked pleats. The cadence of the scroll mirrors their rhythm so the camera never misses a gesture.",
    support: "42 touchpoints of human craft",
    asset:
      "Macro needlework and chalk marks glide under the lens, illustrating how precision and improvisation stay in balance.",
    gradient: {
      start: "#111827",
      end: "#312e81",
      accent: "#c084fc",
    },
  },
  {
    id: "lifestyle",
    label: "Lifestyle",
    headline: "Lifestyle scenes that breathe.",
    body:
      "Wardrobe essentials transition from commuter rush to studio afterglow. Ambient cues — ceramic steam, midnight rides, weekend light — anchor the garments in lived rituals.",
    support: "Designed for 18-hour days without compromise",
    asset:
      "A layered storyboard of city dusk, atelier warmth, and wild coastline pulses together to hint at the wearer’s tempo.",
    gradient: {
      start: "#0b1f1a",
      end: "#115e59",
      accent: "#34d399",
    },
  },
  {
    id: "sustainability",
    label: "Sustainability",
    headline: "Sustainability measured in motion.",
    body:
      "Carbon, water, and energy data surface the instant the perspective shifts. Impact metrics are choreographed into the story so accountability feels as fluid as the visuals.",
    support: "62% lower emissions versus last season",
    asset:
      "Data ribbons orbit the silhouette, echoing the live dashboards that guide our circular production loops.",
    gradient: {
      start: "#102a43",
      end: "#0f766e",
      accent: "#22d3ee",
    },
  },
];

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gradientRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const storyWrapperRef = useRef<HTMLDivElement | null>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      if (indicatorRef.current) {
        indicatorRef.current.style.transformOrigin = "top";
        indicatorRef.current.style.transform = "scaleY(1)";
      }
      return;
    }

    sectionsRef.current = sectionsRef.current.slice(0, STORY_SECTIONS.length);

    const ctx = gsap.context(() => {
      if (heroRef.current) {
        const heroElements =
          heroRef.current.querySelectorAll("[data-hero-animate]");
        gsap.from(heroElements, {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
        });
      }

      if (indicatorRef.current && storyWrapperRef.current) {
        gsap.fromTo(
          indicatorRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: storyWrapperRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      STORY_SECTIONS.forEach((section, index) => {
        const panel = sectionsRef.current[index];
        if (!panel) return;

        const badge = panel.querySelector("[data-animate='badge']");
        const headline = panel.querySelector("[data-animate='headline']");
        const body = panel.querySelector("[data-animate='body']");
        const support = panel.querySelector("[data-animate='support']");
        const asset = panel.querySelector("[data-animate='asset']");

        const timeline = gsap.timeline({
          defaults: {
            ease: "power3.out",
          },
          scrollTrigger: {
            trigger: panel,
            start: "top center+=10%",
            end: "bottom center",
            scrub: true,
          },
        });

        const headingTargets = [badge, headline].filter(
          (el): el is Element => Boolean(el)
        );

        if (headingTargets.length) {
          timeline.fromTo(
            headingTargets,
            { y: 48, opacity: 0, filter: "blur(8px)" },
            { y: 0, opacity: 1, filter: "blur(0px)", duration: 1 },
            0
          );
        }

        if (body) {
          timeline.fromTo(
            body,
            { y: 32, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9 },
            0.1
          );
        }

        if (support) {
          timeline.fromTo(
            support,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9 },
            0.18
          );
        }

        if (asset) {
          timeline.fromTo(
            asset,
            { scale: 0.92, opacity: 0, filter: "blur(12px)" },
            { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.2 },
            0
          );
        }

        if (gradientRef.current) {
          timeline.to(
            gradientRef.current,
            {
              "--hero-start": section.gradient.start,
              "--hero-end": section.gradient.end,
              "--hero-accent": section.gradient.accent,
              duration: 1.2,
              ease: "linear",
            },
            0
          );
        }
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  const gradientVariables = {
    "--hero-start": STORY_SECTIONS[0].gradient.start,
    "--hero-end": STORY_SECTIONS[0].gradient.end,
    "--hero-accent": STORY_SECTIONS[0].gradient.accent,
  } as CSSProperties;

  return (
    <main
      ref={containerRef}
      className="relative flex min-h-screen flex-col overflow-hidden bg-slate-950 text-slate-100"
    >
      <div
        ref={gradientRef}
        className="hero-gradient pointer-events-none absolute inset-0 -z-10 transition-[background] duration-700 ease-out"
        style={gradientVariables}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-gradient-to-b from-white/5 via-transparent to-transparent"
        aria-hidden="true"
      />

      <header
        ref={heroRef}
        className="relative mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 pb-24 pt-24 sm:pt-28 md:gap-8 md:px-12 md:pb-32 md:pt-32 lg:px-20"
      >
        <span
          data-hero-animate
          className="text-xs uppercase tracking-[0.35em] text-white/60 md:text-sm"
        >
          Story / 01
        </span>
        <h1
          data-hero-animate
          className="text-balance text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl md:leading-[1.1]"
        >
          A crafted journey that syncs every detail of the collection with the way you move.
        </h1>
        <p
          data-hero-animate
          className="max-w-2xl text-pretty text-base text-slate-200 sm:text-lg md:text-xl"
        >
          Scroll through the story to follow the camera&#39;s glide across material choices, artisan hands, and everyday moments. Each beat is choreographed so the narrative unfolds as fluidly as the garments themselves.
        </p>
      </header>

      <div className="relative mx-auto w-full max-w-5xl px-6 pb-24 md:px-12 lg:px-20 lg:pb-32">
        <div className="pointer-events-none absolute right-0 top-12 hidden h-[420px] w-[1.5px] overflow-hidden rounded-full bg-white/15 md:block">
          <div
            ref={indicatorRef}
            className="h-full w-full origin-top scale-y-0 rounded-full bg-gradient-to-b from-white via-white/80 to-white/0"
            aria-hidden="true"
          />
        </div>

        <div
          ref={storyWrapperRef}
          className="flex flex-col gap-20 md:gap-28 lg:gap-32"
        >
          {STORY_SECTIONS.map((section, index) => {
            const accentStyle: CSSProperties = {
              backgroundImage: `linear-gradient(140deg, ${section.gradient.accent}1f, rgba(15,23,42,0.35)), linear-gradient(210deg, rgba(15,23,42,0.6), rgba(15,23,42,0.1))`,
            };

            const textureStyle: CSSProperties = {
              backgroundImage: `radial-gradient(120% 120% at 20% 15%, ${section.gradient.accent}55 0%, transparent 55%), radial-gradient(140% 120% at 80% 85%, rgba(255,255,255,0.08) 0%, transparent 65%)`,
            };

            return (
              <section
                key={section.id}
                ref={(element) => {
                  sectionsRef.current[index] = element;
                }}
                className="relative grid min-h-[80vh] grid-cols-1 gap-12 rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-colors duration-500 md:min-h-[70vh] md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)] md:p-12 lg:p-16"
              >
                <div className="flex flex-col gap-6 md:gap-8">
                  <span
                    data-animate="badge"
                    className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.28em] text-white/70 md:text-sm"
                  >
                    {section.label}
                    <span
                      className="h-1 w-1 rounded-full bg-white/60"
                      aria-hidden="true"
                    />
                  </span>
                  <h2
                    data-animate="headline"
                    className="text-balance text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-4xl"
                  >
                    {section.headline}
                  </h2>
                  <p
                    data-animate="body"
                    className="text-pretty text-base text-slate-200 sm:text-lg"
                  >
                    {section.body}
                  </p>
                  <p
                    data-animate="support"
                    className="text-xs font-medium uppercase tracking-[0.22em] text-white/60 md:text-sm"
                  >
                    {section.support}
                  </p>
                </div>

                <div className="relative flex items-end justify-center md:justify-end">
                  <div
                    data-animate="asset"
                    className="relative flex aspect-[4/3] w-full max-w-lg items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_40px_140px_-80px_rgba(15,23,42,0.9)]"
                    style={accentStyle}
                  >
                    <div
                      className="absolute inset-0 opacity-80"
                      style={textureStyle}
                      aria-hidden="true"
                    />
                    <div className="relative z-10 flex flex-col items-center gap-4 px-8 text-center text-sm text-slate-100">
                      <span className="text-xs uppercase tracking-[0.3em] text-white/70">
                        Visual Cue
                      </span>
                      <p className="text-balance text-base font-medium text-white sm:text-lg">
                        {section.asset}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <footer className="mx-auto w-full max-w-5xl px-6 pb-16 text-sm text-white/60 md:px-12 lg:px-20">
        Scroll slowly — the story is timed to the rhythm of the camera.
      </footer>
    </main>
  );
}
