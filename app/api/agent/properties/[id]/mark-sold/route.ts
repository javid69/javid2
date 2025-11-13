import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id;
    // TODO: Get userId from session
    const userId = "test-agent-id"; // Placeholder

    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!existingProperty) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }

    if (existingProperty.agentId !== userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: { status: "SOLD" },
    });

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error("Error marking property as sold:", error);
    return NextResponse.json(
      { message: "Failed to mark property as sold" },
      { status: 500 }
    );
  }
}
