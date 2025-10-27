"use client";

import { useEffect } from "react";
import { Mesh } from "three";
import { useGLTF } from "@react-three/drei";
import type { GLTF } from "three-stdlib";

import { extendGLTFLoader } from "@/lib/three/loaders";

const SHOE_ASSET_PATH = "/models/yashvi-shoe.glb";

export const Shoe = (props: JSX.IntrinsicElements["group"]) => {
  const gltf = useGLTF(SHOE_ASSET_PATH, true, false, extendGLTFLoader) as GLTF;

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [gltf.scene]);

  return <primitive object={gltf.scene} {...props} dispose={null} />;
};

useGLTF.preload(SHOE_ASSET_PATH, true, false, extendGLTFLoader);
