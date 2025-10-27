'use client';

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const SceneElements = () => {
  return (
    <>
      <color attach="background" args={["#020617"]} />
      <fog attach="fog" args={["#020617", 12, 46]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <hemisphereLight
        args={[0x334155, 0x020617, 0.5]}
        position={[0, 4, 0]}
      />
      <RotatingCore />
      <OrbitingSpheres />
      <ParticleField />
      <Ground />
    </>
  );
};

const RotatingCore = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) {
      return;
    }

    meshRef.current.rotation.x += delta * 0.3;
    meshRef.current.rotation.y += delta * 0.42;
  });

  return (
    <mesh ref={meshRef} castShadow position={[0, 0.1, 0]}>
      <icosahedronGeometry args={[1.65, 1]} />
      <meshStandardMaterial
        color="#38bdf8"
        metalness={0.65}
        roughness={0.2}
        emissive="#0ea5e9"
        emissiveIntensity={0.18}
      />
    </mesh>
  );
};

const OrbitingSpheres = () => {
  const groupRef = useRef<THREE.Group>(null);
  const radii = useMemo(() => [3, 3.8, 4.6], []);
  const speeds = useMemo(() => [0.28, 0.22, 0.18], []);
  const colors = useMemo(() => ["#f97316", "#34d399", "#a855f7"], []);

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }

    const time = clock.getElapsedTime();

    groupRef.current.children.forEach((child, index) => {
      const radius = radii[index] ?? 3;
      const angle = time * speeds[index]! + index * Math.PI * 0.33;
      const yOffset = Math.sin(time * (0.6 + index * 0.2)) * 0.6;

      child.position.set(
        Math.cos(angle) * radius,
        yOffset,
        Math.sin(angle) * radius,
      );
    });
  });

  return (
    <group ref={groupRef}>
      {radii.map((radius, index) => (
        <mesh key={radius} castShadow>
          <sphereGeometry args={[0.35 + index * 0.1, 48, 48]} />
          <meshStandardMaterial
            color={colors[index]}
            metalness={0.45}
            roughness={0.3}
            emissive={colors[index]}
            emissiveIntensity={0.12}
          />
        </mesh>
      ))}
    </group>
  );
};

const ParticleField = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 420;
    const array = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 15 * Math.pow(Math.random(), 0.6);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
      const z = radius * Math.cos(phi);

      array.set([x, y, z], i * 3);
    }

    return array;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) {
      return;
    }

    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.03;
  });

  return (
    <points ref={pointsRef} rotation={[0.4, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          itemSize={3}
          count={positions.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#38bdf8"
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
};

const Ground = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
    <planeGeometry args={[80, 80]} />
    <meshStandardMaterial color="#0f172a" roughness={1} metalness={0} />
  </mesh>
);
