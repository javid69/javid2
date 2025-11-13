"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Bed, Bath, Maximize } from "lucide-react";
import { formatPrice, formatNumber } from "@/lib/utils";
import { PropertyStatus } from "@/lib/types";
import { useState } from "react";

interface PropertyCardProps {
  id: string;
  title: string;
  address: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  status: PropertyStatus;
  featured?: boolean;
  images: string[];
  agentName?: string;
  agentImage?: string;
  amenities?: string[];
  onFavoriteToggle?: (id: string) => void;
  isFavorite?: boolean;
}

export function PropertyCard({
  id,
  title,
  address,
  city,
  price,
  bedrooms,
  bathrooms,
  squareFeet,
  status,
  featured = false,
  images,
  agentName,
  agentImage,
  amenities = [],
  onFavoriteToggle,
  isFavorite = false,
}: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const imageUrl = images[0] || "/placeholder-property.jpg";

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(id);
    }
  };

  return (
    <Link
      href={`/properties/${id}`}
      className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 md:h-56 overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className={`object-cover transition-transform duration-300 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {featured && (
          <div className="absolute top-3 left-3 bg-secondary text-white px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}

        {status !== PropertyStatus.AVAILABLE && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {status}
          </div>
        )}

        <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-lg text-sm font-bold">
          {formatPrice(price)}
        </div>

        <button
          onClick={handleFavoriteClick}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-gray-700 hover:text-red-500"
            } transition-colors`}
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-primary mb-1 line-clamp-1 group-hover:text-accent transition-colors">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
          {address}, {city}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="w-4 h-4" />
            <span>{formatNumber(squareFeet)} sq ft</span>
          </div>
        </div>

        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {amenity}
              </span>
            ))}
            {amenities.length > 3 && (
              <span className="text-xs text-muted-foreground px-2 py-1">
                +{amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {agentName && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            {agentImage ? (
              <Image
                src={agentImage}
                alt={agentName}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">
                  {agentName.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-sm text-muted-foreground">{agentName}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
