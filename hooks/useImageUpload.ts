import { useState, useCallback } from "react";
import { uploadImage, deleteImage } from "@/lib/cloudinary-utils";
import { type ImageData, type UploadOptions } from "@/lib/types";
import toast from "react-hot-toast";

interface UseImageUploadOptions extends UploadOptions {
  maxFiles?: number;
  onSuccess?: (images: ImageData[]) => void;
  onError?: (error: string) => void;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const upload = useCallback(
    async (files: File[]) => {
      if (options.maxFiles && images.length + files.length > options.maxFiles) {
        const error = `Maximum ${options.maxFiles} files allowed`;
        toast.error(error);
        if (options.onError) {
          options.onError(error);
        }
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        const uploadPromises = files.map(async (file, index) => {
          const result = await uploadImage(file, options);
          setUploadProgress(((index + 1) / files.length) * 100);
          return result;
        });

        const results = await Promise.all(uploadPromises);
        const newImages = [...images, ...results];
        
        setImages(newImages);
        toast.success(`${files.length} image(s) uploaded successfully`);
        
        if (options.onSuccess) {
          options.onSuccess(newImages);
        }

        return results;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        toast.error(errorMessage);
        if (options.onError) {
          options.onError(errorMessage);
        }
        throw error;
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [images, options],
  );

  const remove = useCallback(
    async (publicId: string) => {
      try {
        await deleteImage(publicId);
        const newImages = images.filter((img) => img.publicId !== publicId);
        setImages(newImages);
        toast.success("Image deleted successfully");
        
        if (options.onSuccess) {
          options.onSuccess(newImages);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Delete failed";
        toast.error(errorMessage);
        if (options.onError) {
          options.onError(errorMessage);
        }
        throw error;
      }
    },
    [images, options],
  );

  const clear = useCallback(() => {
    setImages([]);
  }, []);

  const reorder = useCallback((newOrder: ImageData[]) => {
    setImages(newOrder);
    if (options.onSuccess) {
      options.onSuccess(newOrder);
    }
  }, [options]);

  return {
    images,
    isUploading,
    uploadProgress,
    upload,
    remove,
    clear,
    reorder,
    setImages,
  };
}
