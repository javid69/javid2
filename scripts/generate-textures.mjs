import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DataTexture,
  RGBAFormat,
  UnsignedByteType,
  SRGBColorSpace
} from "three";
import { KTX2Exporter } from "three/examples/jsm/exporters/KTX2Exporter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outputDir = join(__dirname, "../public/textures");

const exporter = new KTX2Exporter();

const toRgb = (hex) => {
  const normalised = hex.replace("#", "");
  const bigint = parseInt(normalised, 16);
  return [
    (bigint >> 16) & 255,
    (bigint >> 8) & 255,
    bigint & 255
  ];
};

const lerp = (a, b, t) => a + (b - a) * t;

const lerpColor = (colorA, colorB, t) => [
  lerp(colorA[0], colorB[0], t),
  lerp(colorA[1], colorB[1], t),
  lerp(colorA[2], colorB[2], t)
];

function createTexture(width, height, generator) {
  const data = new Uint8Array(width * height * 4);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const [r, g, b, a] = generator(x, y, width, height);
      const offset = (y * width + x) * 4;
      data[offset] = r;
      data[offset + 1] = g;
      data[offset + 2] = b;
      data[offset + 3] = a;
    }
  }

  const texture = new DataTexture(data, width, height, RGBAFormat, UnsignedByteType);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

const noise = (x, y, scale, seed = 0) => {
  const s = Math.sin(x * 12.9898 + y * 78.233 + seed * 43758.5453) * 43758.5453;
  return s - Math.floor(s);
};

const textures = [
  {
    name: "knit-fabric.ktx2",
    generator: (x, y, width, height) => {
      const uvX = x / width;
      const uvY = y / height;
      const pattern = Math.sin((uvX + uvY) * Math.PI * 8) * 0.5 + 0.5;
      const fiber = noise(x, y, 0.5, 1.37) * 0.2;
      const toneA = toRgb("#f4f5f8");
      const toneB = toRgb("#c9ced6");
      const [r, g, b] = lerpColor(toneA, toneB, pattern * 0.8 + fiber);
      return [r, g, b, 255];
    }
  },
  {
    name: "micro-suede.ktx2",
    generator: (x, y, width, height) => {
      const uvX = x / width;
      const uvY = y / height;
      const grain = noise(x, y, 1.2, 9.12) * 0.25;
      const shading = Math.pow(1 - Math.abs(uvY - 0.5) * 2, 1.5);
      const toneA = toRgb("#3e3f49");
      const toneB = toRgb("#1f2028");
      const [r, g, b] = lerpColor(toneA, toneB, shading * 0.6 + grain);
      return [r, g, b, 255];
    }
  },
  {
    name: "technical-mesh.ktx2",
    generator: (x, y, width, height) => {
      const uvX = x / width;
      const uvY = y / height;
      const pattern = ((Math.floor(uvX * 16) + Math.floor(uvY * 16)) % 2 === 0) ? 0.75 : 0.35;
      const highlight = Math.pow(Math.max(0, Math.cos(uvY * Math.PI)), 2) * 0.2;
      const toneA = toRgb("#8abbd9");
      const toneB = toRgb("#2b5972");
      const [r, g, b] = lerpColor(toneA, toneB, pattern + highlight * 0.5);
      return [r, g, b, 255];
    }
  }
];

mkdirSync(outputDir, { recursive: true });

for (const descriptor of textures) {
  const texture = createTexture(128, 128, descriptor.generator);
  const binary = await exporter.parse(texture);
  writeFileSync(join(outputDir, descriptor.name), binary);
  console.log(`Generated ${descriptor.name}`);
}
