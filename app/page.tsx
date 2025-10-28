'use client';

import { FormEvent, useMemo, useState } from "react";
import { useAnalytics } from "@/components/analytics/AnalyticsProvider";

const VARIANTS = [
  {
    id: "oak",
    label: "Modern Oak",
    description: "Warm tones with a natural wood grain finish.",
  },
  {
    id: "black",
    label: "Matte Black",
    description: "Minimalist look with a fingerprint-resistant coating.",
  },
  {
    id: "white",
    label: "Nordic White",
    description: "Bright and clean surfaces for open-plan spaces.",
  },
];

const HOTSPOTS = [
  {
    id: "island-storage",
    label: "Island Storage",
    copy: "Soft-close drawers with modular dividers for utensils and cookware.",
  },
  {
    id: "lighting",
    label: "Integrated Lighting",
    copy: "Customisable LED scenes that sync with morning and evening routines.",
  },
  {
    id: "appliances",
    label: "Appliance Wall",
    copy: "Built-in appliances with flush panels for a seamless impression.",
  },
];

const CTA_ID = "request-design-pack";

export default function Home() {
  const { trackEvent } = useAnalytics();
  const [selectedVariant, setSelectedVariant] = useState(VARIANTS[0].id);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(HOTSPOTS[0].id);
  const [ctaSubmitted, setCtaSubmitted] = useState(false);

  const selectedVariantCopy = useMemo(
    () => VARIANTS.find((variant) => variant.id === selectedVariant),
    [selectedVariant],
  );

  const activeHotspotCopy = useMemo(
    () => HOTSPOTS.find((hotspot) => hotspot.id === activeHotspot),
    [activeHotspot],
  );

  const handleVariantClick = (variantId: string) => {
    setSelectedVariant(variantId);
    trackEvent("configurator_variant_selected", {
      variantId,
    });
  };

  const handleHotspotClick = (hotspotId: string) => {
    setActiveHotspot(hotspotId);
    trackEvent("configurator_hotspot_opened", {
      hotspotId,
    });
  };

  const handleCtaSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (ctaSubmitted) {
      return;
    }

    setCtaSubmitted(true);
    trackEvent("cta_submitted", {
      ctaId: CTA_ID,
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-16 dark:bg-black">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-12 rounded-3xl border border-zinc-200 bg-white px-12 py-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <header className="flex flex-col gap-4">
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
            Experience Builder
          </span>
          <h1 className="text-4xl font-semibold text-zinc-900 dark:text-zinc-50">
            Interactive kitchen configurator
          </h1>
          <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
            Choose a finish, explore key hotspots, and request the design pack to
            see how analytics events fire for each interaction. Tracking is only
            enabled in production builds and respects consent when Google
            Analytics 4 is configured.
          </p>
        </header>

        <section className="flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Finish variants
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Preview three curated looks for the island and perimeter cabinets.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {VARIANTS.map((variant) => {
              const isActive = variant.id === selectedVariant;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => handleVariantClick(variant.id)}
                  className={`flex h-full flex-col rounded-2xl border px-5 py-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-50 ${isActive ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-200 dark:bg-zinc-200 dark:text-zinc-900" : "border-zinc-200 bg-zinc-100 text-zinc-800 hover:border-zinc-300 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-700"}`}
                >
                  <span className="text-sm font-medium uppercase tracking-wide">
                    {variant.label}
                  </span>
                  <span
                    className={`mt-2 text-sm leading-relaxed ${isActive ? "text-zinc-100 dark:text-zinc-700" : "text-zinc-600 dark:text-zinc-300"}`}
                  >
                    {variant.description}
                  </span>
                </button>
              );
            })}
          </div>
          {selectedVariantCopy ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 px-6 py-4 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
              Currently previewing the <strong>{selectedVariantCopy.label}</strong> finish.
            </div>
          ) : null}
        </section>

        <section className="flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Explore hotspots
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Toggle product education hotspots to reveal feature details.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-[200px_1fr]">
            <div className="flex flex-col gap-2">
              {HOTSPOTS.map((hotspot) => {
                const isActive = hotspot.id === activeHotspot;
                return (
                  <button
                    key={hotspot.id}
                    type="button"
                    onClick={() => handleHotspotClick(hotspot.id)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-50 ${isActive ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-200 dark:bg-zinc-200 dark:text-zinc-900" : "border-zinc-200 bg-zinc-100 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-700"}`}
                  >
                    {hotspot.label}
                  </button>
                );
              })}
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-5 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              {activeHotspotCopy ? (
                <div className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
                    {activeHotspotCopy.label}
                  </span>
                  <p className="leading-6">{activeHotspotCopy.copy}</p>
                </div>
              ) : (
                <p>Select a hotspot to learn more.</p>
              )}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Request the design pack
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Submit the call-to-action to trigger the final analytics event.
            </p>
          </div>
          <form
            className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900"
            onSubmit={handleCtaSubmit}
          >
            <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Work email
              <input
                type="email"
                required
                placeholder="alex@studio.co"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-500"
              />
            </label>
            <button
              type="submit"
              disabled={ctaSubmitted}
              className={`inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-semibold transition ${ctaSubmitted ? "cursor-not-allowed bg-zinc-400 text-white opacity-80 dark:bg-zinc-700 dark:text-zinc-200 dark:opacity-90" : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"}`}
            >
              {ctaSubmitted ? "Submitted" : "Send me the design pack"}
            </button>
            {ctaSubmitted ? (
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                Thanks! Check the analytics dashboard to confirm the submission
                event.
              </p>
            ) : null}
          </form>
        </section>
      </main>
    </div>
  );
}
