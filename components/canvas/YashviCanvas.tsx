"use client";

import { Suspense, memo } from "react";
import { Canvas } from "@react-three/fiber";

import { sceneConfig } from "@/config/scene";
import { CanvasLoader } from "./CanvasLoader";
import { YashviScene } from "@/components/scene/YashviScene";
import { configureAssetLoaders } from "@/lib/three/loaders";

const canvasClassName = "h-full w-full";

const YashviCanvasComponent = () => {
  return (
    <Canvas
      className={canvasClassName}
      style={{ width: "100%", height: "100%" }}
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={sceneConfig.camera}
      onCreated={({ gl }) => {
        configureAssetLoaders(gl);
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <color attach="background" args={["#090909"]} />
        <YashviScene config={sceneConfig} />
      </Suspense>
    </Canvas>
  );
};

export default memo(YashviCanvasComponent);
