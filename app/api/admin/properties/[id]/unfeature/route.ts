import { NextResponse } from "next/server";
import { unfeatureProperty } from "@/lib/admin/data-store";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const property = unfeatureProperty(params.id);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (error) {
    console.error("Error unfeaturing property:", error);
    return NextResponse.json(
      { error: "Failed to unfeature property" },
      { status: 500 }
    );
  }
}
