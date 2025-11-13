import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Get agent's properties
export async function GET() {
  try {
    // TODO: Get userId from session
    const userId = "test-agent-id"; // Placeholder

    const properties = await prisma.property.findMany({
      where: { agentId: userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { message: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

// POST: Create new property
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // TODO: Get userId from session
    const userId = "test-agent-id"; // Placeholder

    const property = await prisma.property.create({
      data: {
        title: body.title,
        description: body.description,
        price: body.price,
        address: body.address,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        squareFeet: body.squareFeet,
        propertyType: body.propertyType,
        images: body.images || [],
        agentId: userId,
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { message: "Failed to create property" },
      { status: 500 }
    );
  }
}
