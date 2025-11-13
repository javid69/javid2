import { NextResponse } from "next/server";
import { featureProperty } from "@/lib/admin/data-store";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const property = featureProperty(params.id);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (error) {
    console.error("Error featuring property:", error);
    return NextResponse.json(
      { error: "Failed to feature property" },
      { status: 500 }
    );
  }
}
