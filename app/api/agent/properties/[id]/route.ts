import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Get specific property
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id;
    // TODO: Get userId from session
    const userId = "test-agent-id"; // Placeholder

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }

    if (property.agentId !== userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { message: "Failed to fetch property" },
      { status: 500 }
    );
  }
}

// PUT: Update property
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id;
    const body = await request.json();
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
      data: {
        title: body.title || existingProperty.title,
        description: body.description || existingProperty.description,
        price: body.price ?? existingProperty.price,
        address: body.address || existingProperty.address,
        city: body.city || existingProperty.city,
        state: body.state || existingProperty.state,
        zipCode: body.zipCode || existingProperty.zipCode,
        bedrooms: body.bedrooms ?? existingProperty.bedrooms,
        bathrooms: body.bathrooms ?? existingProperty.bathrooms,
        squareFeet: body.squareFeet ?? existingProperty.squareFeet,
        propertyType: body.propertyType || existingProperty.propertyType,
        images: body.images ?? existingProperty.images,
        featured: body.featured ?? existingProperty.featured,
      },
    });

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json(
      { message: "Failed to update property" },
      { status: 500 }
    );
  }
}

// DELETE: Delete property
export async function DELETE(
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

    await prisma.property.delete({
      where: { id: propertyId },
    });

    return NextResponse.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      { message: "Failed to delete property" },
      { status: 500 }
    );
  }
}
