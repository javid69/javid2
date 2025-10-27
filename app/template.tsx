"use client";

import type { ReactNode } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="h-full"
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
