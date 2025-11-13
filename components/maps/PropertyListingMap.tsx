"use client";

import { GoogleMap } from "@react-google-maps/api";
import { useState, useMemo, useCallback } from "react";
import { MapProperty, getBounds } from "@/lib/maps-utils";
import { MapCluster } from "./MapCluster";
import { MapPopup } from "./MapPopup";
import { GoogleMapsProvider } from "./GoogleMapsProvider";

interface PropertyListingMapProps {
  properties: MapProperty[];
  selectedPropertyId?: string | null;
  onPropertyClick?: (property: MapProperty) => void;
  containerStyle?: React.CSSProperties;
}

const defaultMapContainerStyle = {
  width: "100%",
  height: "600px",
};

const defaultCenter = {
  lat: 28.5355,
  lng: 77.391,
};

export function PropertyListingMap({
  properties,
  selectedPropertyId = null,
  onPropertyClick,
  containerStyle = defaultMapContainerStyle,
}: PropertyListingMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeProperty, setActiveProperty] = useState<MapProperty | null>(
    null
  );

  const bounds = useMemo(() => {
    const mapBounds = getBounds(properties);
    if (!mapBounds || typeof window === "undefined" || !window.google) {
      return null;
    }

    return new window.google.maps.LatLngBounds(
      { lat: mapBounds.south, lng: mapBounds.west },
      { lat: mapBounds.north, lng: mapBounds.east }
    );
  }, [properties]);

  const center = useMemo(() => {
    if (properties.length === 0) return defaultCenter;
    if (properties.length === 1) {
      return {
        lat: properties[0].coordinates.latitude,
        lng: properties[0].coordinates.longitude,
      };
    }
    if (bounds) {
      return {
        lat: (bounds.getNorthEast().lat() + bounds.getSouthWest().lat()) / 2,
        lng: (bounds.getNorthEast().lng() + bounds.getSouthWest().lng()) / 2,
      };
    }
    return defaultCenter;
  }, [properties, bounds]);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      center,
      zoom: properties.length === 1 ? 15 : 12,
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    }),
    [center, properties.length]
  );

  const onLoad = useCallback(
    (mapInstance: google.maps.Map) => {
      setMap(mapInstance);
      if (bounds && properties.length > 1) {
        setTimeout(() => {
          mapInstance.fitBounds(bounds);
        }, 100);
      }
    },
    [bounds, properties.length]
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMarkerClick = (property: MapProperty) => {
    setActiveProperty(property);
    if (onPropertyClick) {
      onPropertyClick(property);
    }
  };

  const handlePopupClose = () => {
    setActiveProperty(null);
  };

  if (properties.length === 0) {
    return (
      <div className="flex items-center justify-center bg-gray-50 rounded-lg border border-border p-12 text-center">
        <div>
          <p className="text-muted-foreground">
            No properties available to display on the map.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMapsProvider>
      <div className="relative rounded-lg overflow-hidden border border-border">
        <GoogleMap
          mapContainerStyle={containerStyle}
          options={mapOptions}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <MapCluster
            properties={properties}
            onMarkerClick={handleMarkerClick}
            activePropertyId={selectedPropertyId}
          />

          {activeProperty && (
            <MapPopup property={activeProperty} onClose={handlePopupClose} />
          )}
        </GoogleMap>

        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md px-4 py-2 text-sm">
          <span className="font-semibold text-foreground">
            {properties.length}
          </span>{" "}
          <span className="text-muted-foreground">
            {properties.length === 1 ? "property" : "properties"}
          </span>
        </div>
      </div>
    </GoogleMapsProvider>
  );
}
