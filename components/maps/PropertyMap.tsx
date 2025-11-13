"use client";

import { GoogleMap, InfoWindowF, MarkerF } from "@react-google-maps/api";
import { useState, useMemo, useCallback } from "react";
import { MapPin, Navigation } from "lucide-react";
import { GoogleMapsProvider } from "./GoogleMapsProvider";

interface PropertyMapProps {
  title: string;
  price: number;
  address: string;
  latitude: number;
  longitude: number;
  image?: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

export function PropertyMap({
  title,
  price,
  address,
  latitude,
  longitude,
  image,
}: PropertyMapProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const center = useMemo(
    () => ({
      lat: latitude,
      lng: longitude,
    }),
    [latitude, longitude]
  );

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      center,
      zoom: 15,
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
    [center]
  );

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const markerAnimation =
    typeof window !== "undefined" && window.google
      ? window.google.maps.Animation.DROP
      : undefined;

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <GoogleMapsProvider>
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Location</h3>
          </div>
          <button
            type="button"
            onClick={handleGetDirections}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Navigation className="w-4 h-4" />
            Get Directions
          </button>
        </div>

        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            options={mapOptions}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            <MarkerF
              position={center}
              animation={markerAnimation}
              onClick={() => setShowInfo(true)}
              label={{
                text: formatPrice(price),
                color: "#ffffff",
                fontWeight: "600",
                fontSize: "12px",
              }}
            />

            {showInfo && (
              <InfoWindowF
                position={center}
                onCloseClick={() => setShowInfo(false)}
              >
                <div className="p-2 max-w-xs">
                  {image && (
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  )}
                  <h4 className="font-semibold text-foreground mb-1">{title}</h4>
                  <p className="text-lg font-bold text-primary mb-2">
                    {formatPrice(price)}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">{address}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View in Google Maps
                  </a>
                </div>
              </InfoWindowF>
            )}
          </GoogleMap>
        </div>

        <button
          type="button"
          onClick={handleGetDirections}
          className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
        >
          Open Directions in Google Maps
        </button>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Address</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              address
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground font-medium hover:text-primary"
          >
            {address}
          </a>
        </div>
      </div>
    </GoogleMapsProvider>
  );
}
