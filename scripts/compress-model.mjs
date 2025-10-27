#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";

const inputArg = process.argv[2] ?? "public/models/yashvi-shoe.glb";
const outputDirArg = process.argv[3] ?? "public/models/optimized";

const inputPath = resolve(process.cwd(), inputArg);
const outputDir = resolve(process.cwd(), outputDirArg);

if (!existsSync(inputPath)) {
  console.error(`Cannot find GLB asset at: ${inputPath}`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });

const baseName = basename(inputPath, extname(inputPath));
const outputPath = join(outputDir, `${baseName}.glb`);

const dracoLevel = process.env.DRACO_COMPRESSION_LEVEL ?? "7";
const ktx2Quality = process.env.KTX2_TEXTURE_QUALITY ?? "0.85";

const command = [
  "npx",
  "--yes",
  "gltf-transform",
  "optimize",
  inputPath,
  outputPath,
  "--compress",
  "draco",
  `--draco.compressionLevel=${dracoLevel}`,
  "--texture-compress",
  `--texture-compress.quality=${ktx2Quality}`,
  "--texture-compress.targets=ktx2",
].join(" ");

console.log("\n> Compressing asset using gltf-transform...");
console.log(`> Input: ${inputPath}`);
console.log(`> Output: ${outputPath}`);
console.log(`> Draco compression level: ${dracoLevel}`);
console.log(`> Texture quality: ${ktx2Quality}`);

try {
  execSync(command, { stdio: "inherit" });
  console.log("\nCompression pipeline completed successfully.\n");
} catch (error) {
  console.error("Compression failed. Ensure gltf-transform CLI is available.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
