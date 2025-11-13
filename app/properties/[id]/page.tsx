import Link from "next/link";

export default function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
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

      <main className="container mx-auto px-4 py-12">
        <Link
          href="/properties"
          className="inline-flex items-center text-primary hover:underline mb-6"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg h-96 mb-6"></div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Property Title {params.id}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    123 Main Street, City, State 12345
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary mb-2">
                    $500,000
                  </div>
                  <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                    Available
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 py-6 border-t border-b border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">3</div>
                  <div className="text-sm text-muted-foreground">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">2</div>
                  <div className="text-sm text-muted-foreground">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">2,000</div>
                  <div className="text-sm text-muted-foreground">Sq Ft</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">House</div>
                  <div className="text-sm text-muted-foreground">Type</div>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Description
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Beautiful property in a prime location. This stunning home
                  features modern amenities, spacious rooms, and excellent
                  natural lighting. Perfect for families looking for comfort and
                  style. The property includes a large backyard, updated
                  kitchen, and newly renovated bathrooms. Located near schools,
                  shopping centers, and public transportation.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Features & Amenities
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Central Air Conditioning",
                  "Modern Kitchen",
                  "Hardwood Floors",
                  "Walk-in Closets",
                  "Private Backyard",
                  "Attached Garage",
                  "Energy Efficient",
                  "Pet Friendly",
                ].map((feature) => (
                  <div key={feature} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-accent mr-2"
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
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Contact Agent
              </h3>

              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 mr-4"></div>
                <div>
                  <div className="font-semibold text-foreground">
                    Agent Name
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Real Estate Agent
                  </div>
                </div>
              </div>

              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Your Phone"
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <textarea
                    rows={4}
                    placeholder="Message"
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    defaultValue="I'm interested in this property. Please contact me."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Send Message
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-border">
                <button className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors mb-3">
                  Schedule Tour
                </button>
                <button className="w-full border border-input py-3 rounded-lg font-semibold hover:bg-accent/10 transition-colors">
                  Save Property
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
