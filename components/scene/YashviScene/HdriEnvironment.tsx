"use client";

import { Suspense } from "react";
import { Environment } from "@react-three/drei";

import type { EnvironmentConfig } from "@/config/scene";

const buildFallbackFiles = (path: string, files: EnvironmentConfig["fallback"]["files"]) =>
  files.map((file) => `${path}${file}`);

const FallbackEnvironment = ({
  fallback,
  intensity,
}: {
  fallback: EnvironmentConfig["fallback"];
  intensity: number;
}) => {
  const files = buildFallbackFiles(fallback.path, fallback.files);

  return <Environment files={files} background backgroundIntensity={intensity} />;
};

export const HdriEnvironment = ({
  hdriFile,
  intensity = 1,
  backgroundBlur = 0,
  fallback,
}: EnvironmentConfig) => {
  return (
    <Suspense fallback={<FallbackEnvironment fallback={fallback} intensity={intensity} />}>
      <Environment
        files={hdriFile}
        background
        backgroundIntensity={intensity}
        ground={{ height: 0.01, radius: 35 }}
        blur={backgroundBlur}
      />
    </Suspense>
  );
};
