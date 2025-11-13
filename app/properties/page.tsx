"use client";

import Link from "next/link";
import { useState } from "react";
import { Grid, List, MapIcon } from "lucide-react";
import { PropertyListingMap } from "@/components/maps/PropertyListingMap";
import { MapProperty } from "@/lib/maps-utils";

const mockProperties: (MapProperty & { address: string })[] = [
  {
    id: "prime-residence",
    title: "Prime Riverfront Residence",
    price: 87500000,
    address: "Sector 128, Noida, Uttar Pradesh 201304",
    coordinates: {
      latitude: 28.526602,
      longitude: 77.392622,
    },
    category: "HOUSE",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200",
  },
  {
    id: "skyline-abode",
    title: "Skyline View Abode",
    price: 64500000,
    address: "Sector 104, Noida, Uttar Pradesh 201301",
    coordinates: {
      latitude: 28.544211,
      longitude: 77.350769,
    },
    category: "APARTMENT",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200",
  },
  {
    id: "green-terrace",
    title: "Green Terrace Retreat",
    price: 42500000,
    address: "Sector 62, Noida, Uttar Pradesh 201307",
    coordinates: {
      latitude: 28.627108,
      longitude: 77.363912,
    },
    category: "CONDO",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200",
  },
  {
    id: "commercial-hub",
    title: "Noida Central Business Hub",
    price: 128000000,
    address: "Sector 18, Noida, Uttar Pradesh 201301",
    coordinates: {
      latitude: 28.570197,
      longitude: 77.325714,
    },
    category: "COMMERCIAL",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200",
  },
  {
    id: "riverside-enclave",
    title: "Riverside Luxury Enclave",
    price: 96500000,
    address: "Sector 150, Noida, Uttar Pradesh 201310",
    coordinates: {
      latitude: 28.478208,
      longitude: 77.500617,
    },
    category: "TOWNHOUSE",
    image:
      "https://images.unsplash.com/photo-1600585154340-0ef3c08dcdb6?q=80&w=1200",
  },
  {
    id: "garden-villa",
    title: "Garden Paradise Villa",
    price: 73500000,
    address: "Sector 94, Noida, Uttar Pradesh 201304",
    coordinates: {
      latitude: 28.554816,
      longitude: 77.333411,
    },
    category: "HOUSE",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200",
  },
];

type ViewMode = "grid" | "list" | "map";

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    mockProperties[0]?.id ?? null
  );

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              ASYLEN VENTURES
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/properties"
                className="text-primary font-semibold"
              >
                Properties
              </Link>
              <Link
                href="/signin"
                className="text-foreground hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Browse Properties
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover your perfect property from our premium listings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Filters
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Property Type
                  </label>
                  <select className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>All Types</option>
                    <option>House</option>
                    <option>Apartment</option>
                    <option>Condo</option>
                    <option>Townhouse</option>
                    <option>Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bedrooms
                  </label>
                  <select className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Any</option>
                    <option>1+</option>
                    <option>2+</option>
                    <option>3+</option>
                    <option>4+</option>
                  </select>
                </div>

                <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  Apply Filters
                </button>
              </div>
            </div>
          </aside>

          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {mockProperties.length}
                </span>{" "}
                properties
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground mr-2">
                  View:
                </span>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "map"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  aria-label="Map view"
                >
                  <MapIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {viewMode === "map" ? (
              <div className="space-y-6">
                <PropertyListingMap
                  properties={mockProperties}
                  selectedPropertyId={selectedPropertyId}
                  onPropertyClick={(property) =>
                    setSelectedPropertyId(property.id)
                  }
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {mockProperties.map((property) => {
                    const isActive = property.id === selectedPropertyId;
                    return (
                      <div
                        key={property.id}
                        className={`flex gap-3 rounded-lg border transition-colors bg-white shadow-sm ${
                          isActive
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-border hover:border-primary"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedPropertyId(property.id)}
                          className="flex gap-3 flex-1 text-left"
                        >
                          <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-l-lg">
                            <img
                              src={property.image}
                              alt={property.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="py-3 pr-3 flex-1">
                            <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                              {property.title}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {property.address}
                            </p>
                            <div className="mt-1 text-sm font-semibold text-primary">
                              ₹{property.price.toLocaleString("en-IN")}
                            </div>
                            <span className="text-xs text-muted-foreground capitalize">
                              {property.category.toLowerCase()}
                            </span>
                          </div>
                        </button>
                        <Link
                          href={`/properties/${property.id}`}
                          className="px-3 py-3 text-sm font-medium text-primary hover:underline self-center"
                        >
                          View
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : viewMode === "list" ? (
              <div className="space-y-4">
                {mockProperties.map((property) => (
                  <Link
                    key={property.id}
                    href={`/properties/${property.id}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow flex"
                  >
                    <div className="relative h-48 w-64 flex-shrink-0 bg-gradient-to-br from-primary/20 to-accent/20">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">
                            {property.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-3">
                            {property.address}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span>3 bed</span>
                            <span>•</span>
                            <span>2 bath</span>
                            <span>•</span>
                            <span>2,000 sq ft</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary mb-2">
                            ₹{property.price.toLocaleString("en-IN")}
                          </div>
                          <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium capitalize">
                            {property.category.toLowerCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProperties.map((property) => (
                  <Link
                    key={property.id}
                    href={`/properties/${property.id}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {property.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-1">
                        {property.address}
                      </p>
                      <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
                        <span>3 bed • 2 bath</span>
                        <span>2,000 sq ft</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          ₹{(property.price / 10000000).toFixed(1)} Cr
                        </span>
                        <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium capitalize">
                          {property.category.toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
