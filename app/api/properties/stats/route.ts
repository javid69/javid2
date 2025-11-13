import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PropertyStatus, PropertyType } from "@prisma/client";

export async function GET() {
  try {
    const [
      totalProperties,
      soldProperties,
      rentedProperties,
      propertiesByType,
    ] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { status: PropertyStatus.SOLD } }),
      prisma.property.count({ where: { status: PropertyStatus.RENTED } }),
      prisma.property.groupBy({
        by: ["propertyType"],
        _count: true,
        where: {
          status: PropertyStatus.AVAILABLE,
        },
      }),
    ]);

    const categoryCounts = propertiesByType.reduce(
      (acc, item) => {
        acc[item.propertyType] = item._count;
        return acc;
      },
      {} as Record<PropertyType, number>,
    );

    return NextResponse.json({
      totalProperties,
      soldProperties,
      rentedProperties,
      categoryCounts,
    });
  } catch (error) {
    console.error("Error fetching property stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch property statistics" },
      { status: 500 },
    );
  }
}
