"use client";

import { EffectComposer, Bloom, SSAO } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

import type { EffectsConfig } from "@/config/scene";

export const EffectsPipeline = ({ bloom, ssao }: EffectsConfig) => {
  if (!bloom && !ssao) {
    return null;
  }

  return (
    <EffectComposer multisampling={4} disableNormalPass={!ssao}>
      {bloom ? (
        <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.28} luminanceSmoothing={0.9} />
      ) : null}
      {ssao ? (
        <SSAO
          intensity={0.9}
          radius={0.1}
          luminanceInfluence={0.6}
          color="black"
          blendFunction={BlendFunction.MULTIPLY}
        />
      ) : null}
    </EffectComposer>
  );
};
