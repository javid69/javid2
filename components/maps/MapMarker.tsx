"use client";

import { MarkerF, type MarkerClusterer } from "@react-google-maps/api";
import { useMemo } from "react";
import { MapProperty, getMarkerColor } from "@/lib/maps-utils";

interface MapMarkerProps {
  property: MapProperty;
  isActive?: boolean;
  onClick?: () => void;
  clusterer?: MarkerClusterer;
}

export function MapMarker({ property, isActive = false, onClick, clusterer }: MapMarkerProps) {
  const markerIcon = useMemo(() => {
    const color = getMarkerColor(property.category);
    const size = isActive ? 56 : 48;
    const stroke = isActive ? "#0A2463" : "#ffffff";
    const label = formatMarkerPrice(property.price);
    const svg = `<?xml version="1.0" ?>
      <svg width="${size}" height="${size}" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fill-rule="evenodd">
          <path d="M24 0c11.046 0 20 8.954 20 20 0 11.046-20 28-20 28S4 31.046 4 20C4 8.954 12.954 0 24 0z" fill="${color}" stroke="${stroke}" stroke-width="2" />
          <text x="24" y="24" text-anchor="middle" font-family="Inter" font-size="12" font-weight="600" fill="#ffffff">${label}</text>
        </g>
      </svg>`;
    const url = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

    if (typeof window !== "undefined" && window.google) {
      return {
        url,
        scaledSize: new window.google.maps.Size(size, size),
        anchor: new window.google.maps.Point(size / 2, size),
        labelOrigin: new window.google.maps.Point(size / 2, 18),
      } satisfies google.maps.Icon;
    }

    return {
      url,
    } satisfies google.maps.Icon;
  }, [property.category, property.price, isActive]);

  const position = useMemo(() => {
    return {
      lat: property.coordinates.latitude,
      lng: property.coordinates.longitude,
    };
  }, [property.coordinates.latitude, property.coordinates.longitude]);

  return (
    <MarkerF
      position={position}
      onClick={onClick}
      icon={markerIcon}
      title={`${property.title} – ₹${property.price.toLocaleString("en-IN")}`}
      clusterer={clusterer}
    />
  );
}

function formatMarkerPrice(price: number): string {
  if (price >= 10000000) {
    return `${(price / 10000000).toFixed(price >= 100000000 ? 0 : 1)} Cr`;
  }
  if (price >= 100000) {
    return `${Math.round(price / 100000)} L`; // Lakhs
  }
  if (price >= 1000) {
    return `${Math.round(price / 1000)} K`;
  }
  return `₹${Math.round(price)}`;
}
