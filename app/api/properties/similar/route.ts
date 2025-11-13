import { NextResponse } from "next/server";
import { getSimilarProperties } from "../data";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined;

  if (!id) {
    return NextResponse.json(
      { error: "Property id is required" },
      { status: 400 },
    );
  }

  const properties = getSimilarProperties(id, { limit });

  return NextResponse.json({ properties });
}
