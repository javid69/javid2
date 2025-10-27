import dynamic from "next/dynamic";
import { Suspense } from "react";
import { CaseStudyGallery } from "./sections/CaseStudyGallery";
import { Hero } from "./sections/Hero";
import { ImplementationNotes } from "./sections/ImplementationNotes";
import { MetricsSummary } from "./sections/MetricsSummary";
import { ValueProps } from "./sections/ValueProps";

const ThreeExperienceSection = dynamic(
  () => import("./sections/ThreeExperienceSection"),
  {
    ssr: false,
    loading: () => <ExperienceFallback />,
  }
);

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 pb-24 pt-12 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 sm:px-12 lg:px-16">
        <Hero />
        <MetricsSummary />
        <Suspense fallback={<ExperienceFallback />}>
          <ThreeExperienceSection />
        </Suspense>
        <ValueProps />
        <CaseStudyGallery />
        <ImplementationNotes />
      </div>
    </div>
  );
}

function ExperienceFallback() {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/60 px-8 py-12 text-center text-white/60">
      <p className="text-sm uppercase tracking-[0.3em] text-white/40">Deferred module</p>
      <p className="mt-3 text-lg">
        3D viewport assets are streaming in the background. They hydrate only once
        your device is ready.
      </p>
    </section>
  );
}
