"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LightboxImage {
  url: string;
  alt: string;
}

interface LightboxProps {
  images: LightboxImage[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function Lightbox({
  images,
  initialIndex,
  isOpen,
  onClose,
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleDownload = useCallback(async () => {
    try {
      const response = await fetch(images[currentIndex].url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `property-image-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  }, [currentIndex, images]);

  if (!isOpen) {
    return null;
  }

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        aria-label="Close lightbox"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="relative h-full w-full">
        <div className="flex h-full items-center justify-center p-8">
          <Image
            src={currentImage.url}
            alt={currentImage.alt}
            width={1600}
            height={1200}
            className="max-h-full max-w-full object-contain"
            priority
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-full bg-white/10 px-4 py-2 text-white backdrop-blur-sm">
          <span className="text-sm">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-full p-1 transition-colors hover:bg-white/10"
            aria-label="Download image"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>

        <div className="absolute bottom-16 left-1/2 flex -translate-x-1/2 gap-2 overflow-x-auto p-2">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "relative h-16 w-20 flex-shrink-0 overflow-hidden rounded border-2 transition-all",
                currentIndex === index
                  ? "border-white"
                  : "border-transparent opacity-60 hover:opacity-100",
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
