'use client';

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type RoofOption = {
  id: string;
  label: string;
  description: string;
  priceModifier: number;
  annualOutput: string;
};

type BatteryOption = {
  id: string;
  label: string;
  description: string;
  priceModifier: number;
  backupHours: string;
};

type ExtraOption = {
  id: string;
  label: string;
  description: string;
  priceModifier: number;
};

type Hotspot = {
  id: string;
  title: string;
  summary: string;
  description: string;
  ariaLabel: string;
  position: {
    top: string;
    left: string;
  };
};

type ImpactStat = {
  label: string;
  value: string;
  description: string;
};

type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

const basePrice = 1899;

const navLinks = [
  { href: "#experience", label: "Experience" },
  { href: "#configurator", label: "Configurator" },
  { href: "#technology", label: "Technology" },
  { href: "#commitment", label: "Commitment" },
];

const roofOptions: RoofOption[] = [
  {
    id: "south-facing",
    label: "South-facing roof",
    description: "Max sunlight capture with minimal shading for peak output.",
    priceModifier: 0,
    annualOutput: "≈ 6.1 MWh / year",
  },
  {
    id: "east-west",
    label: "East & west split",
    description: "Balanced generation across the day with slight peak reduction.",
    priceModifier: 180,
    annualOutput: "≈ 5.5 MWh / year",
  },
  {
    id: "flat-roof",
    label: "Flat roof with tilt kit",
    description: "Adjustable racking set for optimal sun capture and drainage.",
    priceModifier: 320,
    annualOutput: "≈ 5.9 MWh / year",
  },
];

const batteryOptions: BatteryOption[] = [
  {
    id: "grid-only",
    label: "Grid-tied only",
    description: "Use the utility grid as backup with no onsite storage.",
    priceModifier: 0,
    backupHours: "Grid fallback",
  },
  {
    id: "battery-10",
    label: "10 kWh battery",
    description: "Keep essentials powered overnight with lithium-iron phosphate cells.",
    priceModifier: 1180,
    backupHours: "10 kWh • 8–10 hrs",
  },
  {
    id: "battery-15",
    label: "15 kWh battery",
    description: "Whole-home backup for extended outages with smart load shifting.",
    priceModifier: 1820,
    backupHours: "15 kWh • 12–14 hrs",
  },
];

const extrasOptions: ExtraOption[] = [
  {
    id: "monitoring",
    label: "24/7 performance monitoring",
    description: "Receive proactive alerts and accessible reports in multiple formats.",
    priceModifier: 180,
  },
  {
    id: "maintenance",
    label: "Annual pro maintenance",
    description: "Certified technicians perform shaded array cleaning and inspections.",
    priceModifier: 320,
  },
  {
    id: "ev-ready",
    label: "EV-ready circuit",
    description: "Pre-wire your garage with a load-ready EV charging circuit.",
    priceModifier: 460,
  },
];

const hotspots: Hotspot[] = [
  {
    id: "inverter",
    title: "High-efficiency inverter",
    summary: "97% conversion efficiency",
    description:
      "Converts DC power to AC with rapid-shutdown compliance and audible status indicators.",
    ariaLabel: "Show details about the high-efficiency inverter",
    position: { top: "32%", left: "66%" },
  },
  {
    id: "battery-hub",
    title: "Hybrid battery hub",
    summary: "Smart charge scheduling",
    description:
      "Coordinates battery charge cycles with grid demand and honors quiet-hours preferences.",
    ariaLabel: "Show details about the hybrid battery hub",
    position: { top: "60%", left: "18%" },
  },
  {
    id: "mounting",
    title: "Low-profile mounting",
    summary: "Weather-rated racking",
    description:
      "Aerodynamic, code-compliant mounts protect roofing materials and include tactile alignment guides.",
    ariaLabel: "Show details about the low-profile mounting system",
    position: { top: "18%", left: "38%" },
  },
];

