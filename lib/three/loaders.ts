import { DefaultLoadingManager, WebGLRenderer } from "three";
import { GLTFLoader } from "three-stdlib/loaders/GLTFLoader";
import { DRACOLoader } from "three-stdlib/loaders/DRACOLoader";
import { KTX2Loader } from "three-stdlib/loaders/KTX2Loader";

const DRACO_DECODER_CDN = "https://www.gstatic.com/draco/versioned/decoders/1.5.7/";
const KTX2_TRANSCODER_CDN = "https://unpkg.com/three@0.161.0/examples/jsm/libs/basis/";

let dracoLoader: DRACOLoader | null = null;
let ktx2Loader: KTX2Loader | null = null;
let isKtx2Initialized = false;
let rendererRef: WebGLRenderer | null = null;

export const configureAssetLoaders = (renderer: WebGLRenderer) => {
  rendererRef = renderer;

  if (!dracoLoader) {
    dracoLoader = new DRACOLoader(DefaultLoadingManager);
    dracoLoader.setDecoderPath(DRACO_DECODER_CDN);
    dracoLoader.setDecoderConfig({ type: "js" });
    dracoLoader.preload();
  }

  if (!ktx2Loader) {
    ktx2Loader = new KTX2Loader(DefaultLoadingManager);
    ktx2Loader.setTranscoderPath(KTX2_TRANSCODER_CDN);
  }

  if (ktx2Loader && rendererRef && !isKtx2Initialized) {
    ktx2Loader.detectSupport(rendererRef);
    isKtx2Initialized = true;
  }
};

export const extendGLTFLoader = (loader: GLTFLoader) => {
  if (dracoLoader) {
    loader.setDRACOLoader(dracoLoader);
  }

  if (ktx2Loader && rendererRef && isKtx2Initialized) {
    loader.setKTX2Loader(ktx2Loader);
  }

  return loader;
};

export const getDecoderStatus = () => ({
  hasDraco: Boolean(dracoLoader),
  hasKtx2: Boolean(ktx2Loader && isKtx2Initialized),
});
