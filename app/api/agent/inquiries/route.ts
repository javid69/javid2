import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Get agent's inquiries
export async function GET() {
  try {
    // TODO: Get userId from session
    const userId = "test-agent-id"; // Placeholder

    const inquiries = await prisma.inquiry.findMany({
      where: { agentId: userId },
      include: { property: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    });

    const withPropertyTitle = inquiries.map((inquiry) => ({
      ...inquiry,
      propertyTitle: inquiry.property.title,
    }));

    return NextResponse.json(withPropertyTitle);
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { message: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}
