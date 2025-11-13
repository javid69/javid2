"use client";

import { MarkerClustererF } from "@react-google-maps/api";
import { MapProperty } from "@/lib/maps-utils";
import { MapMarker } from "./MapMarker";

interface MapClusterProps {
  properties: MapProperty[];
  onMarkerClick?: (property: MapProperty) => void;
  activePropertyId?: string | null;
}

export function MapCluster({
  properties,
  onMarkerClick,
  activePropertyId,
}: MapClusterProps) {
  return (
    <MarkerClustererF averageCenter gridSize={40}>
      {(clusterer) => (
        <>
          {properties.map((property) => (
            <MapMarker
              key={property.id}
              property={property}
              clusterer={clusterer}
              isActive={property.id === activePropertyId}
              onClick={() => onMarkerClick?.(property)}
            />
          ))}
        </>
      )}
    </MarkerClustererF>
  );
}
