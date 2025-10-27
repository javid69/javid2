'use client';

import { Suspense, useCallback, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollSection } from "@/components/scroll/ScrollSection";
import {
  CameraKeyframe,
  CameraState,
  useScrollScene,
} from "@/hooks/useScrollScene";
import { CameraRig } from "@/components/three/CameraRig";
import { SceneElements } from "@/components/three/SceneElements";

const sectionConfigurations = [
  {
    id: "foundation",
    label: "Framework",
    eyebrow: "Phase 01 — Foundation",
    headline: "Establish a motion-first storytelling scaffold.",
    copy: "Anchor your narrative within a resilient scroll framework that keeps spatial pacing steady while the camera glides along orchestrated beats.",
    camera: {
      position: { x: 0, y: 0.6, z: 8.4 },
      target: { x: 0, y: 0.2, z: 0 },
      fov: 44,
      duration: 1.1,
    },
  },
  {
    id: "cadence",
    label: "Cadence",
    eyebrow: "Phase 02 — Cadence",
    headline: "Sync copy, camera, and pacing around ScrollTrigger.",
    copy: "Each section locks into place as ScrollTrigger advances the GSAP timeline, ensuring copy blocks stay pinned while the virtual camera finds its next beat.",
    camera: {
      position: { x: 2.8, y: 0.8, z: 6.6 },
      target: { x: 0.3, y: 0.4, z: 0 },
      fov: 40,
      duration: 1.25,
    },
  },
  {
    id: "immersion",
    label: "Immersion",
    eyebrow: "Phase 03 — Immersion",
    headline: "Lean into depth cues for spatial storytelling.",
    copy: "Perspective shifts, eased dolly moves, and subtle parallax invite the viewer deeper without fight-the-scroll jitters or layout shifts.",
    camera: {
      position: { x: -2.6, y: 1.25, z: 5.4 },
      target: { x: -0.1, y: 0.8, z: 0 },
      fov: 52,
      duration: 1.15,
    },
  },
  {
    id: "handoff",
    label: "Handoff",
    eyebrow: "Phase 04 — Handoff",
    headline: "Exit cleanly and reset for seamless route changes.",
    copy: "On unmount, ScrollTrigger timelines and GSAP contexts clean themselves up so the next page can mount without hydration warnings or stale listeners.",
    camera: {
      position: { x: 0.4, y: -0.15, z: 4.6 },
      target: { x: 0, y: 0, z: 0 },
      fov: 48,
      duration: 1.1,
    },
  },
] satisfies Array<{
  id: string;
  label: string;
  eyebrow: string;
  headline: string;
  copy: string;
  camera: CameraKeyframe;
}>;

export const ScrollExperience = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>(
    sectionConfigurations.map(() => null),
  );

  const cameraStateRef = useRef<CameraState>({
    position: { ...sectionConfigurations[0]!.camera.position },
    target: { ...sectionConfigurations[0]!.camera.target },
    fov: sectionConfigurations[0]!.camera.fov,
    progress: 0,
  });

  const cameraKeyframes = useMemo(
    () => sectionConfigurations.map((section) => section.camera),
    [],
  );

  const { activeSection } = useScrollScene({
    containerRef,
    sectionsRef,
    cameraStateRef,
    keyframes: cameraKeyframes,
  });

  const registerSection = useCallback(
    (node: HTMLElement | null, index: number) => {
      sectionRefs.current[index] = node;
    },
    [],
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-20">
        <Canvas
          shadows
          camera={{
            position: [
              cameraStateRef.current.position.x,
              cameraStateRef.current.position.y,
              cameraStateRef.current.position.z,
            ],
            fov: cameraStateRef.current.fov,
            near: 0.1,
            far: 100,
          }}
        >
          <Suspense fallback={null}>
            <CameraRig stateRef={cameraStateRef} />
            <SceneElements />
          </Suspense>
        </Canvas>
      </div>

      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.65),rgba(2,6,23,0.95))]" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-32 pt-16 sm:px-10 lg:px-16">
        <header className="flex flex-col gap-8 pt-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Scroll Framework
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
              GSAP × ScrollTrigger × React Three Fiber
            </h1>
          </div>
          <div className="flex flex-col gap-4 sm:max-w-md sm:text-right">
            <p className="text-sm leading-relaxed text-slate-400">
              Scroll to step through pinned sections. Animations bridge GSAP’s
              timeline with a persistent R3F camera rig so motion reacts to
              progress without layout shifts.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-500">
                <span>Progress</span>
                <span>
                  {String(activeSection + 1).padStart(2, "0")} /
                  {" "}
                  {String(sectionConfigurations.length).padStart(2, "0")}
                </span>
              </div>
              <div className="flex h-1.5 items-center gap-2">
                {sectionConfigurations.map((section, index) => {
                  const tone =
                    index <= activeSection
                      ? "bg-slate-100"
                      : "bg-slate-700/50";
                  return (
                    <span
                      key={section.id}
                      className={`${tone} flex-1 rounded-full transition-colors duration-300`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        <main ref={containerRef} className="relative flex flex-col gap-10">
          {sectionConfigurations.map((section, index) => (
            <ScrollSection
              key={section.id}
              index={index}
              label={section.label}
              eyebrow={section.eyebrow}
              headline={section.headline}
              copy={section.copy}
              register={registerSection}
              active={activeSection === index}
            />
          ))}
        </main>
      </div>
    </div>
  );
};

export default ScrollExperience;
