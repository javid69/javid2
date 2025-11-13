import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PropertyStatus } from "@prisma/client";

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      where: {
        featured: true,
        status: PropertyStatus.AVAILABLE,
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    });

    return NextResponse.json({ properties });
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured properties" },
      { status: 500 },
    );
  }
}
