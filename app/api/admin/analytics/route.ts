import { NextResponse } from "next/server";
import { getAnalyticsOverview } from "@/lib/admin/data-store";

export async function GET() {
  try {
    const analytics = getAnalyticsOverview();
    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
