"use client";

import { useState, useCallback } from "react";
import {
  X,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { deleteImage } from "@/lib/cloudinary-utils";
import { type ImageData } from "@/lib/types";
import toast from "react-hot-toast";

interface ImageGalleryProps {
  images: ImageData[];
  onDelete?: (publicId: string) => void;
  className?: string;
  showControls?: boolean;
}

export function ImageGallery({
  images,
  onDelete,
  className,
  showControls = true,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopyUrl = useCallback((url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  }, []);

  const handleDelete = useCallback(
    async (publicId: string) => {
      if (!confirm("Are you sure you want to delete this image?")) {
        return;
      }

      setIsDeleting(true);
      try {
        await deleteImage(publicId);
        toast.success("Image deleted successfully");
        if (onDelete) {
          onDelete(publicId);
        }
        setSelectedImage(null);
      } catch (error) {
        toast.error("Failed to delete image");
        console.error("Delete error:", error);
      } finally {
        setIsDeleting(false);
      }
    },
    [onDelete],
  );

  const handlePrevious = useCallback(() => {
    if (!selectedImage) return;
    const currentIndex = images.findIndex(
      (img) => img.publicId === selectedImage.publicId,
    );
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    setSelectedImage(images[prevIndex]);
  }, [images, selectedImage]);

  const handleNext = useCallback(() => {
    if (!selectedImage) return;
    const currentIndex = images.findIndex(
      (img) => img.publicId === selectedImage.publicId,
    );
    const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(images[nextIndex]);
  }, [images, selectedImage]);

  if (images.length === 0) {
    return (
      <div className={cn("text-center py-12 bg-gray-50 rounded-lg", className)}>
        <p className="text-gray-500">No images to display</p>
      </div>
    );
  }

  return (
    <>
      <div className={cn("space-y-4", className)}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.publicId}
              className="relative rounded-lg overflow-hidden border border-gray-200 bg-white group cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="aspect-square relative">
                <img
                  src={image.url}
                  alt={`Image ${image.order}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                {showControls && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUrl(image.url);
                      }}
                      className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100"
                      title="Copy URL"
                    >
                      <Copy className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image.publicId);
                      }}
                      className="p-1.5 bg-white rounded-full shadow-md hover:bg-red-50"
                      title="Delete"
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    </button>
                  </div>
                )}
              </div>
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {image.width} × {image.height}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowInfo(!showInfo);
            }}
            className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <Info className="w-6 h-6 text-white" />
          </button>

          <div
            className="max-w-5xl max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.url}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />

            {showInfo && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 text-white p-4 rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Dimensions:</span>{" "}
                    {selectedImage.width} × {selectedImage.height}
                  </div>
                  <div>
                    <span className="text-gray-400">Order:</span>{" "}
                    {selectedImage.order + 1}
                  </div>
                </div>
                <div className="text-xs text-gray-400 truncate">
                  Public ID: {selectedImage.publicId}
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyUrl(selectedImage.url)}
                    className="text-white border-white hover:bg-white hover:text-black"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy URL
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(selectedImage.publicId)}
                    disabled={isDeleting}
                    className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
