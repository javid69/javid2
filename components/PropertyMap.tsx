import { ExternalLink, MapPin, Navigation, Train } from "lucide-react";
import type { Property } from "@/app/api/properties/data";

interface PropertyMapProps {
  property: Property;
}

export function PropertyMap({ property }: PropertyMapProps) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${property.coordinates.lat},${property.coordinates.lng}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-xl font-semibold text-foreground">Location</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {property.location}
        </p>
      </div>

      <div className="p-6">
        <div className="mb-6 aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full items-center justify-center transition-opacity hover:opacity-90"
            aria-label="Open in Google Maps"
          >
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-primary" />
              <p className="mt-2 text-sm font-medium text-primary">
                Click to view on Google Maps
              </p>
            </div>
          </a>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">{property.map.summary}</p>
          </div>

          {property.map.landmarks.length > 0 && (
            <div>
              <h4 className="mb-3 font-semibold text-foreground">
                Nearby Landmarks
              </h4>
              <div className="space-y-2">
                {property.map.landmarks.map((landmark, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg border border-border bg-background px-3 py-2"
                  >
                    <MapPin className="h-5 w-5 flex-shrink-0 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {landmark.name}
                      </p>
                      {landmark.description && (
                        <p className="text-xs text-muted-foreground">
                          {landmark.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-accent">
                      {landmark.distance}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {property.map.transit.length > 0 && (
            <div>
              <h4 className="mb-3 font-semibold text-foreground">
                Transport Connectivity
              </h4>
              <div className="space-y-2">
                {property.map.transit.map((transit, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Train className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        {transit.type}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {transit.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 font-medium text-primary transition-colors hover:border-primary hover:bg-primary/10"
          >
            <Navigation className="h-5 w-5" />
            <span>Open in Google Maps</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
