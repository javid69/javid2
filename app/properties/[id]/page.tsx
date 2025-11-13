import Link from "next/link";
import { PropertyMap } from "@/components/maps/PropertyMap";
import { calculateDistance, MapProperty } from "@/lib/maps-utils";

interface PropertyDetailPageProps {
  params: { id: string };
}

type ExtendedMapProperty = MapProperty & {
  address: string;
};

const primaryProperty: ExtendedMapProperty = {
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
};

const mockProperties: ExtendedMapProperty[] = [
  primaryProperty,
  {
    id: "skyline-abode",
    title: "Skyline View Abode",
    price: 64500000,
    address: "Sector 104, Noida, Uttar Pradesh 201301",
    coordinates: {
      latitude: 28.544211,
      longitude: 77.350769,
    },
    category: "LUXURY",
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
    category: "APARTMENT",
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
    category: "LUXURY",
    image:
      "https://images.unsplash.com/photo-1600585154340-0ef3c08dcdb6?q=80&w=1200",
  },
];

const RADIUS_IN_KM = 8;

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const property = {
    ...primaryProperty,
    id: params.id,
  };

  const nearbyProperties = mockProperties
    .filter((item) => item.id !== property.id)
    .map((item) => {
      const distance = calculateDistance(
        property.coordinates.latitude,
        property.coordinates.longitude,
        item.coordinates.latitude,
        item.coordinates.longitude
      );

      return {
        ...item,
        distance,
      };
    })
    .filter((item) => item.distance <= RADIUS_IN_KM)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);

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
                className="text-foreground hover:text-primary transition-colors"
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

      <main className="container mx-auto px-4 py-12 space-y-12">
        <div className="flex items-center justify-between">
          <Link
            href="/properties"
            className="inline-flex items-center text-primary hover:underline"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Properties
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-96 bg-gradient-to-br from-primary/20 to-accent/20">
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {property.title}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      {property.address}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="text-3xl font-bold text-primary mb-2">
                      ₹{property.price.toLocaleString("en-IN")}
                    </div>
                    <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium capitalize">
                      {property.category.toLowerCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 py-6 mt-6 border-t border-b border-border">
                  {[
                    { label: "Bedrooms", value: "4" },
                    { label: "Bathrooms", value: "4" },
                    { label: "Sq Ft", value: "3,800" },
                    { label: "Type", value: "Luxury Villa" },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className="text-2xl font-bold text-foreground">
                        {item.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    Property Overview
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Discover an exquisite riverside residence in Noida&apos;s most
                    coveted neighbourhood. Designed for lavish living, this
                    property features expansive interiors, floor-to-ceiling
                    windows, and seamless indoor-outdoor experiences. Premium
                    fittings, a private deck, landscaped gardens, and smart home
                    technology establish a new benchmark for luxury living.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <PropertyMap
                title={property.title}
                price={property.price}
                address={property.address}
                latitude={property.coordinates.latitude}
                longitude={property.coordinates.longitude}
                image={property.image}
              />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Features & Amenities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Smart Home Automation",
                  "Private Infinity Pool",
                  "Sky Deck & Lounge",
                  "Integrated Security System",
                  "Fitness & Wellness Suite",
                  "Dedicated Workspace",
                  "Premium Modular Kitchen",
                  "EV Charging Stations",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-foreground"
                  >
                    <svg
                      className="w-5 h-5 text-accent"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Contact Agent
              </h3>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 mr-4"></div>
                <div>
                  <div className="font-semibold text-foreground">
                    Priya Sharma
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Luxury Property Specialist
                  </div>
                </div>
              </div>

              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  rows={4}
                  placeholder="Message"
                  defaultValue="I&apos;m interested in this property. Please share additional information."
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Nearby Properties within {RADIUS_IN_KM} km
              </h3>
              <div className="space-y-4">
                {nearbyProperties.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No nearby properties found within the selected radius.
                  </p>
                )}

                {nearbyProperties.map((item) => (
                  <Link
                    key={item.id}
                    href={`/properties/${item.id}`}
                    className="flex gap-4 rounded-lg border border-border hover:border-primary transition-colors overflow-hidden"
                  >
                    <div className="relative h-20 w-24 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {item.address}
                      </p>
                      <div className="mt-1 text-sm font-semibold text-primary">
                        ₹{item.price.toLocaleString("en-IN")}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {item.distance.toFixed(1)} km away
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
              <button className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors">
                Schedule Private Tour
              </button>
              <button className="w-full border border-input py-3 rounded-lg font-semibold hover:bg-accent/10 transition-colors">
                Save Property
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
