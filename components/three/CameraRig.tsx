'use client';

import { MutableRefObject, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CameraState } from "@/hooks/useScrollScene";

export type CameraRigProps = {
  stateRef: MutableRefObject<CameraState>;
  lerp?: number;
};

export const CameraRig = ({ stateRef, lerp = 0.08 }: CameraRigProps) => {
  const { camera } = useThree();
  const targetVector = useMemo(() => new THREE.Vector3(), []);
  const desiredPosition = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const { position, target, fov } = stateRef.current;
    camera.position.set(position.x, position.y, position.z);
    camera.lookAt(target.x, target.y, target.z);
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [camera, stateRef]);

  useFrame(() => {
    const { position, target, fov } = stateRef.current;

    desiredPosition.set(position.x, position.y, position.z);
    camera.position.lerp(desiredPosition, lerp);

    targetVector.set(target.x, target.y, target.z);
    camera.lookAt(targetVector);

    camera.fov += (fov - camera.fov) * lerp;
    camera.updateProjectionMatrix();
  });

  return null;
};
