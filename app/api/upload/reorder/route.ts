import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { propertyId, imageIds } = await request.json();

    if (!propertyId || !imageIds || !Array.isArray(imageIds)) {
      return NextResponse.json(
        { error: "Property ID and image IDs array are required" },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, order: imageIds });
  } catch (error) {
    console.error("Reorder error:", error);
    return NextResponse.json(
      { error: "Failed to reorder images" },
      { status: 500 },
    );
  }
}
