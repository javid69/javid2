"use client";

import { Canvas } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import * as THREE from "three";

import { HeroScene } from "./HeroScene";
import { useDeviceCapabilities } from "./useDeviceCapabilities";

type HeroCanvasProps = {
  allowPostprocessing: boolean;
  isMobile: boolean;
  onReady: () => void;
  onProgress: (value: number) => void;
};

const easing = [0.25, 0.8, 0.25, 1];

const heroCopy = {
  kicker: "Next-gen performance",
  title: "Orbit the future of footwear",
  subtitle:
    "A precision-engineered runner built with adaptive cushioning, tuned for zero gravity responsiveness and grounded comfort.",
  ctaPrimary: "Shop the collection",
  ctaSecondary: "View technical specs",
};

export function HeroSection() {
  const capabilities = useDeviceCapabilities();
  const [canvasReady, setCanvasReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const containerRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = !capabilities.allowMotion;

  const motionX = useMotionValue(0);
  const motionY = useMotionValue(0);

  const springX = useSpring(motionX, {
    damping: 20,
    stiffness: 120,
    mass: 0.4,
  });
  const springY = useSpring(motionY, {
    damping: 20,
    stiffness: 120,
    mass: 0.4,
  });

  const parallaxOne = useTransform([springX, springY], ([x, y]) => {
    return `translate3d(${x * 60}px, ${y * 40}px, 0px)`;
  });
  const parallaxTwo = useTransform([springX, springY], ([x, y]) => {
    return `translate3d(${x * -40}px, ${y * -30}px, 0px)`;
  });

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (shouldReduceMotion) {
        motionX.set(0);
        motionY.set(0);
        return;
      }

      if (!containerRef.current) {
        return;
      }
      const rect = containerRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      motionX.set(Number.isFinite(x) ? x : 0);
      motionY.set(Number.isFinite(y) ? y : 0);
    },
    [motionX, motionY, shouldReduceMotion],
  );

  const handlePointerLeave = useCallback(() => {
    motionX.set(0);
    motionY.set(0);
  }, [motionX, motionY]);

  const handleCanvasReady = useCallback(() => {
    setCanvasReady(true);
  }, []);

  const handleProgress = useCallback((value: number) => {
    setLoadingProgress(value);
  }, []);

  const contentReady = capabilities.showFallback ? true : canvasReady;
  const initialVariant = shouldReduceMotion ? "visible" : "hidden";
  const animateVariant = shouldReduceMotion
    ? "visible"
    : contentReady
    ? "visible"
    : "hidden";

  const textVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: 32,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.9,
          ease: easing,
        },
      },
    }),
    [],
  );

  const ctaVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: 24,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.8,
          ease: easing,
          delay: 0.1,
        },
      },
    }),
    [],
  );

  return (
    <motion.section
      ref={(node) => {
        containerRef.current = node;
      }}
      className="relative isolate flex min-h-dvh w-full items-center justify-center overflow-hidden bg-zinc-950 text-zinc-50"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={
        shouldReduceMotion || contentReady
          ? { opacity: 1 }
          : { opacity: 0 }
      }
      transition={shouldReduceMotion ? undefined : { duration: 0.6, ease: easing }}
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-[15%] left-1/2 h-[120%] w-[110%] -translate-x-1/2 rounded-[50%] bg-gradient-to-br from-indigo-600/40 via-purple-500/30 to-sky-500/20 blur-3xl"
          style={{ transform: parallaxOne }}
        />
        <motion.div
          className="absolute bottom-[-25%] left-1/2 h-[120%] w-[120%] -translate-x-1/2 rounded-[50%] bg-gradient-to-tr from-sky-400/30 via-cyan-400/20 to-transparent blur-3xl"
          style={{ transform: parallaxTwo }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(40,40,60,0.4),_transparent_65%)] mix-blend-screen" />
      </div>

      <div className="relative z-10 flex w-full max-w-6xl flex-col gap-16 px-6 py-20 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-20 lg:py-28">
        <div className="flex max-w-xl flex-col gap-6">
          <motion.span
            className="text-sm uppercase tracking-[0.4em] text-sky-200/80"
            variants={textVariants}
            initial={initialVariant}
            animate={animateVariant}
          >
            {heroCopy.kicker}
          </motion.span>
          <motion.h1
            className="text-4xl font-medium leading-tight text-white sm:text-5xl lg:text-6xl"
            variants={textVariants}
            initial={initialVariant}
            animate={animateVariant}
          >
            {heroCopy.title}
          </motion.h1>
          <motion.p
            className="text-base leading-relaxed text-zinc-300 sm:text-lg"
            variants={textVariants}
            initial={initialVariant}
            animate={animateVariant}
            transition={
              shouldReduceMotion ? undefined : { delay: 0.08, duration: 0.9, ease: easing }
            }
          >
            {heroCopy.subtitle}
          </motion.p>
          <motion.div
            className="mt-4 flex flex-col gap-4 sm:flex-row"
            variants={ctaVariants}
            initial={initialVariant}
            animate={animateVariant}
          >
            <a
              href="#shop"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold uppercase tracking-wide text-zinc-900 transition-colors hover:bg-sky-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200"
              aria-label="Shop the collection"
            >
              {heroCopy.ctaPrimary}
            </a>
            <a
              href="#specs"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:border-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="View the technical specifications"
            >
              {heroCopy.ctaSecondary}
            </a>
          </motion.div>
        </div>

        <motion.div
          className="relative flex w-full flex-1 items-center justify-center"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={
            shouldReduceMotion
              ? { opacity: 1, scale: 1 }
              : { opacity: contentReady ? 1 : 0, scale: contentReady ? 1 : 0.95 }
          }
          transition={shouldReduceMotion ? undefined : { duration: 0.8, ease: easing }}
        >
          <div className="relative aspect-[4/3] w-full max-w-[520px] overflow-visible">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-sm"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 rounded-[40px] bg-gradient-to-br from-sky-400/20 via-transparent to-indigo-500/20 blur-3xl"
            />
            {capabilities.showFallback ? (
              <HeroFallback />
            ) : (
              <div className="relative z-10 h-full w-full overflow-hidden rounded-[32px]">
                <HeroCanvas
                  allowPostprocessing={capabilities.allowPostprocessing}
                  isMobile={capabilities.isMobile}
                  onReady={handleCanvasReady}
                  onProgress={handleProgress}
                />
              </div>
            )}

            <AnimatePresence mode="wait">
              {!capabilities.showFallback && !canvasReady ? (
                <motion.div
                  key="loader"
                  className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-[32px] bg-zinc-900/70 backdrop-blur"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: easing }}
                >
                  <motion.div
                    className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  >
                    <span className="text-sm font-medium text-white/80">
                      {Math.floor(loadingProgress)}%
                    </span>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function HeroCanvas({ allowPostprocessing, isMobile, onReady, onProgress }: HeroCanvasProps) {
  const readyRef = useRef(false);

  return (
    <Canvas
      className="h-full w-full"
      style={{ borderRadius: "32px" }}
      shadows
      frameloop="always"
      dpr={isMobile ? [1, 1.4] : [1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0.9, 2.4], fov: 36, near: 0.1, far: 10 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
        gl.setClearColor(0x000000, 0);
      }}
      performance={{ min: 0.6 }}
    >
      <Suspense fallback={null}>
        <HeroScene allowPostprocessing={allowPostprocessing} />
      </Suspense>
      <LoaderWatcher
        onProgress={onProgress}
        onReady={() => {
          if (!readyRef.current) {
            readyRef.current = true;
            onReady();
          }
        }}
      />
    </Canvas>
  );
}

type LoaderWatcherProps = {
  onProgress: (progress: number) => void;
  onReady: () => void;
};

function LoaderWatcher({ onProgress, onReady }: LoaderWatcherProps) {
  const { active, progress } = useProgress();
  const hasCompleted = useRef(false);

  useEffect(() => {
    onProgress(progress);
  }, [progress, onProgress]);

  useEffect(() => {
    if (!hasCompleted.current && !active && progress >= 100) {
      hasCompleted.current = true;
      onReady();
    }
  }, [active, onReady, progress]);

  return null;
}

function HeroFallback() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[32px] bg-zinc-900/80 shadow-[0_40px_120px_-50px_rgba(59,130,246,0.6)]">
      <Image
        src="/media/hero-poster.svg"
        alt="Orbit Runner hero poster"
        fill
        sizes="(max-width: 768px) 80vw, (max-width: 1024px) 45vw, 520px"
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-zinc-950/20" />
    </div>
  );
}