const impactStats: ImpactStat[] = [
  {
    label: "Accessibility score",
    value: "98",
    description: "Lighthouse benchmark using keyboard-first and screen reader workflows.",
  },
  {
    label: "Energy savings",
    value: "22%",
    description: "Average utility reduction for comparable homes within the first year.",
  },
  {
    label: "Inclusive installers",
    value: "500+",
    description: "Certified partners who follow our accessibility and safety standards.",
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      "Every control is reachable using just my keyboard, and the reduced-motion support keeps me comfortable throughout the process.",
    name: "Casey W.",
    role: "Homeowner in Portland",
  },
  {
    quote:
      "The configurator spells out pricing clearly, and the hotspot descriptions help clients visualize their installations before signing.",
    name: "Jordan R.",
    role: "Sustainability consultant",
  },
];

export default function Home() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const allowMotion = !prefersReducedMotion;

  const [selectedRoof, setSelectedRoof] = useState<string>(roofOptions[0]?.id ?? "");
  const [selectedBattery, setSelectedBattery] = useState<string>(batteryOptions[0]?.id ?? "");
  const [selectedExtras, setSelectedExtras] = useState<string[]>(
    extrasOptions[0]?.id ? [extrasOptions[0].id] : []
  );
  const [activeHotspot, setActiveHotspot] = useState<string>(hotspots[0]?.id ?? "");

  useEffect(() => {
    const scrollTriggerElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-animate]")
    );

    if (!scrollTriggerElements.length) {
      return;
    }

    if (prefersReducedMotion) {
      scrollTriggerElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observerInstance.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    scrollTriggerElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const toggleExtra = (id: string) => {
    setSelectedExtras((previous) => {
      if (previous.includes(id)) {
        return previous.filter((value) => value !== id);
      }

      return [...previous, id];
    });
  };

  const totalPrice = useMemo(() => {
    const roofModifier = roofOptions.find((option) => option.id === selectedRoof)?.priceModifier ?? 0;
    const batteryModifier =
      batteryOptions.find((option) => option.id === selectedBattery)?.priceModifier ?? 0;

    const extrasModifier = extrasOptions
      .filter((option) => selectedExtras.includes(option.id))
      .reduce((sum, option) => sum + option.priceModifier, 0);

    return basePrice + roofModifier + batteryModifier + extrasModifier;
  }, [selectedRoof, selectedBattery, selectedExtras]);

  const formattedTotalPrice = useMemo(() => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
      totalPrice
    );
  }, [totalPrice]);

  const selectedRoofOption = roofOptions.find((option) => option.id === selectedRoof);
  const selectedBatteryOption = batteryOptions.find((option) => option.id === selectedBattery);
  const selectedAddOns = extrasOptions.filter((option) => selectedExtras.includes(option.id));
  const selectedHotspot = hotspots.find((hotspot) => hotspot.id === activeHotspot) ?? hotspots[0];
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <a
            className="flex items-center gap-3 text-lg font-semibold text-emerald-800 transition hover:text-emerald-600 focus-visible:outline-offset-4"
            href="#experience"
          >
            <Image
              src="/globe.svg"
              alt="Acme Solar logo"
              width={40}
              height={40}
              priority
            />
            Acme Solar
          </a>
          <nav
            aria-label="Primary navigation"
            className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-700"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-2 transition hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-offset-4"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href="#configurator"
            className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 focus-visible:outline-offset-4"
          >
            Configure now
          </a>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        <section
          id="experience"
          aria-labelledby="experience-heading"
          className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 text-white"
          data-animate
        >
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">
                Inclusive solar planning
              </p>
              <h1 id="experience-heading" className="text-4xl font-bold leading-tight sm:text-5xl">
                Accessible energy design for every home
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-emerald-50">
                Build a tailored solar plan with keyboard-friendly navigation, readable focus outlines,
                and motion that adapts to your comfort.
              </p>
              <ul className="grid gap-3 text-sm text-emerald-100 sm:grid-cols-2">
                {impactStats.map((stat) => (
                  <li
                    key={stat.label}
                    className="rounded-2xl border border-emerald-400/30 bg-white/5 p-4 shadow-sm"
                  >
                    <p className="text-3xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-1 font-medium text-emerald-50">{stat.label}</p>
                    <p className="mt-2 text-xs text-emerald-100">{stat.description}</p>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <a
                  className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-base font-semibold text-emerald-900 transition hover:bg-emerald-100 focus-visible:outline-offset-4"
                  href="#configurator"
                >
                  Launch configurator
                </a>
                <a
                  className="inline-flex items-center justify-center rounded-full border border-white/80 px-5 py-3 text-base font-semibold text-white transition hover:bg-white/10 focus-visible:outline-offset-4"
                  href="#technology"
                >
                  Explore the technology
                </a>
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="relative w-full max-w-md rounded-3xl bg-white/10 p-6 shadow-xl ring-1 ring-white/20">
                <Image
                  src="/window.svg"
                  alt="Illustration of the Acme Solar dashboard"
                  width={480}
                  height={360}
                  className="w-full rounded-2xl object-contain"
                  priority
                />
                <div className="mt-6 grid gap-4 rounded-2xl bg-emerald-950/60 p-5 text-sm shadow-inner">
                  <p className="font-semibold text-white">Live accessibility snapshot</p>
                  <dl className="grid grid-cols-2 gap-3">
                    <div>
                      <dt className="text-emerald-200">Keyboard focus</dt>
                      <dd className="text-white">Sequential & logical</dd>
                    </div>
                    <div>
                      <dt className="text-emerald-200">Motion</dt>
                      <dd className="text-white">Respects system setting</dd>
                    </div>
                    <div>
                      <dt className="text-emerald-200">Skip links</dt>
                      <dd className="text-white">Enabled</dd>
                    </div>
                    <div>
                      <dt className="text-emerald-200">Hotspots</dt>
                      <dd className="text-white">ARIA labelled</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="configurator"
          aria-labelledby="configurator-heading"
          className="mx-auto max-w-6xl px-6 py-16"
          data-animate
        >
          <form
            className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr]"
            aria-describedby="configurator-description"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 id="configurator-heading" className="text-3xl font-semibold text-slate-900">
                  Build your solar plan
                </h2>
                <p id="configurator-description" className="max-w-2xl text-base text-slate-600">
                  Choose options and extras in the order that works best for you. Every field is
                  reachable via keyboard, and live totals update politely for screen readers.
                </p>
              </div>

              <fieldset
                className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                aria-describedby="roof-options-description"
              >
                <legend className="text-lg font-semibold text-slate-900">Roof orientation</legend>
                <p id="roof-options-description" className="text-sm text-slate-600">
                  Pick the configuration that best matches your installation surface.
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  {roofOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`flex cursor-pointer flex-col rounded-xl border-2 border-transparent bg-slate-50 p-4 transition focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-200 ${
                        selectedRoof === option.id
                          ? "border-emerald-600 bg-white ring-2 ring-emerald-200"
                          : "hover:border-emerald-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-base font-semibold text-slate-900">{option.label}</span>
                        <span className="text-sm font-medium text-emerald-700">
                          {option.priceModifier === 0
                            ? "Included"
                            : `+$${option.priceModifier.toLocaleString("en-US")}`}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">{option.description}</p>
                      <p className="mt-3 text-sm font-medium text-slate-700">
                        Annual output: {option.annualOutput}
                      </p>
                      <input
                        className="sr-only"
                        type="radio"
                        name="roof"
                        value={option.id}
                        checked={selectedRoof === option.id}
                        onChange={() => setSelectedRoof(option.id)}
                      />
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset
                className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                aria-describedby="battery-options-description"
              >
                <legend className="text-lg font-semibold text-slate-900">Storage preference</legend>
                <p id="battery-options-description" className="text-sm text-slate-600">
                  Select a backup option that meets your household needs.
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  {batteryOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`flex cursor-pointer flex-col rounded-xl border-2 border-transparent bg-slate-50 p-4 transition focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-200 ${
                        selectedBattery === option.id
                          ? "border-emerald-600 bg-white ring-2 ring-emerald-200"
                          : "hover:border-emerald-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-base font-semibold text-slate-900">{option.label}</span>
                        <span className="text-sm font-medium text-emerald-700">
                          {option.priceModifier === 0
                            ? "Included"
                            : `+$${option.priceModifier.toLocaleString("en-US")}`}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">{option.description}</p>
                      <p className="mt-3 text-sm font-medium text-slate-700">
                        Backup window: {option.backupHours}
                      </p>
                      <input
                        className="sr-only"
                        type="radio"
                        name="battery"
                        value={option.id}
                        checked={selectedBattery === option.id}
                        onChange={() => setSelectedBattery(option.id)}
                      />
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset
                className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                aria-describedby="extras-options-description"
              >
                <legend className="text-lg font-semibold text-slate-900">Service extras</legend>
                <p id="extras-options-description" className="text-sm text-slate-600">
                  Toggle additional services. All checkboxes include focus-visible outlines.
                </p>
                <div className="space-y-3">
                  {extrasOptions.map((option) => {
                    const isChecked = selectedExtras.includes(option.id);
                    return (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-start gap-4 rounded-xl border-2 border-transparent bg-slate-50 p-4 transition focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-200 ${
                          isChecked
                            ? "border-emerald-600 bg-white ring-2 ring-emerald-200"
                            : "hover:border-emerald-200"
                        }`}
                      >
                        <input
                          className="sr-only"
                          type="checkbox"
                          name="extras"
                          value={option.id}
                          checked={isChecked}
                          onChange={() => toggleExtra(option.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-base font-semibold text-slate-900">
                              {option.label}
                            </span>
                            <span className="text-sm font-medium text-emerald-700">
                              +${option.priceModifier.toLocaleString("en-US")}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-slate-600">{option.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </div>

            <aside
              className="space-y-6 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-8 shadow-inner"
              aria-live="polite"
            >
              <h3 className="text-2xl font-semibold text-emerald-900">Your estimate</h3>
              <p className="text-4xl font-bold text-emerald-700">{formattedTotalPrice}</p>
              <p className="text-sm text-slate-600">
                Roof orientation: {selectedRoofOption?.label ?? "Choose an option"}
              </p>
              <p className="text-sm text-slate-600">
                Storage plan: {selectedBatteryOption?.label ?? "Choose an option"}
              </p>
              <p className="text-sm text-slate-600">
                Annual output: {selectedRoofOption?.annualOutput ?? "–"}
              </p>
              <p className="text-sm text-slate-600">
                Backup capacity: {selectedBatteryOption?.backupHours ?? "–"}
              </p>
              <div className="text-sm text-slate-600">
                <p className="font-medium text-slate-700">Selected extras</p>
                <ul className="mt-2 space-y-1">
                  {selectedAddOns.length > 0 ? (
                    selectedAddOns.map((extra) => (
                      <li key={extra.id} className="flex items-center gap-2">
                        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-600" />
                        {extra.label}
                      </li>
                    ))
                  ) : (
                    <li>No add-ons selected</li>
                  )}
                </ul>
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-emerald-700 px-5 py-3 text-base font-semibold text-white transition hover:bg-emerald-600 focus-visible:outline-offset-4"
              >
                Book an accessibility-friendly consultation
              </button>
              <p className="text-xs text-slate-500">
                This experience automatically honors motion preferences and provides consistent focus
                outlines for every interactive control.
              </p>
            </aside>
          </form>
        </section>

        <section
          id="technology"
          aria-labelledby="technology-heading"
          className="bg-white py-16"
          data-animate
        >
          <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1.05fr,0.95fr]">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 id="technology-heading" className="text-3xl font-semibold text-slate-900">
                  Explore the system hotspots
                </h2>
                <p className="text-base text-slate-600">
                  Focus or hover each marker to reveal a tooltip. Tooltips persist while focused and are
                  described to assistive technologies using ARIA labels.
                </p>
              </div>
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900/90 p-6 shadow-xl">
                <figure className="relative">
                  <Image
                    src="/globe.svg"
                    alt="Diagram of the Acme Solar rooftop system"
                    width={640}
                    height={480}
                    className="w-full rounded-2xl bg-slate-800/60 p-6"
                  />
                  {hotspots.map((hotspot, index) => (
                    <div
                      key={hotspot.id}
                      style={{ top: hotspot.position.top, left: hotspot.position.left }}
                      className="absolute"
                    >
                      <button
                        type="button"
                        aria-label={hotspot.ariaLabel}
                        aria-describedby={`${hotspot.id}-description`}
                        onFocus={() => setActiveHotspot(hotspot.id)}
                        onMouseEnter={() => setActiveHotspot(hotspot.id)}
                        className={`flex h-11 w-11 items-center justify-center rounded-full border-2 border-emerald-200 bg-white/90 text-base font-semibold text-emerald-700 transition hover:bg-emerald-100 focus-visible:outline-offset-4 ${
                          activeHotspot === hotspot.id
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : ""
                        } ${allowMotion ? "hotspot-pulse" : ""}`}
                      >
                        <span aria-hidden>{index + 1}</span>
                        <span id={`${hotspot.id}-description`} className="sr-only">
                          {hotspot.title}. {hotspot.description}
                        </span>
                      </button>
                      <div
                        role="tooltip"
                        id={`${hotspot.id}-tooltip`}
                        aria-hidden={activeHotspot !== hotspot.id}
                        className={`mt-3 w-48 rounded-2xl bg-white/95 p-4 text-left text-slate-900 shadow-lg ring-1 ring-emerald-100 transition ${
                          activeHotspot === hotspot.id
                            ? "visible opacity-100"
                            : "invisible opacity-0"
                        }`}
                      >
                        <p className="text-sm font-semibold text-emerald-800">{hotspot.title}</p>
                        <p className="mt-1 text-xs text-slate-600">{hotspot.description}</p>
                      </div>
                    </div>
                  ))}
                </figure>
              </div>
            </div>
            <aside className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Currently highlighted</h3>
              <div aria-live="polite" className="rounded-2xl bg-white p-5 shadow-inner">
                <p className="text-lg font-semibold text-emerald-700">{selectedHotspot.title}</p>
                <p className="mt-2 text-sm text-slate-600">{selectedHotspot.description}</p>
              </div>
              <ol className="space-y-3 text-sm text-slate-600">
                {hotspots.map((hotspot, index) => (
                  <li
                    key={hotspot.id}
                    className={`flex items-start gap-3 rounded-xl px-3 py-2 transition ${
                      activeHotspot === hotspot.id ? "bg-white shadow-inner" : ""
                    }`}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-800">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-slate-900">{hotspot.title}</p>
                      <p className="text-xs text-slate-600">{hotspot.summary}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="text-xs text-slate-500">
                Motion-averse visitors can enable reduced motion at the operating system level. All
                ScrollTrigger animations respect that preference automatically.
              </p>
            </aside>
          </div>
        </section>

        <section
          id="commitment"
          aria-labelledby="commitment-heading"
          className="mx-auto max-w-6xl px-6 py-16"
          data-animate
        >
          <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 id="commitment-heading" className="text-3xl font-semibold text-slate-900">
                  Our accessibility and SEO commitment
                </h2>
                <p className="text-base text-slate-600">
                  We validate every release with Lighthouse audits to ensure accessibility and SEO
                  scores stay above 95. Metadata, canonical links, and structured data are baked in.
                </p>
              </div>
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  Focus-visible outlines guide keyboard users across buttons, forms, and hotspots.
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  Skip links jump straight to the main content, while semantic landmarks aid screen readers.
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  Reduced-motion variants deliver instant content without fades, slides, or pulses.
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  JSON-LD for both product and organization boosts search result visibility.
                </li>
              </ul>
            </div>
            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">What people are saying</h3>
              <ul className="space-y-6">
                {testimonials.map((testimonial) => (
                  <li key={testimonial.name} className="rounded-2xl bg-slate-50 p-5 shadow-inner">
                    <p className="text-base italic text-slate-700">“{testimonial.quote}”</p>
                    <p className="mt-4 text-sm font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-xs text-slate-500">{testimonial.role}</p>
                  </li>
                ))}
              </ul>
              <div className="rounded-2xl bg-emerald-700 p-5 text-white">
                <p className="text-sm font-semibold">Lighthouse ready</p>
                <p className="mt-2 text-sm text-emerald-100">
                  Run audits anytime in Chrome DevTools or via the command line. We document results and
                  iterate quickly when new requirements surface.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white" role="contentinfo">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            © {currentYear} Acme Solar. Accessibility-first renewable energy planning.
          </p>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-4 text-sm text-slate-600">
            <a className="rounded-full px-3 py-2 transition hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-offset-4" href="#configurator">
              Configurator
            </a>
            <a className="rounded-full px-3 py-2 transition hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-offset-4" href="#technology">
              Technology
            </a>
            <a className="rounded-full px-3 py-2 transition hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-offset-4" href="#commitment">
              Commitment
            </a>
            <a className="rounded-full px-3 py-2 transition hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-offset-4" href="mailto:access@acmesolar.energy">
              Email us
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
