import Link from "next/link";
import {
  Home,
  Building2,
  Trees,
  Crown,
  KeyRound,
  TrendingUp,
  Users,
  Award,
  CheckCircle2,
} from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { CategoryCard } from "@/components/cards/CategoryCard";
import { StatCounter } from "@/components/StatCounter";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { Newsletter } from "@/components/Newsletter";

async function getFeaturedProperties() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/properties/featured`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.properties || [];
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    return [];
  }
}

async function getRecentProperties() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/properties?limit=8&sort=newest`,
      {
        next: { revalidate: 300 },
      },
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.properties || [];
  } catch (error) {
    console.error("Error fetching recent properties:", error);
    return [];
  }
}

async function getStats() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/properties/stats`, {
      next: { revalidate: 300 },
    });
    if (!response.ok)
      return {
        totalProperties: 0,
        soldProperties: 0,
        categoryCounts: {},
      };
    return await response.json();
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      totalProperties: 0,
      soldProperties: 0,
      categoryCounts: {},
    };
  }
}

export default async function HomePage() {
  const [featuredProperties, recentProperties, stats] = await Promise.all([
    getFeaturedProperties(),
    getRecentProperties(),
    getStats(),
  ]);

  const categories = [
    {
      name: "Residential",
      icon: Home,
      count:
        (stats.categoryCounts?.APARTMENT || 0) +
        (stats.categoryCounts?.HOUSE || 0) +
        (stats.categoryCounts?.CONDO || 0) +
        (stats.categoryCounts?.TOWNHOUSE || 0),
      href: "/properties?propertyType=APARTMENT,HOUSE,CONDO,TOWNHOUSE",
    },
    {
      name: "Commercial",
      icon: Building2,
      count: stats.categoryCounts?.COMMERCIAL || 0,
      href: "/properties?propertyType=COMMERCIAL",
    },
    {
      name: "Land",
      icon: Trees,
      count: stats.categoryCounts?.LAND || 0,
      href: "/properties?propertyType=LAND",
    },
    {
      name: "Luxury",
      icon: Crown,
      count: Math.floor((stats.totalProperties || 0) * 0.15),
      href: "/properties?minPrice=50000000",
    },
    {
      name: "Rental",
      icon: KeyRound,
      count: stats.rentedProperties || 0,
      href: "/properties?status=RENTED",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-white sticky top-0 z-50 shadow-sm">
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
                href="/auth/signin"
                className="text-foreground hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative bg-gradient-to-br from-primary via-primary/95 to-accent py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-secondary text-lg font-semibold mb-2">
                Your Trusted Real Estate Partner
              </p>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Find Your Dream Property
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Discover premium properties in Noida and beyond
              </p>
            </div>

            <SearchBar />
          </div>
        </section>

        {featuredProperties.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                  Featured Properties
                </h2>
                <p className="text-muted-foreground">
                  Handpicked premium listings
                </p>
              </div>
              <FeaturedCarousel properties={featuredProperties} />
            </div>
          </section>
        )}

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Browse by Category
              </h2>
              <p className="text-muted-foreground">
                Find the perfect property type for you
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.name} {...category} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCounter
                icon={Home}
                value={stats.totalProperties || 0}
                label="Total Properties"
                suffix="+"
              />
              <StatCounter
                icon={Users}
                value={5000}
                label="Happy Clients"
                suffix="+"
              />
              <StatCounter
                icon={Award}
                value={10}
                label="Years in Business"
                suffix="+"
              />
              <StatCounter
                icon={TrendingUp}
                value={stats.soldProperties || 0}
                label="Properties Sold"
                suffix="+"
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                What Our Clients Say
              </h2>
              <p className="text-muted-foreground">
                Real experiences from real people
              </p>
            </div>
            <TestimonialsCarousel />
          </div>
        </section>

        {recentProperties.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                  Latest Properties
                </h2>
                <p className="text-muted-foreground">
                  Recently added listings
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentProperties.map((property: any) => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    title={property.title}
                    address={property.address}
                    city={property.city}
                    price={property.price}
                    bedrooms={property.bedrooms}
                    bathrooms={property.bathrooms}
                    squareFeet={property.squareFeet}
                    status={property.status}
                    featured={property.featured}
                    images={property.images}
                    agentName={property.agent?.name}
                    agentImage={property.agent?.image}
                    amenities={property.amenities}
                  />
                ))}
              </div>
              <div className="text-center mt-12">
                <Link
                  href="/properties"
                  className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  View All Properties
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="py-20 bg-gradient-to-br from-accent to-primary/90">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="text-center md:text-left text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Looking to Buy or Rent?
                </h2>
                <p className="text-white/90 mb-6 text-lg">
                  Explore our extensive collection of properties. From cozy
                  apartments to luxurious villas, find your perfect match.
                </p>
                <Link
                  href="/properties"
                  className="inline-block bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Browse Properties
                </Link>
              </div>

              <div className="text-center md:text-left text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Want to List Your Property?
                </h2>
                <p className="text-white/90 mb-6 text-lg">
                  Join our network of successful agents and sellers. List your
                  property and reach thousands of potential buyers.
                </p>
                <Link
                  href="/auth/signup"
                  className="inline-block bg-white hover:bg-white/90 text-primary px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Become an Agent
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>

      <footer className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-bold mb-4">ASYLEN VENTURES</h4>
              <p className="text-white/80">
                Your trusted partner in real estate excellence.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-white/80">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/properties"
                    className="hover:text-white transition-colors"
                  >
                    Properties
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">For Agents</h5>
              <ul className="space-y-2 text-white/80">
                <li>
                  <Link
                    href="/auth/signup"
                    className="hover:text-white transition-colors"
                  >
                    Join Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Contact Info</h5>
              <ul className="space-y-2 text-white/80">
                <li>Phone: +91 (123) 456-7890</li>
                <li>Email: info@asylenventures.com</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-white/80 text-sm">
                &copy; 2024 ASYLEN VENTURES. All rights reserved.
              </div>
              <div className="flex gap-6 text-white/80 text-sm">
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
