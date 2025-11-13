import { NextResponse } from "next/server";
import { getInquiries } from "@/lib/admin/data-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? undefined;
    const propertyId = searchParams.get("propertyId") ?? undefined;
    const agentId = searchParams.get("agentId") ?? undefined;
    const search = searchParams.get("search") ?? undefined;

    const inquiries = getInquiries({ status, propertyId, agentId, search });
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}
