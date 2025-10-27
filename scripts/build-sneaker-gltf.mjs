import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BoxGeometry,
  BufferGeometry,
  Euler,
  Quaternion
} from "three";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outputDir = join(__dirname, "../public/3d");

const alignTo4 = (value) => (value + 3) & ~3;

const componentTypeForArray = (array) => {
  if (array instanceof Float32Array) return 5126; // FLOAT
  if (array instanceof Uint32Array) return 5125; // UNSIGNED_INT
  if (array instanceof Uint16Array) return 5123; // UNSIGNED_SHORT
  if (array instanceof Uint8Array) return 5121; // UNSIGNED_BYTE
  if (array instanceof Int16Array) return 5122; // SHORT
  if (array instanceof Int8Array) return 5120; // BYTE
  throw new Error("Unsupported typed array for glTF export");
};

const componentCountForType = (type) => {
  switch (type) {
    case "SCALAR":
      return 1;
    case "VEC2":
      return 2;
    case "VEC3":
      return 3;
    case "VEC4":
      return 4;
    default:
      throw new Error(`Unsupported accessor type ${type}`);
  }
};

const computeMinMax = (array, itemSize) => {
  const min = new Array(itemSize).fill(Number.POSITIVE_INFINITY);
  const max = new Array(itemSize).fill(Number.NEGATIVE_INFINITY);

  for (let i = 0; i < array.length / itemSize; i += 1) {
    for (let j = 0; j < itemSize; j += 1) {
      const value = array[i * itemSize + j];
      if (value < min[j]) min[j] = value;
      if (value > max[j]) max[j] = value;
    }
  }

  return { min, max };
};

const bufferChunks = [];
const bufferViews = [];
const accessors = [];
let bufferByteLength = 0;

const addAccessor = (typedArray, itemSize, type, target, options = {}) => {
  const componentType = componentTypeForArray(typedArray);
  const count = typedArray.length / itemSize;

  const alignedOffset = alignTo4(bufferByteLength);
  if (alignedOffset > bufferByteLength) {
    bufferChunks.push(Buffer.alloc(alignedOffset - bufferByteLength));
    bufferByteLength = alignedOffset;
  }

  const segment = Buffer.from(
    typedArray.buffer,
    typedArray.byteOffset,
    typedArray.byteLength
  );
  bufferChunks.push(segment);

  const bufferViewIndex = bufferViews.length;
  bufferViews.push({
    buffer: 0,
    byteOffset: bufferByteLength,
    byteLength: segment.length,
    ...(target ? { target } : {})
  });

  bufferByteLength += segment.length;

  const accessor = {
    bufferView: bufferViewIndex,
    componentType,
    count,
    type
  };

  if (options.normalized) accessor.normalized = true;

  if (options.computeMinMax) {
    const { min, max } = computeMinMax(typedArray, itemSize);
    accessor.min = min;
    accessor.max = max;
  }

  accessors.push(accessor);
  return accessors.length - 1;
};

const createBoxGeometry = (width, height, depth, segments, transform) => {
  const [widthSegments, heightSegments, depthSegments] = segments;
  const geometry = new BoxGeometry(
    width,
    height,
    depth,
    widthSegments,
    heightSegments,
    depthSegments
  );

  if (transform?.translate) {
    const [x, y, z] = transform.translate;
    geometry.translate(x, y, z);
  }

  if (transform?.matrix) {
    geometry.applyMatrix4(transform.matrix);
  }

  geometry.computeVertexNormals();
  return geometry;
};

const sculptUpperProfile = (geometry) => {
  const pos = geometry.getAttribute("position");
  const count = pos.count;
  for (let i = 0; i < count; i += 1) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const toeFactor = (x + 0.8) / 1.6;
    const taper = 1 - toeFactor * 0.2;
    const arch = Math.cos(toeFactor * Math.PI) * 0.08;

    pos.setY(i, y + arch);
    pos.setZ(i, z * taper);
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
};

const sculptCollar = (geometry) => {
  const pos = geometry.getAttribute("position");
  const count = pos.count;
  for (let i = 0; i < count; i += 1) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const open = (x + 0.6) / 1.2;
    pos.setY(i, y + Math.max(0, (open - 0.5) * 0.15));
    pos.setZ(i, z * (1 - open * 0.1));
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
};

const parts = [
  {
    name: "Upper",
    geometry: (() => {
      const geom = createBoxGeometry(
        1.6,
        0.6,
        0.7,
        [24, 16, 24],
        { translate: [0, 0.25, 0] }
      );
      sculptUpperProfile(geom);
      return geom;
    })(),
    materialName: "UpperMaterial"
  },
  {
    name: "Collar",
    geometry: (() => {
      const geom = createBoxGeometry(
        1.2,
        0.35,
        0.55,
        [16, 8, 16],
        { translate: [0, 0.55, 0] }
      );
      sculptCollar(geom);
      return geom;
    })(),
    materialName: "CollarMaterial"
  },
  {
    name: "Accent",
    geometry: createBoxGeometry(
      1.55,
      0.2,
      0.18,
      [10, 4, 4],
      { translate: [0, 0.18, 0.32] }
    ),
    materialName: "AccentMaterial"
  },
  {
    name: "Laces",
    geometry: createBoxGeometry(
      1.4,
      0.08,
      0.45,
      [12, 2, 12],
      { translate: [0, 0.46, 0] }
    ),
    materialName: "LaceMaterial"
  },
  {
    name: "Sole",
    geometry: createBoxGeometry(
      1.8,
      0.24,
      0.85,
      [18, 4, 18],
      { translate: [0, -0.25, 0] }
    ),
    materialName: "SoleMaterial"
  },
  {
    name: "HeelClip",
    geometry: createBoxGeometry(
      0.45,
      0.45,
      0.8,
      [10, 8, 12],
      { translate: [-0.75, 0.3, 0] }
    ),
    materialName: "HeelClipMaterial"
  }
];

