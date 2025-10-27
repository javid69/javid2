"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

function OrbitalGem() {
  const gradientTexture = useMemo(() => {
    if (typeof document === "undefined") {
      return null;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return null;
    }

    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, "#38bdf8");
    gradient.addColorStop(0.5, "#9a6dff");
    gradient.addColorStop(1, "#ff80f4");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  return (
    <Float rotationIntensity={0.3} floatIntensity={0.5} speed={2.2}>
      <mesh castShadow receiveShadow scale={1.6}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          speed={4}
          distort={0.25}
          radius={1.2}
          color="#9a6dff"
          transparent
          opacity={0.95}
        />
      </mesh>
      <mesh rotation={[Math.PI / 4, 0, 0]} scale={2.4}>
        <torusGeometry args={[1.2, 0.04, 32, 128]} />
        <meshStandardMaterial
          color="#38bdf8"
          transparent
          opacity={0.35}
          emissive="#38bdf8"
          emissiveIntensity={0.35}
        />
      </mesh>
      {gradientTexture && (
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]} scale={2.1}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshBasicMaterial map={gradientTexture} transparent opacity={0.18} depthWrite={false} />
        </mesh>
      )}
    </Float>
  );
}

export default function BrandScene() {
  return (
    <div className="glass-surface aspect-square relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10">
      <Canvas shadows dpr={[1.5, 2]} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <color attach="background" args={["#05070f"]} />
          <PerspectiveCamera makeDefault position={[0, 0, 4.2]} fov={45} />
          <ambientLight intensity={0.4} />
          <pointLight position={[2.5, 2, 2]} intensity={5} color="#9a6dff" />
          <pointLight position={[-3, -1, -2]} intensity={2} color="#38bdf8" />

          <group position={[0, -0.25, 0]}>
            <OrbitalGem />
          </group>

          <EffectComposer multisampling={0}>
            <Bloom intensity={1.2} luminanceThreshold={0.2} luminanceSmoothing={0.8} radius={0.9} />
            <Vignette eskil offset={0.25} darkness={0.6} />
          </EffectComposer>

          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
        </Suspense>
      </Canvas>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"
        aria-hidden
      />
    </div>
  );
}
