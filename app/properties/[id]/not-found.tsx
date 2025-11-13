import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function PropertyNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <Search className="h-12 w-12 text-primary" />
          </div>
        </div>

        <h1 className="mb-2 text-3xl font-bold text-foreground">
          Property Not Found
        </h1>
        <p className="mb-8 text-muted-foreground">
          The property you are looking for does not exist or has been removed.
          Please check the URL or browse our available listings.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/properties"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90"
          >
            <Search className="h-5 w-5" />
            Browse Properties
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-background px-6 py-3 font-semibold text-primary transition-colors hover:border-primary hover:bg-primary/10"
          >
            <Home className="h-5 w-5" />
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
