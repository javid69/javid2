'use client';

import { motion } from 'framer-motion';
import {
  COLOR_VARIANTS,
  ENVIRONMENT_OPTIONS,
  MATERIAL_OPTIONS
} from './configurator-data';
import { useConfiguratorStore } from '@/lib/store/configurator-store';
import { useMemo } from 'react';

const spring = {
  type: 'spring',
  stiffness: 320,
  damping: 28
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    viewBox="0 0 24 24"
  >
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ConfiguratorPanel = () => {
  const selectedColorId = useConfiguratorStore((state) => state.selectedColorId);
  const selectedMaterialId = useConfiguratorStore((state) => state.selectedMaterialId);
  const selectedEnvironmentId = useConfiguratorStore((state) => state.selectedEnvironmentId);
  const hotspotsVisible = useConfiguratorStore((state) => state.hotspotsVisible);

  const setColorVariant = useConfiguratorStore((state) => state.setColorVariant);
  const setMaterial = useConfiguratorStore((state) => state.setMaterial);
  const setEnvironment = useConfiguratorStore((state) => state.setEnvironment);
  const toggleHotspots = useConfiguratorStore((state) => state.toggleHotspots);

  const selectedColor = useMemo(
    () => COLOR_VARIANTS.find((item) => item.id === selectedColorId) ?? COLOR_VARIANTS[0],
    [selectedColorId]
  );

  const selectedMaterial = useMemo(
    () => MATERIAL_OPTIONS.find((item) => item.id === selectedMaterialId) ?? MATERIAL_OPTIONS[0],
    [selectedMaterialId]
  );

  const selectedEnvironment = useMemo(
    () => ENVIRONMENT_OPTIONS.find((item) => item.id === selectedEnvironmentId) ?? ENVIRONMENT_OPTIONS[0],
    [selectedEnvironmentId]
  );

  return (
    <aside className="w-full max-w-lg rounded-3xl bg-white/85 p-8 shadow-xl ring-1 ring-black/5 backdrop-blur-lg">
      <header>
        <p className="text-sm font-medium text-slate-500">Configurator</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Design your Momentum Runner</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Pick your palette, dial in textures, and view the shoe inside curated light stages. Selections persist so you can
          pick up right where you left off.
        </p>
      </header>

      <section className="mt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Colorway</h2>
          <p className="text-sm text-slate-400">{selectedColor.label}</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COLOR_VARIANTS.map((variant) => {
            const isActive = variant.id === selectedColorId;
            return (
              <motion.button
                key={variant.id}
                type="button"
                onClick={() => setColorVariant(variant.id)}
                aria-pressed={isActive}
                className={`group relative flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 ${
                  isActive ? 'border-sky-500 bg-sky-50/80 text-sky-600' : 'border-slate-200 bg-white/80 text-slate-600'
                }`}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                <span
                  aria-hidden
                  className="h-11 w-11 rounded-full shadow-md ring-1 ring-black/5"
                  style={{ background: variant.swatch }}
                />
                <span className="text-xs font-semibold leading-tight">{variant.label}</span>
                <span className="text-[11px] text-slate-400">{variant.description}</span>
                {isActive && <CheckIcon className="absolute right-2 top-2 h-5 w-5 text-sky-500" />}
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Material</h2>
          <p className="text-sm text-slate-400">{selectedMaterial.label}</p>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {MATERIAL_OPTIONS.map((material) => {
            const isActive = material.id === selectedMaterialId;
            return (
              <motion.button
                key={material.id}
                type="button"
                onClick={() => setMaterial(material.id)}
                aria-pressed={isActive}
                className={`flex items-center gap-4 rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 ${
                  isActive ? 'border-sky-500 bg-sky-50/70 text-sky-600' : 'border-slate-200 bg-white/80 text-slate-600'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <span
                  aria-hidden
                  className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl shadow-inner ring-1 ring-black/10"
                  style={{ background: material.thumbnailGradient }}
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{material.label}</p>
                  <p className="text-xs leading-5 text-slate-500">{material.description}</p>
                </div>
                {isActive && <CheckIcon className="h-5 w-5 flex-shrink-0 text-sky-500" />}
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Environment</h2>
          <p className="text-sm text-slate-400">{selectedEnvironment.label}</p>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ENVIRONMENT_OPTIONS.map((environment) => {
            const isActive = environment.id === selectedEnvironmentId;
            return (
              <motion.button
                key={environment.id}
                type="button"
                onClick={() => setEnvironment(environment.id)}
                aria-pressed={isActive}
                className={`flex h-full flex-col gap-2 rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 ${
                  isActive ? 'border-sky-500 bg-sky-50/70 text-sky-600' : 'border-slate-200 bg-white/80 text-slate-600'
                }`}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <p className="text-sm font-semibold">{environment.label}</p>
                <p className="text-xs leading-5 text-slate-500">{environment.description}</p>
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Options</h2>
        <div className="mt-4 flex flex-col gap-3">
          <motion.button
            type="button"
            role="switch"
            aria-checked={hotspotsVisible}
            onClick={toggleHotspots}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 ${
              hotspotsVisible ? 'border-sky-500 bg-sky-50/70 text-sky-600' : 'border-slate-200 bg-white/80 text-slate-600'
            }`}
          >
            <div>
              <p className="text-sm font-semibold">Hotspot Narration</p>
              <p className="text-xs leading-5 text-slate-500">
                Toggle guided callouts to explore design and engineering highlights.
              </p>
            </div>
            <span
              className={`relative inline-flex h-9 w-16 items-center rounded-full transition ${
                hotspotsVisible ? 'bg-sky-500/30' : 'bg-slate-200'
              }`}
            >
              <motion.span
                layout
                initial={false}
                transition={spring}
                animate={{
                  x: hotspotsVisible ? 28 : 4,
                  color: hotspotsVisible ? '#0ea5e9' : '#94a3b8'
                }}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white shadow"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    d={hotspotsVisible ? 'M5 13l4 4L19 7' : 'M12 5v14m7-7H5'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.span>
            </span>
          </motion.button>
        </div>
      </section>
    </aside>
  );
};
