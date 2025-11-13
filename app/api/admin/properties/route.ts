import { NextResponse } from "next/server";
import { getProperties } from "@/lib/admin/data-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? undefined;
    const category = searchParams.get("category") ?? undefined;
    const approvalStatus = searchParams.get("approvalStatus") ?? undefined;
    const featured = searchParams.get("featured") ?? undefined;
    const search = searchParams.get("search") ?? undefined;

    const properties = getProperties({
      status,
      category,
      approvalStatus,
      featured,
      search,
    });
    return NextResponse.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}
