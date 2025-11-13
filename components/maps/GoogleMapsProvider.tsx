"use client";

import {
  Libraries,
  useJsApiLoader,
} from "@react-google-maps/api";
import { ReactNode } from "react";

const defaultLibraries: Libraries = ["places", "geometry"];

interface GoogleMapsProviderProps {
  children: ReactNode;
  libraries?: Libraries;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode;
}

export function GoogleMapsProvider({
  children,
  libraries = defaultLibraries,
  loadingFallback,
  errorFallback,
}: GoogleMapsProviderProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { isLoaded, loadError } = useJsApiLoader({
    id: "asylen-ventures-google-maps",
    googleMapsApiKey: apiKey || "",
    libraries,
  });

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-amber-700">
          Google Maps API key is not configured.
        </p>
      </div>
    );
  }

  if (loadError) {
    if (errorFallback) {
      return <>{errorFallback}</>;
    }
    return (
      <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error loading Google Maps. Please try again.</p>
      </div>
    );
  }

  if (!isLoaded) {
    if (loadingFallback) {
      return <>{loadingFallback}</>;
    }
    return (
      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
