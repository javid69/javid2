"use client";

import { Stage, OrbitControls } from "@react-three/drei";
import { memo } from "react";

import type { SceneConfig } from "@/config/scene";
import { EffectsPipeline } from "./EffectsPipeline";
import { HdriEnvironment } from "./HdriEnvironment";
import { Shoe } from "./Shoe";

const DEFAULT_CONFIG_WARNING =
  "YashviScene expects a configuration object. Falling back to defaults.";

export type YashviSceneProps = {
  config?: SceneConfig;
};

const defaultConfig: SceneConfig = {
  camera: {
    fov: 45,
    position: [1.8, 1.6, 2.2],
    near: 0.1,
    far: 45,
  },
  controls: {
    enablePan: false,
    enableZoom: true,
    enableDamping: true,
    dampingFactor: 0.08,
    minDistance: 1,
    maxDistance: 5,
    minPolarAngle: Math.PI / 4,
    maxPolarAngle: (3 * Math.PI) / 5,
  },
  environment: {
    hdriFile: "/environments/yashvi-studio.hdr",
    intensity: 1,
    fallback: {
      path: "/environments/fallback/",
      files: ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"],
    },
  },
  effects: {
    bloom: true,
    ssao: false,
  },
};

const SceneContent = ({ config }: { config: SceneConfig }) => {
  const { controls, environment, effects } = config;

  return (
    <>
      <Stage
        adjustCamera={false}
        intensity={1.4}
        contactShadow={{ blur: 2, opacity: 0.45, scale: 8 }}
        environment={undefined}
      >
        <Shoe position={[0, -0.25, 0]} />
      </Stage>

      <HdriEnvironment {...environment} />

      <OrbitControls makeDefault {...controls} />
      <EffectsPipeline {...effects} />
    </>
  );
};

const YashviSceneComponent = ({ config }: YashviSceneProps) => {
  if (!config && process.env.NODE_ENV !== "production") {
    console.warn(DEFAULT_CONFIG_WARNING);
  }

  return <SceneContent config={config ?? defaultConfig} />;
};

export const YashviScene = memo(YashviSceneComponent);
