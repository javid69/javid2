import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateDistance } from "@/lib/maps-utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latParam = searchParams.get("latitude");
  const lngParam = searchParams.get("longitude");
  const radiusParam = searchParams.get("radius");

  if (!latParam || !lngParam) {
    return NextResponse.json(
      { message: "Latitude and longitude are required." },
      { status: 400 }
    );
  }

  const latitude = parseFloat(latParam);
  const longitude = parseFloat(lngParam);
  const radius = radiusParam ? parseFloat(radiusParam) : 5; // km

  if (isNaN(latitude) || isNaN(longitude) || isNaN(radius)) {
    return NextResponse.json(
      { message: "Latitude, longitude, and radius must be valid numbers." },
      { status: 400 }
    );
  }

  if (radius <= 0) {
    return NextResponse.json(
      { message: "Radius must be greater than zero." },
      { status: 400 }
    );
  }

  try {
    const properties = await prisma.property.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        price: true,
        address: true,
        city: true,
        latitude: true,
        longitude: true,
        images: true,
        propertyType: true,
      },
    });

    const nearby = properties
      .map((property) => {
        if (property.latitude === null || property.longitude === null) {
          return null;
        }

        const distance = calculateDistance(
          latitude,
          longitude,
          property.latitude,
          property.longitude
        );

        if (distance > radius) {
          return null;
        }

        return {
          id: property.id,
          title: property.title,
          price: property.price,
          address: property.address,
          city: property.city,
          coordinates: {
            latitude: property.latitude,
            longitude: property.longitude,
          },
          image: property.images?.[0] ?? null,
          category: property.propertyType,
          distance,
        };
      })
      .filter(Boolean)
      .sort((a, b) => (a!.distance ?? 0) - (b!.distance ?? 0));

    return NextResponse.json({ properties: nearby });
  } catch (error) {
    console.error("Nearby properties error:", error);
    return NextResponse.json(
      { message: "Failed to fetch nearby properties." },
      { status: 500 }
    );
  }
}
