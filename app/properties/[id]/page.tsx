import { headers } from "next/headers";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Eye, IndianRupee, Star } from "lucide-react";
import { Toaster } from "react-hot-toast";
import type { Property } from "@/app/api/properties/data";
import { getPropertyById } from "@/app/api/properties/data";
import { AmenitiesDisplay } from "@/components/AmenitiesDisplay";
import { Breadcrumb, type BreadcrumbItem } from "@/components/Breadcrumb";
import { ContactAgentPanel } from "@/components/ContactAgentPanel";
import { MortgageCalculator } from "@/components/MortgageCalculator";
import { PropertyGallery } from "@/components/PropertyGallery";
import { PropertyMap } from "@/components/PropertyMap";
import { PropertySpecs } from "@/components/PropertySpecs";
import { ShareButtons } from "@/components/ShareButtons";
import { SimilarProperties } from "@/components/SimilarProperties";

interface PropertyDetailPageProps {
  params: { id: string };
}

interface PropertyResponse {
  property: Property;
  similar: Property[];
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const property = getPropertyById(params.id);

  if (!property) {
    return {
      title: "Property Not Found | ASYLEN VENTURES",
    };
  }

  const title = `${property.title} - ${currencyFormatter.format(property.price)} | ASYLEN VENTURES`;
  const description = `${property.category} in ${property.location}. ${property.bedrooms} beds, ${property.bathrooms} baths, ${property.area} sqft. ${property.description}`;

  const canonicalUrl = `https://asylenventures.com/properties/${params.id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "ASYLEN VENTURES",
      images: [
        {
          url: property.images[0]?.url ?? "",
          alt: property.images[0]?.alt ?? property.title,
          width: 1600,
          height: 1000,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [property.images[0]?.url ?? ""],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

async function fetchPropertyData(id: string) {
  const headersList = headers();
  const host =
    headersList.get("x-forwarded-host") ??
    headersList.get("host") ??
    "localhost:3000";
  const protocol =
    headersList.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "production" ? "https" : "http");

  try {
    const res = await fetch(`${protocol}://${host}/api/properties/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data: PropertyResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching property data:", error);
    return null;
  }
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const data = await fetchPropertyData(params.id);

  if (!data || !data.property) {
    notFound();
  }

  const { property, similar } = data;

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Properties", href: "/properties" },
    { label: property.category, href: "/properties" },
    { label: property.title },
  ];

  const statusStyles = {
    Active: "bg-accent/10 text-accent",
    Sold: "bg-destructive/10 text-destructive",
    Rented: "bg-secondary/10 text-secondary",
    Pending: "bg-muted text-muted-foreground",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SingleFamilyResidence",
    name: property.title,
    description: property.description,
    image: property.images.map((image) => image.url),
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.city,
      addressRegion: property.state,
      postalCode: property.zipCode,
      addressCountry: property.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: property.coordinates.lat,
      longitude: property.coordinates.lng,
    },
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.area,
      unitCode: "SFT",
    },
    price: property.price,
    priceCurrency: "INR",
    url: property.shareUrl,
    seller: {
      "@type": "RealEstateAgent",
      name: property.agent.name,
      telephone: property.agent.phone,
      email: property.agent.email,
    },
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "",
          duration: 4000,
          style: {
            background: "#fff",
            color: "#0A2463",
            border: "1px solid #D4AF37",
          },
          success: {
            iconTheme: {
              primary: "#D4AF37",
              secondary: "#fff",
            },
          },
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb items={breadcrumbItems} className="mb-6" />

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                  {property.title}
                </h1>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[property.status]}`}
                >
                  {property.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <p className="text-lg">{property.location}</p>
                <span className="inline-flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {property.views.toLocaleString()} views
                </span>
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-secondary text-secondary" />
                  {property.rating} rating
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 sm:items-end">
              <div className="flex items-center gap-2">
                <IndianRupee className="h-6 w-6 text-primary" />
                <span className="text-3xl font-bold text-primary">
                  {currencyFormatter.format(property.price)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Property ID: {property.propertyId}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <ShareButtons
              url={property.shareUrl}
              title={property.title}
              text={`Check out this ${property.category} in ${property.location} for ${currencyFormatter.format(property.price)}`}
            />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <PropertyGallery
                images={property.images}
                title={property.title}
                propertyId={property.id}
                shareUrl={property.shareUrl}
              />

              <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-2xl font-semibold text-primary">
                  About This Property
                </h2>
                <div
                  className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-accent"
                  dangerouslySetInnerHTML={{ __html: property.descriptionHtml }}
                />
              </section>

              {property.highlights.length > 0 && (
                <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-xl font-semibold text-foreground">
                    Key Highlights
                  </h3>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {property.highlights.map((highlight, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 rounded-lg border border-border bg-background px-4 py-3"
                      >
                        <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                          ✓
                        </span>
                        <span className="text-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <PropertySpecs property={property} />

              <AmenitiesDisplay amenities={property.amenities} />

              <PropertyMap property={property} />

              <MortgageCalculator defaultLoanAmount={property.price * 0.8} />

              <SimilarProperties properties={similar} />
            </div>

            <div className="lg:col-span-1">
              <ContactAgentPanel
                agent={property.agent}
                propertyId={property.id}
                propertyTitle={property.title}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
