"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface PropertyErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PropertyError({ error, reset }: PropertyErrorProps) {
  useEffect(() => {
    console.error("Property detail page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
        </div>

        <h1 className="mb-2 text-3xl font-bold text-foreground">
          Something went wrong
        </h1>
        <p className="mb-8 text-muted-foreground">
          We couldn&apos;t load this property page. Please try again or get back to
          our listings.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            <RotateCcw className="h-5 w-5" />
            Retry
          </button>
          <Link
            href="/properties"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Browse Listings
          </Link>
        </div>
      </div>
    </div>
  );
}
