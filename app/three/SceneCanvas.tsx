"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { useDeviceProfile } from "../hooks/useDeviceProfile";

const MODEL_URL =
  "https://rawcdn.githack.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF-Draco/WaterBottle.gltf";
const KTX2_TEXTURE_URL =
  "https://rawcdn.githack.com/KhronosGroup/glTF-Sample-Models/master/2.0/FlightHelmet/glTF-KTX-BasisU/FlightHelmet_Materials_RubberWoodMat_BaseColor.ktx2";

export function SceneCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { lowPower } = useDeviceProfile();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !lowPower,
      alpha: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(lowPower ? 1 : Math.min(window.devicePixelRatio ?? 1, 2));

    const resizeRenderer = () => {
      const { clientWidth, clientHeight } = canvas;
      renderer.setSize(clientWidth, clientHeight, false);
    };

    resizeRenderer();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#030712");

    const ambient = new THREE.AmbientLight(0xffffff, lowPower ? 0.4 : 0.7);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, lowPower ? 0.6 : 1.1);
    keyLight.position.set(4, 6, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xfff2d8, lowPower ? 0.3 : 0.6);
    fillLight.position.set(-2, 2, -3);
    scene.add(fillLight);

    const camera = new THREE.PerspectiveCamera(
      35,
      canvas.clientWidth / Math.max(canvas.clientHeight, 1),
      0.1,
      100
    );
    camera.position.set(1.2, 0.8, 1.6);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.maxDistance = 4;
    controls.minDistance = 1;

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
    );
    loader.setDRACOLoader(dracoLoader);

    let ktx2Loader: KTX2Loader | null = null;
    if (typeof window !== "undefined") {
      ktx2Loader = new KTX2Loader();
      ktx2Loader.setTranscoderPath(
        "https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/libs/basis/"
      );
      ktx2Loader.detectSupport(renderer);
      loader.setKTX2Loader(ktx2Loader);
    }

    let composer: EffectComposer | null = null;
    if (!lowPower) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(canvas.clientWidth, Math.max(canvas.clientHeight, 1)),
        0.8,
        0.4,
        0.85
      );
      composer.addPass(bloomPass);
    }

    let animationFrame = 0;

    let loadedScene: THREE.Group | null = null;

    let sharedTexture: THREE.Texture | null = null;

    loader.load(
      MODEL_URL,
      (gltf) => {
        loadedScene = gltf.scene;
        gltf.scene.scale.setScalar(2.2);
        gltf.scene.position.set(0, -0.5, 0);
        gltf.scene.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            const mesh = obj as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });
        scene.add(gltf.scene);

        if (ktx2Loader) {
          ktx2Loader.load(
            KTX2_TEXTURE_URL,
            (texture) => {
              sharedTexture = texture;
              texture.colorSpace = THREE.SRGBColorSpace;
              texture.flipY = false;
              gltf.scene.traverse((obj) => {
                if ((obj as THREE.Mesh).isMesh) {
                  const mesh = obj as THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>;
                  const applyTexture = (material: THREE.Material) => {
                    const mat = material as THREE.MeshStandardMaterial;
                    if ("map" in mat) {
                      if (mat.map) {
                        mat.map.dispose();
                      }
                      mat.map = texture;
                      mat.needsUpdate = true;
                    }
                  };

                  if (Array.isArray(mesh.material)) {
                    mesh.material.forEach((material) => applyTexture(material));
                  } else if (mesh.material) {
                    applyTexture(mesh.material);
                  }
                }
              });
            },
            undefined,
            (error) => {
              if (process.env.NODE_ENV !== "production") {
                console.warn("Failed to load KTX2 texture", error);
              }
            }
          );
        }
      },
      undefined,
      (error) => {
        if (process.env.NODE_ENV !== "production") {
          console.error("Failed to load GLB", error);
        }
      }
    );

    const renderScene = () => {
      controls.update();
      if (composer) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
      animationFrame = requestAnimationFrame(renderScene);
    };

    renderScene();

    const handleResize = () => {
      const { clientWidth, clientHeight } = canvas;
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight, false);
      composer?.setSize(clientWidth, Math.max(clientHeight, 1));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      dracoLoader.dispose();
      ktx2Loader?.dispose();
      sharedTexture?.dispose();
      if (loadedScene) {
        scene.remove(loadedScene);
      }
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => material.dispose());
          } else if (mesh.material) {
            mesh.material.dispose();
          }
        }
      });
      composer?.dispose();
    };
  }, [lowPower]);

  return (
    <canvas
      ref={canvasRef}
      className="h-80 w-full rounded-2xl border border-white/10 bg-slate-900/60"
    />
  );
}
