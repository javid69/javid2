"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { Amenity } from "@/app/api/properties/data";
import { cn } from "@/lib/utils";

interface AmenitiesDisplayProps {
  amenities: Amenity[];
  initialVisibleCount?: number;
}

const INITIAL_VISIBLE_COUNT = 8;

export function AmenitiesDisplay({
  amenities,
  initialVisibleCount = INITIAL_VISIBLE_COUNT,
}: AmenitiesDisplayProps) {
  const [showAll, setShowAll] = useState(false);

  const visibleAmenities = showAll
    ? amenities
    : amenities.slice(0, initialVisibleCount);
  const hasMore = amenities.length > initialVisibleCount;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-xl font-semibold text-foreground">
          Amenities & Features
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {amenities.length} premium amenities included
        </p>
      </div>
      <div className="px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleAmenities.map((amenity) => {
            const Icon =
              (LucideIcons[
                amenity.icon as keyof typeof LucideIcons
              ] as React.ComponentType<{ className?: string }>) ?? Check;
            const isIncluded = amenity.included ?? true;

            return (
              <div
                key={amenity.name}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-all",
                  isIncluded
                    ? "border-primary/20 bg-primary/5"
                    : "border-border bg-background opacity-60",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      isIncluded ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {amenity.name}
                  </span>
                </div>
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border",
                    isIncluded
                      ? "border-green-500 bg-green-500/10 text-green-600"
                      : "border-muted text-muted-foreground",
                  )}
                  aria-label={isIncluded ? "Amenity included" : "Amenity unavailable"}
                >
                  {isIncluded ? <Check className="h-4 w-4" /> : null}
                </span>
              </div>
            );
          })}
        </div>

        {hasMore && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background px-6 py-2 font-medium text-primary transition-colors hover:border-primary hover:bg-primary/10"
            >
              {showAll ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  View Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  View All {amenities.length} Amenities
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
