'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  useGLTF
} from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import {
  COLOR_VARIANTS,
  ENVIRONMENT_OPTIONS,
  MATERIAL_OPTIONS
} from './configurator-data';
import { useConfiguratorStore } from '@/lib/store/configurator-store';
import { Hotspots } from './hotspots';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import {
  Color,
  MeshStandardMaterial,
  RepeatWrapping,
  Texture,
  Vector3,
  sRGBEncoding
} from 'three';

const CAMERA_POSITION = new Vector3(2.7, 1.75, 3.1);
const CAMERA_TARGET = new Vector3(0, 0.2, 0);

const lightenHex = (hex: string, amount: number) => {
  const base = new Color(hex);
  const white = new Color('#ffffff');
  base.lerp(white, amount);
  return `#${base.getHexString()}`;
};

type SneakerGLTF = GLTF & {
  nodes: {
    Upper: THREE.Mesh;
    Collar: THREE.Mesh;
    Accent: THREE.Mesh;
    Laces: THREE.Mesh;
    Sole: THREE.Mesh;
    HeelClip: THREE.Mesh;
  };
};

type TextureState = {
  texture: Texture | null;
  status: 'idle' | 'loading' | 'ready' | 'error';
};

const useKtx2Texture = (url: string | null) => {
  const gl = useThree((state) => state.gl);
  const [state, setState] = useState<TextureState>({
    texture: null,
    status: 'idle'
  });

  useEffect(() => {
    if (!url) {
      setState({ texture: null, status: 'ready' });
      return () => undefined;
    }

    let mounted = true;
    let activeTexture: Texture | null = null;
    const loader = new KTX2Loader();
    loader.setTranscoderPath('/basis/');
    loader.detectSupport(gl);

    setState({ texture: null, status: 'loading' });

    loader.load(
      url,
      (loaded) => {
        if (!mounted) {
          loaded.dispose();
          return;
        }

        const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
        loaded.anisotropy = Math.min(16, maxAnisotropy);
        loaded.wrapS = RepeatWrapping;
        loaded.wrapT = RepeatWrapping;
        loaded.encoding = sRGBEncoding;

        activeTexture?.dispose();
        activeTexture = loaded;
        setState({ texture: loaded, status: 'ready' });
      },
      undefined,
      () => {
        if (!mounted) return;
        activeTexture?.dispose();
        activeTexture = null;
        setState({ texture: null, status: 'error' });
      }
    );

    return () => {
      mounted = false;
      loader.dispose();
      if (activeTexture) {
        activeTexture.dispose();
        activeTexture = null;
      }
    };
  }, [gl, url]);

  return state;
};

type SneakerMaterialsProps = {
  material: {
    textureUrl: string | null;
    metalness: number;
    roughness: number;
    fallbackColor: string;
  };
  colors: {
    upper: string;
    accent: string;
    collar: string;
    sole: string;
    laces: string;
    heelClip: string;
  };
};



const ShoeModel = ({ material, colors }: SneakerMaterialsProps) => {
  const { nodes } = useGLTF('/3d/sneaker.gltf') as SneakerGLTF;
  const { texture, status } = useKtx2Texture(material.textureUrl);

  const upperBaseColor = status === 'error' ? material.fallbackColor : colors.upper;
  const accentBaseColor = status === 'error' ? material.fallbackColor : colors.accent;

  const upperMaterial = useMemo(() => {
    const mat = new MeshStandardMaterial({
      color: new Color(upperBaseColor),
      metalness: material.metalness,
      roughness: material.roughness
    });
    if (texture) {
      mat.map = texture;
      mat.needsUpdate = true;
    }
    return mat;
  }, [upperBaseColor, material.metalness, material.roughness, texture]);

  const accentMaterial = useMemo(() => {
    const mat = new MeshStandardMaterial({
      color: new Color(accentBaseColor),
      metalness: material.metalness * 0.85,
      roughness: Math.min(1, material.roughness * 0.9)
    });
    if (texture) {
      mat.map = texture;
      mat.needsUpdate = true;
    }
    return mat;
  }, [accentBaseColor, material.metalness, material.roughness, texture]);

  const soleMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color(colors.sole),
        metalness: 0.05,
        roughness: 0.95
      }),
    [colors.sole]
  );

  const collarMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color(colors.collar),
        metalness: 0.08,
        roughness: 0.78
      }),
    [colors.collar]
  );

  const laceMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color(colors.laces),
        metalness: 0.02,
        roughness: 0.6
      }),
    [colors.laces]
  );

  const heelClipMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color(colors.heelClip),
        metalness: 0.25,
        roughness: 0.35
      }),
    [colors.heelClip]
  );

  useEffect(() => {
    return () => {
      upperMaterial.dispose();
      accentMaterial.dispose();
      soleMaterial.dispose();
      collarMaterial.dispose();
      laceMaterial.dispose();
      heelClipMaterial.dispose();
    };
  }, [upperMaterial, accentMaterial, soleMaterial, collarMaterial, laceMaterial, heelClipMaterial]);

  return (
    <group dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Upper.geometry}
        material={upperMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Collar.geometry}
        material={collarMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Accent.geometry}
        material={accentMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Laces.geometry}
        material={laceMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Sole.geometry}
        material={soleMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.HeelClip.geometry}
        material={heelClipMaterial}
      />
    </group>
  );
};

