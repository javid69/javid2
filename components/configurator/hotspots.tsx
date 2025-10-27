'use client';

import { Html } from '@react-three/drei';
import * as Tooltip from '@radix-ui/react-tooltip';
import { motion } from 'framer-motion';
import { HOTSPOTS } from './configurator-data';

type HotspotsProps = {
  visible: boolean;
};

export const Hotspots = ({ visible }: HotspotsProps) => {
  if (!visible) {
    return null;
  }

  return (
    <Tooltip.Provider delayDuration={100}>
      {HOTSPOTS.map((hotspot) => (
        <Tooltip.Root key={hotspot.id}>
          <Html
            transform
            occlude
            position={hotspot.position}
            distanceFactor={10}
            style={{ pointerEvents: 'auto' }}
          >
            <Tooltip.Trigger asChild>
              <motion.button
                type="button"
                aria-label={`${hotspot.title} hotspot`}
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-700 shadow-xl outline-none ring-offset-2 transition focus-visible:ring-2 focus-visible:ring-sky-500"
                whileHover={{ scale: 1.07 }}
                whileFocus={{ scale: 1.07 }}
              >
                <span className="absolute inset-0 rounded-full bg-sky-500/20 blur" />
                <motion.span
                  className="absolute inset-0 rounded-full border border-sky-400"
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span className="z-10 text-sm font-semibold">i</span>
              </motion.button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                sideOffset={12}
                className="z-50 max-w-xs rounded-xl border border-slate-200 bg-white/95 p-4 text-left shadow-2xl backdrop-blur"
              >
                <p className="text-sm font-semibold text-slate-900">{hotspot.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{hotspot.description}</p>
                <Tooltip.Arrow className="fill-white" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Html>
        </Tooltip.Root>
      ))}
    </Tooltip.Provider>
  );
};
