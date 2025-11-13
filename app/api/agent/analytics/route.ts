import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // TODO: Get userId from session
    const userId = "test-agent-id"; // Placeholder

    const searchParams = request.nextUrl.searchParams;
    const range = searchParams.get("range") || "30";

    const daysAgo = range === "all" ? 365000 : parseInt(range);
    const startDate =
      range === "all"
        ? new Date(0)
        : new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    const properties = await prisma.property.findMany({
      where: { agentId: userId },
    });

    const inquiries = await prisma.inquiry.findMany({
      where: {
        agentId: userId,
        createdAt: { gte: startDate },
      },
    });

    const convertedInquiries = inquiries.filter(
      (i) => i.status === "CONVERTED"
    ).length;
    const conversionRate =
      inquiries.length > 0
        ? ((convertedInquiries / inquiries.length) * 100).toFixed(2)
        : "0";

    const topProperties = properties
      .slice(0, 5)
      .map((p) => ({
        title: p.title,
        city: p.city,
        views: p.views,
        inquiries: inquiries.filter((i) => i.propertyId === p.id).length,
      }))
      .sort((a, b) => b.views - a.views);

    return NextResponse.json({
      totalProperties: properties.length,
      totalViews: properties.reduce((sum, p) => sum + p.views, 0),
      totalInquiries: inquiries.length,
      conversionRate: parseFloat(conversionRate),
      topProperties,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { message: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
