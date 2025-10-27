'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ConfiguratorCanvas } from './shoe-canvas';
import { ConfiguratorPanel } from './configurator-panel';
import { useConfiguratorStore } from '@/lib/store/configurator-store';

const Loader = () => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-200 via-white to-slate-100">
    <motion.div
      className="flex h-24 w-24 items-center justify-center rounded-full border border-slate-200 bg-white shadow-2xl"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
    >
      <motion.div
        className="h-12 w-12 rounded-full border-2 border-sky-500 border-t-transparent"
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
      />
    </motion.div>
  </div>
);

export const ConfiguratorExperience = () => {
  const hasHydrated = useConfiguratorStore((state) => state.hasHydrated);

  useEffect(() => {
    const persist = useConfiguratorStore.persist;
    if (persist.hasHydrated()) {
      useConfiguratorStore.getState().markHydrated();
      return;
    }

    persist.rehydrate().catch(() => {
      useConfiguratorStore.getState().markHydrated();
    });
  }, []);

  if (!hasHydrated) {
    return <Loader />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-200 via-white to-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.16),_transparent_45%)]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-12 lg:flex-row">
        <div className="relative flex-1">
          <div className="relative h-[440px] w-full overflow-hidden rounded-3xl bg-white/80 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl sm:h-[520px] lg:h-[620px]">
            <ConfiguratorCanvas />
          </div>
        </div>
        <ConfiguratorPanel />
      </div>
    </div>
  );
};

export default ConfiguratorExperience;