const CanvasFallback = () => (
  <Html center>
    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white shadow-xl">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
    </div>
  </Html>
);

export const ConfiguratorCanvas = () => {
  const selectedColorId = useConfiguratorStore((state) => state.selectedColorId);
  const selectedMaterialId = useConfiguratorStore((state) => state.selectedMaterialId);
  const selectedEnvironmentId = useConfiguratorStore((state) => state.selectedEnvironmentId);
  const hotspotsVisible = useConfiguratorStore((state) => state.hotspotsVisible);

  const colorVariant = COLOR_VARIANTS.find((variant) => variant.id === selectedColorId) ?? COLOR_VARIANTS[0];
  const materialOption = MATERIAL_OPTIONS.find((material) => material.id === selectedMaterialId) ?? MATERIAL_OPTIONS[0];
  const environmentOption = ENVIRONMENT_OPTIONS.find((env) => env.id === selectedEnvironmentId) ?? ENVIRONMENT_OPTIONS[0];

  const colors = useMemo(() => {
    const collar = lightenHex(colorVariant.upperColor, 0.18);
    const laces = lightenHex(colorVariant.laceColor, 0.12);
    const heelClip = lightenHex(colorVariant.heelClipColor, 0.08);
    const sole = lightenHex(colorVariant.soleColor, 0.04);
    return {
      upper: colorVariant.upperColor,
      accent: colorVariant.accentColor,
      collar,
      sole,
      laces,
      heelClip
    };
  }, [colorVariant]);

  return (
    <Canvas
      shadows
      camera={{ position: CAMERA_POSITION.toArray(), fov: 45 }}
      dpr={[1, 1.8]}
      onCreated={({ camera }) => {
        camera.lookAt(CAMERA_TARGET);
      }}
    >
      <color attach="background" args={[0xf1f3f5]} />
      <OrbitControls
        makeDefault
        enablePan={false}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={(Math.PI / 2) * 0.98}
        enableDamping
        dampingFactor={0.12}
        target={[CAMERA_TARGET.x, CAMERA_TARGET.y, CAMERA_TARGET.z]}
      />
      <ambientLight intensity={0.35} />
      <directionalLight
        intensity={1.4}
        position={[4, 6, 4]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Suspense fallback={<CanvasFallback />}>
        <ShoeModel
          material={{
            textureUrl: materialOption.texture ?? null,
            metalness: materialOption.metalness,
            roughness: materialOption.roughness,
            fallbackColor: materialOption.fallbackColor
          }}
          colors={colors}
        />
        <Environment preset={environmentOption.preset} intensity={environmentOption.intensity} />
        <ContactShadows
          position={[0, -0.45, 0]}
          opacity={0.42}
          scale={6}
          blur={2.8}
          far={2.2}
        />
        <Hotspots visible={hotspotsVisible} />
      </Suspense>
    </Canvas>
  );
};

useGLTF.preload('/3d/sneaker.gltf');
