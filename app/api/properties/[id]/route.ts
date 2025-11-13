import { NextResponse } from "next/server";
import { getPropertyById, getSimilarProperties } from "../data";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const property = getPropertyById(params.id);

  if (!property) {
    return NextResponse.json(
      {
        error: "Property not found",
      },
      { status: 404 },
    );
  }

  const similar = getSimilarProperties(property.id, { limit: 6 });

  return NextResponse.json({ property, similar });
}
