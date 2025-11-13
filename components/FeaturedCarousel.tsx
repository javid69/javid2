"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyCard } from "./cards/PropertyCard";
import { Property } from "@/lib/types";

interface FeaturedCarouselProps {
  properties: (Property & { agent: { name: string; image?: string } })[];
}

export function FeaturedCarousel({ properties }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No featured properties available</p>
      </div>
    );
  }

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? properties.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === properties.length - 1 ? 0 : prev + 1,
    );
  };

  const visibleProperties = properties.slice(
    currentIndex,
    currentIndex + 3,
  );

  if (visibleProperties.length < 3 && properties.length >= 3) {
    visibleProperties.push(
      ...properties.slice(0, 3 - visibleProperties.length),
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleProperties.map((property) => (
          <PropertyCard
            key={property.id}
            id={property.id}
            title={property.title}
            address={property.address}
            city={property.city}
            price={property.price}
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            squareFeet={property.squareFeet}
            status={property.status}
            featured={property.featured}
            images={property.images}
            agentName={property.agent.name || undefined}
            agentImage={property.agent.image || undefined}
            amenities={property.amenities}
          />
        ))}
      </div>

      {properties.length > 3 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Previous properties"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Next properties"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>
        </>
      )}

      {properties.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {properties.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-primary w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
