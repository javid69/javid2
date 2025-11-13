import { NextResponse } from "next/server";

const NOIDA_LOCATION = {
  lat: 28.5355,
  lng: 77.391,
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get("address") || "";

  if (!input || input.trim().length < 3) {
    return NextResponse.json(
      { message: "Query must be at least 3 characters long." },
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
    const autocompleteUrl = new URL(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json"
    );
    autocompleteUrl.searchParams.set("input", input);
    autocompleteUrl.searchParams.set("types", "address");
    autocompleteUrl.searchParams.set("key", apiKey);
    autocompleteUrl.searchParams.set("components", "country:in");
    autocompleteUrl.searchParams.set(
      "location",
      `${NOIDA_LOCATION.lat},${NOIDA_LOCATION.lng}`
    );
    autocompleteUrl.searchParams.set("radius", "50000");

    const autocompleteResponse = await fetch(autocompleteUrl.toString(), {
      cache: "no-store",
    });

    if (!autocompleteResponse.ok) {
      return NextResponse.json(
        { message: "Failed to fetch autocomplete results." },
        { status: 502 }
      );
    }

    const autocompleteData = await autocompleteResponse.json();
    const predictions =
      autocompleteData.predictions?.filter((prediction: any) =>
        prediction.description.toLowerCase().includes("noida")
      ) || autocompleteData.predictions;

    if (!predictions || predictions.length === 0) {
      return NextResponse.json({ suggestions: [] });
    }

    const suggestions = await Promise.all(
      predictions.slice(0, 5).map(async (prediction: any) => {
        const detailsUrl = new URL(
          "https://maps.googleapis.com/maps/api/place/details/json"
        );
        detailsUrl.searchParams.set("place_id", prediction.place_id);
        detailsUrl.searchParams.set("fields", "formatted_address,geometry,place_id");
        detailsUrl.searchParams.set("key", apiKey);

        const detailsResponse = await fetch(detailsUrl.toString(), {
          cache: "no-store",
        });

        if (!detailsResponse.ok) {
          return null;
        }

        const detailsData = await detailsResponse.json();
        const result = detailsData.result;

        if (!result?.geometry?.location) {
          return null;
        }

        return {
          address: result.formatted_address,
          coordinates: {
            latitude: result.geometry.location.lat,
            longitude: result.geometry.location.lng,
          },
          placeId: result.place_id,
        };
      })
    );

    return NextResponse.json({
      suggestions: suggestions.filter(Boolean),
    });
  } catch (error) {
    console.error("Autocomplete error", error);
    return NextResponse.json(
      { message: "Failed to fetch autocomplete results." },
      { status: 500 }
    );
  }
}
