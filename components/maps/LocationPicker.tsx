"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { MapPin } from "lucide-react";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { GoogleMapsProvider } from "./GoogleMapsProvider";
import { LocationCoordinates, PlaceDetails } from "@/lib/maps-utils";

interface LocationPickerProps {
  onLocationSelect: (location: PlaceDetails) => void;
  defaultAddress?: string;
  defaultLatitude?: number;
  defaultLongitude?: number;
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 28.5355,
  lng: 77.391,
};

export function LocationPicker({
  onLocationSelect,
  defaultAddress = "",
  defaultLatitude,
  defaultLongitude,
}: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<
    LocationCoordinates | undefined
  >(
    defaultLatitude && defaultLongitude
      ? { latitude: defaultLatitude, longitude: defaultLongitude }
      : undefined
  );
  const [address, setAddress] = useState(defaultAddress);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(
    defaultLatitude && defaultLongitude
      ? { lat: defaultLatitude, lng: defaultLongitude }
      : null
  );

  const center = useMemo(() => {
    if (markerPosition) {
      return markerPosition;
    }
    return defaultCenter;
  }, [markerPosition]);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      center,
      zoom: markerPosition ? 15 : 12,
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      clickableIcons: false,
    }),
    [center, markerPosition]
  );

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handlePlaceSelect = (place: PlaceDetails) => {
    const { coordinates } = place;
    setAddress(place.address);
    setSelectedLocation(coordinates);
    setMarkerPosition({
      lat: coordinates.latitude,
      lng: coordinates.longitude,
    });

    if (map) {
      map.panTo({
        lat: coordinates.latitude,
        lng: coordinates.longitude,
      });
      map.setZoom(15);
    }

    onLocationSelect(place);
  };

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        setMarkerPosition({ lat, lng });
        setSelectedLocation({ latitude: lat, longitude: lng });

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode(
          { location: { lat, lng } },
          (results, status) => {
            if (status === "OK" && results && results[0]) {
              const formattedAddress = results[0].formatted_address;
              setAddress(formattedAddress);

              const placeDetails: PlaceDetails = {
                address: formattedAddress,
                coordinates: { latitude: lat, longitude: lng },
                placeId: results[0].place_id || "",
              };

              onLocationSelect(placeDetails);
            }
          }
        );
      }
    },
    [onLocationSelect]
  );

  const handleMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        setMarkerPosition({ lat, lng });
        setSelectedLocation({ latitude: lat, longitude: lng });

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode(
          { location: { lat, lng } },
          (results, status) => {
            if (status === "OK" && results && results[0]) {
              const formattedAddress = results[0].formatted_address;
              setAddress(formattedAddress);

              const placeDetails: PlaceDetails = {
                address: formattedAddress,
                coordinates: { latitude: lat, longitude: lng },
                placeId: results[0].place_id || "",
              };

              onLocationSelect(placeDetails);
            }
          }
        );
      }
    },
    [onLocationSelect]
  );

  const handleManualCoordinateChange = (
    field: "latitude" | "longitude",
    value: string
  ) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const newLocation = {
      latitude:
        field === "latitude"
          ? numValue
          : selectedLocation?.latitude || defaultCenter.lat,
      longitude:
        field === "longitude"
          ? numValue
          : selectedLocation?.longitude || defaultCenter.lng,
    };

    setSelectedLocation(newLocation);
    setMarkerPosition({
      lat: newLocation.latitude,
      lng: newLocation.longitude,
    });

    if (map) {
      map.panTo({
        lat: newLocation.latitude,
        lng: newLocation.longitude,
      });
    }
  };

  return (
    <GoogleMapsProvider>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Search Address
          </label>
          <AddressAutocomplete
            onSelect={handlePlaceSelect}
            defaultValue={defaultAddress}
            placeholder="Search for a property address..."
          />
          <p className="text-xs text-muted-foreground mt-1">
            Search for an address or click on the map to set the location
          </p>
        </div>

        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            options={mapOptions}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={handleMapClick}
          >
            {markerPosition && (
              <MarkerF
                position={markerPosition}
                draggable
                onDragEnd={handleMarkerDragEnd}
              />
            )}
          </GoogleMap>
        </div>

        {selectedLocation && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Selected Address
              </label>
              <p className="text-sm text-foreground">{address || "Unknown"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={selectedLocation.latitude}
                  onChange={(e) =>
                    handleManualCoordinateChange("latitude", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={selectedLocation.longitude}
                  onChange={(e) =>
                    handleManualCoordinateChange("longitude", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        )}

        {!selectedLocation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  No location selected
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Search for an address above or click on the map to pin a
                  location
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </GoogleMapsProvider>
  );
}
