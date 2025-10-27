"use client";

import { Html, useProgress } from "@react-three/drei";

export const CanvasLoader = () => {
  const { progress, active } = useProgress();

  return (
    <Html center>
      <div className="flex min-w-[180px] flex-col items-center gap-3 rounded-full border border-white/10 bg-zinc-900/70 px-6 py-4 shadow-lg backdrop-blur">
        <span className="text-xs uppercase tracking-[0.25em] text-zinc-400">
          Loading Scene
        </span>
        <span className="text-2xl font-semibold text-white">
          {active ? `${Math.round(progress)}%` : "0%"}
        </span>
      </div>
    </Html>
  );
};
