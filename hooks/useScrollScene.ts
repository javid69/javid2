'use client';

import { MutableRefObject, useRef, useState } from "react";
import useIsomorphicLayoutEffect from "@/lib/useIsomorphicLayoutEffect";
import { ensureScrollTrigger, gsap, ScrollTrigger } from "@/lib/gsapClient";

export type Vec3 = {
  x: number;
  y: number;
  z: number;
};

export type CameraState = {
  position: Vec3;
  target: Vec3;
  fov: number;
  progress: number;
};

export type CameraKeyframe = {
  position: Vec3;
  target: Vec3;
  fov: number;
  duration?: number;
  ease?: string;
};

export type UseScrollSceneOptions = {
  containerRef: MutableRefObject<HTMLElement | null>;
  sectionsRef: MutableRefObject<(HTMLElement | null)[]>;
  cameraStateRef: MutableRefObject<CameraState>;
  keyframes: CameraKeyframe[];
};

export type UseScrollSceneResult = {
  activeSection: number;
};

export const useScrollScene = ({
  containerRef,
  sectionsRef,
  cameraStateRef,
  keyframes,
}: UseScrollSceneOptions): UseScrollSceneResult => {
  const [activeSection, setActiveSection] = useState(0);
  const activeSectionRef = useRef(0);

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const container = containerRef.current;
    const sections = sectionsRef.current.filter(
      (section): section is HTMLElement => Boolean(section),
    );

    if (!container || sections.length === 0 || keyframes.length === 0) {
      return;
    }

    ensureScrollTrigger();

    const pinnedTriggers = sections.map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=100%",
        pin: true,
        anticipatePin: 1,
      }),
    );

    const timeline = gsap.timeline({ paused: true });

    const [firstFrame, ...restFrames] = keyframes;

    Object.assign(cameraStateRef.current.position, firstFrame.position);
    Object.assign(cameraStateRef.current.target, firstFrame.target);
    cameraStateRef.current.fov = firstFrame.fov;
    cameraStateRef.current.progress = 0;

    restFrames.forEach((frame) => {
      const duration = frame.duration ?? 1;
      const ease = frame.ease ?? "power2.inOut";

      timeline.to(
        cameraStateRef.current.position,
        {
          x: frame.position.x,
          y: frame.position.y,
          z: frame.position.z,
          duration,
          ease,
        },
        ">",
      );

      timeline.to(
        cameraStateRef.current.target,
        {
          x: frame.target.x,
          y: frame.target.y,
          z: frame.target.z,
          duration,
          ease,
        },
        "<",
      );

      timeline.to(
        cameraStateRef.current,
        {
          fov: frame.fov,
          duration,
          ease,
        },
        "<",
      );
    });

    timeline.eventCallback("onUpdate", () => {
      cameraStateRef.current.progress = timeline.progress();
    });

    activeSectionRef.current = 0;
    setActiveSection(0);

    const frameCount = Math.max(keyframes.length - 1, 1);

    const controller = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.65,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;
        timeline.progress(progress);
        cameraStateRef.current.progress = progress;

        const targetIndex = Math.min(
          keyframes.length - 1,
          Math.round(progress * frameCount),
        );

        if (targetIndex !== activeSectionRef.current) {
          activeSectionRef.current = targetIndex;
          setActiveSection(targetIndex);
        }
      },
      onRefresh: (self) => {
        const progress = self.progress;
        timeline.progress(progress);
      },
    });

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      controller.kill();
      timeline.kill();
      pinnedTriggers.forEach((trigger) => trigger.kill());
    };
  }, [containerRef, sectionsRef, cameraStateRef, keyframes]);

  return { activeSection };
};
