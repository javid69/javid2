"use client";

import { InfoWindowF } from "@react-google-maps/api";
import Link from "next/link";
import { MapProperty } from "@/lib/maps-utils";

interface MapPopupProps {
  property: MapProperty;
  onClose: () => void;
}

export function MapPopup({ property, onClose }: MapPopupProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const position = {
    lat: property.coordinates.latitude,
    lng: property.coordinates.longitude,
  };

  return (
    <InfoWindowF position={position} onCloseClick={onClose}>
      <div className="max-w-xs">
        {property.image && (
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-32 object-cover rounded-t mb-2"
          />
        )}
        <div className="p-2">
          <h4 className="font-semibold text-foreground mb-1 line-clamp-1">
            {property.title}
          </h4>
          <p className="text-lg font-bold text-primary mb-2">
            {formatPrice(property.price)}
          </p>
          <p className="text-xs text-muted-foreground mb-3 capitalize">
            {property.category.toLowerCase().replace("_", " ")}
          </p>
          <Link
            href={`/properties/${property.id}`}
            className="inline-block w-full text-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </InfoWindowF>
  );
}
