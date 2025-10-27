export type ColorVariant = {
  id: string;
  label: string;
  description: string;
  swatch: string;
  upperColor: string;
  accentColor: string;
  soleColor: string;
  laceColor: string;
  heelClipColor: string;
};

export type MaterialOption = {
  id: string;
  label: string;
  description: string;
  texture: string;
  fallbackColor: string;
  roughness: number;
  metalness: number;
  thumbnailGradient: string;
};

export type EnvironmentOption = {
  id: string;
  label: string;
  description: string;
  preset: "sunset" | "city" | "studio" | "warehouse" | "lobby";
  intensity: number;
};

export type HotspotDefinition = {
  id: string;
  title: string;
  description: string;
  position: [number, number, number];
};

export const COLOR_VARIANTS: ColorVariant[] = [
  {
    id: "aurora",
    label: "Aurora Frost",
    description: "Monochrome palette with a soft neutral sole for everyday wear.",
    swatch: "#f5f6fa",
    upperColor: "#f6f7fb",
    accentColor: "#d9dde7",
    soleColor: "#ffffff",
    laceColor: "#f0f1f5",
    heelClipColor: "#ccd5e4"
  },
  {
    id: "midnight",
    label: "Midnight Ink",
    description: "Deep navy gradients with graphite detailing.",
    swatch: "#1f2737",
    upperColor: "#202837",
    accentColor: "#111722",
    soleColor: "#1b1f2a",
    laceColor: "#151b28",
    heelClipColor: "#0f121b"
  },
  {
    id: "ember",
    label: "Ember Flux",
    description: "Fiery accents layered over muted charcoal base tones.",
    swatch: "#ff7056",
    upperColor: "#2b2c30",
    accentColor: "#ff5630",
    soleColor: "#1f2024",
    laceColor: "#2d2f33",
    heelClipColor: "#ff8a65"
  },
  {
    id: "tidal",
    label: "Tidal Pulse",
    description: "Icy blues with contrasting opal overlays.",
    swatch: "#78c6ff",
    upperColor: "#233341",
    accentColor: "#8ad0ff",
    soleColor: "#17212b",
    laceColor: "#233546",
    heelClipColor: "#60a4ff"
  }
];

export const MATERIAL_OPTIONS: MaterialOption[] = [
  {
    id: "knit-fabric",
    label: "Performance Knit",
    description: "Breathable knit engineered for dynamic movement.",
    texture: "/textures/knit-fabric.ktx2",
    fallbackColor: "#d7dce7",
    roughness: 0.85,
    metalness: 0.08,
    thumbnailGradient: "linear-gradient(135deg, #eef1f8, #c0c7d6)"
  },
  {
    id: "micro-suede",
    label: "Micro Suede",
    description: "Soft touch suede with subtle micro fibre nap.",
    texture: "/textures/micro-suede.ktx2",
    fallbackColor: "#3a3c45",
    roughness: 0.65,
    metalness: 0.12,
    thumbnailGradient: "linear-gradient(135deg, #3e3f49, #1f2028)"
  },
  {
    id: "technical-mesh",
    label: "Technical Mesh",
    description: "Structured mesh that balances ventilation and support.",
    texture: "/textures/technical-mesh.ktx2",
    fallbackColor: "#2b5972",
    roughness: 0.4,
    metalness: 0.22,
    thumbnailGradient: "linear-gradient(135deg, #9ed3f5, #284f65)"
  }
];

export const ENVIRONMENT_OPTIONS: EnvironmentOption[] = [
  {
    id: "studio",
    label: "Studio Softbox",
    description: "Soft, indirect lighting ideal for material reviews.",
    preset: "studio",
    intensity: 1.1
  },
  {
    id: "city",
    label: "City Neon",
    description: "Vibrant reflections with cool ambient bounce.",
    preset: "city",
    intensity: 1.35
  },
  {
    id: "sunset",
    label: "Sunset Glow",
    description: "Warm directional lighting with long highlights.",
    preset: "sunset",
    intensity: 1.2
  },
  {
    id: "lobby",
    label: "Atrium Lobby",
    description: "Balanced warm and cool lighting from architectural glass.",
    preset: "lobby",
    intensity: 1.25
  }
];

export const HOTSPOTS: HotspotDefinition[] = [
  {
    id: "upper-layer",
    title: "Adaptive Knit Upper",
    description: "Engineered fibers stretch with movement while maintaining midfoot stability.",
    position: [0.35, 0.55, 0.15]
  },
  {
    id: "energy-foam",
    title: "Energy Foam Midsole",
    description: "Dual-density cushioning absorbs impact and returns propulsion on toe-off.",
    position: [0.25, -0.1, 0.2]
  },
  {
    id: "lace-system",
    title: "Winged Lacing",
    description: "Floating eyelets distribute tension evenly across the instep for secure lockdown.",
    position: [0.0, 0.55, 0.1]
  },
  {
    id: "heel-lock",
    title: "Heel Lock Clip",
    description: "Reinforced clip stabilizes lateral landings without adding bulk.",
    position: [-0.7, 0.4, -0.1]
  }
];
