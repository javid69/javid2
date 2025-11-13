import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { address } = body;

  if (!address || typeof address !== "string" || address.trim().length === 0) {
    return NextResponse.json(
      { message: "Address is required." },
      { status: 400 }
    );
  }

  const apiKey =
    process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { message: "Google Maps API key is not configured." },
      { status: 500 }
    );
  }

  try {
    const geocodeUrl = new URL(
      "https://maps.googleapis.com/maps/api/geocode/json"
    );
    geocodeUrl.searchParams.set("address", address);
    geocodeUrl.searchParams.set("key", apiKey);

    const geocodeResponse = await fetch(geocodeUrl.toString(), {
      cache: "no-store",
    });

    if (!geocodeResponse.ok) {
      return NextResponse.json(
        { message: "Failed to geocode address." },
        { status: 502 }
      );
    }

    const geocodeData = await geocodeResponse.json();

    if (geocodeData.status === "ZERO_RESULTS") {
      return NextResponse.json(
        { message: "No results found for this address." },
        { status: 404 }
      );
    }

    if (geocodeData.status !== "OK" || !geocodeData.results?.[0]) {
      return NextResponse.json(
        { message: "Failed to geocode address." },
        { status: 502 }
      );
    }

    const result = geocodeData.results[0];
    const location = result.geometry.location;

    return NextResponse.json({
      coordinates: {
        latitude: location.lat,
        longitude: location.lng,
      },
      formattedAddress: result.formatted_address,
    });
  } catch (error) {
    console.error("Geocode error:", error);
    return NextResponse.json(
      { message: "Failed to geocode address." },
      { status: 500 }
    );
  }
}
