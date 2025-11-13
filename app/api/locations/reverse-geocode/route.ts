import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json(
      { message: "Latitude and longitude are required." },
      { status: 400 }
    );
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json(
      { message: "Invalid latitude or longitude." },
      { status: 400 }
    );
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return NextResponse.json(
      { message: "Latitude or longitude out of range." },
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
    geocodeUrl.searchParams.set("latlng", `${latitude},${longitude}`);
    geocodeUrl.searchParams.set("key", apiKey);

    const geocodeResponse = await fetch(geocodeUrl.toString(), {
      cache: "no-store",
    });

    if (!geocodeResponse.ok) {
      return NextResponse.json(
        { message: "Failed to reverse geocode coordinates." },
        { status: 502 }
      );
    }

    const geocodeData = await geocodeResponse.json();

    if (geocodeData.status === "ZERO_RESULTS") {
      return NextResponse.json(
        { message: "No address found for these coordinates." },
        { status: 404 }
      );
    }

    if (geocodeData.status !== "OK" || !geocodeData.results?.[0]) {
      return NextResponse.json(
        { message: "Failed to reverse geocode coordinates." },
        { status: 502 }
      );
    }

    const result = geocodeData.results[0];

    return NextResponse.json({
      address: result.formatted_address,
      placeId: result.place_id,
    });
  } catch (error) {
    console.error("Reverse geocode error:", error);
    return NextResponse.json(
      { message: "Failed to reverse geocode coordinates." },
      { status: 500 }
    );
  }
}
