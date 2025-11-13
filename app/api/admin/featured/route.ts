import { NextResponse } from "next/server";
import { getFeaturedProperties, reorderFeaturedProperties } from "@/lib/admin/data-store";

export async function GET() {
  try {
    const featuredProperties = getFeaturedProperties();
    return NextResponse.json(featuredProperties);
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured properties" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { propertyIds } = body;

    if (!propertyIds || !Array.isArray(propertyIds)) {
      return NextResponse.json(
        { error: "Invalid property IDs" },
        { status: 400 }
      );
    }

    reorderFeaturedProperties(propertyIds);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering featured properties:", error);
    return NextResponse.json(
      { error: "Failed to reorder featured properties" },
      { status: 500 }
    );
  }
}
