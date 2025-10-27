import { LazyImage } from "../components/LazyImage";

const IMAGE_PLACEHOLDER =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";

const CASE_STUDIES = [
  {
    title: "Furniture try-ons",
    description:
      "High-fidelity renders hydrate only when shoppers explore AR previews, keeping initial checkout flows light.",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=60",
  },
  {
    title: "Sustainable footwear",
    description:
      "Texture-compressed product spins stream progressive detail without blocking PDP navigation.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=60",
  },
  {
    title: "Architectural fly-through",
    description:
      "Large GLB scenes split into route-aware chunks to prevent waterfall cascades on multi-step flows.",
    image:
      "https://images.unsplash.com/photo-1449247613801-ab06418e2861?auto=format&fit=crop&w=1200&q=60",
  },
];

export function CaseStudyGallery() {
  return (
    <section className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/40 px-6 py-10 sm:px-10" id="case-studies">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Real-world rollouts</h2>
        <p className="max-w-2xl text-sm text-white/60">
          The same pattern scales across PDPs, configurators, and real-time editors. Lazy media gates keep the network idle until scroll intent is clear.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {CASE_STUDIES.map((study) => (
          <article
            key={study.title}
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/5"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <LazyImage
                src={study.image}
                alt={study.title}
                fill
                className="object-cover transition duration-700 ease-out group-hover:scale-105"
                sizes="(min-width: 768px) 33vw, 90vw"
                placeholder="blur"
                blurDataURL={IMAGE_PLACEHOLDER}
              />
            </div>
            <div className="space-y-2 px-5 py-4">
              <h3 className="text-lg font-semibold text-white">{study.title}</h3>
              <p className="text-sm text-white/60">{study.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
