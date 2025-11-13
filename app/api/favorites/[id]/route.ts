import { NextResponse } from "next/server";

const favorites = new Set<string>();

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const propertyId = params.id;

    if (favorites.has(propertyId)) {
      favorites.delete(propertyId);
      return NextResponse.json({
        success: true,
        saved: false,
        message: "Property removed from favorites",
      });
    } else {
      favorites.add(propertyId);
      return NextResponse.json({
        success: true,
        saved: true,
        message: "Property saved to favorites",
      });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return NextResponse.json(
      { error: "Failed to update favorite status" },
      { status: 500 },
    );
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  return NextResponse.json({
    saved: favorites.has(params.id),
  });
}
