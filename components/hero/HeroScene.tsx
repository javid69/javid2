"use client";

import { useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  PerformanceMonitor,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type HeroSceneProps = {
  allowPostprocessing: boolean;
};

type SceneContentsProps = {
  enableEffects: boolean;
};

export function HeroScene({ allowPostprocessing }: HeroSceneProps) {
  const [effectsEnabled, setEffectsEnabled] = useState(allowPostprocessing);

  useEffect(() => {
    setEffectsEnabled(allowPostprocessing);
  }, [allowPostprocessing]);

  return (
    <PerformanceMonitor
      onDecline={() => setEffectsEnabled(false)}
      onIncline={() => allowPostprocessing && setEffectsEnabled(true)}
    >
      <SceneContents enableEffects={allowPostprocessing && effectsEnabled} />
    </PerformanceMonitor>
  );
}

function SceneContents({ enableEffects }: SceneContentsProps) {
  return (
    <>
      <Lights />
      <RotatingEnvironment />
      <ContactShadows
        position={[0, -0.55, 0]}
        opacity={0.35}
        scale={6}
        blur={1.6}
        far={4}
      />
      <ShoeModel />
      {enableEffects ? (
        <EffectComposer disableNormalPass multisampling={0}>
          <Bloom
            mipmapBlur
            intensity={0.35}
            luminanceThreshold={0.25}
            luminanceSmoothing={0.6}
            radius={0.9}
          />
        </EffectComposer>
      ) : null}
    </>
  );
}

function Lights() {
  const keyLight = useRef<THREE.DirectionalLight>(null);
  const fillLight = useRef<THREE.DirectionalLight>(null);
  const rimLight = useRef<THREE.SpotLight>(null);

  useEffect(() => {
    if (keyLight.current) {
      keyLight.current.shadow.mapSize.width = 1024;
      keyLight.current.shadow.mapSize.height = 1024;
      keyLight.current.shadow.bias = -0.0002;
    }
  }, []);

  return (
    <>
      <ambientLight intensity={0.35} color="#f3f5ff" />
      <directionalLight
        ref={keyLight}
        intensity={1.1}
        position={[4, 5, 3]}
        color="#fff3e0"
        castShadow
      />
      <directionalLight
        ref={fillLight}
        intensity={0.55}
        position={[-5, 2, 2]}
        color="#6aa8ff"
      />
      <spotLight
        ref={rimLight}
        intensity={1.5}
        position={[-2, 4, -4]}
        angle={0.55}
        penumbra={0.6}
        color="#8bc3ff"
      />
    </>
  );
}

function RotatingEnvironment() {
  const envRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (envRef.current) {
      envRef.current.rotation.y += delta * 0.1;
    }
  });

  return <Environment ref={envRef} preset="city" />;
}

function ShoeModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const targetRotY = THREE.MathUtils.clamp(state.pointer.x * 1.2, -1.2, 1.2);
    const targetRotX = THREE.MathUtils.clamp(-state.pointer.y * 0.6 + 0.25, -0.1, 0.6);

    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotY,
      4,
      delta,
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotX,
      4,
      delta,
    );

    const bob = Math.sin(state.clock.elapsedTime * 1.2) * 0.08;
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      bob,
      6,
      delta,
    );
  });

  return (
    <group ref={groupRef} position={[0, -0.1, 0]} dispose={null}>
      <mesh
        castShadow
        position={[0, -0.28, 0]}
        rotation={[Math.PI * -0.04, 0, 0]}
      >
        <boxGeometry args={[1.8, 0.18, 0.72]} />
        <meshStandardMaterial
          color="#161622"
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      <mesh
        castShadow
        position={[0.1, 0.02, 0]}
        rotation={[Math.PI * 0.04, 0, 0]}
      >
        <boxGeometry args={[1.5, 0.42, 0.66]} />
        <meshStandardMaterial
          color="#f5f5f7"
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      <mesh castShadow position={[0.6, 0.25, 0]}>
        <boxGeometry args={[0.8, 0.22, 0.6]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.25}
          metalness={0.35}
        />
      </mesh>

      <mesh castShadow position={[-0.6, 0.12, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#f9f9fb"
          roughness={0.35}
          metalness={0.15}
        />
      </mesh>

      <mesh castShadow position={[0.5, -0.1, 0]}>
        <boxGeometry args={[0.9, 0.16, 0.75]} />
        <meshStandardMaterial
          color="#d2d3e0"
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      <mesh castShadow position={[0.2, 0.34, 0]}>
        <boxGeometry args={[0.9, 0.18, 0.55]} />
        <meshStandardMaterial
          color="#f7f8ff"
          roughness={0.35}
          metalness={0.25}
        />
      </mesh>

      <mesh castShadow position={[0.45, 0.25, 0.32]} rotation={[0, 0, Math.PI * 0.08]}>
        <boxGeometry args={[0.6, 0.12, 0.08]} />
        <meshStandardMaterial
          color="#2a2a3a"
          roughness={0.45}
          metalness={0.35}
        />
      </mesh>

      <mesh castShadow position={[0.45, 0.25, -0.32]} rotation={[0, 0, Math.PI * -0.08]}>
        <boxGeometry args={[0.6, 0.12, 0.08]} />
        <meshStandardMaterial
          color="#2a2a3a"
          roughness={0.45}
          metalness={0.35}
        />
      </mesh>

      {Array.from({ length: 5 }).map((_, index) => {
        const offset = -0.32 + index * 0.16;
        return (
          <mesh key={`lace-${index}`} castShadow position={[0.15 + index * 0.14, 0.28, offset]}>
            <cylinderGeometry args={[0.025, 0.025, 0.7, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
          </mesh>
        );
      })}

      <mesh castShadow position={[0.2, 0.18, 0]}>
        <boxGeometry args={[0.4, 0.32, 0.6]} />
        <meshStandardMaterial
          color="#e8eaf6"
          roughness={0.3}
          metalness={0.22}
        />
      </mesh>

      <mesh castShadow position={[-0.35, -0.02, 0]}
        rotation={[Math.PI * 0.02, 0, 0]}>
        <boxGeometry args={[0.6, 0.3, 0.64]} />
        <meshStandardMaterial
          color="#eceefc"
          roughness={0.4}
          metalness={0.18}
        />
      </mesh>

      <mesh castShadow position={[-0.2, -0.15, 0]}>
        <boxGeometry args={[0.4, 0.18, 0.7]} />
        <meshStandardMaterial
          color="#1e1e2c"
          roughness={0.7}
          metalness={0.08}
        />
      </mesh>

      <mesh castShadow position={[0.1, -0.18, 0.38]} rotation={[Math.PI * 0.02, Math.PI * 0.08, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.9, 24]} />
        <meshStandardMaterial color="#fefefe" roughness={0.2} metalness={0.15} />
      </mesh>

      <mesh castShadow position={[0.1, -0.18, -0.38]} rotation={[Math.PI * 0.02, Math.PI * -0.08, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.9, 24]} />
        <meshStandardMaterial color="#fefefe" roughness={0.2} metalness={0.15} />
      </mesh>
    </group>
  );
}
