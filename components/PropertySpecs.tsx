import {
  Bath,
  BedDouble,
  Building2,
  Calendar,
  CalendarCheck,
  IndianRupee,
  Layers,
  LocateFixed,
  MapPin,
  Maximize,
  Ruler,
  ShieldCheck,
} from "lucide-react";
import type { Property } from "@/app/api/properties/data";

interface PropertySpecsProps {
  property: Property;
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function PropertySpecs({ property }: PropertySpecsProps) {
  const specs = [
    {
      icon: Building2,
      label: "Property Type",
      value: property.propertyType,
    },
    {
      icon: Layers,
      label: "Category",
      value: property.category,
    },
    {
      icon: IndianRupee,
      label: "Price",
      value: currencyFormatter.format(property.price),
    },
    {
      icon: BedDouble,
      label: "Bedrooms",
      value: property.bedrooms.toString(),
    },
    {
      icon: Bath,
      label: "Bathrooms",
      value: property.bathrooms.toString(),
    },
    {
      icon: Maximize,
      label: "Total Area",
      value: `${property.area.toLocaleString()} sqft`,
    },
    {
      icon: MapPin,
      label: "Location",
      value: property.location,
    },
    {
      icon: MapPin,
      label: "City",
      value: property.city,
    },
    {
      icon: LocateFixed,
      label: "Coordinates",
      value: `${property.coordinates.lat.toFixed(4)}, ${property.coordinates.lng.toFixed(4)}`,
    },
    {
      icon: ShieldCheck,
      label: "Status",
      value: property.status,
    },
    {
      icon: Ruler,
      label: "Year Built",
      value: property.yearBuilt.toString(),
    },
    {
      icon: Calendar,
      label: "Listed Date",
      value: new Date(property.listedDate).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
    {
      icon: CalendarCheck,
      label: "Updated",
      value: new Date(property.updatedDate).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-xl font-semibold text-foreground">Key Specifications</h3>
      </div>
      <div className="px-4 py-4 sm:px-6">
        <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {specs.map((spec) => {
            const Icon = spec.icon;
            return (
              <div
                key={spec.label}
                className="flex items-start gap-3 rounded-xl border border-border/60 bg-background px-4 py-3"
              >
                <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    {spec.label}
                  </dt>
                  <dd className="text-lg font-semibold text-foreground">
                    {spec.value}
                  </dd>
                </div>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
