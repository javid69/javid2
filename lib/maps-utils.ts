export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface PlaceDetails {
  address: string;
  coordinates: LocationCoordinates;
  placeId: string;
}

export interface MapProperty {
  id: string;
  title: string;
  price: number;
  coordinates: LocationCoordinates;
  category: string;
  image: string;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(6)}°${latDir}, ${Math.abs(lng).toFixed(6)}°${lngDir}`;
}

export function getBounds(properties: MapProperty[]): MapBounds | null {
  if (properties.length === 0) return null;

  let north = -90;
  let south = 90;
  let east = -180;
  let west = 180;

  properties.forEach((property) => {
    const { latitude, longitude } = property.coordinates;
    if (latitude > north) north = latitude;
    if (latitude < south) south = latitude;
    if (longitude > east) east = longitude;
    if (longitude < west) west = longitude;
  });

  const padding = 0.01;
  return {
    north: north + padding,
    south: south - padding,
    east: east + padding,
    west: west - padding,
  };
}

export async function geocodeAddress(
  address: string
): Promise<LocationCoordinates | null> {
  try {
    const response = await fetch(`/api/locations/geocode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address }),
    });

    if (!response.ok) {
      throw new Error("Geocoding failed");
    }

    const data = await response.json();
    return data.coordinates;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string | null> {
  try {
    const response = await fetch(
      `/api/locations/reverse-geocode?lat=${lat}&lng=${lng}`
    );

    if (!response.ok) {
      throw new Error("Reverse geocoding failed");
    }

    const data = await response.json();
    return data.address;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}

export function getMarkerColor(category: string): string {
  const colors: Record<string, string> = {
    HOUSE: "#22c55e",
    APARTMENT: "#3b82f6",
    LAND: "#f97316",
    CONDO: "#D4AF37",
    TOWNHOUSE: "#a855f7",
    COMMERCIAL: "#0ea5e9",
    LUXURY: "#D4AF37",
    RENTAL: "#7c3aed",
  };
  return colors[category] || "#0A2463";
}

export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
}

export function isValidCoordinates(
  lat?: number | null,
  lng?: number | null
): boolean {
  if (lat === undefined || lat === null || lng === undefined || lng === null) {
    return false;
  }
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}
