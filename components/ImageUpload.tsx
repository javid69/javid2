"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  uploadImage,
  validateFile,
  formatBytes,
} from "@/lib/cloudinary-utils";
import { type ImageData, type UploadOptions } from "@/lib/types";
import toast from "react-hot-toast";

interface ImageUploadProps {
  maxFiles?: number;
  maxSize?: number;
  folder?: "properties" | "avatars" | "floor-plans" | "documents";
  propertyId?: string;
  onUploadSuccess?: (images: ImageData[]) => void;
  onUploadError?: (error: string) => void;
  initialImages?: ImageData[];
  multiple?: boolean;
  className?: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  preview: string;
  error?: string;
}

export function ImageUpload({
  maxFiles = 15,
  maxSize = 5 * 1024 * 1024,
  folder = "properties",
  propertyId,
  onUploadSuccess,
  onUploadError,
  initialImages = [],
  multiple = true,
  className,
}: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<ImageData[]>(initialImages);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);

      if (!multiple && fileArray.length > 1) {
        toast.error("Only one file can be uploaded");
        return;
      }

      const totalFiles = uploadedImages.length + uploadingFiles.length + fileArray.length;
      if (totalFiles > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const validFiles: UploadingFile[] = [];
      const errors: string[] = [];

      for (const file of fileArray) {
        const validation = validateFile(file, maxSize);
        if (!validation.valid) {
          errors.push(`${file.name}: ${validation.error}`);
          continue;
        }

        const preview = URL.createObjectURL(file);
        validFiles.push({ file, progress: 0, preview });
      }

      if (errors.length > 0) {
        errors.forEach((error) => toast.error(error));
      }

      if (validFiles.length === 0) return;

      setUploadingFiles((prev) => [...prev, ...validFiles]);

      const options: UploadOptions = { folder, propertyId, maxSize };

      for (let i = 0; i < validFiles.length; i++) {
        const uploadingFile = validFiles[i];

        try {
          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.preview === uploadingFile.preview ? { ...f, progress: 50 } : f,
            ),
          );

          const result = await uploadImage(uploadingFile.file, options);

          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.preview === uploadingFile.preview ? { ...f, progress: 100 } : f,
            ),
          );

          setTimeout(() => {
            setUploadingFiles((prev) =>
              prev.filter((f) => f.preview !== uploadingFile.preview),
            );
            setUploadedImages((prev) => {
              const newImages = [...prev, result];
              if (onUploadSuccess) {
                onUploadSuccess(newImages);
              }
              return newImages;
            });
            URL.revokeObjectURL(uploadingFile.preview);
          }, 500);

          toast.success(`${uploadingFile.file.name} uploaded successfully`);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Upload failed";
          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.preview === uploadingFile.preview
                ? { ...f, error: errorMessage, progress: 0 }
                : f,
            ),
          );
          toast.error(`Failed to upload ${uploadingFile.file.name}`);
          if (onUploadError) {
            onUploadError(errorMessage);
          }
        }
      }
    },
    [uploadedImages, uploadingFiles, maxFiles, maxSize, folder, propertyId, multiple, onUploadSuccess, onUploadError],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect],
  );

  const handleRemoveImage = useCallback(
    (publicId: string) => {
      setUploadedImages((prev) => {
        const newImages = prev.filter((img) => img.publicId !== publicId);
        if (onUploadSuccess) {
          onUploadSuccess(newImages);
        }
        return newImages;
      });
      toast.success("Image removed");
    },
    [onUploadSuccess],
  );

  const handleRemoveUploadingFile = useCallback((preview: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.preview !== preview));
    URL.revokeObjectURL(preview);
  }, []);

  const handleRetryUpload = useCallback(
    (preview: string) => {
      const file = uploadingFiles.find((f) => f.preview === preview);
      if (file) {
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.preview === preview ? { ...f, error: undefined, progress: 0 } : f,
          ),
        );
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file.file);
        handleFileSelect(dataTransfer.files);
      }
    },
    [uploadingFiles, handleFileSelect],
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-primary",
          uploadedImages.length >= maxFiles && "opacity-50 cursor-not-allowed",
        )}
        onClick={() => {
          if (uploadedImages.length < maxFiles) {
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={uploadedImages.length >= maxFiles}
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">
              Drop your images here, or{" "}
              <span className="text-primary">browse</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {multiple
                ? `Upload up to ${maxFiles} images`
                : "Upload one image"}{" "}
              (max {formatBytes(maxSize)} each)
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Supported formats: JPG, PNG, WEBP
            </p>
          </div>
        </div>
      </div>

      {uploadingFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {uploadingFiles.map((file) => (
            <div
              key={file.preview}
              className="relative rounded-lg overflow-hidden border border-gray-200 bg-white"
            >
              <div className="aspect-square relative">
                <img
                  src={file.preview}
                  alt="Uploading"
                  className="w-full h-full object-cover"
                />
                {file.error ? (
                  <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
                    <div className="text-center p-2">
                      <p className="text-white text-xs font-medium">
                        Upload failed
                      </p>
                      <button
                        onClick={() => handleRetryUpload(file.preview)}
                        className="mt-1 text-xs text-white underline"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
                {file.progress > 0 && !file.error && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}
              </div>
              <button
                onClick={() => handleRemoveUploadingFile(file.preview)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">
            Uploaded Images ({uploadedImages.length}/{maxFiles})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {uploadedImages.map((image) => (
              <div
                key={image.publicId}
                className="relative rounded-lg overflow-hidden border border-gray-200 bg-white group"
              >
                <div className="aspect-square relative">
                  <img
                    src={image.url}
                    alt="Uploaded"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                </div>
                <button
                  onClick={() => handleRemoveImage(image.publicId)}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploadedImages.length === 0 && uploadingFiles.length === 0 && (
        <div className="text-center py-8">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
}
