"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { MapPin, Loader2 } from "lucide-react";
import { LocationCoordinates, PlaceDetails } from "@/lib/maps-utils";

const libraries: ("places")[] = ["places"];

interface AddressAutocompleteProps {
  onSelect: (place: PlaceDetails) => void;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

export function AddressAutocomplete({
  onSelect,
  defaultValue = "",
  placeholder = "Search for an address...",
  className = "",
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(
    null
  );
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  useEffect(() => {
    if (isLoaded && !autocompleteService.current) {
      autocompleteService.current =
        new google.maps.places.AutocompleteService();
      const mapDiv = document.createElement("div");
      placesService.current = new google.maps.places.PlacesService(mapDiv);
    }
  }, [isLoaded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchPlaces = useCallback(
    (input: string) => {
      if (!autocompleteService.current || input.length < 3) {
        setPredictions([]);
        setIsSearching(false);
        return;
      }

      const locationBias = new google.maps.LatLng(28.5355, 77.3910);
      const request: google.maps.places.AutocompletionRequest = {
        input,
        componentRestrictions: { country: "in" },
        types: ["address"],
        location: locationBias,
        radius: 50000,
      };

      autocompleteService.current.getPlacePredictions(
        request,
        (results, status) => {
          setIsSearching(false);
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            results
          ) {
            const filtered = results.filter((prediction) =>
              prediction.description.toLowerCase().includes("noida")
            );
            setPredictions(filtered.length > 0 ? filtered : results);
            setShowDropdown(true);
          } else {
            setPredictions([]);
          }
        }
      );
    },
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.length >= 3) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(() => {
        searchPlaces(value);
      }, 300);
    } else {
      setPredictions([]);
      setShowDropdown(false);
    }
  };

  const handleSelectPrediction = (prediction: google.maps.places.AutocompletePrediction) => {
    if (!placesService.current) return;

    const request: google.maps.places.PlaceDetailsRequest = {
      placeId: prediction.place_id,
      fields: ["formatted_address", "geometry", "place_id"],
    };

    placesService.current.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        const location = place.geometry?.location;
        if (location) {
          const coordinates: LocationCoordinates = {
            latitude: location.lat(),
            longitude: location.lng(),
          };

          const placeDetails: PlaceDetails = {
            address: place.formatted_address || "",
            coordinates,
            placeId: place.place_id || "",
          };

          setInputValue(placeDetails.address);
          setShowDropdown(false);
          setPredictions([]);
          onSelect(placeDetails);
        }
      }
    });
  };

  if (!isLoaded) {
    return (
      <div className="relative">
        <input
          type="text"
          disabled
          placeholder="Loading..."
          className={`w-full px-4 py-2 pl-10 border border-input rounded-lg bg-gray-50 ${className}`}
        />
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2 pl-10 pr-10 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
          onFocus={() => {
            if (predictions.length > 0) {
              setShowDropdown(true);
            }
          }}
        />
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />
        )}
      </div>

      {showDropdown && predictions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              type="button"
              onClick={() => handleSelectPrediction(prediction)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b last:border-b-0 border-gray-100"
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {prediction.structured_formatting.main_text}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {prediction.structured_formatting.secondary_text}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showDropdown && !isSearching && inputValue.length >= 3 && predictions.length === 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-border rounded-lg shadow-lg p-4"
        >
          <p className="text-sm text-muted-foreground text-center">
            No addresses found. Try a different search.
          </p>
        </div>
      )}
    </div>
  );
}
