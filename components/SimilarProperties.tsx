"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import type { Property } from "@/app/api/properties/data";
import { cn } from "@/lib/utils";

interface SimilarPropertiesProps {
  properties: Property[];
  heading?: string;
  subheading?: string;
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function SimilarProperties({
  properties,
  heading = "Similar Properties",
  subheading = "You might also like",
}: SimilarPropertiesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.9;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (properties.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-foreground">{heading}</h3>
          <p className="text-sm text-muted-foreground">{subheading}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            className="rounded-full border border-primary/30 p-2 text-primary transition-colors hover:border-primary"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll("right")}
            className="rounded-full border border-primary/30 p-2 text-primary transition-colors hover:border-primary"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2"
      >
        {properties.map((property) => (
          <Link
            key={property.id}
            href={`/properties/${property.id}`}
            className="group relative flex w-72 flex-shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-border/80 bg-background transition-shadow hover:shadow-lg"
          >
            <div className="relative h-40 w-full overflow-hidden">
              <Image
                src={property.images[0]?.url ?? "/images/property-placeholder.jpg"}
                alt={property.images[0]?.alt ?? property.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="288px"
              />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary">
                {property.category}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4">
              <div>
                <h4 className="text-lg font-semibold text-foreground line-clamp-2">
                  {property.title}
                </h4>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="line-clamp-1">{property.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                <div className="rounded-lg bg-white px-2 py-1 text-center">
                  <span className="font-semibold text-foreground">
                    {property.bedrooms}
                  </span>{" "}
                  Bed
                </div>
                <div className="rounded-lg bg-white px-2 py-1 text-center">
                  <span className="font-semibold text-foreground">
                    {property.bathrooms}
                  </span>{" "}
                  Bath
                </div>
                <div className="rounded-lg bg-white px-2 py-1 text-center">
                  {property.area.toLocaleString()} sqft
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  {currencyFormatter.format(property.price)}
                </span>
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  {property.status}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:border-primary"
        >
          View All Similar
        </Link>
      </div>
    </section>
  );
}
