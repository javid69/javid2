import { type ImageData, type UploadOptions } from "./types";

const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";

export async function uploadImage(
  file: File,
  options: UploadOptions = {},
): Promise<ImageData> {
  const formData = new FormData();
  formData.append("file", file);

  if (options.folder) {
    formData.append("folder", options.folder);
  }

  if (options.propertyId) {
    formData.append("propertyId", options.propertyId);
  }

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Upload failed");
  }

  const data = await response.json();
  return data;
}

export async function uploadMultipleImages(
  files: File[],
  options: UploadOptions = {},
  onProgress?: (progress: number, fileIndex: number) => void,
): Promise<ImageData[]> {
  const uploadPromises = files.map(async (file, index) => {
    const result = await uploadImage(file, options);
    if (onProgress) {
      onProgress(((index + 1) / files.length) * 100, index);
    }
    return result;
  });

  return Promise.all(uploadPromises);
}

export async function deleteImage(publicId: string): Promise<void> {
  const response = await fetch(`/api/upload/${encodeURIComponent(publicId)}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Delete failed");
  }
}

export async function reorderImages(
  propertyId: string,
  imageIds: string[],
): Promise<void> {
  const response = await fetch("/api/upload/reorder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ propertyId, imageIds }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Reorder failed");
  }
}

export function getTransformedUrl(
  publicId: string,
  transformation: string,
): string {
  if (!CLOUDINARY_CLOUD_NAME) {
    return "";
  }

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformation}/${publicId}`;
}

export function getThumbnailUrl(publicId: string): string {
  return getTransformedUrl(publicId, "w_300,h_250,c_fill,f_auto,q_auto");
}

export function getListViewUrl(publicId: string): string {
  return getTransformedUrl(publicId, "w_500,h_350,c_fill,f_auto,q_auto");
}

export function getDetailViewUrl(publicId: string): string {
  return getTransformedUrl(publicId, "w_1200,h_800,c_fill,f_auto,q_auto");
}

export function getGalleryUrl(publicId: string): string {
  return getTransformedUrl(publicId, "w_800,h_600,c_fill,f_auto,q_auto");
}

export function getAvatarUrl(publicId: string): string {
  return getTransformedUrl(publicId, "w_150,h_150,c_fill,r_max,q_80,f_auto");
}

export function getFloorPlanUrl(publicId: string): string {
  return getTransformedUrl(publicId, "w_600,h_800,c_fit,q_85,f_auto");
}

export function generateSrcSet(publicId: string, sizes: number[]): string {
  return sizes
    .map((size) => {
      const url = getTransformedUrl(
        publicId,
        `w_${size},c_scale,f_auto,q_auto`,
      );
      return `${url} ${size}w`;
    })
    .join(", ");
}

export function generateResponsiveSizes(): string {
  return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
}

export function validateFile(
  file: File,
  maxSize: number = 5 * 1024 * 1024,
  allowedFormats: string[] = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
): { valid: boolean; error?: string } {
  if (!allowedFormats.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed formats: ${allowedFormats.join(", ")}`,
    };
  }

  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  return { valid: true };
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
