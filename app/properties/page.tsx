import Link from "next/link";

export default function PropertiesPage() {
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
                  <select className="w-full px-3 py-2 border border-input rounded-lg">
                    <option>All Types</option>
                    <option>House</option>
                    <option>Apartment</option>
                    <option>Condo</option>
                    <option>Townhouse</option>
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
                      className="w-full px-3 py-2 border border-input rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-input rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bedrooms
                  </label>
                  <select className="w-full px-3 py-2 border border-input rounded-lg">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Link
                  key={i}
                  href={`/properties/${i}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20"></div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Property Title {i}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      123 Main Street, City, State
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground">
                        3 bed • 2 bath
                      </span>
                      <span className="text-sm text-muted-foreground">
                        2,000 sq ft
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        $500,000
                      </span>
                      <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                        Available
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