const materials = [
  {
    name: "UpperMaterial",
    pbrMetallicRoughness: {
      baseColorFactor: [1, 1, 1, 1],
      metallicFactor: 0.05,
      roughnessFactor: 0.75
    }
  },
  {
    name: "CollarMaterial",
    pbrMetallicRoughness: {
      baseColorFactor: [0.95, 0.95, 0.95, 1],
      metallicFactor: 0.03,
      roughnessFactor: 0.8
    }
  },
  {
    name: "AccentMaterial",
    pbrMetallicRoughness: {
      baseColorFactor: [0.8, 0.83, 0.9, 1],
      metallicFactor: 0.2,
      roughnessFactor: 0.4
    }
  },
  {
    name: "LaceMaterial",
    pbrMetallicRoughness: {
      baseColorFactor: [0.9, 0.9, 0.9, 1],
      metallicFactor: 0.05,
      roughnessFactor: 0.55
    }
  },
  {
    name: "SoleMaterial",
    pbrMetallicRoughness: {
      baseColorFactor: [0.92, 0.92, 0.92, 1],
      metallicFactor: 0.01,
      roughnessFactor: 0.85
    }
  },
  {
    name: "HeelClipMaterial",
    pbrMetallicRoughness: {
      baseColorFactor: [0.82, 0.85, 0.88, 1],
      metallicFactor: 0.25,
      roughnessFactor: 0.45
    }
  }
];

const materialIndexByName = new Map(
  materials.map((material, index) => [material.name, index])
);

const meshes = [];
const nodes = [];
const childNodeIndices = [];

for (const part of parts) {
  const geometry = part.geometry;

  if (!(geometry instanceof BufferGeometry)) {
    throw new Error(`Geometry for part ${part.name} is not a BufferGeometry`);
  }

  const positionAttr = geometry.getAttribute("position");
  const normalAttr = geometry.getAttribute("normal");
  const uvAttr = geometry.getAttribute("uv");
  const indexAttr = geometry.getIndex();

  const positionAccessor = addAccessor(
    new Float32Array(positionAttr.array),
    3,
    "VEC3",
    34962,
    { computeMinMax: true }
  );

  const normalAccessor = addAccessor(
    new Float32Array(normalAttr.array),
    3,
    "VEC3",
    34962
  );

  const uvAccessor = addAccessor(
    new Float32Array(uvAttr.array),
    2,
    "VEC2",
    34962
  );

  const indexArray = indexAttr.array instanceof Uint16Array
    ? indexAttr.array
    : new Uint16Array(indexAttr.array);

  const indexAccessor = addAccessor(
    indexArray,
    1,
    "SCALAR",
    34963
  );

  const meshIndex = meshes.length;
  meshes.push({
    name: part.name,
    primitives: [
      {
        attributes: {
          POSITION: positionAccessor,
          NORMAL: normalAccessor,
          TEXCOORD_0: uvAccessor
        },
        indices: indexAccessor,
        material: materialIndexByName.get(part.materialName)
      }
    ]
  });

  const nodeIndex = nodes.length;
  nodes.push({
    name: part.name,
    mesh: meshIndex
  });

  childNodeIndices.push(nodeIndex);
}

// Parent node to keep transforms tidy
const rootNodeIndex = nodes.length;
const displayOrientation = new Quaternion().setFromEuler(
  new Euler(-0.35, 0.65, 0)
);
nodes.push({
  name: "Sneaker",
  children: childNodeIndices,
  rotation: [
    displayOrientation.x,
    displayOrientation.y,
    displayOrientation.z,
    displayOrientation.w
  ],
  translation: [0, 0, 0],
  scale: [1, 1, 1]
});

const buffer = Buffer.concat(bufferChunks, alignTo4(bufferByteLength));

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "sneaker.bin"), buffer);

const gltf = {
  asset: {
    version: "2.0",
    generator: "custom-node-script"
  },
  buffers: [
    {
      uri: "sneaker.bin",
      byteLength: buffer.length
    }
  ],
  bufferViews,
  accessors,
  materials,
  meshes,
  nodes,
  scenes: [
    {
      nodes: [rootNodeIndex]
    }
  ],
  scene: 0
};

writeFileSync(
  join(outputDir, "sneaker.gltf"),
  `${JSON.stringify(gltf, null, 2)}\n`
);

console.log("Generated sneaker.gltf and sneaker.bin");
