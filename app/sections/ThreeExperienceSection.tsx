"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDeviceProfile } from "../hooks/useDeviceProfile";

const SceneCanvas = dynamic(
  () => import("../three/SceneCanvas").then((mod) => mod.SceneCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-80 w-full items-center justify-center rounded-2xl border border-white/10 bg-slate-900/40 text-white/60">
        Preparing renderer…
      </div>
    ),
  }
);

const POSTER_IMAGE =
  "https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=1024&q=60";
const POSTER_PLACEHOLDER =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";

export default function ThreeExperienceSection() {
  const { lowPower, mode } = useDeviceProfile();
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current || inView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "240px" }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      className="grid gap-8 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-8 py-12 text-white lg:grid-cols-[1.2fr_1fr]"
    >
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-300/80">
          Adaptive 3D viewport
        </p>
        <h2 className="text-3xl font-semibold text-white">
          Streamed geometry, texture compression, and a graceful fallback path.
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-white/60">
          The 3D viewer hydrates only once users intentionally scroll to it.
          Draco-compressed meshes and KTX2 textures decode off the main thread,
          while Suspense keeps UI responsive. Low-power devices stay on the
          static poster without paying for post-processing.
        </p>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-white/40">Mode</dt>
            <dd className="text-lg font-semibold text-white">{mode}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-white/40">Load trigger</dt>
            <dd className="text-lg font-semibold text-white">
              {inView ? "Activated" : "Deferred"}
            </dd>
          </div>
        </dl>
      </div>
      <div className="flex items-center justify-center">
        {lowPower ? (
          <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={POSTER_IMAGE}
              alt="Optimized 3D fallback poster"
              fill
              priority={false}
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 90vw"
              placeholder="blur"
              blurDataURL={POSTER_PLACEHOLDER}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60" />
            <div className="absolute bottom-4 left-4 right-4 space-y-1 rounded-xl border border-white/10 bg-slate-950/70 p-3 text-xs text-white/70 backdrop-blur">
              <p className="font-semibold text-white">Low-power fallback</p>
              <p>
                Heavy shaders skipped. Users still get contextual art direction,
                but no GPU spikes.
              </p>
            </div>
          </div>
        ) : inView ? (
          <SceneCanvas />
        ) : (
          <div className="flex h-80 w-full items-center justify-center rounded-2xl border border-white/10 bg-slate-900/40 text-white/60">
            Awaiting viewport intent…
          </div>
        )}
      </div>
    </section>
  );
}
