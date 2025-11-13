"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  PauseCircle,
  PlayCircle,
  SquareArrowOutUpRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Lightbox, type LightboxImage } from "./Lightbox";

interface PropertyGalleryProps {
  images: LightboxImage[];
  title: string;
  propertyId: string;
  shareUrl: string;
  autoPlayInterval?: number;
}

const AUTO_PLAY_INTERVAL = 5000;

export function PropertyGallery({
  images,
  title,
  propertyId,
  shareUrl,
  autoPlayInterval = AUTO_PLAY_INTERVAL,
}: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  const currentImage = images[currentIndex];

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isAutoPlay) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, autoPlayInterval);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoPlay, autoPlayInterval, images.length]);

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/favorites/${propertyId}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && typeof data.saved === "boolean") {
          setIsFavorite(data.saved);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch favorite status", error);
      });

    return () => {
      isMounted = false;
    };
  }, [propertyId]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handleFavoriteToggle = useCallback(async () => {
    try {
      const response = await fetch(`/api/favorites/${propertyId}`, {
        method: "POST",
      });
      const data = await response.json();
      if (response.ok) {
        setIsFavorite(data.saved);
        toast.success(data.message ?? "Favorite updated");
      } else {
        throw new Error(data.error ?? "Failed to update favorite");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to update favorite status");
    }
  }, [propertyId]);

  const handleLightboxOpen = useCallback(() => {
    setIsLightboxOpen(true);
  }, []);

  const handleLightboxClose = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  const autoPlayLabel = useMemo(
    () => (isAutoPlay ? "Pause slideshow" : "Play slideshow"),
    [isAutoPlay],
  );

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gray-100 shadow-lg">
      <div className="relative">
        <div
          key={currentImage.url}
          className="group relative aspect-[16/10] cursor-zoom-in overflow-hidden"
          onClick={handleLightboxOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleLightboxOpen();
            }
          }}
        >
          <Image
            src={currentImage.url}
            alt={`${title} - ${currentImage.alt}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
          <div className="absolute bottom-4 left-4 flex items-center gap-3 text-white">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-wide">
              {currentIndex + 1} / {images.length}
            </span>
            <p className="text-sm font-medium drop-shadow">
              {currentImage.alt}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleFavoriteToggle}
          className={cn(
            "absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
            isFavorite
              ? "bg-secondary text-secondary-foreground"
              : "bg-white/90 text-primary hover:bg-white",
          )}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Save property"}
        >
          <Heart
            className={cn(
              "h-5 w-5",
              isFavorite ? "fill-secondary-foreground" : "",
            )}
          />
          <span>{isFavorite ? "Saved" : "Save"}</span>
        </button>

        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-white"
          aria-label="Open property in new tab"
        >
          <SquareArrowOutUpRight className="h-5 w-5" />
          View Listing
        </a>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-primary transition-colors hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-primary transition-colors hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      <div className="border-t border-white/80 bg-white/90 p-4 backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-3 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={image.url}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                  currentIndex === index
                    ? "border-primary shadow-lg"
                    : "border-transparent opacity-70 hover:opacity-100",
                )}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="128px"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
          <div className="flex flex-shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAutoPlay((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2 text-sm font-medium text-primary transition-colors hover:border-primary"
              aria-pressed={isAutoPlay}
              aria-label={autoPlayLabel}
            >
              {isAutoPlay ? (
                <PauseCircle className="h-5 w-5" />
              ) : (
                <PlayCircle className="h-5 w-5" />
              )}
              {isAutoPlay ? "Pause" : "Slideshow"}
            </button>
            <span className="text-xs text-muted-foreground">
              Tip: Hover to zoom • Click to view full-screen
            </span>
          </div>
        </div>
      </div>

      <Lightbox
        images={images}
        initialIndex={currentIndex}
        isOpen={isLightboxOpen}
        onClose={handleLightboxClose}
      />
    </div>
  );
}
