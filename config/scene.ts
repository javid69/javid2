export type EffectsConfig = {
  bloom: boolean;
  ssao: boolean;
};

export type EnvironmentConfig = {
  hdriFile: string;
  intensity: number;
  backgroundBlur?: number;
  fallback: {
    path: string;
    files: [string, string, string, string, string, string];
  };
};

export type ControlsConfig = {
  enablePan: boolean;
  enableZoom: boolean;
  enableDamping: boolean;
  dampingFactor: number;
  minDistance: number;
  maxDistance: number;
  minPolarAngle: number;
  maxPolarAngle: number;
};

export type SceneConfig = {
  camera: {
    fov: number;
    position: [number, number, number];
    near: number;
    far: number;
  };
  environment: EnvironmentConfig;
  effects: EffectsConfig;
  controls: ControlsConfig;
};

export const sceneConfig: SceneConfig = {
  camera: {
    fov: 42,
    position: [2.4, 1.6, 2.4],
    near: 0.1,
    far: 50,
  },
  environment: {
    hdriFile: "/environments/yashvi-studio.hdr",
    intensity: 1.15,
    backgroundBlur: 0.35,
    fallback: {
      path: "/environments/fallback/",
      files: ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"],
    },
  },
  effects: {
    bloom: true,
    ssao: false,
  },
  controls: {
    enablePan: false,
    enableZoom: true,
    enableDamping: true,
    dampingFactor: 0.08,
    minDistance: 1.1,
    maxDistance: 4.5,
    minPolarAngle: Math.PI / 4,
    maxPolarAngle: (3 * Math.PI) / 5,
  },
};
